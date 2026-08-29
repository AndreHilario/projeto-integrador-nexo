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

export interface Job {
  id: string
  companyId: string
  companyName: string
  companyLogo: string
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
  status: JobStatus
  postedAt: string
  views: number
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

export interface Database {
  users: User[]
  jobs: Job[]
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
}
