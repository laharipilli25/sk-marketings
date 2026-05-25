import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import skLogo from '../assets/sklogo.png'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Clients', path: '/clients' },
  { label: 'Contact', path: '/contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className={`w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl border-2 ${scrolled ? 'bg-white border-orange-500' : 'bg-white/10 border-white/20'
              } p-1`}
          >
            <img src={skLogo} alt="Logo" className="w-full h-full object-contain" />
          </motion.div>

          <div>
            <div className={`font-bold text-lg ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              SK Marketings
            </div>
            <div className={`text-[10px] uppercase font-black tracking-widest ${scrolled ? 'text-orange-500' : 'text-orange-400'}`}>
              Business Consultancy
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-bold transition-all ${
                location.pathname === link.path
                  ? scrolled ? 'bg-orange-500 text-white px-4 py-1.5 rounded-md shadow-md font-black shadow-orange-100' : 'bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-md border border-white/35 font-black shadow-lg'
                  : scrolled ? 'px-3 py-2 text-slate-700 hover:text-orange-500' : 'px-3 py-2 text-white/90 hover:text-orange-400'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* ✅ LOGIN - Unified for Admin & Agent */}
          <Link
            to="/login"
            className="ml-4 bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-black hover:bg-orange-600 transition-all shadow-md active:scale-95"
          >
            Login
          </Link>

          {/* ✅ CONSULTATION BUTTON */}
          <Link
            to="/contact"
            className="ml-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-2.5 px-6 rounded-xl transition-all shadow-lg"
          >
            Get Consultation
          </Link>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className={`md:hidden p-2 ${scrolled ? 'text-slate-900' : 'text-white'}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="flex flex-col px-6 py-6 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl font-bold ${location.pathname === link.path
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-700 hover:bg-orange-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="grid grid-cols-2 gap-3 mt-2">
                {/* BOTH MOBILE BUTTONS MATCHED */}
                <Link
                  to="/user-login"
                  className="text-center bg-orange-500 text-white py-3 rounded-lg font-black text-sm shadow-sm"
                >
                  User
                </Link>
                <Link
                  to="/admin-login"
                  className="text-center bg-orange-500 text-white py-3 rounded-lg font-black text-sm shadow-sm"
                >
                  Admin
                </Link>
              </div>

              <Link
                to="/contact"
                className="text-center bg-slate-900 text-white py-4 rounded-xl font-black mt-2 shadow-md"
              >
                Get Consultation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar