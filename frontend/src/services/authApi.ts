import { appConfig } from '../config/app'
import type { CandidateProfile, CompanyProfile, ExperienceLevel, UserRole, Workplace } from '../types'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AuthResult {
  token: string
  user: AuthUser
}

export interface CandidateProfileDto {
  userId: string
  phone: string | null
  city: string | null
  headline: string | null
  area: string | null
  experience: ExperienceLevel | null
  preferredWorkplace: Workplace | null
  resumeName: string | null
  bio: string | null
  skills: string[]
}

export interface CompanyProfileDto {
  userId: string
  legalName: string | null
  document: string | null
  sector: string | null
  size: string | null
  city: string | null
  website: string | null
  about: string | null
}

class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const url = `${appConfig.authApiBaseUrl}${path}`
  console.debug(`[authApi] -> ${method} ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    console.error(`[authApi] <- ${method} ${url} status=${response.status}`, body)
    throw new ApiError(body?.message ?? 'Não foi possível completar a requisição.')
  }

  console.debug(`[authApi] <- ${method} ${url} status=${response.status}`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export const authApi = {
  register(input: { name: string; email: string; password: string; role: UserRole }) {
    return request<AuthResult>('/register', { method: 'POST', body: JSON.stringify(input) })
  },

  login(input: { email: string; password: string }) {
    return request<AuthResult>('/login', { method: 'POST', body: JSON.stringify(input) })
  },

  me(token: string) {
    return request<AuthUser>('/me', { headers: authHeaders(token) })
  },

  updateName(token: string, name: string) {
    return request<AuthUser>('/me', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ name }),
    })
  },

  getCandidateProfile(token: string) {
    return request<CandidateProfileDto>('/profile/candidate', { headers: authHeaders(token) })
  },

  updateCandidateProfile(token: string, profile: CandidateProfile) {
    const { kind, ...payload } = profile
    void kind
    return request<CandidateProfileDto>('/profile/candidate', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    })
  },

  getCompanyProfile(token: string) {
    return request<CompanyProfileDto>('/profile/company', { headers: authHeaders(token) })
  },

  updateCompanyProfile(token: string, profile: CompanyProfile) {
    const { kind, ...payload } = profile
    void kind
    return request<CompanyProfileDto>('/profile/company', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    })
  },
}

export function toCandidateProfile(dto: CandidateProfileDto): CandidateProfile {
  return {
    kind: 'candidate',
    phone: dto.phone ?? '',
    city: dto.city ?? '',
    headline: dto.headline ?? '',
    area: dto.area ?? '',
    experience: dto.experience ?? 'Júnior',
    preferredWorkplace: dto.preferredWorkplace ?? 'Híbrido',
    skills: dto.skills ?? [],
    resumeName: dto.resumeName ?? '',
    bio: dto.bio ?? '',
  }
}

export function toCompanyProfile(dto: CompanyProfileDto): CompanyProfile {
  return {
    kind: 'company',
    legalName: dto.legalName ?? '',
    document: dto.document ?? '',
    sector: dto.sector ?? '',
    size: dto.size ?? '',
    city: dto.city ?? '',
    website: dto.website ?? '',
    about: dto.about ?? '',
  }
}
