import { BriefcaseBusiness, ChevronDown, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { JobCard } from '../../components/JobCard'
import { useApp } from '../../context/useApp'
import { jobsApi } from '../../services/jobsApi'
import type { ExperienceLevel, JobSummary, Workplace } from '../../types'

export function JobsPage() {
  const { currentUser } = useApp()
  const [search, setSearch] = useState('')
  const [workplace, setWorkplace] = useState('Todas')
  const [experience, setExperience] = useState('Todos')
  const [jobs, setJobs] = useState<JobSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setLoading(true)
      jobsApi
        .search({
          title: search.trim() || undefined,
          workplace: workplace !== 'Todas' ? (workplace as Workplace) : undefined,
          experience: experience !== 'Todos' ? (experience as ExperienceLevel) : undefined,
        })
        .then(setJobs)
        .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar as vagas.'))
        .finally(() => setLoading(false))
    }, 300)
    return () => window.clearTimeout(handle)
  }, [search, workplace, experience])

  const activeFilters = Number(workplace !== 'Todas') + Number(experience !== 'Todos')

  return (
    <div className="page-stack">
      <section className="candidate-hero">
        <div>
          <span className="eyebrow"><Sparkles size={15} /> Oportunidades para você</span>
          <h1>Olá, {currentUser?.name.split(' ')[0]}.</h1>
          <p>Encontre um lugar onde o seu trabalho possa fazer a diferença.</p>
        </div>
        <div className="hero-orb"><BriefcaseBusiness size={34} /></div>
      </section>

      <section className="search-panel glass">
        <label className="main-search"><Search size={21} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cargo ou palavra-chave" /></label>
        <div className="filter-field"><MapPin size={18} /><span>Brasil</span><ChevronDown size={16} /></div>
        <button className="primary-button search-button" type="button">Buscar vagas</button>
      </section>

      <section className="content-section">
        <div className="list-toolbar">
          <div><h2>Vagas recomendadas</h2><p>{loading ? 'Buscando vagas...' : `${jobs.length} oportunidades com o seu perfil`}</p></div>
          <div className="filter-controls">
            <label><span className="sr-only">Modalidade</span><select value={workplace} onChange={(event) => setWorkplace(event.target.value)}><option>Todas</option><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></label>
            <label><span className="sr-only">Experiência</span><select value={experience} onChange={(event) => setExperience(event.target.value)}><option>Todos</option><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></label>
            <button type="button" className="filter-button"><SlidersHorizontal size={17} /> Filtros {activeFilters > 0 && <b>{activeFilters}</b>}</button>
          </div>
        </div>
        {error && <div className="empty-state surface"><h3>Não foi possível carregar as vagas</h3><p>{error}</p></div>}
        {!error && jobs.length > 0 && (
          <div className="jobs-grid">{jobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
        )}
        {!error && !loading && jobs.length === 0 && (
          <div className="empty-state surface"><Search size={32} /><h3>Nenhuma vaga encontrada</h3><p>Tente remover algum filtro ou buscar por outro termo.</p><button className="secondary-button" onClick={() => { setSearch(''); setWorkplace('Todas'); setExperience('Todos') }}>Limpar filtros</button></div>
        )}
      </section>
    </div>
  )
}
