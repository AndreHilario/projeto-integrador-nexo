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
