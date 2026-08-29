# Auth Service

Responsável pela autenticação e pelo cadastro de usuários da Nexo, além dos perfis de candidato e de empresa.

## Responsabilidades

- Cadastro e login de usuários (`users`), com papel (`role`) de candidato ou empresa.
- Emissão e validação de tokens de sessão/autenticação.
- Gerenciamento do perfil de candidato (`candidate_profiles`, `candidate_skills`): dados pessoais, headline, área, experiência, modelo de trabalho preferido, currículo e bio.
- Gerenciamento do perfil de empresa (`company_profiles`): razão social, documento, setor, porte, cidade, site e descrição.

## Tabelas do banco relacionadas

- `users`
- `candidate_profiles`
- `candidate_skills`
- `company_profiles`

## Fora de escopo

- Publicação e gestão de vagas (ver `jobs-service`).
- Candidaturas e acompanhamento de status (ver `applications-service`).

## Stack

- Java 17 + Spring Boot 3 (Web, Data JPA, Security, Validation).
- Arquitetura em camadas no padrão MVC:
  - `controller`: recebe as requisições HTTP e devolve as respostas.
  - `service`: regras de negócio (cadastro, login, atualização de perfil).
  - `model`: entidades JPA mapeadas para as tabelas do Postgres.
  - `repository`: acesso a dados (Spring Data JPA).
  - `dto`: objetos de entrada/saída dos endpoints, para não expor as entidades diretamente.
  - `security`: geração/validação de JWT e configuração do Spring Security.
  - `exception`: exceções de negócio e tratamento centralizado de erros.
- Autenticação via JWT (Bearer token), senha armazenada com hash BCrypt.
- `spring.jpa.hibernate.ddl-auto=none`: o schema é sempre o de `Backend/dbfiles/01_init.sql`, o serviço não altera a estrutura do banco.
- Logging: `com.nexo.auth` e `org.springframework.security` estão temporariamente em `DEBUG` (`application.yml`) para facilitar o diagnóstico da integração com o gateway/frontend. Controllers, services, o filtro JWT e o `SecurityConfig` (401/403) logam cada etapa do fluxo de auth/perfil — acompanhe com `docker compose logs -f auth-service`.

## Endpoints

Todos expostos sem prefixo (o prefixo `/api/auth` é adicionado pelo API Gateway KrakenD, ver `Backend/krakend`).

| Método | Rota                | Auth?         | Descrição                                  |
|--------|----------------------|---------------|---------------------------------------------|
| POST   | `/register`           | não           | Cria usuário (candidato ou empresa) + perfil vazio |
| POST   | `/login`               | não           | Autentica e retorna um JWT                  |
| GET    | `/me`                  | sim           | Dados do usuário autenticado                |
| PUT    | `/me`                  | sim           | Atualiza o nome do usuário autenticado      |
| GET    | `/profile/candidate`   | sim (candidate) | Perfil do candidato autenticado           |
| PUT    | `/profile/candidate`   | sim (candidate) | Atualiza perfil do candidato               |
| GET    | `/profile/company`     | sim (company)   | Perfil da empresa autenticada              |
| PUT    | `/profile/company`     | sim (company)   | Atualiza perfil da empresa                 |

## Exemplos de requisições

Exemplos via `curl`, passando pelo API Gateway (`http://localhost:8000/api/auth/...`). Se for chamar o serviço diretamente (dentro da rede Docker ou expondo a porta 3001), troque a base pela URL do serviço e remova o prefixo `/api/auth`.

### Cadastro de candidato

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "senha12345",
    "role": "candidate"
  }'
```

### Cadastro de empresa

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa X",
    "email": "contato@empresax.com",
    "password": "senha12345",
    "role": "company"
  }'
```

Resposta (`201 Created`) para ambos os cadastros:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "b6f0c8b0-6e21-4e34-9a3a-1a2b3c4d5e6f",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "role": "candidate",
    "createdAt": "2026-08-29T12:00:00Z"
  }
}
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "senha12345"
  }'
```

Resposta (`200 OK`): mesmo formato do cadastro, com um novo `token`.

### Usuário autenticado

```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Atualizar nome do usuário autenticado

```bash
curl -X PUT http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Maria Silva Santos" }'
```

### Consultar perfil de candidato

```bash
curl http://localhost:8000/api/auth/profile/candidate \
  -H "Authorization: Bearer <token>"
```

### Atualizar perfil de candidato

```bash
curl -X PUT http://localhost:8000/api/auth/profile/candidate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "11999998888",
    "city": "São Paulo",
    "headline": "Desenvolvedora Backend",
    "area": "Tecnologia",
    "experience": "Pleno",
    "preferredWorkplace": "Remoto",
    "resumeName": "curriculo-maria.pdf",
    "bio": "Desenvolvedora com foco em back-end.",
    "skills": ["Java", "Spring Boot", "PostgreSQL"]
  }'
```

### Consultar perfil de empresa

```bash
curl http://localhost:8000/api/auth/profile/company \
  -H "Authorization: Bearer <token>"
```

### Atualizar perfil de empresa

```bash
curl -X PUT http://localhost:8000/api/auth/profile/company \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "legalName": "Empresa X Ltda",
    "document": "12.345.678/0001-90",
    "sector": "Tecnologia",
    "size": "50-200",
    "city": "São Paulo",
    "website": "https://empresax.com",
    "about": "Empresa de tecnologia focada em soluções B2B."
  }'
```

## Rodando localmente

Via Docker Compose (recomendado), a partir da raiz do projeto:

```bash
docker compose up -d --build auth-service
```

O serviço sobe na porta `3001` dentro da rede do Compose (não é publicada no host; o acesso externo é feito via `krakend` na porta `8000`).

Para rodar fora do Docker, é necessário um Postgres acessível e as variáveis de ambiente `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` e `JWT_SECRET` (veja os defaults em `src/main/resources/application.yml`).
