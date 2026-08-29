import { ArrowRight, BriefcaseBusiness, CalendarCheck2, Eye, Plus, Sparkles, UserRoundCheck, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { JobCard } from '../../components/JobCard'
import { useApp } from '../../context/useApp'
import { jobsApi } from '../../services/jobsApi'
import type { CompanyProfile, JobSummary } from '../../types'
import { deriveCompanyDisplay } from '../../utils/format'

export function CompanyDashboardPage() {
  const { database, currentUser } = useApp()
  const [jobs, setJobs] = useState<JobSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    jobsApi.search({ companyId: currentUser.id }).then(setJobs).finally(() => setLoading(false))
  }, [currentUser])

  const jobIds = new Set(jobs.map((job) => job.id))
  const applications = database.applications.filter((application) => jobIds.has(application.jobId))
  const activeJobs = jobs.filter((job) => job.status === 'active').length
  const interviews = applications.filter((application) => application.status === 'interview').length
  const views = jobs.reduce((total, job) => total + job.views, 0)
  const companyDisplay = currentUser ? deriveCompanyDisplay((currentUser.profile as CompanyProfile).legalName) : undefined

  return (
    <div className="page-stack">
      <section className="company-hero">
        <div><span className="eyebrow"><Sparkles size={15} /> Painel de recrutamento</span><h1>Bom dia, {currentUser?.name.split(' ')[0]}.</h1><p>Seus processos estão avançando. Veja o que merece atenção hoje.</p></div>
        <Link className="primary-button" to="/empresa/vagas/nova"><Plus size={18} /> Publicar nova vaga</Link>
      </section>
      <section className="metrics-grid">
        <div className="metric-card surface"><span className="metric-icon blue"><BriefcaseBusiness size={20} /></span><div><p>Vagas ativas</p><strong>{activeJobs}</strong><small>de {jobs.length} publicadas</small></div></div>
        <div className="metric-card surface"><span className="metric-icon purple"><UsersRound size={20} /></span><div><p>Candidaturas</p><strong>{applications.length}</strong><small>nos seus processos</small></div></div>
        <div className="metric-card surface"><span className="metric-icon mint"><CalendarCheck2 size={20} /></span><div><p>Em entrevista</p><strong>{interviews}</strong><small>aguardando retorno</small></div></div>
        <div className="metric-card surface"><span className="metric-icon orange"><Eye size={20} /></span><div><p>Visualizações</p><strong>{views}</strong><small>alcance total</small></div></div>
      </section>
      {applications.length > 0 && (
        <section className="attention-card surface">
          <div className="attention-icon"><UserRoundCheck size={22} /></div>
          <div><span className="eyebrow">Em destaque</span><h2>{applications.filter((item) => item.status === 'applied').length || applications.length} novos perfis para revisar</h2><p>Os candidatos com maior compatibilidade já aparecem primeiro no ranking.</p></div>
          <Link to={`/empresa/vagas/${jobs.find((job) => database.applications.some((item) => item.jobId === job.id))?.id ?? jobs[0]?.id}`}>Revisar agora <ArrowRight size={17} /></Link>
        </section>
      )}
      <section className="content-section">
        <div className="list-toolbar"><div><h2>Suas vagas</h2><p>Acompanhe desempenho, status e candidatos.</p></div><div className="legend"><span><i className="legend-dot active" /> Ativas</span><span><i className="legend-dot paused" /> Pausadas</span></div></div>
        {loading ? <p>Carregando vagas...</p> : jobs.length > 0 ? (
          <div className="jobs-grid">{jobs.map((job) => <JobCard key={job.id} job={job} companyView companyName={companyDisplay?.name} companyLogo={companyDisplay?.logo} />)}</div>
        ) : (
          <div className="empty-state surface"><BriefcaseBusiness size={32} /><h3>Publique sua primeira vaga</h3><p>Leva poucos minutos para começar a receber candidatos.</p><Link className="primary-button" to="/empresa/vagas/nova"><Plus size={17} /> Nova vaga</Link></div>
        )}
      </section>
    </div>
  )
}
