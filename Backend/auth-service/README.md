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
