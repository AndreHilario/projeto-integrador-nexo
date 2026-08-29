export type UserRole = 'candidate' | 'company'
export type Workplace = 'Remoto' | 'Híbrido' | 'Presencial'
export type ExperienceLevel = 'Júnior' | 'Pleno' | 'Sênior'
export type JobStatus = 'active' | 'paused' | 'closed'
export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'approved'
  | 'rejected'

export interface CandidateProfile {
  kind: 'candidate'
  phone: string
  city: string
  headline: string
  area: string
  experience: ExperienceLevel
  preferredWorkplace: Workplace
  skills: string[]
  resumeName: string
  bio: string
}

export interface CompanyProfile {
  kind: 'company'
  legalName: string
  document: string
  sector: string
  size: string
  city: string
  website: string
  about: string
}

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  password: string
  profile: CandidateProfile | CompanyProfile
}

/** Usuário autenticado via auth-service (sem senha, que nunca trafega além do login). */
export interface SessionUser {
  id: string
  role: UserRole
  name: string
  email: string
  profile: CandidateProfile | CompanyProfile
}

/** Campos devolvidos por GET /jobs (listagem/busca) no jobs-service. */
export interface JobSummary {
  id: string
  companyId: string
  title: string
  location: string
  workplace: Workplace
  experience: ExperienceLevel
  employmentType: string
  salary: string
  status: JobStatus
  views: number
  postedAt: string
}

/** Campos adicionais devolvidos por GET /jobs/{id} no jobs-service. */
export interface Job extends JobSummary {
  updatedAt: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  benefits: string[]
}

export interface Application {
  id: string
  jobId: string
  candidateId: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  match: number
}

/** Usuários e candidaturas seguem mockados em localStorage, pois applications-service ainda não existe. */
export interface Database {
  users: User[]
  applications: Application[]
  currentUserId: string | null
}

export interface JobInput {
  title: string
  location: string
  workplace: Workplace
  experience: ExperienceLevel
  employmentType: string
  salary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  benefits: string[]
  /** Só é considerado em atualizações (PUT); ignorado na criação de vagas. */
  status?: JobStatus
}
