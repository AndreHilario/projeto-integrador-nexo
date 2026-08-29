import type { ApplicationStatus, JobStatus } from '../types'

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  applied: 'Candidatura enviada',
  screening: 'Em triagem',
  interview: 'Entrevista',
  approved: 'Aprovado',
  rejected: 'Não selecionado',
}

export const jobStatusLabel: Record<JobStatus, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  closed: 'Encerrada',
}

export const formatRelativeDate = (value: string) => {
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000))
  if (days === 0) return 'Publicada hoje'
  if (days === 1) return 'Publicada ontem'
  return `Há ${days} dias`
}

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

/**
 * O jobs-service só guarda o `companyId` da vaga (não o nome/logo da empresa, que é
 * dado do auth-service). Quando quem está vendo a vaga é a própria empresa dona dela,
 * usamos o perfil já carregado; nos demais casos (candidato navegando vagas de terceiros)
 * ainda não existe um diretório público de empresas, então mostramos um rótulo genérico.
 */
export function deriveCompanyDisplay(legalName: string) {
  const name = legalName.replace(/\s+(Ltda\.?|S\.?A\.?)$/i, '').trim()
  const logo = name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()
  return { name: name || 'Empresa', logo: logo || 'EM' }
}

export const unknownCompanyDisplay = { name: 'Empresa parceira', logo: 'EP' }
