import { useEffect, useMemo, useState } from 'react'
import { applicationsApi } from '../services/applicationsApi'
import { authApi, toCandidateProfile, toCompanyProfile } from '../services/authApi'
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/authStorage'
import { jobsApi } from '../services/jobsApi'
import type { CandidateProfile, CompanyProfile, SessionUser } from '../types'
import { computeMatchScore } from '../utils/match'
import { AppContext } from './useApp'
import type { AppContextValue, RegistrationInput } from './useApp'

async function loadSessionUser(token: string): Promise<SessionUser> {
  const user = await authApi.me(token)
  const profile: CandidateProfile | CompanyProfile =
    user.role === 'candidate'
      ? toCandidateProfile(await authApi.getCandidateProfile(token))
      : toCompanyProfile(await authApi.getCompanyProfile(token))
  return { id: user.id, role: user.role, name: user.name, email: user.email, profile }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
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

    restoreSession()
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar os dados.'))
      .finally(() => setLoading(false))
  }, [])

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

  const applyToJob: AppContextValue['applyToJob'] = (job) => {
    if (!token || !currentUser || currentUser.role !== 'candidate') {
      return Promise.reject(new Error('É necessário estar autenticado como candidato para se candidatar.'))
    }
    const matchScore = computeMatchScore(job, currentUser.profile as CandidateProfile)
    return applicationsApi.create(token, job.id, matchScore)
  }

  const createJob: AppContextValue['createJob'] = (input) => {
    if (!token) throw new Error('É necessário estar autenticado como empresa para publicar vagas.')
    return jobsApi.create(token, input)
  }

  const updateJob: AppContextValue['updateJob'] = (jobId, input) => {
    if (!token) throw new Error('É necessário estar autenticado como empresa para editar vagas.')
    return jobsApi.update(token, jobId, input)
  }

  const deleteJob: AppContextValue['deleteJob'] = (jobId) => {
    if (!token) throw new Error('É necessário estar autenticado como empresa para remover vagas.')
    return jobsApi.remove(token, jobId)
  }

  const setApplicationStatus: AppContextValue['setApplicationStatus'] = (applicationId, status) => {
    if (!token) return Promise.reject(new Error('É necessário estar autenticado como empresa para atualizar candidaturas.'))
    return applicationsApi.updateStatus(token, applicationId, status)
  }

  const value = useMemo(
    () => ({
      token,
      currentUser,
      loading,
      error,
      login,
      register,
      logout,
      applyToJob,
      createJob,
      updateJob,
      deleteJob,
      setApplicationStatus,
      updateUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, loading, error, token],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
