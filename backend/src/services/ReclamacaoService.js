import * as ReclamacaoModel from "../models/ReclamacaoModel.js";

const STATUS = ["aberto", "em_andamento", "concluido", "cancelado"];
const PRIORIDADES = ["baixa", "media", "alta"];
const CATEGORIAS = ["climatizacao", "iluminacao", "acesso", "energia", "dispositivo", "outro"];
const EQUIPE = ["administrador", "manutencao", "porteiro"];

function erro(mensagem, status = 422) {
    const e = new Error(mensagem);
    e.status = status;
    return e;
}

function numeroOuNull(valor, campo) {
    if (valor === "" || valor === undefined || valor === null) return null;
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero <= 0) throw erro(`O campo ${campo} é inválido.`);
    return numero;
}

function validarDados(entrada, parcial = false) {
    const dados = {};
    if (!parcial || "id_ambiente" in entrada) dados.id_ambiente = numeroOuNull(entrada.id_ambiente, "ambiente");
    if (!parcial || "id_dispositivo" in entrada) dados.id_dispositivo = numeroOuNull(entrada.id_dispositivo, "dispositivo");
    if (!parcial || "id_usuario_responsavel" in entrada) dados.id_usuario_responsavel = numeroOuNull(entrada.id_usuario_responsavel, "responsável");

    if (!parcial || "descricao_usuario" in entrada) {
        dados.descricao_usuario = typeof entrada.descricao_usuario === "string" ? entrada.descricao_usuario.trim() : "";
        if (!dados.descricao_usuario || dados.descricao_usuario.length > 5000) {
            throw erro("A descrição é obrigatória e deve ter até 5.000 caracteres.");
        }
    }
    if (!parcial || "prioridade" in entrada) {
        dados.prioridade = entrada.prioridade || "media";
        if (!PRIORIDADES.includes(dados.prioridade)) throw erro("Prioridade inválida.");
    }
    if (!parcial || "categoria_problema" in entrada) {
        dados.categoria_problema = entrada.categoria_problema || null;
        if (dados.categoria_problema && !CATEGORIAS.includes(dados.categoria_problema)) {
            throw erro("Categoria da reclamação inválida.");
        }
    }
    if (!parcial && !dados.id_ambiente && !dados.id_dispositivo) {
        throw erro("Informe ao menos um ambiente ou dispositivo.");
    }
    return dados;
}

async function contexto(usuario) {
    return {
        idPredio: await ReclamacaoModel.obterPredioUsuario(usuario.id),
        idUsuario: usuario.id,
        perfil: usuario.perfil
    };
}

async function obterOuFalhar(id, usuario) {
    const ctx = await contexto(usuario);
    const registro = await ReclamacaoModel.buscarPorId(id, ctx.idUsuario, ctx.perfil, ctx.idPredio);
    if (!registro) throw erro("Reclamação não encontrada.", 404);
    return { ctx, registro };
}

async function validarReferencias(dados, idPredio, existente = null) {
    const ambiente = dados.id_ambiente !== undefined ? dados.id_ambiente : existente?.id_ambiente;
    const dispositivo = dados.id_dispositivo !== undefined ? dados.id_dispositivo : existente?.id_dispositivo;
    const responsavel = dados.id_usuario_responsavel !== undefined
        ? dados.id_usuario_responsavel
        : existente?.id_usuario_responsavel;

    if (!ambiente && !dispositivo) throw erro("Informe ao menos um ambiente ou dispositivo.");
    if (ambiente && !(await ReclamacaoModel.validarAmbiente(ambiente, idPredio))) {
        throw erro("O ambiente informado não pertence ao prédio do usuário.", 404);
    }
    if (dispositivo && !(await ReclamacaoModel.validarDispositivo(dispositivo, ambiente, idPredio))) {
        throw erro("O dispositivo informado não pertence ao ambiente ou prédio selecionado.", 404);
    }
    if (!(await ReclamacaoModel.validarResponsavel(responsavel, idPredio))) {
        throw erro("O responsável informado não pertence ao prédio ou está inativo.", 404);
    }
}

export async function buscarContexto(usuario) {
    const ctx = await contexto(usuario);
    return ReclamacaoModel.buscarContexto(ctx.idPredio);
}

export async function listar(usuario) {
    const ctx = await contexto(usuario);
    return ReclamacaoModel.listar(ctx.idUsuario, ctx.perfil, ctx.idPredio);
}

export async function criar(usuario, entrada) {
    const ctx = await contexto(usuario);
    const dados = validarDados(entrada);
    if (ctx.perfil === "locador") {
        dados.id_usuario_responsavel = null;
        dados.prioridade = "media";
    }
    await validarReferencias(dados, ctx.idPredio);
    const id = await ReclamacaoModel.criar({ ...dados, id_usuario_abertura: ctx.idUsuario });
    return obterOuFalhar(id, usuario).then(({ registro }) => registro);
}

export async function atualizar(id, usuario, entrada) {
    const { ctx, registro } = await obterOuFalhar(id, usuario);
    if (ctx.perfil === "locador" && registro.status_chamado !== "aberto") {
        throw erro("Você só pode editar sua reclamação enquanto ela estiver aberta.", 409);
    }
    const dados = validarDados(entrada);
    if (ctx.perfil === "locador") {
        dados.id_usuario_responsavel = registro.id_usuario_responsavel;
        dados.prioridade = registro.prioridade;
    }
    await validarReferencias(dados, ctx.idPredio, registro);
    await ReclamacaoModel.atualizar(id, { ...registro, ...dados });
    return obterOuFalhar(id, usuario).then(({ registro: atualizado }) => atualizado);
}

export async function mudarStatus(id, usuario, status) {
    const { ctx, registro } = await obterOuFalhar(id, usuario);
    if (!STATUS.includes(status)) throw erro("Status da reclamação inválido.");
    if (ctx.perfil === "locador") {
        if (registro.status_chamado !== "aberto" || status !== "cancelado") {
            throw erro("Você só pode cancelar sua reclamação enquanto ela estiver aberta.", 403);
        }
    } else if (!EQUIPE.includes(ctx.perfil)) {
        throw erro("Usuário sem permissão para alterar o status.", 403);
    }
    await ReclamacaoModel.atualizarStatus(id, status);
    return obterOuFalhar(id, usuario).then(({ registro: atualizado }) => atualizado);
}

export async function mudarResponsavel(id, usuario, idResponsavel) {
    const { ctx, registro } = await obterOuFalhar(id, usuario);
    if (!EQUIPE.includes(ctx.perfil)) throw erro("Usuário sem permissão para atribuir responsáveis.", 403);
    if (registro.status_chamado === "cancelado") throw erro("Não é possível atribuir responsável a uma reclamação cancelada.", 409);
    const responsavel = numeroOuNull(idResponsavel, "responsável");
    if (!(await ReclamacaoModel.validarResponsavel(responsavel, ctx.idPredio))) {
        throw erro("O responsável informado não pertence ao prédio ou está inativo.", 404);
    }
    await ReclamacaoModel.atualizarResponsavel(id, responsavel);
    return obterOuFalhar(id, usuario).then(({ registro: atualizado }) => atualizado);
}
