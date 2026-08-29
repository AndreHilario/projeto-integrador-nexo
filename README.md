# Projeto Integrador Nexo

## Executando com Docker Compose

Este projeto usa Docker Compose para subir dois serviços:

- **db**: banco de dados PostgreSQL 16, exposto na porta `5432`, com os scripts de inicialização em `Backend/dbfiles` e dados persistidos no volume `db_data`.
- **frontend**: aplicação frontend, construída a partir de `frontend/Dockerfile` e exposta na porta `8080`.

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
2. Baixar a imagem do PostgreSQL 16.
3. Subir os dois serviços em segundo plano.

### Acessando os serviços

- Frontend: [http://localhost:8080](http://localhost:8080)
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
