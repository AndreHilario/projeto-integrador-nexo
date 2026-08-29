# Nexo

MVP de uma plataforma digital de intermediação de vagas e candidatos. Cadastro, login, perfil (candidato/empresa) e vagas (busca, publicação, edição, status e exclusão) são feitos contra o `auth-service` e o `jobs-service` reais (via API Gateway KrakenD); candidaturas ainda usam dados mockados persistidos em `localStorage`, pois `applications-service` ainda não foi implementado.

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

## Autenticação e vagas

Login, cadastro, perfil e vagas chamam `auth-service` e `jobs-service` (Java/Spring Boot) através do API Gateway KrakenD, em `http://localhost:8000/api/auth` e `http://localhost:8000/api` por padrão. Para funcionar, é necessário subir `db`, `auth-service`, `jobs-service` e `krakend` (veja o `docker-compose.yaml` na raiz do projeto):

```bash
docker compose up -d db auth-service jobs-service krakend
```

O e-mail/senha preenchidos automaticamente na tela de login (`lucas@nexo.com` / `mariana@auroratech.com`, senha `123456`) são apenas um atalho de formulário — como o banco começa vazio, é preciso criar essas contas pela tela de cadastro antes de conseguir logar com elas (ou usar qualquer outro e-mail/senha cadastrados). Da mesma forma, o `jobs-service` começa sem nenhuma vaga cadastrada: é preciso publicar vagas pela conta de empresa para elas aparecerem na busca do candidato.

Para apontar para outra URL do gateway/serviço, defina em `.env`:

```env
VITE_AUTH_API_BASE_URL=http://localhost:8000/api/auth
VITE_JOBS_API_BASE_URL=http://localhost:8000/api
```

Como o `jobs-service` guarda apenas o `companyId` de cada vaga (o nome da empresa é dado do `auth-service`, e ainda não existe um diretório público de empresas), a interface mostra o nome real da empresa apenas quando é a própria empresa dona da vaga vendo seu painel; para candidatos navegando vagas de terceiros, o rótulo exibido é genérico ("Empresa parceira").

## Fluxos disponíveis

- Cadastro e login de candidato e empresa
- Perfil profissional com currículo, competências e preferências
- Feed, busca e filtros de vagas
- Detalhes e envio de candidatura
- Acompanhamento das etapas da candidatura
- Painel da empresa com métricas e vagas publicadas
- Criação, edição e exclusão de vagas
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
  services/         dataProvider (candidaturas mock), authApi e jobsApi (clientes do auth-service/jobs-service)
  types/            contratos do domínio
  utils/            formatação e rótulos
```

## Candidaturas (ainda mockadas)

Candidaturas (envio, ranking de candidatos, atualização de etapa) continuam usando o `dataProvider` local/HTTP genérico, já que `applications-service` ainda não existe. Para trocar essa fonte por uma API própria no futuro, defina em `.env`:

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000/api
```

O provider HTTP está em `src/services/dataProvider.ts`. O contrato atual espera:

- `GET /state` para carregar o estado
- `PUT /state` para persistir o estado

Essa fronteira pode ser substituída por endpoints de candidaturas sem alterar os componentes de interface.

## Qualidade

```bash
npm run lint
npm run build
```
