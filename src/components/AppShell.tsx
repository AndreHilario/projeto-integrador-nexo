import { BriefcaseBusiness, Building2, ChevronDown, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Logo } from './Logo'

export function AppShell() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  if (!currentUser) return null

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
  const links = currentUser.role === 'candidate' ? candidateLinks : companyLinks

  const handleLogout = () => {
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
        <div className="account-area">
          <div className="avatar">{currentUser.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
          <span className="account-name">{currentUser.name.split(' ')[0]}</span>
          <ChevronDown size={15} className="account-chevron" />
          <button className="icon-button logout-button" type="button" onClick={handleLogout} aria-label="Sair da conta">
            <LogOut size={18} />
          </button>
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
