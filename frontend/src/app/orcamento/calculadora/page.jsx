"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requisicaoAPI } from "@/services/api";

export default function CalcularOrcamentoPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        nomeResponsavel: "",
        nomeEmpresa: "",
        email: "",
        telefone: "",
        enderecoEmpresa: "",
        quantidadeAndares: "",
        quantidadeAmbientes: "",
        quantidadeDispositivos: "",
        servicosDesejados: "",
        descricao: ""
    });

    const [erro, setErro] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const dados = await requisicaoAPI("/orcamentos", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            router.push(
                `/orcamento/resumoOrcamento?id=${dados.idOrcamento}`
            );
        } catch (erro) {
            setErro(erro.message);
        }
    }

    return (
        <div>
            <h1>Calcular Orçamento</h1>

            {erro && <p>{erro}</p>}

            <form onSubmit={handleSubmit}>
                <input name="nomeResponsavel" placeholder="Nome do responsável"
                    value={formData.nomeResponsavel} onChange={handleChange} required />

                <input name="nomeEmpresa" placeholder="Nome da empresa"
                    value={formData.nomeEmpresa} onChange={handleChange} required />

                <input name="email" type="email" placeholder="E-mail"
                    value={formData.email} onChange={handleChange} required />

                <input name="telefone" placeholder="Telefone"
                    value={formData.telefone} onChange={handleChange} required />

                <input name="enderecoEmpresa" placeholder="Endereço da empresa"
                    value={formData.enderecoEmpresa} onChange={handleChange} />

                <input name="quantidadeAndares" type="number" min="1"
                    placeholder="Quantidade de andares"
                    value={formData.quantidadeAndares} onChange={handleChange} required />

                <input name="quantidadeAmbientes" type="number" min="1"
                    placeholder="Quantidade de ambientes"
                    value={formData.quantidadeAmbientes} onChange={handleChange} required />

                <input name="quantidadeDispositivos" type="number" min="0"
                    placeholder="Quantidade de dispositivos"
                    value={formData.quantidadeDispositivos} onChange={handleChange} />

                <textarea name="servicosDesejados"
                    placeholder="Serviços desejados"
                    value={formData.servicosDesejados}
                    onChange={handleChange} required />

                <textarea name="descricao" placeholder="Descrição adicional"
                    value={formData.descricao} onChange={handleChange} />

                <button type="submit">Calcular orçamento</button>
            </form>
        </div>
    );
}