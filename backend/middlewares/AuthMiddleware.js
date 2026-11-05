import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const PERFIS_VALIDOS = [
    'Administrador',
    'Manutencao',
    'Porteiro',
    'Visitante'
];

export function autenticar(req, res, next) {
    const headerAuth = req.headers.authorization;

    const [tipo, token, ...extras] =
        typeof headerAuth === 'string'
            ? headerAuth.trim().split(/\s+/)
            : [];

    if (tipo !== 'Bearer' || !token || extras.length > 0) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Cabeçalho de autenticação ausente ou inválido.'
        });
    }

    if (!jwtSecret) {
        return res.status(500).json({
            sucesso: false,
            erro: 'Configuração de autenticação indisponível.'
        });
    }

    try {
        const payload = jwt.verify(token, jwtSecret, {
            issuer: 'lumora-smartbuilding',
            algorithms: ['HS256']
        });

        const id = Number(payload.sub);

        if (
            !Number.isInteger(id) ||
            id <= 0 ||
            !PERFIS_VALIDOS.includes(payload.perfil)
        ) {
            return res.status(401).json({
                sucesso: false,
                erro: 'Token contém informações inválidas.'
            });
        }

        req.usuario = {
            id_usuario: id,
            perfil: payload.perfil
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
    if (
        perfisPermitidos.length === 0 ||
        !perfisPermitidos.every(
            perfil => PERFIS_VALIDOS.includes(perfil)
        )
    ) {
        throw new TypeError('Perfis de autorização inválidos.');
    }

    return function autorizar(req, res, next) {
        if (!req.usuario) {
            return res.status(401).json({
                sucesso: false,
                erro: 'Autenticação necessária.'
            });
        }

        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({
                sucesso: false,
                erro: 'Usuário sem permissão para esta operação.'
            });
        }

        return next();
    };
}

export const somenteAdmin = autorizarPerfis('Administrador');
