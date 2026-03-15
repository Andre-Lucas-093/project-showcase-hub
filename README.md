# Extensao Unifeso

Aplicacao web para divulgacao e administracao de projetos academicos da comunidade da Unifeso. O projeto possui um frontend em React para navegacao publica e um backend em Express preparado para expor uma API REST.

## Visao geral

O sistema permite:

- listar projetos academicos em destaque;
- filtrar projetos por titulo, status e area;
- visualizar detalhes do projeto, dono e documentos associados;
- autenticar usuarios para acesso ao painel administrativo;
- cadastrar, editar e remover projetos pelo painel admin.

## Estado atual da aplicacao

Hoje existem duas camadas separadas no repositorio:

- o frontend em [src/services/api.ts](src/services/api.ts) usa mocks locais para login, cadastro e CRUD de projetos;
- o backend em [server/src/app.ts](server/src/app.ts) expoe rotas REST, mas os dados tambem estao em memoria nos arquivos de [server/src/models](server/src/models).

Tambem ja existe preparacao para MySQL com schema e migracao em [server/src/database/schema.sql](server/src/database/schema.sql), mas essa persistencia ainda nao esta conectada aos modelos usados pela API.

## Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Vitest

### Backend

- Node.js
- Express
- TypeScript
- MySQL2
- dotenv
- tsx

## Estrutura do projeto

```text
.
|-- src/                  # frontend React
|   |-- components/       # componentes e UI base
|   |-- contexts/         # contexto de autenticacao
|   |-- mocks/            # dados mockados do frontend
|   |-- pages/            # telas principais
|   `-- services/         # camada de acesso a dados do frontend
|-- server/               # backend Express
|   |-- src/
|   |   |-- controllers/  # handlers HTTP
|   |   |-- database/     # conexao, migrate e schema SQL
|   |   |-- models/       # armazenamento em memoria
|   |   `-- routes/       # rotas da API
|-- public/
`-- README.md
```

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- MySQL 8+ opcional, apenas se quiser testar a estrutura de banco e as migracoes

## Como executar

### 1. Frontend

Na raiz do projeto:

```bash
npm install
npm run dev
```

O frontend sobe em http://localhost:8080.

### 2. Backend

Em outra aba do terminal:

```bash
cd server
npm install
npm run dev
```

A API sobe em http://localhost:3001.

### 3. Variaveis de ambiente do backend

O backend le variaveis via `dotenv`, entao voce pode criar um arquivo `server/.env` com valores como estes:

```env
PORT=3001
CORS_ORIGIN=http://localhost:8080
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=project_case
```

Se o MySQL nao estiver disponivel, o servidor continua rodando e informa que esta em modo sem conexao com banco.

## Banco de dados

O schema SQL esta em [server/src/database/schema.sql](server/src/database/schema.sql) e pode ser aplicado com:

```bash
cd server
npm run db:migrate
```

Importante: as migracoes criam o banco e os dados iniciais, mas a API atual ainda nao grava nem le do MySQL. Os endpoints continuam usando os arrays em memoria de [server/src/models/projects.ts](server/src/models/projects.ts) e [server/src/models/users.ts](server/src/models/users.ts).

## Conta de teste

Para acessar o fluxo de login do frontend:

- e-mail: `admin@projeto.com`
- senha: qualquer valor

Esse usuario recebe papel `admin` e libera acesso ao painel em `/admin`.

## Scripts disponiveis

### Raiz

- `npm run dev`: inicia o frontend em modo desenvolvimento
- `npm run build`: gera build de producao do frontend
- `npm run build:dev`: gera build no modo development
- `npm run lint`: executa o ESLint
- `npm run preview`: abre preview da build
- `npm run test`: executa os testes com Vitest
- `npm run test:watch`: executa testes em modo watch

### server/

- `npm run dev`: inicia a API com recarga automatica
- `npm run build`: compila o backend com TypeScript
- `npm run start`: executa a build do backend
- `npm run db:migrate`: aplica o schema SQL

## Rotas da API

Base URL: `http://localhost:3001/api`

### Saude

- `GET /health`

### Autenticacao

- `POST /auth/login`
- `POST /auth/register`

### Projetos

- `GET /projects`
- `GET /projects/:id`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

### Usuarios

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### Membros

- `GET /members/:projectId`
- `POST /members`
- `DELETE /members/:projectId/:userId`

### Documentos

- `GET /documents/:projectId`
- `POST /documents`
- `DELETE /documents/:id`

## Fluxos principais do frontend

- Home: lista projetos e oferece filtros por busca, status e area.
- Projeto: mostra detalhes, dono do projeto e documentos relacionados.
- Login: autentica com base no e-mail cadastrado nos mocks.
- Cadastro: cria usuarios do tipo mentor/professor pelo modal de registro.
- Admin: permite criar, editar e excluir projetos quando o usuario logado possui papel `admin`.

## Proximos passos tecnicos

Os pontos mais naturais de evolucao sao:

1. conectar [src/services/api.ts](src/services/api.ts) aos endpoints reais do backend;
2. substituir os modelos em memoria do backend por repositorios conectados ao MySQL;
3. adicionar autenticacao real com senha, sessao ou token;
4. implementar upload e download reais para documentos.
