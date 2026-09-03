# Nexo

MVP de uma plataforma digital de intermediação de vagas e candidatos. O frontend cobre as jornadas de candidato e empresa com dados mockados persistidos em `localStorage`.

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

## Acessos de demonstração

### Candidato

- E-mail: `lucas@nexo.com`
- Senha: `123456`

### Empresa

- E-mail: `mariana@auroratech.com`
- Senha: `123456`

As credenciais são preenchidas automaticamente ao selecionar o perfil na tela de login.

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
  services/         providers local e HTTP
  types/            contratos do domínio
  utils/            formatação e rótulos
```

## Troca para API real

Copie `.env.example` para `.env` e altere:

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000/api
```

O provider HTTP está em `src/services/dataProvider.ts`. O contrato atual espera:

- `GET /state` para carregar o estado
- `PUT /state` para persistir o estado

Essa fronteira pode ser substituída por endpoints de autenticação, vagas, usuários e candidaturas sem alterar os componentes de interface.

## Qualidade

```bash
npm run lint
npm run build
```

## Vídeo:
www.youtube.com/watch?v=fGdOkCf0PlI
