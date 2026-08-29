export type DataSource = 'local' | 'api'

export const appConfig = {
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? 'local') as DataSource,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  storageKey: 'nexo:mvp:database:v1',
}
