import { AlertCircle } from 'lucide-react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppShell } from './components/AppShell'
import { Logo } from './components/Logo'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/useApp'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ApplicationsPage } from './pages/candidate/ApplicationsPage'
import { JobDetailPage } from './pages/candidate/JobDetailPage'
import { JobsPage } from './pages/candidate/JobsPage'
import { CompanyDashboardPage } from './pages/company/CompanyDashboardPage'
import { CompanyJobDetailPage } from './pages/company/CompanyJobDetailPage'
import { JobFormPage } from './pages/company/JobFormPage'
import type { UserRole } from './types'

function ProtectedRoute({ role }: { role: UserRole }) {
  const { currentUser } = useApp()
  if (!currentUser) return <Navigate to="/" replace />
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'candidate' ? '/vagas' : '/empresa'} replace />
  return <AppShell />
}

function RootRoute() {
  const { currentUser } = useApp()
  if (currentUser) return <Navigate to={currentUser.role === 'candidate' ? '/vagas' : '/empresa'} replace />
  return <LoginPage />
}

function AppRoutes() {
  const { loading, error, currentUser } = useApp()

  if (loading) return <div className="loading-screen"><Logo /><span className="loader" /><p>Preparando sua experiência...</p></div>

  return (
    <>
      {error && <div className="global-error"><AlertCircle size={18} />{error}</div>}
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/cadastro/candidato" element={currentUser ? <Navigate to="/vagas" replace /> : <RegisterPage role="candidate" />} />
        <Route path="/cadastro/empresa" element={currentUser ? <Navigate to="/empresa" replace /> : <RegisterPage role="company" />} />
        <Route element={<ProtectedRoute role="candidate" />}>
          <Route path="/vagas" element={<JobsPage />} />
          <Route path="/vagas/:jobId" element={<JobDetailPage />} />
          <Route path="/candidaturas" element={<ApplicationsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
        <Route element={<ProtectedRoute role="company" />}>
          <Route path="/empresa" element={<CompanyDashboardPage />} />
          <Route path="/empresa/vagas/nova" element={<JobFormPage />} />
          <Route path="/empresa/vagas/:jobId" element={<CompanyJobDetailPage />} />
          <Route path="/empresa/vagas/:jobId/editar" element={<JobFormPage />} />
          <Route path="/empresa/perfil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider><AppRoutes /></AppProvider>
    </BrowserRouter>
  )
}

export default App
