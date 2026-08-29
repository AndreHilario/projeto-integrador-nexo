export type DataSource = 'local' | 'api'

export const appConfig = {
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? 'local') as DataSource,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  storageKey: 'nexo:mvp:database:v1',
  // API Gateway (KrakenD) -> auth-service. Vagas e candidaturas ainda usam o dataProvider mock acima,
  // pois jobs-service e applications-service ainda não foram implementados.
  authApiBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'http://localhost:8000/api/auth',
  authStorageKey: 'nexo:auth:v1',
}
