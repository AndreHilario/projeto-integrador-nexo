export const appConfig = {
  // API Gateway (KrakenD) -> auth-service / jobs-service / applications-service.
  authApiBaseUrl: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'http://localhost:8000/api/auth',
  jobsApiBaseUrl: import.meta.env.VITE_JOBS_API_BASE_URL ?? 'http://localhost:8000/api',
  applicationsApiBaseUrl: import.meta.env.VITE_APPLICATIONS_API_BASE_URL ?? 'http://localhost:8000/api',
  authStorageKey: 'nexo:auth:v1',
}
