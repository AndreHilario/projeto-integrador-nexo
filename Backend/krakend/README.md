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

A configuração das rotas fica em [`krakend.json`](./krakend.json). Cada serviço é referenciado pelo nome do container Docker (`auth-service`, `jobs-service`, `applications-service`) e pela porta interna que ele deve expor:

| Serviço               | Host interno esperado           |
|------------------------|----------------------------------|
| auth-service            | `http://auth-service:3001`      |
| jobs-service             | `http://jobs-service:3002`      |
| applications-service     | `http://applications-service:3003` |

## Status atual

Os microsserviços (`auth-service`, `jobs-service`, `applications-service`) ainda não possuem implementação nem `Dockerfile`, por isso ainda não foram adicionados ao `docker-compose.yaml`. O gateway já está configurado e sobe sozinho; conforme cada serviço for implementado e ganhar seu próprio `Dockerfile`, ele deve ser adicionado ao `docker-compose.yaml` com o nome de host e a porta usados aqui, para que o roteamento funcione.

## Subindo o gateway

O serviço `krakend` é adicionado ao `docker-compose.yaml` na raiz do projeto, expondo a porta `8000` (mapeada para a porta `8080` interna do KrakenD).
