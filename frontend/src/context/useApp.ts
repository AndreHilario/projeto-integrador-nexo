import { createContext, useContext } from 'react'
import type {
  Application,
  ApplicationStatus,
  CandidateProfile,
  CompanyProfile,
  Job,
  JobInput,
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
  token: string | null
  currentUser: SessionUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (input: RegistrationInput) => Promise<void>
  logout: () => void
  applyToJob: (job: Job) => Promise<Application>
  createJob: (input: JobInput) => Promise<Job>
  updateJob: (jobId: string, input: JobInput) => Promise<Job>
  deleteJob: (jobId: string) => Promise<void>
  setApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<Application>
  updateUser: (name: string, profile: CandidateProfile | CompanyProfile) => Promise<void>
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp precisa ser usado dentro de AppProvider.')
  return context
}
