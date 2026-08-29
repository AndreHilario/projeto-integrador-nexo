import { appConfig } from '../config/app'
import { mockDatabase } from '../data/mockData'
import type { Database } from '../types'

export interface DataProvider {
  load(): Promise<Database>
  save(database: Database): Promise<void>
}

const cloneMockDatabase = () => structuredClone(mockDatabase)

class LocalDataProvider implements DataProvider {
  async load() {
    const stored = localStorage.getItem(appConfig.storageKey)
    if (!stored) {
      const database = cloneMockDatabase()
      localStorage.setItem(appConfig.storageKey, JSON.stringify(database))
      return database
    }
    return JSON.parse(stored) as Database
  }

  async save(database: Database) {
    localStorage.setItem(appConfig.storageKey, JSON.stringify(database))
  }
}

class ApiDataProvider implements DataProvider {
  async load() {
    const response = await fetch(`${appConfig.apiBaseUrl}/state`)
    if (!response.ok) throw new Error('Não foi possível carregar os dados da API.')
    return response.json() as Promise<Database>
  }

  async save(database: Database) {
    const response = await fetch(`${appConfig.apiBaseUrl}/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(database),
    })
    if (!response.ok) throw new Error('Não foi possível salvar os dados na API.')
  }
}

export const dataProvider: DataProvider =
  appConfig.dataSource === 'api' ? new ApiDataProvider() : new LocalDataProvider()
