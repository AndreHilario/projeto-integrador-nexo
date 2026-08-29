import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, Clock3, Inbox } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/useApp'
import { jobsApi } from '../../services/jobsApi'
import type { ApplicationStatus, Job } from '../../types'
import { applicationStatusLabel, formatDate, unknownCompanyDisplay } from '../../utils/format'

const stages: ApplicationStatus[] = ['applied', 'screening', 'interview', 'approved']

export function ApplicationsPage() {
  const { database, currentUser } = useApp()
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const [jobsById, setJobsById] = useState<Record<string, Job>>({})
  const applications = useMemo(() => database.applications
    .filter((item) => item.candidateId === currentUser?.id)
    .filter((item) => filter === 'all' || (filter === 'active' ? !['approved', 'rejected'].includes(item.status) : ['approved', 'rejected'].includes(item.status)))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [currentUser?.id, database.applications, filter])

  useEffect(() => {
    const missingIds = [...new Set(applications.map((item) => item.jobId))].filter((id) => !jobsById[id])
    if (missingIds.length === 0) return
    Promise.all(missingIds.map((id) => jobsApi.getById(id).catch(() => null))).then((results) => {
      setJobsById((current) => {
        const next = { ...current }
        results.forEach((job, index) => { if (job) next[missingIds[index]] = job })
        return next
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications])

  return (
    <div className="page-stack narrow-content">
      <section className="page-heading">
        <div><span className="eyebrow">Sua jornada</span><h1>Minhas candidaturas</h1><p>Acompanhe cada etapa e não perca nenhuma atualização.</p></div>
        <div className="summary-pill"><BriefcaseBusiness size={19} /><span><strong>{database.applications.filter((item) => item.candidateId === currentUser?.id && !['approved', 'rejected'].includes(item.status)).length}</strong> processos ativos</span></div>
      </section>
      <div className="segmented compact application-filter">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todas</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Em andamento</button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>Finalizadas</button>
      </div>
      <div className="application-list">
        {applications.map((application) => {
          const job = jobsById[application.jobId]
          if (!job) return null
          const currentStage = stages.indexOf(application.status)
          return (
            <article className="application-card surface" key={application.id}>
              <div className="application-card-head">
                <div className="company-logo company-logo-blue">{unknownCompanyDisplay.logo}</div>
                <div><span className={`application-badge application-${application.status}`}>{applicationStatusLabel[application.status]}</span><h2>{job.title}</h2><p>{unknownCompanyDisplay.name} · {job.workplace}</p></div>
                <Link to={`/vagas/${job.id}`} className="icon-button"><ArrowUpRight size={19} /></Link>
              </div>
              {application.status === 'rejected' ? (
                <div className="application-message neutral"><Inbox size={19} /><span><strong>Processo finalizado</strong>Seu perfil segue visível para novas oportunidades.</span></div>
              ) : (
                <div className="application-timeline">
                  {stages.map((stage, index) => (
                    <div key={stage} className={`timeline-step ${index <= currentStage ? 'complete' : ''} ${index === currentStage ? 'current' : ''}`}>
                      <span>{index < currentStage ? <Check size={13} /> : index + 1}</span>
                      <small>{applicationStatusLabel[stage].replace('Candidatura ', '')}</small>
                    </div>
                  ))}
                </div>
              )}
              <div className="application-footer"><span><CalendarDays size={15} /> Candidatura em {formatDate(application.appliedAt)}</span><span><Clock3 size={15} /> Atualizada em {formatDate(application.updatedAt)}</span><strong>{application.match}% match</strong></div>
            </article>
          )
        })}
        {applications.length === 0 && <div className="empty-state surface"><Inbox size={32} /><h3>Nenhuma candidatura por aqui</h3><p>Quando você se candidatar, o andamento aparecerá nesta tela.</p><Link className="primary-button" to="/vagas">Explorar vagas</Link></div>}
      </div>
    </div>
  )
}
