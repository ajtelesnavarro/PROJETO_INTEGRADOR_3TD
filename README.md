<<<<<<< HEAD
# Lumora — Edifícios Inteligentes

Projeto organizado no padrão `backend/`, `frontend/` e `docs/`, seguindo a
referência estrutural fornecida.

O design e o conteúdo visual do ZIP de origem foram preservados. As mudanças
foram de organização de diretórios e atualização dos caminhos de importação
necessários após a movimentação dos componentes.

Consulte `docs/ESTRUTURA.md` para a árvore do projeto e instruções de execução.
=======
<<<<<<< HEAD
# Projeto Base Full Stack

Template para alunos criarem forks com a mesma stack de frontend, backend e banco de dados.

## Stack Padrao

- Frontend: Next.js `16.2.10` com JavaScript, sem Tailwind e sem Bootstrap por padrao.
- Backend: Node.js com Express em JavaScript.
- Banco de dados: MySQL.
- Deploy: Dockerfiles separados para frontend, backend e banco, facilitando criacao de servicos.

## Estrutura

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── database/
│   ├── init/
│   │   └── 01-schema.sql
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Como Rodar Localmente

1. Instale as dependencias:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Copie os arquivos de ambiente:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Suba o MySQL com Docker (se for rodar com XAMPP ou MySQL Community Server, ignorar passo):

```bash
docker compose up -d database
```

4. Rode o backend:

```bash
cd backend
npm run dev
```

5. Rode o frontend:

```bash
cd frontend
npm run dev
```

URLs padrao:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Health check da API: `http://localhost:8080/api/health`
- MySQL: `localhost:3306`

## Rodando Tudo com Docker Compose

```bash
docker compose up --build
```

Esse comando sobe:

- `frontend` na porta `3000` por padrao
- `backend` na porta `8080` por padrao
- `database` na porta `3306` por padrao

## Variaveis de Ambiente

Docker Compose raiz (`.env`):

```env
FRONTEND_HOST_PORT=3000
BACKEND_HOST_PORT=8080
DATABASE_HOST_PORT=3306

FRONTEND_PORT=3000
BACKEND_PORT=8080

FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api

MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=app_db
MYSQL_USER=app_user
MYSQL_PASSWORD=app_password

DB_HOST=database
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=app_db
```

Para rodar varios grupos no mesmo servidor, mude pelo menos as portas publicadas no host e a URL publica da API. Exemplo para um segundo grupo:

```env
FRONTEND_HOST_PORT=3001
BACKEND_HOST_PORT=8081
DATABASE_HOST_PORT=3307
FRONTEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8081/api
```

As portas internas podem continuar nos defaults (`FRONTEND_PORT=3000` e `BACKEND_PORT=8080`) na maioria dos casos. Altere as portas internas apenas se o Coolify ou a arquitetura escolhida exigirem.

Backend (`backend/.env`):

```env
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=app_db
```

Frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

No Docker Compose, o backend usa `DB_HOST=database`, porque esse e o nome do servico MySQL na rede Docker.

## Backend

Scripts principais:

```bash
npm run dev
npm start
```

Rotas iniciais:

- `GET /` retorna uma mensagem basica da API.
- `GET /api/health` retorna status da API e testa a conexao com MySQL.

Pastas padrao:

- `src/config`: configuracoes e conexoes externas.
- `src/controllers`: funcoes que tratam requisicoes.
- `src/routes`: definicao das rotas HTTP.
- `src/middlewares`: middlewares compartilhados.

## Frontend

Scripts principais:

```bash
npm run dev
npm run build
npm start
npm run lint
```

O projeto esta sem Tailwind e sem Bootstrap por padrao. Cada aluno pode instalar e configurar a biblioteca CSS escolhida conforme a necessidade do projeto.

## Banco de Dados

O arquivo `database/init/01-schema.sql` cria a base inicial quando o container MySQL sobe pela primeira vez.

Para reiniciar o banco local do zero:

```bash
docker compose down -v
docker compose up -d database
```

## Deploy no Coolify

Crie servicos separados apontando para os Dockerfiles:

- Frontend: `frontend/Dockerfile`
- Backend: `backend/Dockerfile`
- Banco: preferencialmente use o servico gerenciado de MySQL do Coolify. Se quiser usar a imagem do repo, use `database/Dockerfile`.

Configure no Coolify as variaveis de ambiente equivalentes aos arquivos `.env.example`. No backend, `DB_HOST` deve apontar para o host/nome interno do servico MySQL no Coolify.

Para cada grupo, configure valores diferentes para:

- `FRONTEND_HOST_PORT`
- `BACKEND_HOST_PORT`
- `DATABASE_HOST_PORT`, se estiver publicando MySQL no host
- `FRONTEND_URL`
- `NEXT_PUBLIC_API_URL`

Em deploy com dominio/reverse proxy, `NEXT_PUBLIC_API_URL` deve apontar para a URL publica real do backend, por exemplo `https://api-grupo-01.seudominio.com/api`.

## Observacoes Para Alunos

- Nao versionar arquivos `.env`.
- Nao versionar `node_modules`, `.next` ou arquivos de build.
- Manter o backend em JavaScript.
- Instalar Tailwind ou Bootstrap apenas se o projeto precisar.
=======
# API Lumora SmartBuilding

API REST em Node.js, Express e MySQL para gerenciamento de prédios, ambientes, dispositivos, leituras, acessos, ocorrências e relatórios.

## Requisitos

- Node.js 20 ou superior
- MySQL 8 ou MariaDB compatível
- npm

## Instalação

1. Crie o banco `lumora_smartbuilding` no MySQL/phpMyAdmin.
2. Importe `migrations/20261030_0001_criar_estrutura_lumora.sql`.
3. Copie `.env.example` para `.env` e ajuste os dados do banco e uma chave JWT aleatória com pelo menos 32 caracteres.
4. Execute `npm install`.
5. Configure temporariamente `ADMIN_NOME`, `ADMIN_EMAIL` e `ADMIN_SENHA` no `.env` e execute `npm run criar-admin` para criar o primeiro administrador. Depois remova `ADMIN_SENHA` do `.env`.
6. Inicie com `npm run dev` ou `npm start`.

Base: `http://localhost:3001/api/v1`
Formato: JSON. Para rotas protegidas, envie `Authorization: Bearer SEU_TOKEN`.

## Autenticação

`POST /auth/gerarToken`

```json
{ "email": "admin@lumora.local", "senha": "SuaSenhaSegura123!" }
```

## Endpoints

| Método | Endpoint | Permissão de escrita |
|---|---|---|
| POST | `/auth/gerarToken` | Público |
| GET, POST, GET por ID, PATCH, DELETE | `/predios` | Administrador |
| GET, POST, GET por ID | `/ambientes` | Administrador para cadastro; perfis autenticados para consulta |
| GET, POST, GET por ID | `/dispositivos` | Administrador para cadastro; perfis autenticados para consulta |
| GET, POST, GET por ID | `/leituras` | Administrador/Manutenção para registro |
| GET, POST, GET por ID | `/acessos` | Administrador/Porteiro para registro |
| GET, POST, GET por ID, PATCH | `/ocorrencias` | Administrador/Manutenção/Porteiro para registro; equipe para atualização |
| GET | `/relatorios` | Administrador/Manutenção |

O endpoint PATCH de ocorrências permite atualizar estado e responsável. Os estados aceitos são `Aberta`, `Em Atendimento` e `Resolvida`.

## Filtros e paginação

As listagens aceitam `pagina`, `limite`, `ambienteId`, `predioId`, `tipo`, `estado`, `status`, `dataInicio` e `dataFim`, conforme os campos aplicáveis ao recurso. Limite máximo: 200 registros.

Exemplos:

- `GET /leituras?ambienteId=1&tipo=temperatura&dataInicio=2026-10-01&dataFim=2026-10-30`
- `GET /ocorrencias?estado=Aberta&ambienteId=1`
- `GET /relatorios?ambienteId=1&dataInicio=2026-10-01&dataFim=2026-10-30`

## Perfis

- `Administrador`: gerenciamento geral.
- `Manutenção`: consulta operacional, leituras, ocorrências e relatórios.
- `Porteiro`: consulta, registro de acessos e ocorrências.
- `Visitante`: consulta de informações autorizadas.

## Códigos HTTP

A API utiliza `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409` e `500`. Respostas de erro seguem `{ "sucesso": false, "erro": "..." }`.

## Observações

- As senhas são armazenadas com bcrypt.
- Tokens JWT têm validade configurável por `JWT_EXPIRES_IN` (padrão de 2 horas).
- Consultas SQL usam parâmetros e nomes de tabelas/colunas são definidos por lista permitida no código.
- Leituras, acessos e ocorrências possuem data/hora de registro.
- O histórico não possui rotas de exclusão para leituras e acessos.
>>>>>>> origin/andre
>>>>>>> b4c3445aa3cab8a9026e887a4387af9de6392fc5
