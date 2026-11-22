# Lumora — Smart Buildings

Frontend institucional em Next.js para a Lumora, com identidade visual em azul-marinho, verde-água e tons claros.

## Páginas
- `/` — homepage com vídeo de edifício inteligente, apresentação e visão geral da plataforma.
- `/sobre` — história, propósito, missão, visão, valores e públicos atendidos.
- `/solucoes` — catálogo de capacidades, jornada de implantação e FAQ.
- `/orcamento` — formulário de levantamento inicial do projeto.
- `/login` — tela de acesso conectada ao endpoint de autenticação existente.

Também foram incluídas telas de carregamento e página 404, navegação mobile e rodapé institucional.

## Requisitos
- Node.js 20 ou superior recomendado.
- npm.

## Executar localmente
```bash
npm install
cp .env.example .env.local
npm run dev
```
Abra `http://localhost:3000`.

No Windows PowerShell, copie `.env.example` para `.env.local` manualmente ou use:
```powershell
Copy-Item .env.example .env.local
```

## Integração com o back-end
A tela de login utiliza `POST ${NEXT_PUBLIC_API_URL}/api/v1/auth/gerarToken` e espera receber um objeto JSON com a propriedade `token`.

O formulário de orçamento possui validação no navegador, mas **ainda não envia os dados para um servidor**. Para receber solicitações reais, é necessário definir e conectar o endpoint de orçamento do back-end. Não há envio simulado.

## Vídeo da homepage
O vídeo de fundo é carregado de um endereço externo. É necessário acesso à internet para reproduzi-lo; o navegador também pode limitar autoplay em determinadas condições. O vídeo é silenciado e usa `playsInline` para melhor compatibilidade em dispositivos móveis.

## Observações
- Tipografia carregada do Google Fonts.
- Imagens e vídeo são carregados de serviços externos.
- Configure `NEXT_PUBLIC_API_URL` no ambiente de desenvolvimento/produção para apontar para a API correta.
