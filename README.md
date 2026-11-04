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
