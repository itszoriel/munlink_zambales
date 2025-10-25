import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MarketplacePage from './pages/MarketplacePage'
import Layout from './components/Layout'
import AnnouncementsPage from './pages/AnnouncementsPage'
import About from '@/pages/About'
import DocumentsPage from './pages/DocumentsPage'
import DocumentRequestPage from './pages/DocumentRequestPage'
import IssuesPage from './pages/IssuesPage'
import BenefitsPage from './pages/BenefitsPage'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyEmailPage from './pages/VerifyEmailPage'
import UploadIdPage from './pages/UploadIdPage'
import ErrorBoundary from './components/ErrorBoundary'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<ErrorBoundary><RegisterPage /></ErrorBoundary>} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="upload-id" element={<ProtectedRoute allow={["resident"]}><UploadIdPage /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute allow={["resident"]}><DashboardPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute allow={["resident"]}><ProfilePage /></ProtectedRoute>} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="about" element={<About />} />
          <Route path="documents" element={<ProtectedRoute allow={["resident","admin","public"]}><DocumentsPage /></ProtectedRoute>} />
          <Route path="documents/requests/:id" element={<LegacyDocRedirect />} />
          <Route path="dashboard/requests/:id" element={<ProtectedRoute allow={["resident"]}><DocumentRequestPage /></ProtectedRoute>} />
          <Route path="issues" element={<ProtectedRoute allow={["resident","admin","public"]}><IssuesPage /></ProtectedRoute>} />
          <Route path="benefits" element={<ProtectedRoute allow={["resident","admin","public"]}><BenefitsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

function LegacyDocRedirect() {
  const location = useLocation()
  const to = location.pathname.replace('/documents/requests', '/dashboard/requests')
  return <Navigate to={to} replace />
}

