# Jobs Service

Responsável pela publicação e gestão de vagas de emprego pelas empresas.

## Responsabilidades

- CRUD de vagas (`jobs`): título, localização, modelo de trabalho, nível de experiência, tipo de contratação, salário, descrição e status (ativa, pausada, encerrada).
- Gerenciamento das listas associadas a uma vaga: responsabilidades (`job_responsibilities`), requisitos (`job_requirements`), skills exigidas (`job_skills`) e benefícios (`job_benefits`).
- Contagem de visualizações (`views`) e listagem/busca de vagas para o candidato.

## Tabelas do banco relacionadas

- `jobs`
- `job_responsibilities`
- `job_requirements`
- `job_skills`
- `job_benefits`

## Fora de escopo

- Autenticação, cadastro e perfis de usuário (ver `auth-service`).
- Candidaturas e status de processo seletivo (ver `applications-service`).
