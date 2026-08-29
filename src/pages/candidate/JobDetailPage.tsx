import { ArrowLeft, Bookmark, BriefcaseBusiness, Building2, Check, CheckCircle2, Clock3, MapPin, Share2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/useApp'
import type { CandidateProfile } from '../../types'
import { formatRelativeDate } from '../../utils/format'

export function JobDetailPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { database, currentUser, applyToJob } = useApp()
  const [saved, setSaved] = useState(false)
  const [notice, setNotice] = useState(false)
  const job = database.jobs.find((item) => item.id === jobId)
  const application = database.applications.find((item) => item.jobId === jobId && item.candidateId === currentUser?.id)

  if (!job) return <div className="empty-state surface"><h2>Vaga não encontrada</h2><button className="secondary-button" onClick={() => navigate('/vagas')}>Voltar para vagas</button></div>

  const profile = currentUser?.profile as CandidateProfile
  const matchingSkills = job.skills.filter((skill) => profile.skills.some((item) => item.toLowerCase() === skill.toLowerCase()))
  const match = application?.match ?? Math.min(98, 70 + matchingSkills.length * 7 + (job.experience === profile.experience ? 7 : 0))

  const apply = () => {
    applyToJob(job.id)
    setNotice(true)
    window.setTimeout(() => setNotice(false), 3600)
  }

  return (
    <div className="detail-page">
      <button className="back-link page-back" type="button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Voltar para vagas</button>
      <section className="job-detail-hero surface">
        <div className={`company-logo large company-logo-${job.companyId === 'company-vento' ? 'mint' : 'blue'}`}>{job.companyLogo}</div>
        <div className="job-detail-title">
          <div className="detail-badges"><span className="status-dot status-active">Vaga ativa</span><span>{formatRelativeDate(job.postedAt)}</span></div>
          <h1>{job.title}</h1>
          <p>{job.companyName}</p>
          <div className="detail-meta"><span><MapPin size={17} />{job.location}</span><span><BriefcaseBusiness size={17} />{job.employmentType}</span><span><Clock3 size={17} />{job.workplace}</span></div>
        </div>
        <div className="detail-actions"><button className={`icon-button ${saved ? 'selected' : ''}`} type="button" onClick={() => setSaved((value) => !value)} aria-label="Salvar vaga"><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button><button className="icon-button" type="button" aria-label="Compartilhar vaga"><Share2 size={19} /></button></div>
      </section>

      <div className="detail-layout">
        <article className="job-description surface">
          <section><h2>Sobre a oportunidade</h2><p>{job.description}</p></section>
          <section><h2>O que você vai fazer</h2><ul className="check-list">{job.responsibilities.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>
          <section><h2>O que buscamos</h2><ul className="check-list">{job.requirements.map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></section>
          <section><h2>Conhecimentos valorizados</h2><div className="skill-cloud">{job.skills.map((item) => <span key={item} className={matchingSkills.includes(item) ? 'matching' : ''}>{item}{matchingSkills.includes(item) && <CheckCircle2 size={14} />}</span>)}</div></section>
          <section><h2>Benefícios</h2><div className="benefits-grid">{job.benefits.map((item) => <span key={item}><Sparkles size={16} />{item}</span>)}</div></section>
        </article>

        <aside className="apply-sidebar">
          <div className="match-card surface">
            <div className="match-ring" style={{ '--match': `${match * 3.6}deg` } as React.CSSProperties}><span>{match}%</span></div>
            <div><h3>Boa compatibilidade</h3><p>Seu perfil combina com esta vaga.</p></div>
          </div>
          <div className="apply-card surface">
            <div><span className="muted-label">Faixa salarial</span><strong>{job.salary}</strong></div>
            {application ? <button className="success-button" disabled><CheckCircle2 size={18} /> Candidatura enviada</button> : <button className="primary-button full-button" type="button" onClick={apply}>Quero me candidatar</button>}
            <p>{application ? 'A empresa já recebeu seu perfil e currículo.' : 'Seu perfil e currículo serão compartilhados com a empresa.'}</p>
            {application && <Link className="text-link centered" to="/candidaturas">Acompanhar candidatura</Link>}
          </div>
          <div className="company-summary surface"><div className="company-logo company-logo-blue">{job.companyLogo}</div><div><span className="muted-label">Sobre a empresa</span><h3>{job.companyName}</h3><p>Tecnologia · São Paulo</p></div><Building2 size={20} /></div>
        </aside>
      </div>
      {notice && <div className="toast"><CheckCircle2 size={20} /><div><strong>Candidatura enviada!</strong><span>Acompanhe as próximas etapas na área de candidaturas.</span></div></div>}
    </div>
  )
}
