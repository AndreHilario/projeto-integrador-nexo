import { appConfig } from '../config/app'
import type { ExperienceLevel, Job, JobInput, JobStatus, JobSummary, Workplace } from '../types'

export interface JobSearchFilters {
  title?: string
  location?: string
  workplace?: Workplace
  experience?: ExperienceLevel
  employmentType?: string
  companyId?: string
  status?: JobStatus
}

class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const url = `${appConfig.jobsApiBaseUrl}${path}`
  console.debug(`[jobsApi] -> ${method} ${url}`)

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    console.error(`[jobsApi] <- ${method} ${url} status=${response.status}`, body)
    throw new ApiError(body?.message ?? 'Não foi possível completar a requisição.')
  }

  console.debug(`[jobsApi] <- ${method} ${url} status=${response.status}`)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

function buildQuery(filters: JobSearchFilters): string {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const jobsApi = {
  search(filters: JobSearchFilters = {}) {
    return request<JobSummary[]>(`/jobs${buildQuery(filters)}`)
  },

  getById(jobId: string) {
    return request<Job>(`/jobs/${jobId}`)
  },

  create(token: string, input: JobInput) {
    return request<Job>('/jobs', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    })
  },

  update(token: string, jobId: string, input: JobInput) {
    return request<Job>(`/jobs/${jobId}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(input),
    })
  },

  remove(token: string, jobId: string) {
    return request<void>(`/jobs/${jobId}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    })
  },
}

/** Reconstrói o payload editável de uma vaga já carregada, para reenvio em um PUT (ex.: só trocar o status). */
export function toJobInput(job: Job): JobInput {
  return {
    title: job.title,
    location: job.location,
    workplace: job.workplace,
    experience: job.experience,
    employmentType: job.employmentType,
    salary: job.salary,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    skills: job.skills,
    benefits: job.benefits,
    status: job.status,
  }
}
