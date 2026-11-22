import { Router } from "express";
import { autenticar, autorizarPerfis } from "../middlewares/AuthMiddleware.js";
import { pool } from "../config/database.js";

export const informacaoRouter = Router();
informacaoRouter.use(autenticar);
const todos = autorizarPerfis("administrador", "manutencao", "porteiro", "locador");

informacaoRouter.get("/dashboard", todos, async (req, res, next) => {
    try {
        const idAmbiente = req.query.id_ambiente ? Number(req.query.id_ambiente) : null;
        const inicio = req.query.inicio || null;
        const fim = req.query.fim ? `${req.query.fim} 23:59:59` : null;
        const filtroDispositivo = idAmbiente ? " AND id_ambiente = ?" : "";
        const paramsDispositivo = idAmbiente ? [idAmbiente] : [];
        const filtroOcorrencia = idAmbiente ? " AND d.id_ambiente = ?" : "";
        const paramsOcorrencia = idAmbiente ? [idAmbiente] : [];
        const filtroAcesso = idAmbiente ? " AND id_ambiente = ?" : "";
        const paramsAcesso = idAmbiente ? [idAmbiente] : [];
        const filtroDataOcorrencia = inicio || fim ? `${inicio ? " AND o.data_ocorrencia >= ?" : ""}${fim ? " AND o.data_ocorrencia <= ?" : ""}` : "";
        if (inicio) paramsOcorrencia.push(inicio);
        if (fim) paramsOcorrencia.push(fim);
        const filtroDataAcesso = inicio || fim ? `${inicio ? " AND data_utilizacao >= ?" : ""}${fim ? " AND data_utilizacao <= ?" : ""}` : "";
        if (inicio) paramsAcesso.push(inicio);
        if (fim) paramsAcesso.push(fim);

        const [predios] = await pool.query("SELECT COUNT(*) total FROM predio");
        const [ambientes] = await pool.query("SELECT COUNT(*) total FROM ambiente" + (idAmbiente ? " WHERE id_ambiente = ?" : ""), idAmbiente ? [idAmbiente] : []);
        const [dispositivos] = await pool.query(`SELECT COUNT(*) total FROM dispositivo WHERE 1=1${filtroDispositivo}`, paramsDispositivo);
        const [ativos] = await pool.query(`SELECT COUNT(*) total FROM dispositivo WHERE status_dispositivo='ativo'${filtroDispositivo}`, paramsDispositivo);
        const [ocorrencias] = await pool.query(`SELECT COUNT(*) total FROM ocorrencia o JOIN dispositivo d ON d.id_dispositivo=o.id_dispositivo WHERE o.status_ocorrencia <> 'resolvida'${filtroOcorrencia}${filtroDataOcorrencia}`, paramsOcorrencia);
        const [acessos] = await pool.query(`SELECT COUNT(*) total FROM eventos_acessos WHERE 1=1${filtroAcesso}${filtroDataAcesso}`, paramsAcesso);
        return res.json({ sucesso: true, dados: {
            predios: Number(predios[0].total), ambientes: Number(ambientes[0].total), dispositivos: Number(dispositivos[0].total),
            ativos: Number(ativos[0].total), ocorrencias: Number(ocorrencias[0].total), acessos_30_dias: Number(acessos[0].total),
            filtros: { id_ambiente: idAmbiente, inicio: req.query.inicio || null, fim: req.query.fim || null }
        }});
    } catch (e) { next(e); }
});

informacaoRouter.get("/historico", todos, async (req, res, next) => {
    try {
        const limite = Math.min(Math.max(Number(req.query.limite || 100), 1), 500);
        const [leituras] = await pool.query(`
            SELECT 'temperatura' tipo, ht.id_historico_temperatura id, ht.data_temperatura data_hora,
                   ht.id_dispositivo, d.nome dispositivo, ht.temperatura_medida valor, '°C' unidade
            FROM historico_temperatura ht INNER JOIN dispositivo d ON d.id_dispositivo=ht.id_dispositivo
            UNION ALL
            SELECT 'iluminacao', hi.id_historico_iluminacao, hi.data_iluminacao, hi.id_dispositivo, d.nome, hi.iluminacao_medida, 'lux'
            FROM historico_iluminacao hi INNER JOIN dispositivo d ON d.id_dispositivo=hi.id_dispositivo
            UNION ALL
            SELECT 'energia', he.id_historico_energia, he.data_historico_energia, he.id_dispositivo, d.nome, he.consumo_kwh, 'kWh'
            FROM historico_energia he INNER JOIN dispositivo d ON d.id_dispositivo=he.id_dispositivo
            ORDER BY data_hora DESC LIMIT ${limite}`);
        const [acessos] = await pool.query(`
            SELECT 'acesso' tipo, ea.id_evento id, ea.data_utilizacao data_hora, ea.id_ambiente,
                   a.nome ambiente, ea.tipo_acesso, ea.decisao_acesso, ea.motivo
            FROM eventos_acessos ea INNER JOIN ambiente a ON a.id_ambiente=ea.id_ambiente
            ORDER BY ea.data_utilizacao DESC LIMIT ${limite}`);
        const [ocorrencias] = await pool.query(`
            SELECT 'ocorrencia' tipo, o.id_ocorrencia id, o.data_ocorrencia data_hora, o.titulo,
                   o.status_ocorrencia, o.prioridade, o.descricao
            FROM ocorrencia o ORDER BY o.data_ocorrencia DESC LIMIT ${limite}`);
        return res.json({ sucesso: true, dados: { leituras, acessos, ocorrencias } });
    } catch (e) { next(e); }
});

informacaoRouter.get("/versao", todos, async (_req, res, next) => {
    try {
        const [rows] = await pool.query("SELECT versao, data_publicacao, notas FROM versao_sistema ORDER BY data_publicacao DESC, id_versao DESC LIMIT 20");
        return res.json({ sucesso: true, dados: rows });
    } catch (e) { next(e); }
});
