import { BriefcaseBusiness, Building2, ChevronDown, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Logo } from './Logo'

const candidateLinks = [
  { to: '/vagas', label: 'Explorar vagas', icon: BriefcaseBusiness },
  { to: '/candidaturas', label: 'Candidaturas', icon: LayoutDashboard },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]
const companyLinks = [
  { to: '/empresa', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/empresa/vagas/nova', label: 'Nova vaga', icon: BriefcaseBusiness },
  { to: '/empresa/perfil', label: 'Empresa', icon: Building2 },
]

export function AppShell() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!accountOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [accountOpen])

  if (!currentUser) return null

  const links = currentUser.role === 'candidate' ? candidateLinks : companyLinks
  const profilePath = currentUser.role === 'candidate' ? '/perfil' : '/empresa/perfil'
  const initials = currentUser.name.split(' ').map((word) => word[0]).slice(0, 2).join('')
  const roleLabel = currentUser.role === 'candidate' ? 'Candidato' : 'Conta empresarial'

  const handleLogout = () => {
    setAccountOpen(false)
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      <header className="topbar glass">
        <NavLink to={currentUser.role === 'candidate' ? '/vagas' : '/empresa'} className="logo-link">
          <Logo />
        </NavLink>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/empresa'}>{label}</NavLink>
          ))}
        </nav>
        <div className="account-area" ref={accountRef}>
          <button
            className="account-trigger"
            type="button"
            aria-haspopup="menu"
            aria-expanded={accountOpen}
            aria-controls="account-menu"
            onClick={() => setAccountOpen((open) => !open)}
          >
            <span className="avatar">{initials}</span>
            <span className="account-name">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown size={15} className={`account-chevron ${accountOpen ? 'open' : ''}`} />
          </button>
          {accountOpen && (
            <div className="account-menu surface" id="account-menu" role="menu">
              <div className="account-menu-profile">
                <span className="avatar large-avatar">{initials}</span>
                <span><strong>{currentUser.name}</strong><small>{currentUser.email}</small></span>
              </div>
              <span className="account-role">{roleLabel}</span>
              <div className="account-menu-actions">
                <NavLink to={profilePath} role="menuitem" onClick={() => setAccountOpen(false)}>
                  {currentUser.role === 'candidate' ? <UserRound size={18} /> : <Building2 size={18} />}
                  <span><strong>{currentUser.role === 'candidate' ? 'Meu perfil' : 'Dados da empresa'}</strong><small>Visualizar e editar informações</small></span>
                </NavLink>
                <button type="button" role="menuitem" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span><strong>Sair da conta</strong><small>Voltar para a tela de acesso</small></span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="page-container"><Outlet /></main>
      <nav className="mobile-tabbar glass" aria-label="Navegação principal">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/empresa'}>
            <Icon size={21} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
