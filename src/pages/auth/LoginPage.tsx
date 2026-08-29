import { ArrowRight, BriefcaseBusiness, CheckCircle2, Eye, EyeOff, Sparkles, UsersRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { useApp } from '../../context/useApp'
import type { UserRole } from '../../types'

const demoCredentials = {
  candidate: { email: 'lucas@nexo.com', password: '123456' },
  company: { email: 'mariana@auroratech.com', password: '123456' },
}

export function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('candidate')
  const [email, setEmail] = useState(demoCredentials.candidate.email)
  const [password, setPassword] = useState(demoCredentials.candidate.password)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const selectRole = (nextRole: UserRole) => {
    setRole(nextRole)
    setEmail(demoCredentials[nextRole].email)
    setPassword(demoCredentials[nextRole].password)
    setError('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!login(email, password, role)) {
      setError('E-mail ou senha não conferem. Tente novamente.')
      return
    }
    navigate(role === 'candidate' ? '/vagas' : '/empresa')
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="auth-showcase-inner">
          <Logo />
          <div className="showcase-copy">
            <span className="eyebrow light"><Sparkles size={15} /> O seu próximo passo começa aqui</span>
            <h1>Talento e oportunidade, no mesmo lugar.</h1>
            <p>Uma experiência mais simples e transparente para quem busca crescer e para quem está construindo grandes times.</p>
          </div>
          <div className="showcase-preview glass-dark">
            <div className="preview-head">
              <div><span>Vaga em destaque</span><strong>Desenvolvedor Front-end</strong></div>
              <div className="company-logo company-logo-blue">AU</div>
            </div>
            <div className="preview-tags"><span>Híbrido</span><span>Júnior</span><span>São Paulo</span></div>
            <div className="preview-match"><CheckCircle2 size={18} /><span><strong>92% de compatibilidade</strong> com o seu perfil</span></div>
          </div>
          <div className="showcase-stats">
            <div><BriefcaseBusiness size={20} /><span><strong>+2.400</strong> vagas ativas</span></div>
            <div><UsersRound size={20} /><span><strong>+800</strong> empresas conectadas</span></div>
          </div>
        </div>
      </section>
      <section className="auth-panel">
        <div className="mobile-auth-logo"><Logo /></div>
        <div className="auth-form-wrap">
          <span className="eyebrow">Bem-vindo de volta</span>
          <h2>Entre na sua conta</h2>
          <p className="auth-intro">Acesse oportunidades ou continue construindo o seu time.</p>
          <div className="segmented" role="tablist" aria-label="Tipo de acesso">
            <button type="button" className={role === 'candidate' ? 'active' : ''} onClick={() => selectRole('candidate')}>Sou candidato</button>
            <button type="button" className={role === 'company' ? 'active' : ''} onClick={() => selectRole('company')}>Sou empresa</button>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              E-mail
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" required />
            </label>
            <label>
              Senha
              <span className="password-field">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <div className="form-between">
              <label className="check-label"><input type="checkbox" defaultChecked /> Lembrar de mim</label>
              <button type="button" className="link-button">Esqueci minha senha</button>
            </div>
            {error && <div className="inline-error">{error}</div>}
            <button className="primary-button auth-submit" type="submit">Entrar <ArrowRight size={18} /></button>
          </form>
          <p className="signup-prompt">Ainda não tem uma conta? <Link to={role === 'candidate' ? '/cadastro/candidato' : '/cadastro/empresa'}>Cadastre-se grátis</Link></p>
          <p className="demo-hint">Os dados de demonstração já estão preenchidos.</p>
        </div>
      </section>
    </main>
  )
}
