import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import DashboardHeader from '../components/DashboardHeader'

function Layout({ children }) {
  const location = useLocation()
  const isDashboard = location.pathname.includes('dashboard')
  const isAuthPage = location.pathname.includes('login') || location.pathname.includes('signup') || location.pathname.includes('forgot-password') || location.pathname.includes('reset-password')

  // Extract tab from search params if needed, or just let children handle their state
  // For a truly integrated sidebar, we might eventually move state to a context.
  
  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default Layout
