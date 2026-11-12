'use client';

import { useState } from "react";

export default function Orcamento() {
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({nome:"",empresa:"",email:"",telefone:"",tipo:"Comercial",ambientes:"",prioridade:"Monitoramento",mensagem:""});
  const set = e => setForm({...form,[e.target.name]:e.target.value});
  function submit(e) {
    e.preventDefault();
    setStatus("validado");
  }

  return (
    <main className="quote-page">
      <div className="container quote-grid">
        <div className="quote-intro">
          <div className="pill">VAMOS CONVERSAR</div>
          <h1>Conte-nos o que seu edifício <em>precisa.</em></h1>
          <p>Preencha o formulário e nossa equipe poderá entender o cenário e preparar uma proposta alinhada ao seu projeto.</p>
          <div className="quote-steps"><Step n="01" text="Entenda o seu cenário" /><Step n="02" text="Defina as prioridades" /><Step n="03" text="Receba uma proposta" /></div>
        </div>

        <form className="quote-form" onSubmit={submit}>
          <div className="form-top"><div><span className="section-kicker">PROJETO</span><h2>Solicitar orçamento</h2></div><span>01 / 01</span></div>
          <div className="form-grid">
            <Field label="Nome *" autoComplete="name" name="nome" value={form.nome} onChange={set} placeholder="Seu nome" required />
            <Field label="Empresa" name="empresa" value={form.empresa} onChange={set} placeholder="Nome da empresa" />
            <Field label="E-mail *" autoComplete="email" type="email" name="email" value={form.email} onChange={set} placeholder="voce@empresa.com" required />
            <Field label="Telefone" autoComplete="tel" name="telefone" value={form.telefone} onChange={set} placeholder="(11) 99999-9999" />
            <label>Tipo de edifício<select name="tipo" value={form.tipo} onChange={set}><option>Comercial</option><option>Corporativo</option><option>Residencial</option><option>Outro</option></select></label>
            <Field label="Quantidade de ambientes" type="number" min="1" name="ambientes" value={form.ambientes} onChange={set} placeholder="Ex.: 40" />
            <label>Principal necessidade<select name="prioridade" value={form.prioridade} onChange={set}><option>Monitoramento</option><option>Gestão de energia</option><option>Automação</option><option>Controle de acessos</option><option>Alertas e ocorrências</option><option>Integração de sistemas</option><option>Outra necessidade</option></select></label>
          </div>
          <label>Fale sobre seu projeto<textarea name="mensagem" value={form.mensagem} onChange={set} rows="5" placeholder="Conte sobre o edifício, objetivos, quantidade de dispositivos ou necessidades de monitoramento." /></label>
          <button className="button primary full" type="submit">Enviar solicitação <span>→</span></button>
          {status === "validado" && <div className="success" role="status">✓ Formulário preenchido e validado neste navegador. O envio ainda precisa ser conectado ao serviço de atendimento da Lumora.</div>}
        </form>
      </div>
    </main>
  );
}

function Field({label,...props}) { return <label>{label}<input {...props}/></label>; }
function Step({n,text}) { return <div><b>{n}</b><span>{text}</span><i>↗</i></div>; }