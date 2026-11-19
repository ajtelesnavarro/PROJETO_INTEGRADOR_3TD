"use client";

import { useState, useEffect } from "react";
import "./pefil.css";

export default function User() {
    const [imagem, setImagem] = useState("/images/logo.png");

    function selecionarImagem(event) {
        const arquivo = event.target.files[0];

        if (arquivo) {
            setImagem(URL.createObjectURL(arquivo));
        }
    }

    useEffect(() => {
        return () => {
            if (imagem.startsWith("blob:")) {
                URL.revokeObjectURL(imagem);
            }
        };
    }, [imagem]);

    return (
        <main className="perfil-container">

            <section className="perfil-card">

                <div className="perfil-header">
                    <h1>Meu Perfil</h1>
                    <p>Visualize e atualize suas informações pessoais.</p>
                </div>

                <form
                    className="perfil-form"
                    onSubmit={(event) => event.preventDefault()}
                >

                    <div className="perfil-foto-area">

                        <div className="perfil-foto">
                            <img src={imagem} alt="Foto de perfil" />

                            <label htmlFor="foto" title="Alterar foto">
                                <i className="bi bi-camera-fill"></i>
                            </label>

                            <input
                                type="file"
                                name="foto"
                                id="foto"
                                accept="image/*"
                                onChange={selecionarImagem}
                                hidden
                            />
                        </div>

                        <div>
                            <h3>Foto de perfil</h3>
                            <p>Clique no ícone da câmera para alterar sua foto.</p>
                        </div>

                    </div>

                    <div className="perfil-divider"></div>

                    <div className="perfil-campos">

                        <div className="campo">
                            <label htmlFor="nome_usuario">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                name="nome_usuario"
                                id="nome_usuario"
                                required
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="data_nascimento">
                                Data de nascimento
                            </label>
                            <input
                                type="date"
                                name="data_nascimento"
                                id="data_nascimento"
                                required
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="cpf">CPF</label>
                            <input
                                type="text"
                                name="cpf"
                                id="cpf"
                                required
                            />
                        </div>

                        <div className="campo">
                            <label htmlFor="telefone">Telefone</label>
                            <input
                                type="tel"
                                name="telefone"
                                id="telefone"
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>

                        <div className="campo campo-email">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="seuemail@email.com"
                                required
                            />
                        </div>

                    </div>
                    <div className="perfil-footer">
                        <button type="submit">
                            <i className="bi bi-check-lg"></i>
                            Salvar alterações
                        </button>
                    </div>

                </form>

            </section>

        </main>
    );
}