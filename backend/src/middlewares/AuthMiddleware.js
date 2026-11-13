import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    const authorization = req.headers.authorization;

    const partes = typeof authorization === 'string'
        ? authorization.trim().split(/\s+/)
        : [];

    const [tipo, token, ...resto] = partes;

    if (tipo?.toLowerCase() !== 'bearer' || !token || resto.length !== 0) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token de acesso não informado.'
        });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({
            sucesso: false,
            erro: 'Configuração de autenticação indisponível.'
        });
    }

    try {
        const dadosToken = jwt.verify(token, jwtSecret);

        req.usuario = {
            id: Number(dadosToken.sub),
            perfil: dadosToken.perfil
        };

        return next();

    } catch {
        return res.status(401).json({
            sucesso: false,
            erro: 'Token inválido ou expirado.'
        });
    }
}

export function autorizarPerfis(...perfisPermitidos) {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                sucesso: false,
                erro: 'É necessário realizar a autenticação.'
            });
        }

        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({
                sucesso: false,
                erro: 'Acesso não autorizado para este perfil.'
            });
        }

        return next();
    };
}

export const autorizarAdmin = autorizarPerfis('administrador');