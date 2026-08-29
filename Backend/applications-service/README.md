# Applications Service

Responsável pelas candidaturas dos candidatos às vagas e pelo acompanhamento do processo seletivo.

## Responsabilidades

- Criação de candidaturas (`applications`), vinculando candidato e vaga.
- Atualização do status da candidatura ao longo do processo seletivo (`applied`, `screening`, `interview`, `approved`, `rejected`).
- Cálculo/armazenamento do `match_score` entre candidato e vaga.
- Listagem de candidaturas por candidato e por vaga (para empresas acompanharem os candidatos).

## Tabelas do banco relacionadas

- `applications`

## Fora de escopo

- Autenticação, cadastro e perfis de usuário (ver `auth-service`).
- Criação e edição de vagas (ver `jobs-service`).
