# Nexo

MVP de uma plataforma digital de intermediação de vagas e candidatos. Cadastro, login e perfil (candidato/empresa) são autenticados contra o `auth-service` real (via API Gateway KrakenD); vagas e candidaturas ainda usam dados mockados persistidos em `localStorage`, pois `jobs-service` e `applications-service` ainda não foram implementados.

## Executando

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## Autenticação

Login, cadastro e perfil chamam o `auth-service` (Java/Spring Boot) através do API Gateway KrakenD, em `http://localhost:8000/api/auth` por padrão. Para funcionar, é necessário subir `db`, `auth-service` e `krakend` (veja o `docker-compose.yaml` na raiz do projeto):

```bash
docker compose up -d db auth-service krakend
```

O e-mail/senha preenchidos automaticamente na tela de login (`lucas@nexo.com` / `mariana@auroratech.com`, senha `123456`) são apenas um atalho de formulário — como o banco do `auth-service` começa vazio, é preciso criar essas contas pela tela de cadastro antes de conseguir logar com elas (ou usar qualquer outro e-mail/senha cadastrados).

Para apontar para outra URL do gateway/serviço, defina `VITE_AUTH_API_BASE_URL` (ex.: `.env`):

```env
VITE_AUTH_API_BASE_URL=http://localhost:8000/api/auth
```

## Fluxos disponíveis

- Cadastro e login de candidato e empresa
- Perfil profissional com currículo, competências e preferências
- Feed, busca e filtros de vagas
- Detalhes e envio de candidatura
- Acompanhamento das etapas da candidatura
- Painel da empresa com métricas e vagas publicadas
- Criação e edição de vagas
- Pausa, reabertura e encerramento de vagas
- Ranking de candidatos por compatibilidade
- Atualização da etapa de cada candidato
- Persistência local de todas as ações

## Estrutura

```text
src/
  components/       componentes compartilhados
  config/           configuração da fonte de dados
  context/          estado e ações da aplicação
  data/             base inicial mockada
  pages/            telas por jornada
  services/         dataProvider (vagas/candidaturas mock) e cliente do auth-service
  types/            contratos do domínio
  utils/            formatação e rótulos
```

## Vagas e candidaturas (ainda mockadas)

Vagas e candidaturas continuam usando o `dataProvider` local/HTTP genérico, já que `jobs-service` e `applications-service` ainda não existem. Para trocar essa fonte por uma API própria no futuro, defina em `.env`:

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000/api
```

O provider HTTP está em `src/services/dataProvider.ts`. O contrato atual espera:

- `GET /state` para carregar o estado
- `PUT /state` para persistir o estado

Essa fronteira pode ser substituída por endpoints de vagas e candidaturas sem alterar os componentes de interface.

## Qualidade

```bash
npm run lint
npm run build
```
