import { Router } from "express";
import { autenticar, autorizarPerfis } from "../middlewares/AuthMiddleware.js";
import { pool } from "../config/database.js";

export const relatorioRouter = Router();
relatorioRouter.use(autenticar, autorizarPerfis("administrador", "manutencao"));

relatorioRouter.get("/relatorios", async (req, res, next) => {
  try {
    const idAmbiente = req.query.id_ambiente ? Number(req.query.id_ambiente) : null;
    const inicio = req.query.inicio || null;
    const fim = req.query.fim || null;
    const params = [];
    const whereAmb = idAmbiente ? " AND d.id_ambiente = ?" : "";
    if (idAmbiente) params.push(idAmbiente);
    const dateWhere = [];
    if (inicio) { dateWhere.push("ht.data_temperatura >= ?"); params.push(inicio); }
    if (fim) { dateWhere.push("ht.data_temperatura <= ?"); params.push(`${fim} 23:59:59`); }
    const dateClause = dateWhere.length ? ` AND ${dateWhere.join(" AND ")}` : "";

    const [temperatura] = await pool.query(`SELECT 'temperatura' tipo, ht.data_temperatura data_hora, d.id_dispositivo, d.nome dispositivo, ht.temperatura_medida valor, '°C' unidade FROM historico_temperatura ht JOIN dispositivo d ON d.id_dispositivo=ht.id_dispositivo WHERE 1=1 ${whereAmb} ${dateClause} ORDER BY ht.data_temperatura DESC`, params);
    const [ocorrencias] = await pool.query(`SELECT o.id_ocorrencia, o.titulo, o.status_ocorrencia, o.prioridade, o.data_ocorrencia, o.descricao, d.nome dispositivo FROM ocorrencia o JOIN dispositivo d ON d.id_dispositivo=o.id_dispositivo WHERE 1=1 ${idAmbiente ? " AND d.id_ambiente = ?" : ""} ${inicio ? " AND o.data_ocorrencia >= ?" : ""} ${fim ? " AND o.data_ocorrencia <= ?" : ""} ORDER BY o.data_ocorrencia DESC`, (() => { const p=[]; if(idAmbiente)p.push(idAmbiente); if(inicio)p.push(inicio); if(fim)p.push(`${fim} 23:59:59`); return p; })());
    return res.json({ sucesso: true, dados: { filtros: { id_ambiente: idAmbiente, inicio, fim }, temperatura, ocorrencias } });
  } catch (e) { next(e); }
});
