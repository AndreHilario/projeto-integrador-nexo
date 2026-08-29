import type { CandidateProfile, Job } from '../types'

/** Compatibilidade estimada entre um candidato e uma vaga, calculada no cliente e enviada ao aplicar. */
export function computeMatchScore(job: Pick<Job, 'skills' | 'experience'>, profile: CandidateProfile): number {
  const matchingSkills = job.skills.filter((skill) => profile.skills.some((item) => item.toLowerCase() === skill.toLowerCase()))
  return Math.min(98, 70 + matchingSkills.length * 7 + (job.experience === profile.experience ? 7 : 0))
}
