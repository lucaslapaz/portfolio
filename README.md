🔧 ⚙️ README E O PROJETO AINDA ESTÃO EM DESENVOLVIMENTO ⚙️ 🔧

**Conteúdo:**
* Arquitetura do Projeto
* Como rodar o projeto localmente
* Rotas
* Dependência do projeto
* Build do projeto e rodar
* Criar páginas
* Criar posts
* Editar um post


# Arquitetura do Projeto

Monólito construído com **Node.js**, **Express** e **TypeScript**, seguindo arquitetura em camadas com injeção de dependência.

## Stack Principal
- **Backend**: Node.js + Express + TypeScript
- **Banco**: MySQL com Knex.js (migrations, query builder)
- **Autenticação**: JWT + bcrypt
- **Template**: EJS para renderização server-side (SEO)
- **Testes**: Jest + ts-jest
- **CI/CD**: GitHub Actions

## Estrutura
```
Controllers → Services → Repositories → Database (MySQL)
     ↓
Middlewares + Views (EJS)
```

**Benefícios**: Código testável, desacoplado e maintível através da separação de responsabilidades e injeção de dependência.


# Como rodar o projeto localmente:

## 1. Programas necessários:
* **MySQL**: usado a versão 8.0.41
* **NodeJS**: usado a versão 20.16.0

---

## 2. Clonar o repositório
Baixe e extraia os arquivos do projeto.

---

## 3. Criar arquivo de configuração
Altere o nome do arquivo `.env.example` para `.env` na pasta raíz e defina as variáveis de ambiente:

```bash
# LEMBRAR DE REINICIAR O SERVIDOR SEMPRE QUE ALGUMA VARIAVEL FOR MUDADA
SERVER_PORT=8088                # Porta em que o servidor rodará
MYSQL_HOST="localhost"          # Endereço do banco de dados
MYSQL_PORT=3306                 # Porta em que o serviço do MySQL está rodando no seu pc
MYSQL_USER="root"               # Seu usuário do MySQL
MYSQL_PASSWORD=1234             # Senha do seu usuário do MySQL
DATABASE="DEVELOPMENT_DB"       # Nome do banco de dados. Se você não alterou no schema, mantenha esse

JWT_SECRET="6936410fbee99f0511d...." # Chave secreta que vai ser usada para assinar e verificar os tokens JWT
JWT_EXPIRES_IN="3600"                # Tempo de vida dos tokens JWT gerados. Usados como segundos.
COOKIE_EXPIRES_IN="3600"             # Tempo de vida do cookie salvo no cliente.
```

---

## 2. Criar banco de dados
Abra o terminal na pasta raiz do projeto e execute:

`mysql -u root -p < ./schemas/create_development_db.sql`

> Sendo `root` o seu usuário do MySQL. Na sequência vai pedir a senha do usuário MySQL.

Isso fará com que um banco de dados `DEVELOPMENT_DB` seja criado.

---

## 3. Instalar dependências
Na pasta raiz do projeto rode o comando:

`npm install`

----

## 4. Corrigir divergências no banco de dados (Migrations)
Na pasta raiz do projeto rode o comando:

`npx knex migrate:latest`


## 5. Popular as tabelas
Caso queira popular o banco de dados, execute o seguinte comando:

`npx knex seed:make <nome_da_seed>`

Esse comando vai criar um arquivo .js dentro da pasta `seeds` com o nome que você definiu. O Knex segue a ordem alfabética do nome dos arquivos para executar os seeds, então use números no começo do nome para definir a ordem em que os arquivos serão executados. Consulte a documentação do Knex para mais informações.

Exemplo de seed:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex) {

    await knex('users').insert([
        {id: 2, username:'admin', name:'Admin', email:'contact@example.com', creation_date:'2025-07-05 12:03:31', password:'$2b$12$6mxsKPpN71LxTBk2cMr3TuY38mYkpOFIqMYYaNew23YDHhWBXzt4e', permission: 10}
    ])
};
```

e então execute o script:

`npx knex seed:run`



## 6. Executar o servidor:
Na pasta raiz rode o comando:

`npm run dev`


# Rotas

| Método |                                 Rota |                      Middleware |                    Controlador / Ação |                                          Descrição breve |
| :----: | -----------------------------------: | ------------------------------: | ------------------------------------: | -------------------------------------------------------: |
|   GET  |                                  `/` |                               – |          `homeController.getHomePage` |                                           Página inicial |
|   GET  |                              `/home` |                               – |          `homeController.getHomePage` |                        Página inicial (rota alternativa) |
|   GET  |                             `/login` |                               – |         `authController.getLoginPage` |                                  Exibe a página de login |
|  POST  |                             `/login` |                               – |            `authController.postLogin` |                              Processa o login do usuário |
|   GET  |                            `/logout` |                               – |        `authController.getLogoutPage` |                Realiza o logout do usuário e redireciona |
|   GET  |                              `/blog` |                               – |          `blogController.getBlogPage` |                Exibe a página com lista de posts do blog |
|  POST  |                              `/post` | `checkPermissionMiddleware(10)` |           `postController.createPost` |        Cria um novo post (precisa de permissão nível 10) |
|   GET  |                          `/post/new` | `checkPermissionMiddleware(10)` |    `postController.getCreatePostPage` |           Exibe a página para criar novo post (restrito) |
|   GET  |                      `/post/:postId` |                               – |      `postController.getPostByIdPage` |                         Exibe um post específico pelo ID |
|   GET  |                 `/post/:postId/edit` | `checkPermissionMiddleware(10)` |  `postController.getEditPostByIdPage` | Exibe a página para editar um post específico (restrito) |
|  PATCH |                      `/post/:postId` |                               – |        `postController.patchPostById` |                 Atualiza parcialmente um post específico |
|   GET  |                      `/unauthorized` |                               – | `errorController.getUnauthorizedPage` |                          Página de acesso não autorizado |
|    –   | `*` (todas as rotas não encontradas) |                               – |     `errorController.getNotFoundPage` |                    Página 404 para rotas não encontradas |

---

# Dependência do projeto

### Dependências de produção (runtime)

* `bcrypt` — Biblioteca para hashing seguro de senhas.
* `cookie-parser` — Middleware para manipulação de cookies no Express.
* `dotenv` — Carrega variáveis de ambiente de um arquivo `.env`.
* `ejs` — Template engine para gerar HTML dinâmico.
* `express` — Framework web para Node.js.
* `express-rate-limit` — Middleware para limitar número de requisições e evitar abusos.
* `jsonwebtoken` — Biblioteca para criação e verificação de tokens JWT.
* `knex` — Query builder SQL e gerenciador de migrations/seeds.
* `mysql2` — Cliente MySQL moderno para Node.js com suporte a Promises.

---

### Dependências de desenvolvimento (build, testes e tipos)

* `@types/bcrypt` — Tipagens TypeScript para bcrypt.
* `@types/cookie-parser` — Tipagens TypeScript para cookie-parser.
* `@types/ejs` — Tipagens TypeScript para EJS.
* `@types/express` — Tipagens TypeScript para Express.
* `@types/jest` — Tipagens TypeScript para Jest (framework de testes).
* `@types/jsonwebtoken` — Tipagens TypeScript para jsonwebtoken.
* `esbuild` — Bundler rápido para JavaScript/TypeScript.
* `jest` — Framework de testes.
* `nodemon` — Reinicia automaticamente o servidor durante o desenvolvimento.
* `ts-jest` — Integra Jest com TypeScript.
* `ts-node` — Permite rodar TypeScript diretamente no Node.js.
* `typescript` — Linguagem TypeScript.

---


# Build do projeto e rodar
Na pasta raiz do projeto rode o comando para fazer a build do projeto em `./server-build`:

**Linux:**
`npm run build:linux`

**Windows:**
`npm run build:win`

Depois, para rodar o servidor a partir do arquivo de build:
`npm run prod`

# Criar páginas
O servidor usa EJS (Embedded JavaScript templating), isso significa que o arquivo html é gerado pelo servidor antes de enviar, o que ajuda no SEO, ao invés de montar ele no cliente.

Crie uma pasta em `./server-dev/views` com o nome da página e dentro coloque um arquivo `index.ejs`. Depois crie um controller para sua página se já não houver um em `./server-dev/controllers` e crie uma função para manipular a requisição dentro do controller. Configure a rota, o controller e a função do controller nos arquivos `./server-dev/app.ts` e `./server-dev/routes/index.ts`.

# Criar posts
Acesse `http://localhost:8088/post/new` depois de estar logado (o usuário precisa ter permissão 10 no registro da tabela users) para criar um post novo.

# Editar um post
Acesse `http://localhost:8088/post/<id>/edit` depois de estar logado (o usuário precisa ter permissão 10 no registro da tabela users), sendo que id pode ser o id do banco de dados ou o slug (formatted_title).