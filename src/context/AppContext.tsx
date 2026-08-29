import { useEffect, useMemo, useState } from 'react'
import { dataProvider } from '../services/dataProvider'
import type {
  ApplicationStatus,
  CandidateProfile,
  CompanyProfile,
  Database,
  JobInput,
  JobStatus,
  User,
  UserRole,
} from '../types'
import { AppContext } from './useApp'
import type { RegistrationInput } from './useApp'

const emptyDatabase: Database = {
  users: [],
  jobs: [],
  applications: [],
  currentUserId: null,
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [database, setDatabase] = useState<Database>(emptyDatabase)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dataProvider
      .load()
      .then(setDatabase)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar os dados.'))
      .finally(() => setLoading(false))
  }, [])

  const commit = (updater: (current: Database) => Database) => {
    setDatabase((current) => {
      const next = updater(current)
      void dataProvider.save(next).catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Erro ao salvar os dados.')
      })
      return next
    })
  }

  const currentUser = useMemo(
    () => database.users.find((user) => user.id === database.currentUserId) ?? null,
    [database.currentUserId, database.users],
  )

  const login = (email: string, password: string, role: UserRole) => {
    const user = database.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password && item.role === role,
    )
    if (!user) return false
    commit((current) => ({ ...current, currentUserId: user.id }))
    return true
  }

  const register = (input: RegistrationInput) => {
    const user: User = { ...input, id: makeId(input.role) }
    commit((current) => ({ ...current, users: [...current.users, user], currentUserId: user.id }))
    return user
  }

  const logout = () => commit((current) => ({ ...current, currentUserId: null }))

  const applyToJob = (jobId: string) => {
    if (!currentUser || currentUser.role !== 'candidate') return
    commit((current) => {
      if (current.applications.some((item) => item.jobId === jobId && item.candidateId === currentUser.id)) return current
      const job = current.jobs.find((item) => item.id === jobId)
      const profile = currentUser.profile as CandidateProfile
      const matches = job?.skills.filter((skill) => profile.skills.some((item) => item.toLowerCase() === skill.toLowerCase())).length ?? 0
      const match = Math.min(98, 68 + matches * 8 + (job?.experience === profile.experience ? 8 : 0))
      const now = new Date().toISOString()
      return {
        ...current,
        applications: [
          ...current.applications,
          {
            id: makeId('application'),
            jobId,
            candidateId: currentUser.id,
            status: 'applied',
            appliedAt: now,
            updatedAt: now,
            match,
          },
        ],
      }
    })
  }

  const createJob = (input: JobInput) => {
    if (!currentUser || currentUser.role !== 'company') return ''
    const profile = currentUser.profile as CompanyProfile
    const id = makeId('job')
    const companyName = profile.legalName.replace(/\s+(Ltda\.?|S\.?A\.?)$/i, '')
    const companyLogo = companyName.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()
    commit((current) => ({
      ...current,
      jobs: [
        {
          ...input,
          id,
          companyId: currentUser.id,
          companyName,
          companyLogo,
          status: 'active',
          postedAt: new Date().toISOString(),
          views: 0,
        },
        ...current.jobs,
      ],
    }))
    return id
  }

  const updateJob = (jobId: string, input: JobInput) => {
    commit((current) => ({
      ...current,
      jobs: current.jobs.map((job) => (job.id === jobId ? { ...job, ...input } : job)),
    }))
  }

  const setJobStatus = (jobId: string, status: JobStatus) => {
    commit((current) => ({
      ...current,
      jobs: current.jobs.map((job) => (job.id === jobId ? { ...job, status } : job)),
    }))
  }

  const setApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    commit((current) => ({
      ...current,
      applications: current.applications.map((application) =>
        application.id === applicationId
          ? { ...application, status, updatedAt: new Date().toISOString() }
          : application,
      ),
    }))
  }

  const updateUser = (name: string, profile: CandidateProfile | CompanyProfile) => {
    if (!currentUser) return
    commit((current) => ({
      ...current,
      users: current.users.map((user) => (user.id === currentUser.id ? { ...user, name, profile } : user)),
    }))
  }

  return (
    <AppContext.Provider
      value={{
        database,
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        applyToJob,
        createJob,
        updateJob,
        setJobStatus,
        setApplicationStatus,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
