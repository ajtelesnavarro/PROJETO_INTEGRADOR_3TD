
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

export default function Orcamento() {
    const router = useRouter();

    const [form, setForm] = useState({
        nomeResponsavel: "",
        nomeEmpresa: "",
        email: "",
        telefone: "",
        enderecoEmpresa: "",
        tipo: "Comercial",
        quantidadeAndares: "",
        quantidadeAmbientes: "",
        quantidadeDispositivos: "",
        prioridade: "Monitoramento",
        mensagem: ""
    });

    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    const set = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    async function submit(e) {
        e.preventDefault();
        setErro("");
        setEnviando(true);

        try {
            const dadosEnvio = {
                nomeResponsavel: form.nomeResponsavel,
                nomeEmpresa: form.nomeEmpresa,
                email: form.email,
                telefone: form.telefone,
                enderecoEmpresa: form.enderecoEmpresa,
                quantidadeAndares: form.quantidadeAndares,
                quantidadeAmbientes: form.quantidadeAmbientes,
                quantidadeDispositivos: form.quantidadeDispositivos,
                servicosDesejados: form.prioridade,
                descricao: `Tipo de edifício: ${form.tipo}\n${form.mensagem}`
            };

            const dados = await requisicaoAPI("/orcamentos", {
                method: "POST",
                body: JSON.stringify(dadosEnvio)
            });

            router.push(
                `/orcamento/resumoOrcamento?id=${dados.idOrcamento}`
            );

        } catch (erro) {
            setErro(erro.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="quote-page">
            <div className="container quote-grid">

                <div className="quote-intro">
                    <div className="pill">VAMOS CONVERSAR</div>

                    <h1>
                        Conte-nos o que seu edifício <em>precisa.</em>
                    </h1>

                    <p>
                        Preencha o formulário e nossa equipe poderá
                        entender o cenário e preparar uma proposta
                        alinhada ao seu projeto.
                    </p>

                    <div className="quote-steps">
                        <Step n="01" text="Entenda o seu cenário" />
                        <Step n="02" text="Defina as prioridades" />
                        <Step n="03" text="Receba uma proposta" />
                    </div>
                </div>

                <form className="quote-form" onSubmit={submit}>

                    <div className="form-top">
                        <div>
                            <span className="section-kicker">PROJETO</span>
                            <h2>Solicitar orçamento</h2>
                        </div>
                        <span>01 / 01</span>
                    </div>

                    <div className="form-grid">

                        <Field
                            label="Nome do responsável *"
                            name="nomeResponsavel"
                            value={form.nomeResponsavel}
                            onChange={set}
                            placeholder="Seu nome"
                            autoComplete="name"
                            required
                        />

                        <Field
                            label="Empresa *"
                            name="nomeEmpresa"
                            value={form.nomeEmpresa}
                            onChange={set}
                            placeholder="Nome da empresa"
                            required
                        />

                        <Field
                            label="E-mail *"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={set}
                            placeholder="voce@empresa.com"
                            autoComplete="email"
                            required
                        />

                        <Field
                            label="Telefone *"
                            name="telefone"
                            value={form.telefone}
                            onChange={set}
                            placeholder="(11) 99999-9999"
                            autoComplete="tel"
                            required
                        />

                        <Field
                            label="Endereço da empresa"
                            name="enderecoEmpresa"
                            value={form.enderecoEmpresa}
                            onChange={set}
                            placeholder="Endereço completo"
                        />

                        <label>
                            Tipo de edifício
                            <select
                                name="tipo"
                                value={form.tipo}
                                onChange={set}
                            >
                                <option>Comercial</option>
                                <option>Corporativo</option>
                                <option>Residencial</option>
                                <option>Outro</option>
                            </select>
                        </label>

                        <Field
                            label="Quantidade de andares *"
                            type="number"
                            min="1"
                            name="quantidadeAndares"
                            value={form.quantidadeAndares}
                            onChange={set}
                            placeholder="Ex.: 5"
                            required
                        />

                        <Field
                            label="Quantidade de ambientes *"
                            type="number"
                            min="1"
                            name="quantidadeAmbientes"
                            value={form.quantidadeAmbientes}
                            onChange={set}
                            placeholder="Ex.: 40"
                            required
                        />

                        <Field
                            label="Quantidade de dispositivos"
                            type="number"
                            min="0"
                            name="quantidadeDispositivos"
                            value={form.quantidadeDispositivos}
                            onChange={set}
                            placeholder="Ex.: 100"
                        />

                        <label>
                            Principal necessidade
                            <select
                                name="prioridade"
                                value={form.prioridade}
                                onChange={set}
                            >
                                <option>Monitoramento</option>
                                <option>Gestão de energia</option>
                                <option>Automação</option>
                                <option>Controle de acessos</option>
                                <option>Alertas e ocorrências</option>
                                <option>Integração de sistemas</option>
                                <option>Outra necessidade</option>
                            </select>
                        </label>

                    </div>

                    <label>
                        Fale sobre seu projeto
                        <textarea
                            name="mensagem"
                            value={form.mensagem}
                            onChange={set}
                            rows="5"
                            placeholder="Conte sobre o edifício, objetivos, quantidade de dispositivos ou necessidades de monitoramento."
                        />
                    </label>

                    {erro && (
                        <div className="success" role="alert">
                            {erro}
                        </div>
                    )}

                    <button
                        className="button primary full"
                        type="submit"
                        disabled={enviando}
                    >
                        {enviando ? "Enviando..." : "Enviar solicitação"}
                        <span>→</span>
                    </button>

                </form>
            </div>
        </main>
    );
}

function Field({ label, ...props }) {
    return (
        <label>
            {label}
            <input {...props} />
        </label>
    );
}

function Step({ n, text }) {
    return (
        <div>
            <b>{n}</b>
            <span>{text}</span>
            <i>↗</i>
        </div>
    );
}
