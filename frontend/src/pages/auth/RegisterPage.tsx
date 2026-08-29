import { ArrowLeft, ArrowRight, Building2, Check, FileText, UploadCloud, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { useApp } from '../../context/useApp'
import type { CandidateProfile, CompanyProfile, UserRole } from '../../types'

export function RegisterPage({ role }: { role: UserRole }) {
  const { register } = useApp()
  const navigate = useNavigate()
  const [resumeName, setResumeName] = useState('')
  const isCandidate = role === 'candidate'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name'))
    const email = String(data.get('email'))
    const password = String(data.get('password'))

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
          resumeName: resumeName || 'Curriculo.pdf',
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

    register({ role, name, email, password, profile })
    navigate(isCandidate ? '/vagas' : '/empresa')
  }

  return (
    <main className="register-page">
      <header className="register-header">
        <Logo />
        <span>Já possui uma conta? <Link to="/">Entrar</Link></span>
      </header>
      <div className="register-layout">
        <aside className="register-aside">
          <Link to="/" className="back-link"><ArrowLeft size={17} /> Voltar</Link>
          <div className="register-icon">{isCandidate ? <UserRound size={28} /> : <Building2 size={28} />}</div>
          <span className="eyebrow">Crie sua conta</span>
          <h1>{isCandidate ? 'Encontre uma vaga que combine com você.' : 'Encontre as pessoas certas para o seu time.'}</h1>
          <p>{isCandidate ? 'Conte o que você sabe fazer e receba oportunidades mais relevantes.' : 'Publique vagas, organize candidaturas e conduza seleções com clareza.'}</p>
          <ul className="benefit-list">
            {(isCandidate
              ? ['Perfil profissional completo', 'Candidatura rápida', 'Status sempre atualizado']
              : ['Publicação de vagas', 'Ranking de compatibilidade', 'Pipeline de candidatos']
            ).map((item) => <li key={item}><Check size={17} /> {item}</li>)}
          </ul>
        </aside>
        <section className="register-card surface">
          <div className="section-heading">
            <span className="step-chip">Etapa única</span>
            <h2>{isCandidate ? 'Seus dados profissionais' : 'Dados da empresa'}</h2>
            <p>Você poderá editar essas informações quando quiser.</p>
          </div>
          <form className="register-form" onSubmit={handleSubmit}>
            {isCandidate ? (
              <>
                <div className="form-grid two">
                  <label>Nome completo<input name="name" placeholder="Como devemos chamar você?" required /></label>
                  <label>Telefone<input name="phone" placeholder="(11) 99999-9999" required /></label>
                </div>
                <div className="form-grid two">
                  <label>E-mail<input type="email" name="email" placeholder="voce@exemplo.com" required /></label>
                  <label>Senha<input type="password" name="password" minLength={6} placeholder="Mínimo de 6 caracteres" required /></label>
                </div>
                <div className="form-grid two">
                  <label>Título profissional<input name="headline" placeholder="Ex.: Desenvolvedor Front-end" required /></label>
                  <label>Cidade<input name="city" placeholder="São Paulo, SP" required /></label>
                </div>
                <div className="form-grid three">
                  <label>Área<select name="area" defaultValue="Tecnologia"><option>Tecnologia</option><option>Design</option><option>Marketing</option><option>Finanças</option><option>Operações</option></select></label>
                  <label>Experiência<select name="experience" defaultValue="Júnior"><option>Júnior</option><option>Pleno</option><option>Sênior</option></select></label>
                  <label>Modalidade<select name="workplace" defaultValue="Híbrido"><option>Remoto</option><option>Híbrido</option><option>Presencial</option></select></label>
                </div>
                <label>Competências<input name="skills" placeholder="React, TypeScript, Figma" required /><small>Separe por vírgulas</small></label>
                <label>Sobre você<textarea name="bio" rows={4} placeholder="Uma apresentação breve sobre a sua trajetória e objetivos" required /></label>
                <label className="upload-area">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResumeName(event.target.files?.[0]?.name ?? '')} />
                  {resumeName ? <FileText size={27} /> : <UploadCloud size={27} />}
                  <span><strong>{resumeName || 'Anexe seu currículo'}</strong><small>PDF ou DOC, até 5 MB</small></span>
                </label>
              </>
            ) : (
              <>
                <div className="form-grid two">
                  <label>Nome da empresa<input name="legalName" placeholder="Razão social" required /></label>
                  <label>CNPJ<input name="document" placeholder="00.000.000/0001-00" required /></label>
                </div>
                <div className="form-grid two">
                  <label>Seu nome<input name="name" placeholder="Responsável pelo recrutamento" required /></label>
                  <label>E-mail corporativo<input type="email" name="email" placeholder="voce@empresa.com" required /></label>
                </div>
                <div className="form-grid two">
                  <label>Senha<input type="password" name="password" minLength={6} placeholder="Mínimo de 6 caracteres" required /></label>
                  <label>Cidade<input name="city" placeholder="São Paulo, SP" required /></label>
                </div>
                <div className="form-grid three">
                  <label>Segmento<select name="sector" defaultValue="Tecnologia"><option>Tecnologia</option><option>Serviços financeiros</option><option>Varejo</option><option>Educação</option><option>Saúde</option></select></label>
                  <label>Tamanho<select name="size" defaultValue="51–200 pessoas"><option>1–10 pessoas</option><option>11–50 pessoas</option><option>51–200 pessoas</option><option>201–500 pessoas</option><option>+500 pessoas</option></select></label>
                  <label>Site<input name="website" placeholder="empresa.com.br" /></label>
                </div>
                <label>Sobre a empresa<textarea name="about" rows={5} placeholder="Conte sobre a cultura, missão e o que torna a empresa especial" required /></label>
              </>
            )}
            <label className="terms-label"><input type="checkbox" required /> Li e concordo com os Termos de Uso e Política de Privacidade.</label>
            <button className="primary-button register-submit" type="submit">Criar conta <ArrowRight size={18} /></button>
          </form>
        </section>
      </div>
    </main>
  )
}
