import jwt from "jsonwebtoken";

export const PERFIS = Object.freeze({
    ADMINISTRADOR: "administrador",
    MANUTENCAO: "manutencao",
    PORTEIRO: "porteiro",
    LOCADOR: "locador"
});

export const TODOS_OS_PERFIS = Object.values(PERFIS);

export function autenticar(req, res, next) {
    const headerAuth = req.headers.authorization;
    const [tipo, token, ...extras] = typeof headerAuth === "string" ? headerAuth.split(" ") : [];

    if (tipo !== "Bearer" || !token || extras.length > 0) {
        return res.status(401).json({ sucesso: false, erro: "Token de acesso ausente." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).json({ sucesso: false, erro: "Configuração de autenticação indisponível." });

    try {
        const payload = jwt.verify(token, jwtSecret, { issuer: "lumora-smartbuilding" });
        const perfil = String(payload.perfil || "").toLowerCase();
        if (!TODOS_OS_PERFIS.includes(perfil)) {
            return res.status(403).json({ sucesso: false, erro: "Perfil de usuário inválido ou desativado." });
        }
        req.usuario = { id: Number(payload.sub), perfil };
        return next();
    } catch {
        return res.status(401).json({ sucesso: false, erro: "Token inválido ou expirado." });
    }
}

export function autorizarPerfis(...perfisPermitidos) {
    return function autorizar(req, res, next) {
        if (!req.usuario) return res.status(401).json({ sucesso: false, erro: "Autenticação necessária." });
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ sucesso: false, erro: "Usuário sem permissão para esta operação." });
        }
        return next();
    };
}

export const somenteAdmin = autorizarPerfis(PERFIS.ADMINISTRADOR);
