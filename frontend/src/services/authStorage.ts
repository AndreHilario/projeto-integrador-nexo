import { appConfig } from '../config/app'

export function getStoredToken(): string | null {
  return localStorage.getItem(appConfig.authStorageKey)
}

export function setStoredToken(token: string) {
  localStorage.setItem(appConfig.authStorageKey, token)
}

export function clearStoredToken() {
  localStorage.removeItem(appConfig.authStorageKey)
}
