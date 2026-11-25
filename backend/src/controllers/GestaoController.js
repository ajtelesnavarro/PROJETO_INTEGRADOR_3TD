import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

function formatarDataSQL(valor) {
    if (!valor) return new Date().toISOString().slice(0, 10);

    if (/^\d{4}-\d{2}-\d{2}/.test(valor)) {
        return valor.slice(0, 10);
    }

    const partes = String(valor).split("/");

    if (partes.length === 3) {
        return `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
    }

    return new Date().toISOString().slice(0, 10);
}

function normalizarPerfil(role) {
    const texto = String(role || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (texto.includes("admin") || texto.includes("coordenador")) {
        return "administrador";
    }

    if (
        texto.includes("manut") ||
        texto.includes("tecnic") ||
        texto.includes("eletric") ||
        texto.includes("hidraul")
    ) {
        return "manutencao";
    }

    if (
        texto.includes("port") ||
        texto.includes("segur")
    ) {
        return "porteiro";
    }

    return "funcionario";
}

async function obterPredioUsuario(idUsuario) {
    const [[usuario]] = await pool.query(
        "SELECT id_predio FROM usuario WHERE id_usuario = ? LIMIT 1",
        [idUsuario]
    );

    return usuario?.id_predio ?? null;
}

export async function listarUsuarios(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);

        if (!idPredio) {
            return res.json({
                sucesso: true,
                dados: []
            });
        }

        const [dados] = await pool.query(
            `SELECT
                id_usuario,
                id_predio,
                nome,
                email,
                telefone,
                perfil
             FROM usuario
             WHERE id_predio = ?
             ORDER BY nome ASC`,
            [idPredio]
        );

        return res.json({
            sucesso: true,
            dados
        });

    } catch (erro) {
        return next(erro);
    }
}

export async function contextoCadastroUsuario(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });

        const [dados] = await pool.query(
            `SELECT a.id_ambiente, a.nome, a.localizacao, an.numero_andar
             FROM ambiente a
             INNER JOIN andar an ON an.id_andar = a.id_andar
             WHERE an.id_predio = ?
             ORDER BY an.numero_andar, a.nome`,
            [idPredio]
        );
        return res.json({ sucesso: true, dados });
    } catch (erro) {
        return next(erro);
    }
}

export async function criarUsuario(req, res, next) {
    let conexao;
    try {
        const nome = String(req.body.nome || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const cpf = String(req.body.cpf || "").replace(/\D/g, "");
        const telefone = String(req.body.telefone || "").trim();
        const senha = req.body.senha;
        const perfil = String(req.body.perfil || "");
        const ambientes = [...new Set((Array.isArray(req.body.ambientes) ? req.body.ambientes : []).map(Number))];
        const tipoCredencial = String(req.body.tipo_credencial || "");
        const tokenCredencial = String(req.body.token_credencial || "").trim();
        const idPredio = await obterPredioUsuario(req.usuario.id);

        if (!idPredio) return res.status(400).json({ sucesso: false, erro: "O administrador não está vinculado a um prédio." });
        if (nome.length < 3 || nome.length > 100) return res.status(400).json({ sucesso: false, erro: "Informe um nome entre 3 e 100 caracteres." });
        if (!/^[^\s@]+@[^\s@]+$/.test(email)) return res.status(400).json({ sucesso: false, erro: "Informe um e-mail válido." });
        if (cpf.length !== 11) return res.status(400).json({ sucesso: false, erro: "Informe um CPF com 11 números." });
        if (typeof senha !== "string" || senha.length < 8) return res.status(400).json({ sucesso: false, erro: "A senha deve ter pelo menos 8 caracteres." });
        if (telefone.length > 20) return res.status(400).json({ sucesso: false, erro: "O telefone deve ter no máximo 20 caracteres." });
        if (!["manutencao", "porteiro"].includes(perfil)) return res.status(400).json({ sucesso: false, erro: "O perfil deve ser Porteiro ou Manutenção." });
        if (!ambientes.length || ambientes.some((id) => !Number.isInteger(id) || id <= 0)) return res.status(400).json({ sucesso: false, erro: "Selecione ao menos um ambiente para liberar acesso." });
        if (!["cartao_rfid", "tag_nfc", "qr_code"].includes(tipoCredencial)) return res.status(400).json({ sucesso: false, erro: "Selecione um tipo de credencial válido." });
        if (tokenCredencial.length < 4 || tokenCredencial.length > 255) return res.status(400).json({ sucesso: false, erro: "Informe um código de credencial entre 4 e 255 caracteres." });

        const senhaHash = (await bcrypt.hash(senha, 12)).replace(/^\$2b\$/, "$2y$");
        const tokenHash = createHash("sha256").update(tokenCredencial).digest("hex");
        const placeholders = ambientes.map(() => "?").join(", ");
        conexao = await pool.getConnection();
        await conexao.beginTransaction();

        const [[duplicado]] = await conexao.query(
            "SELECT id_usuario FROM usuario WHERE email = ? OR cpf = ? LIMIT 1",
            [email, cpf]
        );
        if (duplicado) {
            await conexao.rollback();
            return res.status(409).json({ sucesso: false, erro: "Já existe uma conta com este e-mail ou CPF." });
        }

        const [ambientesValidos] = await conexao.query(
            `SELECT a.id_ambiente
             FROM ambiente a INNER JOIN andar an ON an.id_andar = a.id_andar
             WHERE an.id_predio = ? AND a.id_ambiente IN (${placeholders})`,
            [idPredio, ...ambientes]
        );
        if (ambientesValidos.length !== ambientes.length) {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "Um ou mais ambientes não pertencem ao prédio atual." });
        }

        const [resultado] = await conexao.query(
            `INSERT INTO usuario (id_predio, nome, email, senha_hash, telefone, perfil, cpf)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [idPredio, nome, email, senhaHash, telefone || null, perfil, cpf]
        );
        const idUsuario = resultado.insertId;

        for (const idAmbiente of ambientes) {
            await conexao.query(
                `INSERT INTO permissao_acesso (id_usuario, id_ambiente, status_permissao, data_inicio)
                 VALUES (?, ?, 'ativa', CURRENT_DATE)`,
                [idUsuario, idAmbiente]
            );
        }

        await conexao.query(
            `INSERT INTO credenciais_acesso (id_usuario, token_hash, tipo_credencial)
             VALUES (?, ?, ?)`,
            [idUsuario, tokenHash, tipoCredencial]
        );
        await conexao.commit();

        return res.status(201).json({ sucesso: true, id_usuario: idUsuario, mensagem: "Usuário, permissões e credencial cadastrados." });
    } catch (erro) {
        if (conexao) await conexao.rollback();
        if (erro.code === "ER_DUP_ENTRY") return res.status(409).json({ sucesso: false, erro: "Este código de credencial já está cadastrado." });
        return next(erro);
    } finally {
        conexao?.release();
    }
}


/* =========================================================
   EQUIPES
========================================================= */

export async function listarEquipes(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);

        if (!idPredio) {
            return res.json({
                sucesso: true,
                dados: [],
                usuarios: []
            });
        }

        const [equipes] = await pool.query(
            `
            SELECT *
            FROM equipe
            WHERE id_predio = ?
            ORDER BY id_equipe ASC
            `,
            [idPredio]
        );

        const [usuarios] = await pool.query(
            `
            SELECT
                id_usuario,
                id_predio,
                nome,
                email,
                telefone,
                perfil
            FROM usuario
            WHERE id_predio = ?
            ORDER BY nome ASC
            `,
            [idPredio]
        );

        const [vinculos] = await pool.query(
            `
            SELECT
                eu.id_equipe_usuario,
                eu.id_equipe,
                eu.id_usuario,
                eu.data_entrada,
                eu.data_saida,
                u.nome,
                u.email,
                u.telefone,
                u.perfil
            FROM equipe_usuario eu
            INNER JOIN usuario u
                ON u.id_usuario = eu.id_usuario
            INNER JOIN equipe e
                ON e.id_equipe = eu.id_equipe
            WHERE e.id_predio = ?
            ORDER BY eu.id_equipe_usuario ASC
            `,
            [idPredio]
        );

        const dados = equipes.map((eq) => ({
            ...eq,
            membros: vinculos.filter(
                (v) => v.id_equipe === eq.id_equipe
            )
        }));

        return res.json({
            sucesso: true,
            dados,
            usuarios
        });

    } catch (erro) {
        return next(erro);
    }
}


export async function criarEquipe(req, res, next) {
    try {
        const nome =
            typeof req.body.nome_equipe === "string"
                ? req.body.nome_equipe.trim()
                : "";

        const descricao =
            typeof req.body.descricao === "string"
                ? req.body.descricao.trim()
                : "";

        const idPredio = await obterPredioUsuario(req.usuario.id);

        if (!nome) {
            return res.status(400).json({
                sucesso: false,
                erro: "Informe o nome da equipe."
            });
        }

        if (!idPredio) {
            return res.status(409).json({
                sucesso: false,
                erro: "Vincule um prédio à conta antes de criar uma equipe."
            });
        }

        const [resultado] = await pool.query(
            `
            INSERT INTO equipe
                (id_predio, nome_equipe, descricao)
            VALUES (?, ?, ?)
            `,
            [
                idPredio,
                nome,
                descricao || null
            ]
        );

        const [[equipe]] = await pool.query(
            `
            SELECT *
            FROM equipe
            WHERE id_equipe = ?
            `,
            [resultado.insertId]
        );

        return res.status(201).json({
            sucesso: true,
            dados: equipe
        });

    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   ALERTAS DE LIMITES DOS DISPOSITIVOS
========================================================= */

export async function listarAlertasLimites(req, res, next) {
    try {

        /*
         * Busca somente a última leitura de cada dispositivo.
         *
         * São consultados:
         * - temperatura
         * - iluminação
         * - energia
         *
         * Os resultados são unidos com UNION ALL.
         */

        const [leituras] = await pool.query(
            `
            /* =====================================================
               TEMPERATURA
            ===================================================== */

            SELECT
                d.id_dispositivo,
                d.nome AS nome_dispositivo,
                a.nome AS nome_ambiente,

                'temperatura' AS tipo,

                h.temperatura_medida AS valor,

                t.temperatura_minima AS limite_minimo,
                t.temperatura_maxima AS limite_maximo,

                NULL AS potencia,
                NULL AS potencia_maxima,

                h.data_temperatura AS data_hora

            FROM usuario u

            INNER JOIN andar an
                ON an.id_predio = u.id_predio

            INNER JOIN ambiente a
                ON a.id_andar = an.id_andar

            INNER JOIN temperatura t
                ON t.id_ambiente = a.id_ambiente

            INNER JOIN dispositivo d
                ON d.id_ambiente = a.id_ambiente
                AND d.tipo_dispositivo = 'temperatura'

            INNER JOIN historico_temperatura h
                ON h.id_dispositivo = d.id_dispositivo

            WHERE u.id_usuario = ?

            AND NOT EXISTS (
                SELECT 1
                FROM historico_temperatura h2
                WHERE h2.id_dispositivo = h.id_dispositivo
                AND h2.id_historico_temperatura > h.id_historico_temperatura
            )


            UNION ALL


            /* =====================================================
               ILUMINAÇÃO
            ===================================================== */

            SELECT
                d.id_dispositivo,
                d.nome AS nome_dispositivo,
                a.nome AS nome_ambiente,

                'iluminacao' AS tipo,

                h.iluminacao_medida AS valor,

                l.iluminacao_minima AS limite_minimo,
                l.iluminacao_maxima AS limite_maximo,

                NULL AS potencia,
                NULL AS potencia_maxima,

                h.data_iluminacao AS data_hora

            FROM usuario u

            INNER JOIN andar an
                ON an.id_predio = u.id_predio

            INNER JOIN ambiente a
                ON a.id_andar = an.id_andar

            INNER JOIN iluminacao l
                ON l.id_ambiente = a.id_ambiente

            INNER JOIN dispositivo d
                ON d.id_ambiente = a.id_ambiente
                AND d.tipo_dispositivo = 'iluminacao'

            INNER JOIN historico_iluminacao h
                ON h.id_dispositivo = d.id_dispositivo

            WHERE u.id_usuario = ?

            AND NOT EXISTS (
                SELECT 1
                FROM historico_iluminacao h2
                WHERE h2.id_dispositivo = h.id_dispositivo
                AND h2.id_historico_iluminacao > h.id_historico_iluminacao
            )


            UNION ALL


            /* =====================================================
               ENERGIA
            ===================================================== */

            SELECT
                d.id_dispositivo,
                d.nome AS nome_dispositivo,
                a.nome AS nome_ambiente,

                'energia' AS tipo,

                h.consumo_kwh AS valor,

                e.consumo_minimo AS limite_minimo,
                e.consumo_maximo AS limite_maximo,

                h.potencia_kw AS potencia,
                e.potencia_maxima AS potencia_maxima,

                h.data_historico_energia AS data_hora

            FROM usuario u

            INNER JOIN andar an
                ON an.id_predio = u.id_predio

            INNER JOIN ambiente a
                ON a.id_andar = an.id_andar

            INNER JOIN energia e
                ON e.id_ambiente = a.id_ambiente

            INNER JOIN dispositivo d
                ON d.id_ambiente = a.id_ambiente
                AND d.tipo_dispositivo = 'energia'

            INNER JOIN historico_energia h
                ON h.id_dispositivo = d.id_dispositivo

            WHERE u.id_usuario = ?

            AND NOT EXISTS (
                SELECT 1
                FROM historico_energia h2
                WHERE h2.id_dispositivo = h.id_dispositivo
                AND h2.id_historico_energia > h.id_historico_energia
            )
            `,
            [
                req.usuario.id,
                req.usuario.id,
                req.usuario.id
            ]
        );


        /* =========================================================
           TRANSFORMA AS LEITURAS EM ALERTAS
        ========================================================= */

        const alertas = [];

        for (const leitura of leituras) {

            const valor = Number(leitura.valor);
            const minimo = Number(leitura.limite_minimo);
            const maximo = Number(leitura.limite_maximo);

            const potencia = Number(leitura.potencia);
            const potenciaMaxima = Number(leitura.potencia_maxima);


            /* Define a unidade */

            let unidade;

            if (leitura.tipo === "temperatura") {
                unidade = "°C";
            } else if (leitura.tipo === "iluminacao") {
                unidade = "lux";
            } else {
                unidade = "kWh";
            }


            /*
             * Dados básicos que serão enviados
             * para o PrivateHeader.
             */

            const base = {
                id_dispositivo: leitura.id_dispositivo,
                dispositivo: leitura.nome_dispositivo,
                ambiente: leitura.nome_ambiente,
                tipo: leitura.tipo,
                valor,
                unidade,
                data_hora: leitura.data_hora
            };


            /* =====================================================
               ALERTA DE TEMPERATURA / ILUMINAÇÃO / CONSUMO
            ===================================================== */

            if (
                !Number.isNaN(valor) &&
                (
                    valor < minimo ||
                    valor > maximo
                )
            ) {

                alertas.push({
                    ...base,

                    motivo: "valor",

                    direcao:
                        valor > maximo
                            ? "acima"
                            : "abaixo",

                    limite_minimo: minimo,
                    limite_maximo: maximo
                });
            }


            /* =====================================================
               ALERTA DE POTÊNCIA ELÉTRICA
            ===================================================== */

            if (
                leitura.tipo === "energia" &&
                !Number.isNaN(potencia) &&
                !Number.isNaN(potenciaMaxima) &&
                potencia > potenciaMaxima
            ) {

                alertas.push({
                    ...base,

                    motivo: "potencia",

                    direcao: "acima",

                    valor: potencia,

                    unidade: "kW",

                    limite_minimo: null,

                    limite_maximo: potenciaMaxima
                });
            }
        }


        // Registra cada alerta uma única vez no histórico do dispositivo.
        for (const alerta of alertas) {
            const titulo = alerta.tipo === "temperatura" ? "Temperatura" :
                alerta.tipo === "iluminacao" ? "Iluminação" :
                alerta.motivo === "potencia" ? "Potência elétrica" : "Consumo de energia";
            const motivo = `Alerta automático: ${titulo} ${alerta.direcao} do limite`;
            const dataEvento = alerta.data_hora instanceof Date
                ? alerta.data_hora.toISOString().slice(0, 19).replace("T", " ")
                : String(alerta.data_hora || new Date().toISOString()).replace("T", " ").slice(0, 19);
            const observacao = `Leitura: ${alerta.valor} ${alerta.unidade}; limites: ${alerta.limite_minimo ?? "—"} a ${alerta.limite_maximo ?? "—"} ${alerta.unidade}; ambiente: ${alerta.ambiente}; dispositivo: ${alerta.dispositivo}.`;
            await pool.query(
                `INSERT INTO historico_dispositivo
                    (id_dispositivo, status_dispositivo, data_inicio_status, motivo, observacao)
                 SELECT ?, 'instavel', ?, ?, ?
                 WHERE NOT EXISTS (
                    SELECT 1 FROM historico_dispositivo
                    WHERE id_dispositivo = ? AND data_inicio_status = ? AND motivo = ?
                 )`,
                [alerta.id_dispositivo, dataEvento, motivo, observacao,
                 alerta.id_dispositivo, dataEvento, motivo]
            );
            const [[registro]] = await pool.query(
                `SELECT id_historico_dispositivo
                 FROM historico_dispositivo
                 WHERE id_dispositivo = ? AND data_inicio_status = ? AND motivo = ?
                 ORDER BY id_historico_dispositivo DESC LIMIT 1`,
                [alerta.id_dispositivo, dataEvento, motivo]
            );
            alerta.id_historico_dispositivo = registro?.id_historico_dispositivo ?? null;
        }

        /* =========================================================
           ORDENA OS ALERTAS
           Mais recente primeiro
        ========================================================= */

        alertas.sort((a, b) => {
            return (
                new Date(b.data_hora).getTime() -
                new Date(a.data_hora).getTime()
            );
        });


        /* =========================================================
           RESPOSTA PARA O FRONTEND
        ========================================================= */

        return res.json({
            sucesso: true,
            dados: alertas
        });

    } catch (erro) {

        console.error(
            "Erro ao listar alertas de limites:",
            erro
        );

        return next(erro);
    }
}


/* =========================================================
   INTEGRANTES
========================================================= */

export async function adicionarIntegrante(req, res, next) {
    try {
        const idEquipe = Number(req.params.id);
        const idUsuario = Number(req.body.id_usuario);
        const { status, since } = req.body;
        const idPredioUsuario = await obterPredioUsuario(req.usuario.id);

        if (!idPredioUsuario || !Number.isInteger(idEquipe) || idEquipe <= 0 || !Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(400).json({ sucesso: false, erro: "Selecione uma equipe e um usuário já cadastrado." });
        }

        const [[equipe]] = await pool.query(
            `
            SELECT *
            FROM equipe
            WHERE id_equipe = ? AND id_predio = ?
            LIMIT 1
            `,
            [idEquipe, idPredioUsuario]
        );

        if (!equipe) {
            return res.status(404).json({
                sucesso: false,
                erro: "Equipe não encontrada."
            });
        }

        const [[usuario]] = await pool.query(
            "SELECT id_usuario FROM usuario WHERE id_usuario = ? AND id_predio = ? LIMIT 1",
            [idUsuario, equipe.id_predio]
        );
        if (!usuario) return res.status(404).json({ sucesso: false, erro: "Usuário não encontrado no prédio desta equipe." });


        const dataEntrada =
            formatarDataSQL(since);

        const dataSaida =
            status === "Ausente"
                ? new Date()
                    .toISOString()
                    .slice(0, 10)
                : null;


        await pool.query(
            `
            INSERT INTO equipe_usuario
                (
                    id_equipe,
                    id_usuario,
                    id_predio,
                    data_entrada,
                    data_saida
                )
            VALUES (?, ?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE
                data_entrada = VALUES(data_entrada),
                data_saida = VALUES(data_saida)
            `,
            [
                idEquipe,
                idUsuario,
                equipe.id_predio,
                dataEntrada,
                dataSaida
            ]
        );

        return res.status(201).json({
            sucesso: true,
            id_usuario: idUsuario
        });

    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   ATUALIZAR INTEGRANTE
========================================================= */

export async function atualizarIntegrante(req, res, next) {
    try {
        const idEquipe =
            Number(req.params.id);

        const idUsuario =
            Number(req.params.idUsuario);

        const {
            nome,
            email,
            telefone,
            role,
            perfil,
            status,
            since
        } = req.body;


        if (
            nome ||
            email ||
            telefone !== undefined ||
            role ||
            perfil
        ) {

            const campos = [];
            const valores = [];


            if (nome) {
                campos.push("nome = ?");
                valores.push(nome.trim());
            }

            if (email) {
                campos.push("email = ?");
                valores.push(email.trim());
            }

            if (telefone !== undefined) {
                campos.push("telefone = ?");
                valores.push(telefone || null);
            }

            if (role || perfil) {
                campos.push("perfil = ?");
                valores.push(
                    normalizarPerfil(
                        perfil || role
                    )
                );
            }


            if (campos.length > 0) {

                await pool.query(
                    `
                    UPDATE usuario
                    SET ${campos.join(", ")}
                    WHERE id_usuario = ?
                    `,
                    [
                        ...valores,
                        idUsuario
                    ]
                );
            }
        }


        const updatesVinculo = [];
        const valsVinculo = [];


        if (since) {
            updatesVinculo.push(
                "data_entrada = ?"
            );

            valsVinculo.push(
                formatarDataSQL(since)
            );
        }


        if (status !== undefined) {

            updatesVinculo.push(
                "data_saida = ?"
            );

            valsVinculo.push(
                status === "Ausente"
                    ? new Date()
                        .toISOString()
                        .slice(0, 10)
                    : null
            );
        }


        if (updatesVinculo.length > 0) {

            await pool.query(
                `
                UPDATE equipe_usuario
                SET ${updatesVinculo.join(", ")}
                WHERE id_equipe = ?
                AND id_usuario = ?
                `,
                [
                    ...valsVinculo,
                    idEquipe,
                    idUsuario
                ]
            );
        }


        return res.json({
            sucesso: true
        });

    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   REMOVER INTEGRANTE
========================================================= */

export async function removerIntegrante(req, res, next) {
    try {
        const idEquipe =
            Number(req.params.id);

        const idUsuario =
            Number(req.params.idUsuario);

        await pool.query(
            `
            DELETE FROM equipe_usuario
            WHERE id_equipe = ?
            AND id_usuario = ?
            `,
            [
                idEquipe,
                idUsuario
            ]
        );

        return res.status(204).send();

    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   CREDENCIAIS
========================================================= */

export async function listarCredenciais(
    req,
    res,
    next
) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });

        const [dados] =
            await pool.query(
                `
                SELECT
                    c.id_credencial,
                    c.id_usuario,
                    c.status,
                    c.data_cadastro,
                    RIGHT(c.token_hash, 4) AS token_hash_sufixo,
                    c.tipo_credencial,
                    c.bloqueado_ate,
                    u.nome AS nome_usuario,
                    u.perfil,
                    u.email
                FROM credenciais_acesso c
                INNER JOIN usuario u
                    ON u.id_usuario = c.id_usuario
                WHERE u.id_predio = ?
                ORDER BY c.id_credencial DESC
                `,
                [idPredio]
            );

        return res.json({
            sucesso: true,
            dados
        });

    } catch (erro) {
        return next(erro);
    }
}

export async function listarPermissoesAcesso(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });

        const [dados] = await pool.query(
            `SELECT pa.id_permissao, pa.id_usuario, pa.id_ambiente,
                    pa.horario_inicio, pa.horario_fim, pa.status_permissao,
                    pa.data_inicio, pa.data_fim, pa.dias_semana,
                    u.nome AS nome_usuario, u.perfil,
                    a.nome AS nome_ambiente, a.localizacao,
                    an.numero_andar
             FROM permissao_acesso pa
             INNER JOIN usuario u ON u.id_usuario = pa.id_usuario
             INNER JOIN ambiente a ON a.id_ambiente = pa.id_ambiente
             INNER JOIN andar an ON an.id_andar = a.id_andar
             WHERE u.id_predio = ? AND an.id_predio = ?
             ORDER BY u.nome, a.nome, pa.data_inicio DESC`,
            [idPredio, idPredio]
        );
        return res.json({ sucesso: true, dados });
    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   ATUALIZAR CREDENCIAL
========================================================= */

export async function atualizarCredencial(
    req,
    res,
    next
) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.status(404).json({ sucesso: false, erro: "Prédio do usuário não encontrado." });

        const idCredencial =
            Number(req.params.id);

        const { status } =
            req.body;

        if (
            ![
                "ativa",
                "bloqueada",
                "expirada"
            ].includes(status)
        ) {
            return res.status(400).json({
                sucesso: false,
                erro: "Status de credencial inválido."
            });
        }

        await pool.query(
            `
            UPDATE credenciais_acesso c
            INNER JOIN usuario u ON u.id_usuario = c.id_usuario
            SET c.status = ?
            WHERE c.id_credencial = ?
              AND u.id_predio = ?
            `,
            [status, idCredencial, idPredio]
        );

        return res.json({
            sucesso: true
        });

    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   ACESSOS DETALHADOS
========================================================= */

export async function listarAcessosDetalhado(
    req,
    res,
    next
) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });

        const [dados] =
            await pool.query(
                `
                SELECT
                    e.id_evento,
                    e.id_credencial,
                    e.id_ambiente,
                    e.tipo_acesso,
                    e.decisao_acesso,
                    e.status_evento,
                    e.data_expiracao,
                    e.data_utilizacao,
                    e.motivo,
                    RIGHT(e.token_tentado, 4) AS token_tentado_sufixo,
                    a.nome AS nome_ambiente,
                    a.localizacao AS localizacao_ambiente,
                    c.tipo_credencial,
                    u.nome AS nome_usuario,
                    u.perfil AS perfil_usuario,
                    (SELECT pa.id_permissao
                     FROM permissao_acesso pa
                     WHERE pa.id_usuario = u.id_usuario
                       AND pa.id_ambiente = e.id_ambiente
                       AND pa.data_inicio <= DATE(e.data_utilizacao)
                       AND (pa.data_fim IS NULL OR pa.data_fim >= DATE(e.data_utilizacao))
                     ORDER BY pa.id_permissao DESC LIMIT 1) AS id_permissao_evento,
                    (SELECT pa.status_permissao
                     FROM permissao_acesso pa
                     WHERE pa.id_usuario = u.id_usuario
                       AND pa.id_ambiente = e.id_ambiente
                       AND pa.data_inicio <= DATE(e.data_utilizacao)
                       AND (pa.data_fim IS NULL OR pa.data_fim >= DATE(e.data_utilizacao))
                     ORDER BY pa.id_permissao DESC LIMIT 1) AS status_permissao_evento,
                    (SELECT CONCAT_WS('–', pa.horario_inicio, pa.horario_fim)
                     FROM permissao_acesso pa
                     WHERE pa.id_usuario = u.id_usuario
                       AND pa.id_ambiente = e.id_ambiente
                       AND pa.data_inicio <= DATE(e.data_utilizacao)
                       AND (pa.data_fim IS NULL OR pa.data_fim >= DATE(e.data_utilizacao))
                     ORDER BY pa.id_permissao DESC LIMIT 1) AS horario_permissao_evento,
                    (SELECT pa.dias_semana
                     FROM permissao_acesso pa
                     WHERE pa.id_usuario = u.id_usuario
                       AND pa.id_ambiente = e.id_ambiente
                       AND pa.data_inicio <= DATE(e.data_utilizacao)
                       AND (pa.data_fim IS NULL OR pa.data_fim >= DATE(e.data_utilizacao))
                     ORDER BY pa.id_permissao DESC LIMIT 1) AS dias_permissao_evento
                FROM eventos_acessos e
                LEFT JOIN ambiente a
                    ON a.id_ambiente = e.id_ambiente
                LEFT JOIN credenciais_acesso c
                    ON c.id_credencial = e.id_credencial
                LEFT JOIN usuario u
                    ON u.id_usuario = c.id_usuario
                INNER JOIN andar an
                    ON an.id_andar = a.id_andar
                WHERE an.id_predio = ?
                ORDER BY
                    e.data_utilizacao DESC,
                    e.id_evento DESC
                LIMIT 200
                `,
                [idPredio]
            );

        return res.json({
            sucesso: true,
            dados
        });

    } catch (erro) {
        return next(erro);
    }
}


/* =========================================================
   HISTÓRICO DE DISPOSITIVOS
========================================================= */

export async function contextoHistoricoDispositivos(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });
        const [dados] = await pool.query(
            `SELECT d.id_dispositivo, d.id_ambiente, d.nome, d.tipo_dispositivo,
                    a.nome AS nome_ambiente
             FROM dispositivo d
             INNER JOIN ambiente a ON a.id_ambiente = d.id_ambiente
             INNER JOIN andar an ON an.id_andar = a.id_andar
             WHERE an.id_predio = ?
             ORDER BY d.nome ASC`,
            [idPredio]
        );
        return res.json({ sucesso: true, dados });
    } catch (erro) { return next(erro); }
}

export async function listarHistoricoDispositivos(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });
        const [dados] = await pool.query(
            `SELECT h.*, d.nome AS nome_dispositivo, d.tipo_dispositivo,
                    (SELECT he.consumo_kwh FROM historico_energia he
                     WHERE he.id_dispositivo = h.id_dispositivo
                       AND he.data_historico_energia = h.data_historico_dispositivo
                     ORDER BY he.id_historico_energia DESC LIMIT 1) AS leitura_consumo_kwh,
                    (SELECT he.potencia_kw FROM historico_energia he
                     WHERE he.id_dispositivo = h.id_dispositivo
                       AND he.data_historico_energia = h.data_historico_dispositivo
                     ORDER BY he.id_historico_energia DESC LIMIT 1) AS leitura_potencia_kw,
                    (SELECT ht.temperatura_medida FROM historico_temperatura ht
                     WHERE ht.id_dispositivo = h.id_dispositivo
                       AND ht.data_temperatura = h.data_historico_dispositivo
                     ORDER BY ht.id_historico_temperatura DESC LIMIT 1) AS leitura_temperatura,
                    (SELECT ht.umidade FROM historico_temperatura ht
                     WHERE ht.id_dispositivo = h.id_dispositivo
                       AND ht.data_temperatura = h.data_historico_dispositivo
                     ORDER BY ht.id_historico_temperatura DESC LIMIT 1) AS leitura_umidade,
                    (SELECT hi.iluminacao_medida FROM historico_iluminacao hi
                     WHERE hi.id_dispositivo = h.id_dispositivo
                       AND hi.data_iluminacao = h.data_historico_dispositivo
                     ORDER BY hi.id_historico_iluminacao DESC LIMIT 1) AS leitura_iluminacao
             FROM historico_dispositivo h
             INNER JOIN dispositivo d ON d.id_dispositivo = h.id_dispositivo
             INNER JOIN ambiente a ON a.id_ambiente = d.id_ambiente
             INNER JOIN andar an ON an.id_andar = a.id_andar
             WHERE an.id_predio = ?
             ORDER BY h.data_historico_dispositivo DESC, h.id_historico_dispositivo DESC
             LIMIT 300`,
            [idPredio]
        );
        return res.json({ sucesso: true, dados });
    } catch (erro) { return next(erro); }
}


/* =========================================================
   CRIAR HISTÓRICO DE DISPOSITIVO
========================================================= */

export async function criarHistoricoDispositivo(
    req,
    res,
    next
) {
    const {
        id_dispositivo,
        status_dispositivo,
        data_inicio_status,
        data_fim_status,
        motivo,
        consumo_estimado_kwh,
        custo_estimado,
        observacao,
        consumo_kwh,
        potencia_kw,
        qualidade_medicao,
        temperatura_medida,
        umidade,
        iluminacao_medida
    } = req.body;


    const statusValidos = [
        "ativo",
        "instavel",
        "manutencao",
        "inativo",
        "offline"
    ];

    const idDispositivo =
        Number(id_dispositivo);


    if (
        !Number.isInteger(idDispositivo) ||
        idDispositivo <= 0 ||
        !statusValidos.includes(
            status_dispositivo
        ) ||
        !data_inicio_status
    ) {
        return res.status(400).json({
            sucesso: false,
            erro: "Informe dispositivo, status e data de início válidos."
        });
    }

    const inicioNormalizado = String(data_inicio_status || "").replace("T", " ");
    const fimNormalizado = data_fim_status ? String(data_fim_status).replace("T", " ") : null;
    const formatoDataHora = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/;
    if (!formatoDataHora.test(inicioNormalizado) || (fimNormalizado && !formatoDataHora.test(fimNormalizado))) {
        return res.status(400).json({ sucesso: false, erro: "Informe datas de início e fim válidas." });
    }
    if (fimNormalizado && fimNormalizado < inicioNormalizado) {
        return res.status(400).json({ sucesso: false, erro: "A data de fim não pode ser anterior à data de início." });
    }


    const conexao =
        await pool.getConnection();

    try {

        await conexao.beginTransaction();


        const [dispositivos] =
            await conexao.query(
                `
                SELECT id_dispositivo, tipo_dispositivo
                FROM dispositivo
                WHERE id_dispositivo = ?
                FOR UPDATE
                `,
                [idDispositivo]
            );


        if (!dispositivos.length) {

            await conexao.rollback();

            return res.status(404).json({
                sucesso: false,
                erro: "Dispositivo não encontrado."
            });
        }

        const tipoDispositivo = dispositivos[0].tipo_dispositivo;
        const numeroOpcional = (valor) =>
            valor === "" || valor == null ? null : Number(valor);
        const numeroValido = (valor) =>
            valor !== "" && valor != null && Number.isFinite(Number(valor)) && Number(valor) >= 0;

        if (tipoDispositivo === "energia" && (!numeroValido(consumo_kwh) || !numeroValido(potencia_kw))) {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "Informe consumo e potência medidos para o dispositivo de energia." });
        }

        if (tipoDispositivo === "temperatura" && (temperatura_medida === "" || temperatura_medida == null || !Number.isFinite(Number(temperatura_medida)))) {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "Informe a temperatura medida pelo dispositivo." });
        }

        if (tipoDispositivo === "iluminacao" && !numeroValido(iluminacao_medida)) {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "Informe a iluminação medida pelo dispositivo." });
        }

        if (qualidade_medicao && !["boa", "regular", "ruim"].includes(qualidade_medicao)) {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "Qualidade de medição inválida." });
        }

        if (umidade !== "" && umidade != null && (!numeroValido(umidade) || Number(umidade) > 100)) {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "A umidade deve estar entre 0 e 100%." });
        }

        await conexao.query("SET @data_registro_historico = CURRENT_TIMESTAMP");


        const [resultadoHistorico] = await conexao.query(
            `
            INSERT INTO historico_dispositivo
            (
                id_dispositivo,
                data_historico_dispositivo,
                status_dispositivo,
                data_inicio_status,
                data_fim_status,
                motivo,
                consumo_estimado_kwh,
                custo_estimado,
                observacao
            )
            VALUES (?, @data_registro_historico, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                idDispositivo,
                status_dispositivo,

                inicioNormalizado,
                fimNormalizado,

                motivo?.trim() || null,

                consumo_estimado_kwh === "" ||
                consumo_estimado_kwh == null
                    ? null
                    : Number(
                        consumo_estimado_kwh
                    ),

                custo_estimado === "" ||
                custo_estimado == null
                    ? null
                    : Number(
                        custo_estimado
                    ),

                observacao?.trim() || null
            ]
        );

        if (tipoDispositivo === "energia") {
            await conexao.query(
                `INSERT INTO historico_energia
                    (id_dispositivo, id_tarifa, consumo_kwh, potencia_kw, custo_estimado, qualidade_medicao, data_historico_energia)
                 VALUES (?, NULL, ?, ?, ?, ?, @data_registro_historico)`,
                [idDispositivo, Number(consumo_kwh), Number(potencia_kw), numeroOpcional(custo_estimado), qualidade_medicao || null]
            );
        } else if (tipoDispositivo === "temperatura") {
            await conexao.query(
                `INSERT INTO historico_temperatura
                    (id_dispositivo, temperatura_medida, umidade, data_temperatura)
                 VALUES (?, ?, ?, @data_registro_historico)`,
                [idDispositivo, Number(temperatura_medida), numeroOpcional(umidade)]
            );
        } else if (tipoDispositivo === "iluminacao") {
            await conexao.query(
                `INSERT INTO historico_iluminacao
                    (id_dispositivo, iluminacao_medida, data_iluminacao)
                 VALUES (?, ?, @data_registro_historico)`,
                [idDispositivo, Number(iluminacao_medida)]
            );
        } else {
            await conexao.rollback();
            return res.status(400).json({ sucesso: false, erro: "Tipo de dispositivo sem tabela de leitura configurada." });
        }


        await conexao.query(
            `
            UPDATE dispositivo
            SET status_dispositivo = ?
            WHERE id_dispositivo = ?
            `,
            [
                status_dispositivo,
                idDispositivo
            ]
        );


        await conexao.commit();


        return res.status(201).json({
            sucesso: true,
            id_historico_dispositivo: resultadoHistorico.insertId,
            mensagem: "Histórico registrado."
        });

    } catch (erro) {

        await conexao.rollback();

        return next(erro);

    } finally {

        conexao.release();
    }
}
