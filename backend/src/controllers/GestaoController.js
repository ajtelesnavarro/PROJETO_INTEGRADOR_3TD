import { randomBytes, scryptSync } from "node:crypto";
import { pool } from "../config/database.js";

function formatarDataSQL(valor) {
    if (!valor) return new Date().toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}/.test(valor)) return valor.slice(0, 10);
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

    if (texto.includes("admin") || texto.includes("coordenador")) return "administrador";
    if (texto.includes("manut") || texto.includes("tecnic") || texto.includes("eletric") || texto.includes("hidraul")) return "manutencao";
    if (texto.includes("port") || texto.includes("segur")) return "porteiro";
    return "funcionario";
}

async function obterPredioUsuario(idUsuario) {
    const [[usuario]] = await pool.query(
        'SELECT id_predio FROM usuario WHERE id_usuario = ? LIMIT 1',
        [idUsuario]
    );
    return usuario?.id_predio ?? null;
}

export async function listarUsuarios(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [] });
        const [dados] = await pool.query(
            `SELECT id_usuario, id_predio, nome, email, telefone, perfil
             FROM usuario WHERE id_predio = ? ORDER BY nome ASC`,
            [idPredio]
        );
        return res.json({ sucesso: true, dados });
    } catch (erro) {
        return next(erro);
    }
}

export async function listarEquipes(req, res, next) {
    try {
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!idPredio) return res.json({ sucesso: true, dados: [], usuarios: [] });
        const [equipes] = await pool.query("SELECT * FROM equipe WHERE id_predio = ? ORDER BY id_equipe ASC", [idPredio]);
        const [usuarios] = await pool.query(
            "SELECT id_usuario, id_predio, nome, email, telefone, perfil FROM usuario WHERE id_predio = ? ORDER BY nome ASC",
            [idPredio]
        );
        const [vinculos] = await pool.query(
            `SELECT eu.id_equipe_usuario, eu.id_equipe, eu.id_usuario, eu.id_predio,
                    eu.data_entrada, eu.data_saida,
                    u.nome, u.email, u.telefone, u.perfil
             FROM equipe_usuario eu
             INNER JOIN usuario u ON u.id_usuario = eu.id_usuario
             WHERE eu.id_predio = ? ORDER BY eu.id_equipe_usuario ASC`,
            [idPredio]
        );

        const dados = equipes.map((eq) => ({
            ...eq,
            membros: vinculos.filter((v) => v.id_equipe === eq.id_equipe)
        }));

        return res.json({ sucesso: true, dados, usuarios });
    } catch (erro) {
        return next(erro);
    }
}

export async function criarEquipe(req, res, next) {
    try {
        const nome = typeof req.body.nome_equipe === 'string' ? req.body.nome_equipe.trim() : '';
        const descricao = typeof req.body.descricao === 'string' ? req.body.descricao.trim() : '';
        const idPredio = await obterPredioUsuario(req.usuario.id);
        if (!nome) return res.status(400).json({ sucesso: false, erro: 'Informe o nome da equipe.' });
        if (!idPredio) return res.status(409).json({ sucesso: false, erro: 'Vincule um prédio à conta antes de criar uma equipe.' });

        const [resultado] = await pool.query(
            'INSERT INTO equipe (id_predio, nome_equipe, descricao) VALUES (?, ?, ?)',
            [idPredio, nome, descricao || null]
        );
        const [[equipe]] = await pool.query('SELECT * FROM equipe WHERE id_equipe = ?', [resultado.insertId]);
        return res.status(201).json({ sucesso: true, dados: equipe });
    } catch (erro) {
        return next(erro);
    }
}

export async function listarAlertasLimites(req, res, next) {
    try {
        const [leituras] = await pool.query(
            `SELECT d.id_dispositivo, d.nome AS nome_dispositivo, a.nome AS nome_ambiente,
                    'temperatura' AS tipo, h.temperatura_medida AS valor,
                    t.temperatura_minima AS limite_minimo, t.temperatura_maxima AS limite_maximo,
                    NULL AS potencia, NULL AS potencia_maxima, h.data_temperatura AS data_hora
             FROM usuario u
             INNER JOIN andar an ON an.id_predio = u.id_predio
             INNER JOIN ambiente a ON a.id_andar = an.id_andar
             INNER JOIN temperatura t ON t.id_ambiente = a.id_ambiente
             INNER JOIN dispositivo d ON d.id_ambiente = a.id_ambiente AND d.tipo_dispositivo = 'temperatura'
             INNER JOIN historico_temperatura h ON h.id_dispositivo = d.id_dispositivo
             WHERE u.id_usuario = ?
               AND NOT EXISTS (
                   SELECT 1 FROM historico_temperatura h2
                   WHERE h2.id_dispositivo = h.id_dispositivo
                     AND h2.id_historico_temperatura > h.id_historico_temperatura
               )
             UNION ALL
             SELECT d.id_dispositivo, d.nome, a.nome, 'iluminacao', h.iluminacao_medida,
                    l.iluminacao_minima, l.iluminacao_maxima, NULL, NULL, h.data_iluminacao
             FROM usuario u
             INNER JOIN andar an ON an.id_predio = u.id_predio
             INNER JOIN ambiente a ON a.id_andar = an.id_andar
             INNER JOIN iluminacao l ON l.id_ambiente = a.id_ambiente
             INNER JOIN dispositivo d ON d.id_ambiente = a.id_ambiente AND d.tipo_dispositivo = 'iluminacao'
             INNER JOIN historico_iluminacao h ON h.id_dispositivo = d.id_dispositivo
             WHERE u.id_usuario = ?
               AND NOT EXISTS (
                   SELECT 1 FROM historico_iluminacao h2
                   WHERE h2.id_dispositivo = h.id_dispositivo
                     AND h2.id_historico_iluminacao > h.id_historico_iluminacao
               )
             UNION ALL
             SELECT d.id_dispositivo, d.nome, a.nome, 'energia', h.consumo_kwh,
                    e.consumo_minimo, e.consumo_maximo, h.potencia_kw, e.potencia_maxima,
                    h.data_historico_energia
             FROM usuario u
             INNER JOIN andar an ON an.id_predio = u.id_predio
             INNER JOIN ambiente a ON a.id_andar = an.id_andar
             INNER JOIN energia e ON e.id_ambiente = a.id_ambiente
             INNER JOIN dispositivo d ON d.id_ambiente = a.id_ambiente AND d.tipo_dispositivo = 'energia'
             INNER JOIN historico_energia h ON h.id_dispositivo = d.id_dispositivo
             WHERE u.id_usuario = ?
               AND NOT EXISTS (
                   SELECT 1 FROM historico_energia h2
                   WHERE h2.id_dispositivo = h.id_dispositivo
                     AND h2.id_historico_energia > h.id_historico_energia
               )`,
            [req.usuario.id, req.usuario.id, req.usuario.id]
        );

        const alertas = leituras.reduce((lista, leitura) => {
            const valor = Number(leitura.valor);
            const minimo = Number(leitura.limite_minimo);
            const maximo = Number(leitura.limite_maximo);
            const potencia = Number(leitura.potencia);
            const potenciaMaxima = Number(leitura.potencia_maxima);
            const unidade = leitura.tipo === 'temperatura' ? '°C' : leitura.tipo === 'iluminacao' ? 'lux' : 'kWh';
            const base = {
                id_dispositivo: leitura.id_dispositivo,
                dispositivo: leitura.nome_dispositivo,
                ambiente: leitura.nome_ambiente,
                tipo: leitura.tipo,
                valor,
                unidade,
                data_hora: leitura.data_hora,
            };

            if (valor < minimo || valor > maximo) {
                lista.push({ ...base, motivo: 'valor', limite_minimo: minimo, limite_maximo: maximo });
            }
            if (leitura.tipo === 'energia' && potencia > potenciaMaxima) {
                lista.push({ ...base, motivo: 'potencia', valor: potencia, unidade: 'kW', limite_maximo: potenciaMaxima });
            }
            return lista;
        }, []);

        return res.json({ sucesso: true, dados: alertas });
    } catch (erro) {
        return next(erro);
    }
}

export async function adicionarIntegrante(req, res, next) {
    try {
        const idEquipe = Number(req.params.id);
        const { nome, email, telefone, role, perfil, status, since } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ sucesso: false, erro: "Informe nome e e-mail do integrante." });
        }

        const [[equipe]] = await pool.query(
            "SELECT * FROM equipe WHERE id_equipe = ? LIMIT 1",
            [idEquipe]
        );

        if (!equipe) {
            return res.status(404).json({ sucesso: false, erro: "Equipe não encontrada." });
        }

        const perfilFinal = normalizarPerfil(perfil || role);
        const [[usuarioExistente]] = await pool.query(
            "SELECT * FROM usuario WHERE email = ? LIMIT 1",
            [email.trim()]
        );

        let idUsuario;
        if (usuarioExistente) {
            idUsuario = usuarioExistente.id_usuario;
            await pool.query(
                `UPDATE usuario
                 SET nome = ?, telefone = ?, perfil = ?, id_predio = ?
                 WHERE id_usuario = ?`,
                [nome.trim(), telefone || usuarioExistente.telefone || null, perfilFinal, equipe.id_predio, idUsuario]
            );
        } else {
            const salt = randomBytes(16).toString("hex");
            const hash = scryptSync("Lumora@2026", salt, 32).toString("hex");
            const cpfGerado = String(Math.floor(10000000000 + Math.random() * 89999999999));

            const [insertUser] = await pool.query(
                `INSERT INTO usuario (id_predio, nome, email, senha_hash, telefone, perfil, cpf)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [equipe.id_predio, nome.trim(), email.trim(), `${salt}:${hash}`, telefone || null, perfilFinal, cpfGerado]
            );
            idUsuario = insertUser.insertId;
        }

        const dataEntrada = formatarDataSQL(since);
        const dataSaida = status === "Ausente" ? new Date().toISOString().slice(0, 10) : null;

        await pool.query(
            `INSERT INTO equipe_usuario (id_equipe, id_usuario, id_predio, data_entrada, data_saida)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE data_entrada = VALUES(data_entrada), data_saida = VALUES(data_saida)`,
            [idEquipe, idUsuario, equipe.id_predio, dataEntrada, dataSaida]
        );

        return res.status(201).json({ sucesso: true, id_usuario: idUsuario });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizarIntegrante(req, res, next) {
    try {
        const idEquipe = Number(req.params.id);
        const idUsuario = Number(req.params.idUsuario);
        const { nome, email, telefone, role, perfil, status, since } = req.body;

        if (nome || email || telefone !== undefined || role || perfil) {
            const campos = [];
            const valores = [];

            if (nome) { campos.push("nome = ?"); valores.push(nome.trim()); }
            if (email) { campos.push("email = ?"); valores.push(email.trim()); }
            if (telefone !== undefined) { campos.push("telefone = ?"); valores.push(telefone || null); }
            if (role || perfil) { campos.push("perfil = ?"); valores.push(normalizarPerfil(perfil || role)); }

            if (campos.length > 0) {
                await pool.query(
                    `UPDATE usuario SET ${campos.join(", ")} WHERE id_usuario = ?`,
                    [...valores, idUsuario]
                );
            }
        }

        const updatesVinculo = [];
        const valsVinculo = [];

        if (since) {
            updatesVinculo.push("data_entrada = ?");
            valsVinculo.push(formatarDataSQL(since));
        }

        if (status !== undefined) {
            updatesVinculo.push("data_saida = ?");
            valsVinculo.push(status === "Ausente" ? new Date().toISOString().slice(0, 10) : null);
        }

        if (updatesVinculo.length > 0) {
            await pool.query(
                `UPDATE equipe_usuario SET ${updatesVinculo.join(", ")} WHERE id_equipe = ? AND id_usuario = ?`,
                [...valsVinculo, idEquipe, idUsuario]
            );
        }

        return res.json({ sucesso: true });
    } catch (erro) {
        return next(erro);
    }
}

export async function removerIntegrante(req, res, next) {
    try {
        const idEquipe = Number(req.params.id);
        const idUsuario = Number(req.params.idUsuario);

        await pool.query(
            "DELETE FROM equipe_usuario WHERE id_equipe = ? AND id_usuario = ?",
            [idEquipe, idUsuario]
        );

        return res.status(204).send();
    } catch (erro) {
        return next(erro);
    }
}

export async function listarCredenciais(_req, res, next) {
    try {
        const [dados] = await pool.query(
            `SELECT c.id_credencial, c.id_usuario, c.status, c.data_cadastro,
                    c.token_hash, c.tipo_credencial, c.bloqueado_ate,
                    u.nome AS nome_usuario, u.perfil, u.email
             FROM credencial c
             LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
             ORDER BY c.id_credencial DESC`
        );

        return res.json({ sucesso: true, dados });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizarCredencial(req, res, next) {
    try {
        const idCredencial = Number(req.params.id);
        const { status } = req.body;

        if (!["ativa", "bloqueada", "expirada"].includes(status)) {
            return res.status(400).json({ sucesso: false, erro: "Status de credencial inválido." });
        }

        await pool.query(
            "UPDATE credencial SET status = ? WHERE id_credencial = ?",
            [status, idCredencial]
        );

        return res.json({ sucesso: true });
    } catch (erro) {
        return next(erro);
    }
}

export async function listarAcessosDetalhado(_req, res, next) {
    try {
        const [dados] = await pool.query(
            `SELECT e.*,
                    a.nome AS nome_ambiente,
                    c.tipo_credencial,
                    c.token_hash,
                    u.nome AS nome_usuario,
                    u.perfil AS perfil_usuario
             FROM eventos_acessos e
             LEFT JOIN ambiente a ON a.id_ambiente = e.id_ambiente
             LEFT JOIN credencial c ON c.id_credencial = e.id_credencial
             LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
             ORDER BY e.data_utilizacao DESC, e.id_evento DESC
             LIMIT 200`
        );

        return res.json({ sucesso: true, dados });
    } catch (erro) {
        return next(erro);
    }
}

export async function listarHistoricoDispositivos(_req, res, next) {
    try {
        const [dados] = await pool.query(
            `SELECT h.*, d.nome AS nome_dispositivo, d.tipo_dispositivo
             FROM historico_dispositivo h
             INNER JOIN dispositivo d ON d.id_dispositivo = h.id_dispositivo
             ORDER BY h.data_historico_dispositivo DESC, h.id_historico_dispositivo DESC
             LIMIT 300`
        );
        return res.json({ sucesso: true, dados });
    } catch (erro) {
        return next(erro);
    }
}

export async function criarHistoricoDispositivo(req, res, next) {
    const {
        id_dispositivo,
        status_dispositivo,
        data_inicio_status,
        data_fim_status,
        motivo,
        consumo_estimado_kwh,
        custo_estimado,
        observacao,
    } = req.body;
    const statusValidos = ["ativo", "instavel", "manutencao", "inativo", "offline"];
    const idDispositivo = Number(id_dispositivo);

    if (!Number.isInteger(idDispositivo) || idDispositivo <= 0 || !statusValidos.includes(status_dispositivo) || !data_inicio_status) {
        return res.status(400).json({ sucesso: false, erro: "Informe dispositivo, status e data de início válidos." });
    }

    const conexao = await pool.getConnection();
    try {
        await conexao.beginTransaction();
        const [dispositivos] = await conexao.query(
            "SELECT id_dispositivo FROM dispositivo WHERE id_dispositivo = ? FOR UPDATE",
            [idDispositivo]
        );
        if (!dispositivos.length) {
            await conexao.rollback();
            return res.status(404).json({ sucesso: false, erro: "Dispositivo não encontrado." });
        }

        await conexao.query(
            `INSERT INTO historico_dispositivo (
                id_dispositivo, status_dispositivo, data_inicio_status, data_fim_status,
                motivo, consumo_estimado_kwh, custo_estimado, observacao
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idDispositivo,
                status_dispositivo,
                String(data_inicio_status).replace("T", " "),
                data_fim_status ? String(data_fim_status).replace("T", " ") : null,
                motivo?.trim() || null,
                consumo_estimado_kwh === "" || consumo_estimado_kwh == null ? null : Number(consumo_estimado_kwh),
                custo_estimado === "" || custo_estimado == null ? null : Number(custo_estimado),
                observacao?.trim() || null,
            ]
        );
        await conexao.query(
            "UPDATE dispositivo SET status_dispositivo = ? WHERE id_dispositivo = ?",
            [status_dispositivo, idDispositivo]
        );
        await conexao.commit();
        return res.status(201).json({ sucesso: true, mensagem: "Histórico registrado." });
    } catch (erro) {
        await conexao.rollback();
        return next(erro);
    } finally {
        conexao.release();
    }
}
