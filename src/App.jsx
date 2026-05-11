import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'   // ✅ ADDED

import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Clients from './pages/Clients'
import Contact from './pages/Contact'
import WhatsAppButton from './components/WhatsAppButton'

// ✅ EXISTING LOGIN IMPORTS
import UserLogin from './pages/UserLogin'
import AdminLogin from './pages/AdminLogin'

// ✅ DASHBOARD IMPORTS
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import SignUp from './pages/SignUp'
import ViewPage from './pages/ViewPage'

function App() {
  const location = useLocation()

  // ✅ SCROLL FIX (ONLY ADD THIS)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth Routes - Single Login */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/user-login" element={<UserLogin />} />

            {/* Dashboard Routes */}
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Legacy Routes (for backward compatibility) */}
            <Route path="/user-dashboard" element={<AgentDashboard />} />
            <Route path="/admin-login" element={<UserLogin />} />

            {/* Other Routes */}
            <Route path="/view/:id" element={<ViewPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user-signup" element={<SignUp />} />

          </Routes>
        </AnimatePresence>
      </Layout>

      <WhatsAppButton />
    </>
  )
}

export default App