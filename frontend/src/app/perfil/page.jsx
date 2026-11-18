"use client"

import "./pefil.css"

export default function user() {
    return (
        <main>
            <section>
                <div className="">
                    <form action="">
                        <div className="">
                            <label htmlFor="foto">Perfil</label>
                            <input type="file" name="foto" id="foto" hidden/>
                            <img src="images/logo.png" alt=""  />
                        </div>

                        <label htmlFor="nome_usuario">Nome Complemeto</label>
                        <input type="text" name="nome_usuario" id="nome_usuario" required="" />
                        <label htmlFor="data_nascimento">Data de nascimento</label>
                        <input type="date" name="data_nascimento" id="data_nascimento" required="" />
                        <label htmlFor="cpf">CPF</label>
                        <input type="text" name="cpf" id="cpf" required="" />
                        <label htmlFor="">Telefone</label>
                        <input type="tel" name="telefone" id="telefone" required="" />
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" required="" />

                        <button type="submit">Alterar</button>
                    </form>
                </div>
            </section>
        </main>
    )
}