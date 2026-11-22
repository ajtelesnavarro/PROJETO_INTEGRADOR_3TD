
import * as PredioService from '../services/recursos/predioService.js';
import * as DispositivoService from '../services/recursos/dispositivoService.js';
import * as AndarService from '../services/recursos/andarService.js';
import * as AmbienteService from '../services/recursos/ambienteService.js';
import * as OcorrenciaService from '../services/recursos/ocorrenciaService.js';
import * as AcessoService from '../services/recursos/acessoService.js';
import { validarPaginacao } from '../services/recursos/validacaoService.js';
import * as LeituraService from '../services/recursos/leituraService.js';

// Serviços disponíveis por recurso
const servicos = {
    predios: PredioService,
    andares: AndarService,
    ambientes: AmbienteService,
    dispositivos: DispositivoService,
    ocorrencias: OcorrenciaService,
    acessos: AcessoService
};

// Tratamento centralizado de erros
function responderErro(erro, res, next) {
    if (erro instanceof TypeError) {
        return res.status(400).json({
            sucesso: false,
            erro: erro.message
        });
    }

    if (
        Number.isInteger(erro.status) &&
        erro.status >= 400 &&
        erro.status <= 599
    ) {
        return res.status(erro.status).json({
            sucesso: false,
            erro: erro.message
        });
    }

    return next(erro);
}

// Verifica se o serviço existe
function obterServico(nome) {
    const service = servicos[nome];

    if (!service) {
        const erro = new Error('Recurso não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return service;
}

// 1. Listagem
export function listar(nome) {
    return async (req, res, next) => {
        try {
            const service = obterServico(nome);

            // Valida os parâmetros de paginação
            const paginacao = validarPaginacao(req.query);

            // Separa paginação dos filtros
            const filtros = { ...req.query };
            delete filtros.pagina;
            delete filtros.limite;

            // Busca os registros
            const resultado = await service.listar(
                filtros,
                paginacao
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado.dados,
                paginacao: {
                    pagina: paginacao.pagina,
                    limite: paginacao.limite,
                    total: resultado.total,
                    totalPaginas: Math.ceil(
                        resultado.total / paginacao.limite
                    )
                }
            });
        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 2. Busca por ID
export function buscar(nome) {
    return async (req, res, next) => {
        try {
            const resultado = await obterServico(nome).buscar(
                req.params.id
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado
            });
        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 3. Criação
export function criar(nome) {
    return async (req, res, next) => {
        try {
            const resultado = await obterServico(nome).criar(
                req.body,
                req.usuario
            );

            return res.status(201).json({
                sucesso: true,
                dados: resultado
            });
        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 4. Atualização
export function atualizar(nome) {
    return async (req, res, next) => {
        try {
            const resultado = await obterServico(nome).atualizar(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado
            });
        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 5. Remoção
export function excluir(nome) {
    return async (req, res, next) => {
        try {
            await obterServico(nome).excluir(req.params.id);

            return res.status(204).send();
        } catch (erro) {
            return responderErro(erro, res, next);
        }
    };
}

// 6. Listagem de leituras
export function listarLeituras(req, res, next) {
    return (async () => {
        try {
            const paginacao = validarPaginacao(req.query);

            const filtros = { ...req.query };
            delete filtros.pagina;
            delete filtros.limite;

            const resultado = await LeituraService.listar(
                filtros,
                paginacao
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado.dados,
                paginacao: {
                    pagina: paginacao.pagina,
                    limite: paginacao.limite,
                    total: resultado.total,
                    totalPaginas: Math.ceil(
                        resultado.total / paginacao.limite
                    )
                }
            });
        } catch (erro) {
            return responderErro(erro, res, next);
        }
    })();
}

// 7. Busca de leitura por tipo e ID
export async function buscarLeitura(req, res, next) {
    try {
        const resultado = await LeituraService.buscar(
            req.params.tipo,
            req.params.id
        );

        return res.status(200).json({
            sucesso: true,
            dados: resultado
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}

// 8. Criação de leitura
export async function criarLeitura(req, res, next) {
    try {
        const resultado = await LeituraService.criar(
            req.params.tipo,
            req.body
        );

        return res.status(201).json({
            sucesso: true,
            dados: resultado
        });
    } catch (erro) {
        return responderErro(erro, res, next);
    }
}