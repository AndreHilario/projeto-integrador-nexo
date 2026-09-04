# Projeto Integrador Nexo

## Integrantes do grupo

- ANDRE IKEJIRI HILARIO
- ANNA CLARA MEIRELLES IANZER
- DANIEL BERG DOS SANTOS NASCIMENTO
- GIOVANNI MADALOZZO OLIVEIRA
- HUGO RIBEIRO RAMADAN
- MARIA HELENA GRACA LOPES
- PALOMA FREDIANI VIEITZ GIL

## Vídeo do projeto funcionando

https://youtu.be/fGdOkCf0PlI

## Executando com Docker Compose

Este projeto usa Docker Compose para subir os seguintes serviços:

- **db**: banco de dados PostgreSQL 16, exposto na porta `5432`, com os scripts de inicialização em `Backend/dbfiles` e dados persistidos no volume `db_data`.
- **frontend**: aplicação frontend, construída a partir de `frontend/Dockerfile` e exposta na porta `8080`.
- **auth-service**: microsserviço de autenticação, construído a partir de `Backend/auth-service/Dockerfile`.
- **jobs-service**: microsserviço de vagas, construído a partir de `Backend/jobs-service/Dockerfile`.
- **applications-service**: microsserviço de candidaturas, construído a partir de `Backend/applications-service/Dockerfile`.
- **krakend**: API Gateway que centraliza o acesso aos microsserviços de backend, exposto na porta `8000`. Configuração em `Backend/krakend/krakend.json` (veja `Backend/krakend/README.md`).

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (já incluído no Docker Desktop)

### Subir os containers

Na raiz do projeto, execute:

```bash
docker compose up -d
```

O comando irá:

1. Construir a imagem do frontend (`frontend/Dockerfile`).
2. Construir as imagens dos três serviços de backend: `auth-service`, `jobs-service` e `applications-service`.
3. Baixar as imagens do PostgreSQL 16 e do KrakenD.
4. Subir todos os serviços em segundo plano.

### Acessando os serviços

- Frontend: [http://localhost:8080](http://localhost:8080)
- API Gateway (KrakenD): [http://localhost:8000](http://localhost:8000)
- Banco de dados: `localhost:5432`
  - Usuário: `nexo`
  - Senha: `nexo`
  - Database: `nexo`

### Ver logs

```bash
docker compose logs -f
```

Ou de um serviço específico:

```bash
docker compose logs -f frontend
docker compose logs -f db
```

### Reconstruir imagens após alterações

```bash
docker compose up -d --build
```

### Parar os containers

```bash
docker compose down
```

Para remover também o volume de dados do banco:

```bash
docker compose down -v
```

## Telas do projeto

### Login

### Cadastro de candidato

### Cadastro de empresa

### Explorar vagas

### Detalhe da vaga

### Candidaturas

### Perfil do candidato

### Painel da empresa

### Nova vaga (empresa)

### Detalhe da vaga (empresa)

### Perfil da empresa
