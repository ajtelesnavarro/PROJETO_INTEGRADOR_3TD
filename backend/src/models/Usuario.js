const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERFIS = [
    'administrador',
    'manutencao',
    'porteiro',
    'locador'
];

export default class Usuario {
    constructor({
        id_usuario,
        id_predio = null,
        nome,
        email,
        telefone = null,
        perfil = 'locador',
        cpf,
        foto = null,
        data_nascimento = null,
        ativo = 'ativo'
    }) {

        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {
            throw new TypeError('ID do usuário inválido.');
        }

        if (typeof nome !== 'string' || nome.trim() === '') {
            throw new TypeError('Nome é obrigatório.');
        }

        if (nome.trim().length > 100) {
            throw new TypeError('Nome deve ter no máximo 100 caracteres.');
        }

        if (typeof email !== 'string' || !REGEX_EMAIL.test(email.trim())) {
            throw new TypeError('Informe um e-mail válido.');
        }

        if (email.trim().length > 150) {
            throw new TypeError('E-mail deve ter no máximo 150 caracteres.');
        }

        if (id_predio !== null && (!Number.isInteger(id_predio) || id_predio <= 0)) {
            throw new TypeError('ID do prédio inválido.');
        }

        if (!PERFIS.includes(perfil)) {
            throw new TypeError('Perfil de usuário inválido.');
        }

        if (typeof cpf !== 'string' || !/^\d{11}$/.test(cpf)) {
            throw new TypeError('CPF deve conter 11 números.');
        }

        if (!['ativo', 'inativo'].includes(ativo)) {
            throw new TypeError('Status do usuário inválido.');
        }

        Object.assign(this, {
            id_usuario,
            id_predio,
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            telefone,
            perfil,
            cpf,
            foto,
            data_nascimento,
            ativo
        });
    }
}
