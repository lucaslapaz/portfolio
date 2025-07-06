**Conteúdo:**
* COMO RODAR O PROJETO LOCALMENTE
* ROTAS
* DEPENDÊNCIAS DO PROJETO
* BUILD DO PROJETO E RODAR
* CRIAR PÁGINAS
* CRIAR POSTS
* EDITAR UM POST

# COMO RODAR O PROJETO LOCALMENTE:

## 1. Programas necessários:
* **MySQL**: usado a versão 8.0.41
* **NodeJS**: usado a versão 20.16.0

---

## 2. Criar banco de dados
Abra o terminal na pasta raiz do projeto e execute:

`mysql -u root -p < ./schemas/create_database.sql`

> Sendo `root` o seu usuário do MySQL

Isso fará com que um banco de dados `blog_db` seja criado com as tabelas `users` e `posts`.

---

## 3. Criar o usuário admin
Abra o terminal na pasta raiz do projeto e execute:
`mysql -u root -p < ./schemas/create_admin_user.sql`

> Sendo `root` o seu usuário do MySQL. O usuário criado terá o username `admin` e senha `123admin123`.

---

## 4. Criar arquivo de configuração
Crie um arquivo `.env` na pasta raíz com as seguintes variáveis de ambiente:

```bash
SERVER_PORT=8088   # Porta em que o servidor rodará
HOST="localhost"   # Endereço do banco de dados
PORT=3306          # Porta em que o serviço do MySQL está rodando no seu pc
USER="root"        # Seu usuário do MySQL
PASSWORD=1234      # Senha do seu usuário do MySQL
DATABASE="blog_db" # Nome do banco de dados. Se você não alterou no schema, mantenha esse

JWT_SECRET="6936410fbee99f0511d...." # Chave secreta que vai ser usada para assinar e verificar os tokens JWT
JWT_EXPIRES_IN="3600"                # Tempo de vida dos tokens JWT gerados. Usados como segundos.
COOKIE_EXPIRES_IN="3600"             # Tempo de vida do cookie salvo no cliente.
```

---

## 5. Instalar dependências
Na pasta raiz do projeto rode o comando:

`npm install`

## 6. Rodar o servidor
Na pasta raiz do projeto rode o comando:

`npm run dev`

# ROTAS

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

# DEPENDÊNCIAS DO PROJETO

### Dependências de produção (runtime)

* `bcrypt` — Biblioteca para hashing seguro de senhas.
* `cookie-parser` — Middleware para manipulação de cookies no Express.
* `dotenv` — Carrega variáveis de ambiente de um arquivo `.env`.
* `ejs` — Template engine para gerar HTML dinâmico.
* `express` — Framework web para Node.js.
* `express-rate-limit` — Middleware para limitar número de requisições e evitar abusos.
* `jsonwebtoken` — Biblioteca para criação e verificação de tokens JWT.
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


# BUILD DO PROJETO E RODAR
Na pasta raiz do projeto rode o comando para fazer a build do projeto em `./server-build`:
`npm run build`

Depois, para rodar o servidor a partir do arquivo de build:
`npm run prod`

# CRIAR PÁGINAS
O servidor usa EJS (Embedded JavaScript templating), isso significa que o arquivo html é gerado pelo servidor antes de enviar ao invés de montar ele no cliente, o que ajuda no SEO.

Crie uma pasta em `./server-dev/views` com o nome da página e dentro coloque um arquivo `index.ejs`. Depois crie um controller para sua página se já não houver um em `./server-dev/controllers` e crie uma função para manipular a requisição dentro do controller. Configure a rota, o controller e a função do controller nos arquivos `./server-dev/app.ts` e `./server-dev/routes/index.ts`.

# CRIAR POSTS
Acesse `http://localhost:8088/post/new` depois de estar logado (o usuário precisa ter permissão 10) para criar um post novo.

# EDITAR UM POST
Acesse `http://localhost:8088/post/<id>`, sendo que id pode ser o id do banco de dados ou o slug (formatted_title).