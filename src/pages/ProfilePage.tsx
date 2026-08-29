import { Building2, CheckCircle2, FileText, Save, UploadCloud, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useApp } from '../context/useApp'
import type { CandidateProfile, CompanyProfile } from '../types'

export function ProfilePage() {
  const { currentUser, updateUser } = useApp()
  const [saved, setSaved] = useState(false)
  const [resumeName, setResumeName] = useState('')

  if (!currentUser) return null
  const isCandidate = currentUser.role === 'candidate'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const profile: CandidateProfile | CompanyProfile = isCandidate
      ? {
          kind: 'candidate',
          phone: String(data.get('phone')),
          city: String(data.get('city')),
          headline: String(data.get('headline')),
          area: String(data.get('area')),
          experience: String(data.get('experience')) as CandidateProfile['experience'],
          preferredWorkplace: String(data.get('workplace')) as CandidateProfile['preferredWorkplace'],
          skills: String(data.get('skills')).split(',').map((item) => item.trim()).filter(Boolean),
          resumeName: resumeName || (currentUser.profile as CandidateProfile).resumeName,
          bio: String(data.get('bio')),
        }
      : {
          kind: 'company',
          legalName: String(data.get('legalName')),
          document: String(data.get('document')),
          sector: String(data.get('sector')),
          size: String(data.get('size')),
          city: String(data.get('city')),
          website: String(data.get('website')),
          about: String(data.get('about')),
        }
    updateUser(String(data.get('name')), profile)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  const candidate = currentUser.profile as CandidateProfile
  const company = currentUser.profile as CompanyProfile

  return (
    <div className="page-stack narrow-content">
      <section className="page-heading profile-heading">
        <div><span className="eyebrow">{isCandidate ? 'Seu perfil profissional' : 'Perfil da organização'}</span><h1>{isCandidate ? 'Perfil' : 'Dados da empresa'}</h1><p>Mantenha suas informações atualizadas para uma experiência melhor.</p></div>
        <div className="profile-avatar">{isCandidate ? <UserRound size={29} /> : <Building2 size={29} />}</div>
      </section>
      <form className="profile-form surface" onSubmit={handleSubmit}>
        <div className="form-section-head"><div><h2>Informações principais</h2><p>Esses dados ficam visíveis nas interações da plataforma.</p></div></div>
        {isCandidate ? (
          <>
            <div className="form-grid two"><label>Nome completo<input name="name" defaultValue={currentUser.name} required /></label><label>Telefone<input name="phone" defaultValue={candidate.phone} required /></label></div>
            <div className="form-grid two"><label>Título profissional<input name="headline" defaultValue={candidate.headline} required /></label><label>Cidade<input name="city" defaultValue={candidate.city} required /></label></div>
            <div className="form-grid three"><label>Área<select name="area" defaultValue={candidate.area}><option>Tecnologia</option><option>Design</option><option>Marketing</option><option>Finanças</option><option>Operações</option></select></label><label>Experiência<select name="experience" defaultValue={candidate.experience}><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></label><label>Preferência<select name="workplace" defaultValue={candidate.preferredWorkplace}><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></label></div>
            <label>Competências<input name="skills" defaultValue={candidate.skills.join(', ')} required /><small>Separe por vírgulas</small></label>
            <label>Sobre você<textarea name="bio" rows={5} defaultValue={candidate.bio} required /></label>
            <label className="upload-area profile-upload"><input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? '')} />{resumeName ? <UploadCloud size={25} /> : <FileText size={25} />}<span><strong>{resumeName || candidate.resumeName}</strong><small>{resumeName ? 'Novo currículo selecionado' : 'Clique para substituir seu currículo'}</small></span></label>
          </>
        ) : (
          <>
            <div className="form-grid two"><label>Nome do responsável<input name="name" defaultValue={currentUser.name} required /></label><label>Razão social<input name="legalName" defaultValue={company.legalName} required /></label></div>
            <div className="form-grid two"><label>CNPJ<input name="document" defaultValue={company.document} required /></label><label>Cidade<input name="city" defaultValue={company.city} required /></label></div>
            <div className="form-grid three"><label>Segmento<select name="sector" defaultValue={company.sector}><option>Tecnologia</option><option>Serviços financeiros</option><option>Varejo</option><option>Educação</option><option>Saúde</option></select></label><label>Tamanho<select name="size" defaultValue={company.size}><option>1–10 pessoas</option><option>11–50 pessoas</option><option>51–200 pessoas</option><option>201–500 pessoas</option><option>+500 pessoas</option></select></label><label>Site<input name="website" defaultValue={company.website} /></label></div>
            <label>Sobre a empresa<textarea name="about" rows={6} defaultValue={company.about} required /></label>
          </>
        )}
        <div className="form-actions"><span>{saved && <><CheckCircle2 size={17} /> Alterações salvas</>}</span><button className="primary-button" type="submit"><Save size={17} /> Salvar alterações</button></div>
      </form>
    </div>
  )
}
