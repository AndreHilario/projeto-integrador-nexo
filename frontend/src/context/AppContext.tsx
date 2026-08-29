import { useEffect, useMemo, useState } from 'react'
import { authApi, toCandidateProfile, toCompanyProfile } from '../services/authApi'
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/authStorage'
import { dataProvider } from '../services/dataProvider'
import type {
  ApplicationStatus,
  CandidateProfile,
  CompanyProfile,
  Database,
  JobInput,
  JobStatus,
  SessionUser,
} from '../types'
import { AppContext } from './useApp'
import type { AppContextValue, RegistrationInput } from './useApp'

const emptyDatabase: Database = {
  users: [],
  jobs: [],
  applications: [],
  currentUserId: null,
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

async function loadSessionUser(token: string): Promise<SessionUser> {
  const user = await authApi.me(token)
  const profile: CandidateProfile | CompanyProfile =
    user.role === 'candidate'
      ? toCandidateProfile(await authApi.getCandidateProfile(token))
      : toCompanyProfile(await authApi.getCompanyProfile(token))
  return { id: user.id, role: user.role, name: user.name, email: user.email, profile }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [database, setDatabase] = useState<Database>(emptyDatabase)
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredToken()
      if (!storedToken) return
      try {
        const user = await loadSessionUser(storedToken)
        setToken(storedToken)
        setCurrentUser(user)
      } catch {
        clearStoredToken()
      }
    }

    Promise.all([
      dataProvider.load().then(setDatabase),
      restoreSession(),
    ])
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

  const login: AppContextValue['login'] = async (email, password, role) => {
    const result = await authApi.login({ email, password })
    if (result.user.role !== role) {
      throw new Error('Esta conta não é do tipo selecionado. Troque a aba de acesso e tente novamente.')
    }
    setStoredToken(result.token)
    const user = await loadSessionUser(result.token)
    setToken(result.token)
    setCurrentUser(user)
  }

  const register: AppContextValue['register'] = async (input: RegistrationInput) => {
    const result = await authApi.register({ name: input.name, email: input.email, password: input.password, role: input.role })
    setStoredToken(result.token)
    setToken(result.token)

    const profile: CandidateProfile | CompanyProfile =
      input.role === 'candidate'
        ? toCandidateProfile(await authApi.updateCandidateProfile(result.token, input.profile as CandidateProfile))
        : toCompanyProfile(await authApi.updateCompanyProfile(result.token, input.profile as CompanyProfile))

    setCurrentUser({ id: result.user.id, role: result.user.role, name: result.user.name, email: result.user.email, profile })
  }

  const logout = () => {
    clearStoredToken()
    setToken(null)
    setCurrentUser(null)
  }

  const updateUser: AppContextValue['updateUser'] = async (name, profile) => {
    if (!token || !currentUser) return

    const nameUpdate = authApi.updateName(token, name)
    const profileUpdate =
      currentUser.role === 'candidate'
        ? authApi.updateCandidateProfile(token, profile as CandidateProfile).then(toCandidateProfile)
        : authApi.updateCompanyProfile(token, profile as CompanyProfile).then(toCompanyProfile)

    const [updatedName, updatedProfile] = await Promise.all([nameUpdate, profileUpdate])
    setCurrentUser({ ...currentUser, name: updatedName.name, profile: updatedProfile })
  }

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

  const value = useMemo(
    () => ({
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [database, currentUser, loading, error, token],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
