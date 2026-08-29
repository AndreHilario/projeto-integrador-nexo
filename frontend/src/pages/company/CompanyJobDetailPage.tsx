import { ArrowLeft, CalendarCheck2, CheckCircle2, Download, Edit3, Eye, MapPin, MoreHorizontal, PauseCircle, PlayCircle, Search, Sparkles, UserRoundCheck, UsersRound, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/useApp'
import type { ApplicationStatus, CandidateProfile } from '../../types'
import { applicationStatusLabel, jobStatusLabel } from '../../utils/format'

export function CompanyJobDetailPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { database, currentUser, setJobStatus, setApplicationStatus } = useApp()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [notice, setNotice] = useState('')
  const job = database.jobs.find((item) => item.id === jobId && item.companyId === currentUser?.id)

  const candidates = useMemo(() => database.applications
    .filter((application) => application.jobId === jobId)
    .map((application) => ({ application, user: database.users.find((user) => user.id === application.candidateId) }))
    .filter((item) => {
      const text = `${item.user?.name} ${(item.user?.profile as CandidateProfile | undefined)?.skills.join(' ')}`.toLowerCase()
      return (!query || text.includes(query.toLowerCase())) && (statusFilter === 'all' || item.application.status === statusFilter)
    })
    .sort((a, b) => b.application.match - a.application.match), [database.applications, database.users, jobId, query, statusFilter])

  if (!job) return <div className="empty-state surface"><h2>Vaga não encontrada</h2><button className="secondary-button" onClick={() => navigate('/empresa')}>Voltar ao painel</button></div>

  const totalApplications = database.applications.filter((item) => item.jobId === job.id)
  const interviews = totalApplications.filter((item) => item.status === 'interview').length

  const flash = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  const changeStatus = (status: ApplicationStatus, applicationId: string) => {
    setApplicationStatus(applicationId, status)
    flash('Etapa do candidato atualizada.')
  }

  return (
    <div className="company-job-page">
      <Link className="back-link page-back" to="/empresa"><ArrowLeft size={17} /> Voltar para o painel</Link>
      <section className="company-job-header surface">
        <div className="company-job-main"><div className="company-logo large company-logo-blue">{job.companyLogo}</div><div><div className="detail-badges"><span className={`status-dot status-${job.status}`}>{jobStatusLabel[job.status]}</span><span>{job.employmentType}</span></div><h1>{job.title}</h1><p><MapPin size={16} />{job.location} · {job.workplace} · {job.experience}</p></div></div>
        <div className="company-job-actions"><Link className="secondary-button" to={`/empresa/vagas/${job.id}/editar`}><Edit3 size={17} /> Editar vaga</Link>{job.status === 'active' ? <button className="secondary-button" onClick={() => setJobStatus(job.id, 'paused')}><PauseCircle size={17} /> Pausar</button> : job.status === 'paused' ? <button className="secondary-button" onClick={() => setJobStatus(job.id, 'active')}><PlayCircle size={17} /> Reabrir</button> : <button className="secondary-button" onClick={() => setJobStatus(job.id, 'active')}><PlayCircle size={17} /> Reabrir</button>}<button className="icon-button" aria-label="Mais opções"><MoreHorizontal size={19} /></button></div>
      </section>
      <section className="job-kpi-row surface">
        <div><span className="metric-icon purple"><UsersRound size={19} /></span><span><strong>{totalApplications.length}</strong><small>Candidatos</small></span></div>
        <div><span className="metric-icon blue"><Eye size={19} /></span><span><strong>{job.views}</strong><small>Visualizações</small></span></div>
        <div><span className="metric-icon mint"><CalendarCheck2 size={19} /></span><span><strong>{interviews}</strong><small>Entrevistas</small></span></div>
        <div><span className="metric-icon orange"><UserRoundCheck size={19} /></span><span><strong>{totalApplications.filter((item) => item.match >= 85).length}</strong><small>Alto match</small></span></div>
      </section>
      <section className="candidate-section">
        <div className="list-toolbar candidate-toolbar"><div><span className="eyebrow"><Sparkles size={15} /> Ranking inteligente</span><h2>Candidatos</h2><p>Ordenados pela compatibilidade com os requisitos da vaga.</p></div>{job.status !== 'closed' && <button className="danger-text-button" onClick={() => setJobStatus(job.id, 'closed')}><XCircle size={17} /> Encerrar vaga</button>}</div>
        <div className="candidate-filters surface"><label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome ou habilidade" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Todas as etapas</option><option value="applied">Candidatura enviada</option><option value="screening">Em triagem</option><option value="interview">Entrevista</option><option value="approved">Aprovado</option><option value="rejected">Não selecionado</option></select></div>
        <div className="candidate-list">
          {candidates.map(({ application, user }, index) => {
            if (!user) return null
            const profile = user.profile as CandidateProfile
            return (
              <article className="candidate-card surface" key={application.id}>
                <div className="ranking-number">#{index + 1}</div>
                <div className="candidate-avatar">{user.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
                <div className="candidate-info"><div className="candidate-title"><div><h3>{user.name}</h3><p>{profile.headline} · {profile.city}</p></div><span className={`application-badge application-${application.status}`}>{applicationStatusLabel[application.status]}</span></div><div className="candidate-skills">{profile.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}{job.skills.includes(skill) && <CheckCircle2 size={13} />}</span>)}</div><p className="candidate-bio">{profile.bio}</p></div>
                <div className="candidate-match"><div className="mini-match-ring" style={{ '--match': `${application.match * 3.6}deg` } as React.CSSProperties}><span>{application.match}%</span></div><small>compatível</small></div>
                <div className="candidate-actions"><button className="secondary-button" onClick={() => flash(`Currículo de ${user.name} pronto para visualização.`)}><Download size={16} /> Currículo</button><select aria-label={`Etapa de ${user.name}`} value={application.status} onChange={(event) => changeStatus(event.target.value as ApplicationStatus, application.id)}><option value="applied">Recebido</option><option value="screening">Em triagem</option><option value="interview">Entrevista</option><option value="approved">Aprovado</option><option value="rejected">Não selecionado</option></select></div>
              </article>
            )
          })}
          {candidates.length === 0 && <div className="empty-state surface"><UsersRound size={32} /><h3>Nenhum candidato encontrado</h3><p>Ajuste os filtros ou aguarde novas candidaturas.</p></div>}
        </div>
      </section>
      {notice && <div className="toast"><CheckCircle2 size={20} /><div><strong>Tudo certo</strong><span>{notice}</span></div></div>}
    </div>
  )
}
