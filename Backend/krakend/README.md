# API Gateway (KrakenD)

Ponto único de entrada para os microsserviços da Nexo. Recebe as requisições do frontend e as encaminha (roteia) para o serviço correto, evitando que o frontend precise conhecer o endereço/porta de cada microsserviço.

## Responsabilidades

- Expor uma única URL/porta para o frontend consumir (`/api/...`).
- Rotear cada endpoint para o backend correspondente:
  - `/api/auth/*` → `auth-service`
  - `/api/jobs*` → `jobs-service`
  - `/api/applications*` → `applications-service`
- Centralizar, no futuro, preocupações transversais como autenticação (validação de token), rate limiting, CORS e agregação de respostas de múltiplos serviços.

## Configuração

A configuração das rotas fica em [`krakend.json`](./krakend.json). Cada serviço é referenciado pelo nome do container Docker (`auth-service`, `jobs-service`, `applications-service`) e pela porta interna que ele deve expor. O KrakenD 2.x não aceita `"method": "ANY"` nem wildcards de múltiplos segmentos (`{path}` casa só um segmento) — por isso cada rota é declarada explicitamente (uma entrada por combinação endpoint + método), em vez de um catch-all genérico por serviço.

| Serviço               | Host interno esperado           |
|------------------------|----------------------------------|
| auth-service            | `http://auth-service:3001`      |
| jobs-service             | `http://jobs-service:3002`      |
| applications-service     | `http://applications-service:3003` |

## CORS

O gateway libera CORS (`security/cors` no `krakend.json`) para `http://localhost:8080` (frontend via Docker/Nginx) e `http://localhost:5173` (frontend via `npm run dev`), permitindo os métodos e headers usados pelo frontend (incluindo `Authorization` para o JWT). Se o frontend rodar em outra origem/porta, adicione-a em `allow_origins`.

## Repasse de headers (`input_headers`)

Por padrão o KrakenD **não repassa headers customizados da requisição pro backend** (só um conjunto padrão, que inclui `Content-Type`). Todo endpoint que exige o JWT (`/me` GET/PUT e `/profile/candidate|company` GET/PUT) declara `"input_headers": ["Authorization"]` — sem isso, o `auth-service` nunca recebe o token e responde 401/403, que o KrakenD transforma em `Error #01: invalid status code` (mensagem genérica, sem detalhe do erro real).

**Cuidado:** `input_headers` é uma lista **exaustiva**, não aditiva — declarar `["Authorization"]` também *suprime* o `Content-Type` que era repassado por padrão. Por isso, todo endpoint que recebe corpo (PUT/POST) e também exige `Authorization` precisa listar os dois: `["Authorization", "Content-Type"]`. Descobrimos isso na prática: os `PUT` de `/me` e `/profile/*` chegavam no `auth-service` com `Content-Type: application/octet-stream` em vez de `application/json`, e o Spring rejeitava com `HttpMediaTypeNotSupportedException` (500, sem log de negócio nenhum). Qualquer novo endpoint autenticado com corpo (inclusive em `jobs-service`/`applications-service` no futuro) precisa repetir essa combinação.

## Debug

O nível de log está temporariamente em `DEBUG` (`telemetry/logging.level`) para facilitar o diagnóstico da integração com o `auth-service`. Volte para `INFO` quando o fluxo estiver estável, pra não poluir os logs em produção.

## Status atual

`auth-service` e `jobs-service` já estão implementados e integrados ao `docker-compose.yaml` e ao gateway. `applications-service` ainda não possui implementação nem `Dockerfile`, por isso ainda não foi adicionado ao `docker-compose.yaml`; assim que for implementado e ganhar seu próprio `Dockerfile`, deve ser adicionado ao `docker-compose.yaml` com o nome de host e a porta usados aqui, para que o roteamento funcione.

## Subindo o gateway

O serviço `krakend` é adicionado ao `docker-compose.yaml` na raiz do projeto, expondo a porta `8000` (mapeada para a porta `8080` interna do KrakenD).
