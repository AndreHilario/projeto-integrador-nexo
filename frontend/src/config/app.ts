export type DataSource = 'local' | 'api'

export const appConfig = {
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? 'local') as DataSource,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  storageKey: 'nexo:mvp:database:v1',
  // API Gateway (KrakenD) -> auth-service / jobs-service. Candidaturas ainda usam o dataProvider
  // mock acima, pois applications-service ainda não foi implementado.
  authApiBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'http://localhost:8000/api/auth',
  jobsApiBaseUrl: import.meta.env.VITE_JOBS_API_BASE_URL ?? 'http://localhost:8000/api',
  authStorageKey: 'nexo:auth:v1',
}
