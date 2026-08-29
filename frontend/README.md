# Nexo

MVP de uma plataforma digital de intermediação de vagas e candidatos. Cadastro, login, perfil (candidato/empresa), vagas (busca, publicação, edição, status e exclusão) e candidaturas (envio, ranking de candidatos, atualização de etapa) são feitos contra o `auth-service`, o `jobs-service` e o `applications-service` reais, via API Gateway KrakenD.

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

Login, cadastro, perfil, vagas e candidaturas chamam `auth-service`, `jobs-service` e `applications-service` (Java/Spring Boot) através do API Gateway KrakenD, em `http://localhost:8000/api/auth` e `http://localhost:8000/api` por padrão. Para funcionar, é necessário subir `db`, `auth-service`, `jobs-service`, `applications-service` e `krakend` (veja o `docker-compose.yaml` na raiz do projeto):

```bash
docker compose up -d db auth-service jobs-service applications-service krakend
```

O e-mail/senha preenchidos automaticamente na tela de login (`lucas@nexo.com` / `mariana@auroratech.com`, senha `123456`) são apenas um atalho de formulário — como o banco começa vazio, é preciso criar essas contas pela tela de cadastro antes de conseguir logar com elas (ou usar qualquer outro e-mail/senha cadastrados). Da mesma forma, o `jobs-service` começa sem nenhuma vaga cadastrada: é preciso publicar vagas pela conta de empresa para elas aparecerem na busca do candidato.

Para apontar para outra URL do gateway/serviço, defina em `.env`:

```env
VITE_AUTH_API_BASE_URL=http://localhost:8000/api/auth
VITE_JOBS_API_BASE_URL=http://localhost:8000/api
VITE_APPLICATIONS_API_BASE_URL=http://localhost:8000/api
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
  config/           URLs do API Gateway
  context/          estado e ações da aplicação
  pages/            telas por jornada
  services/         authApi, jobsApi e applicationsApi (clientes do auth-service/jobs-service/applications-service)
  types/            contratos do domínio
  utils/            formatação, rótulos e cálculo de compatibilidade
```

## Qualidade

```bash
npm run lint
npm run build
```
