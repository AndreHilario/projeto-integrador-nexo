import { createContext, useContext } from 'react'
import type {
  ApplicationStatus,
  CandidateProfile,
  CompanyProfile,
  Database,
  JobInput,
  JobStatus,
  SessionUser,
  UserRole,
} from '../types'

export interface RegistrationInput {
  role: UserRole
  name: string
  email: string
  password: string
  profile: CandidateProfile | CompanyProfile
}

export interface AppContextValue {
  database: Database
  currentUser: SessionUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (input: RegistrationInput) => Promise<void>
  logout: () => void
  applyToJob: (jobId: string) => void
  createJob: (input: JobInput) => string
  updateJob: (jobId: string, input: JobInput) => void
  setJobStatus: (jobId: string, status: JobStatus) => void
  setApplicationStatus: (applicationId: string, status: ApplicationStatus) => void
  updateUser: (name: string, profile: CandidateProfile | CompanyProfile) => Promise<void>
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp precisa ser usado dentro de AppProvider.')
  return context
}
