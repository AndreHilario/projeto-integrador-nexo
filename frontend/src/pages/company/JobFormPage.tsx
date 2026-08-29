import { ArrowLeft, ArrowRight, CheckCircle2, CircleDollarSign, ListChecks, MapPin, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/useApp'
import { jobsApi } from '../../services/jobsApi'
import type { ExperienceLevel, Job, JobInput, Workplace } from '../../types'
import type { AppContextValue } from '../../context/useApp'

const toItems = (value: FormDataEntryValue | null) => String(value).split(/\n|,/).map((item) => item.trim()).filter(Boolean)

export function JobFormPage() {
  const { jobId } = useParams()
  const { createJob, updateJob } = useApp()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loadingJob, setLoadingJob] = useState(Boolean(jobId))

  useEffect(() => {
    if (!jobId) return
    jobsApi.getById(jobId).then(setJob).catch(() => setJob(null)).finally(() => setLoadingJob(false))
  }, [jobId])

  if (loadingJob) return <div className="empty-state surface"><h2>Carregando vaga...</h2></div>

  return <JobFormFields job={job} createJob={createJob} updateJob={updateJob} navigate={navigate} />
}

interface JobFormFieldsProps {
  job: Job | null
  createJob: AppContextValue['createJob']
  updateJob: AppContextValue['updateJob']
  navigate: (path: string) => void
}

function JobFormFields({ job, createJob, updateJob, navigate }: JobFormFieldsProps) {
  const editing = Boolean(job)
  const [step, setStep] = useState(1)
  const [basic, setBasic] = useState({
    title: job?.title ?? '',
    location: job?.location ?? '',
    workplace: job?.workplace ?? ('Híbrido' as Workplace),
    experience: job?.experience ?? ('Júnior' as ExperienceLevel),
    employmentType: job?.employmentType ?? 'CLT',
    salary: job?.salary ?? '',
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const basicComplete = Boolean(basic.title.trim() && basic.location.trim() && basic.salary.trim())

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const input: JobInput = {
      title: basic.title,
      location: basic.location,
      workplace: basic.workplace,
      experience: basic.experience,
      employmentType: basic.employmentType,
      salary: basic.salary,
      description: String(data.get('description')),
      responsibilities: toItems(data.get('responsibilities')),
      requirements: toItems(data.get('requirements')),
      skills: toItems(data.get('skills')),
      benefits: toItems(data.get('benefits')),
    }
    setSubmitError(null)
    setSubmitting(true)
    try {
      if (job) {
        await updateJob(job.id, input)
        navigate(`/empresa/vagas/${job.id}`)
        return
      }
      const created = await createJob(input)
      navigate(`/empresa/vagas/${created.id}`)
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'Não foi possível salvar a vaga.')
      setSubmitting(false)
    }
  }

  return (
    <div className="job-form-page narrow-content">
      <Link className="back-link page-back" to={editing ? `/empresa/vagas/${job?.id}` : '/empresa'}><ArrowLeft size={17} /> {editing ? 'Voltar para a vaga' : 'Voltar para o painel'}</Link>
      <section className="page-heading"><div><span className="eyebrow"><Sparkles size={15} /> {editing ? 'Edição da oportunidade' : 'Nova oportunidade'}</span><h1>{editing ? 'Editar vaga' : 'Publique uma nova vaga'}</h1><p>Informações claras ajudam as pessoas certas a encontrar sua empresa.</p></div></section>
      <div className="form-stepper">
        <button type="button" className={step === 1 ? 'active' : ''} onClick={() => setStep(1)}><span>{step > 1 ? <CheckCircle2 size={16} /> : '1'}</span><div><strong>Informações básicas</strong><small>Cargo e modelo</small></div></button>
        <i />
        <button type="button" className={step === 2 ? 'active' : ''} onClick={() => basicComplete && setStep(2)}><span>2</span><div><strong>Descrição da vaga</strong><small>Escopo e requisitos</small></div></button>
      </div>
      <form className="job-form surface" onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="form-step-content">
            <div className="form-section-head"><span className="form-section-icon"><MapPin size={21} /></span><div><h2>Sobre a oportunidade</h2><p>Comece pelas informações que aparecem na busca.</p></div></div>
            <label>Título da vaga<input value={basic.title} onChange={(event) => setBasic((current) => ({ ...current, title: event.target.value }))} placeholder="Ex.: Desenvolvedor(a) Front-end" required /></label>
            <div className="form-grid two"><label>Localização<input value={basic.location} onChange={(event) => setBasic((current) => ({ ...current, location: event.target.value }))} placeholder="São Paulo, SP ou Brasil" required /></label><label>Modalidade<select value={basic.workplace} onChange={(event) => setBasic((current) => ({ ...current, workplace: event.target.value as Workplace }))}><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></label></div>
            <div className="form-grid three"><label>Senioridade<select value={basic.experience} onChange={(event) => setBasic((current) => ({ ...current, experience: event.target.value as ExperienceLevel }))}><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></label><label>Contratação<select value={basic.employmentType} onChange={(event) => setBasic((current) => ({ ...current, employmentType: event.target.value }))}><option>CLT</option><option>PJ</option><option>Estágio</option><option>Temporário</option></select></label><label>Faixa salarial<input value={basic.salary} onChange={(event) => setBasic((current) => ({ ...current, salary: event.target.value }))} placeholder="R$ 5.000 – R$ 7.000" required /></label></div>
            <div className="form-tip"><CircleDollarSign size={19} /><span><strong>Transparência gera confiança</strong>Vagas com salário visível tendem a receber candidaturas mais alinhadas.</span></div>
            <div className="form-actions"><span /><button className="primary-button" type="button" disabled={!basicComplete} onClick={() => setStep(2)}>Continuar <ArrowRight size={17} /></button></div>
          </div>
        ) : (
          <div className="form-step-content">
            <div className="form-section-head"><span className="form-section-icon"><ListChecks size={21} /></span><div><h2>Detalhes e requisitos</h2><p>Ajude candidatos a entender o desafio e a cultura.</p></div></div>
            <label>Sobre a oportunidade<textarea name="description" rows={5} defaultValue={job?.description} placeholder="Apresente a equipe, o contexto e o principal desafio da posição" required /></label>
            <div className="form-grid two"><label>Responsabilidades<textarea name="responsibilities" rows={6} defaultValue={job?.responsibilities.join('\n')} placeholder={'Uma responsabilidade por linha\nColaborar com Produto\nEvoluir as interfaces'} required /><small>Uma por linha</small></label><label>Requisitos<textarea name="requirements" rows={6} defaultValue={job?.requirements.join('\n')} placeholder={'Um requisito por linha\nReact e TypeScript\nConhecimento de testes'} required /><small>Um por linha</small></label></div>
            <div className="form-grid two"><label>Competências<input name="skills" defaultValue={job?.skills.join(', ')} placeholder="React, TypeScript, CSS" required /><small>Separe por vírgulas</small></label><label>Benefícios<input name="benefits" defaultValue={job?.benefits.join(', ')} placeholder="Plano de saúde, Vale-refeição" required /><small>Separe por vírgulas</small></label></div>
            {submitError && <p className="form-error">{submitError}</p>}
            <div className="form-actions"><button className="secondary-button" type="button" onClick={() => setStep(1)}>Voltar</button><button className="primary-button" type="submit" disabled={submitting}>{editing ? 'Salvar alterações' : 'Publicar vaga'} <CheckCircle2 size={17} /></button></div>
          </div>
        )}
      </form>
    </div>
  )
}
