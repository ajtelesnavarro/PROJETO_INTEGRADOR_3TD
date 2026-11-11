
import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../src/config/database.js";

const {
    ADMIN_NOME,
    ADMIN_EMAIL,
    ADMIN_SENHA,
    ADMIN_CPF
} = process.env;

async function criarAdmin() {
    if (
        !ADMIN_NOME ||
        !ADMIN_EMAIL ||
        !ADMIN_SENHA ||
        ADMIN_SENHA.length < 8 ||
        !ADMIN_CPF
    ) {
        throw new Error(
            "Defina ADMIN_NOME, ADMIN_EMAIL, ADMIN_SENHA e ADMIN_CPF no .env. A senha deve ter pelo menos 8 caracteres."
        );
    }

    const cpf = ADMIN_CPF.replace(/\D/g, "");

    if (cpf.length !== 11) {
        throw new Error("ADMIN_CPF deve conter 11 números.");
    }

    const hash = await bcrypt.hash(ADMIN_SENHA, 12);

    await pool.query(
        `INSERT INTO usuario
            (id_predio, nome, email, senha_hash, perfil, cpf)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            1,
            ADMIN_NOME.trim(),
            ADMIN_EMAIL.trim().toLowerCase(),
            hash,
            "administrador",
            cpf
        ]
    );

    console.log(
        "Administrador criado com sucesso no Edificio Empresarial Central."
    );
}

try {
    await criarAdmin();
} catch (erro) {
    console.error("Erro ao criar administrador:");
    console.error(erro);
    console.error(erro?.stack);
    process.exitCode = 1;
} finally {
    await pool.end();
}
