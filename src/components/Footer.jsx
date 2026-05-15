import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaUser, FaUserShield } from 'react-icons/fa'
import skfbg from '../assets/skfbg.png'
import skLogo from '../assets/sklogo.png'

function Footer() {
  const year = new Date().getFullYear()

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <footer className="relative bg-orange-900 text-white overflow-hidden">
      {/* ─── BACKGROUND IMAGE LAYER ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${skfbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-200/10 via-orange-100/10 to-white/10 pointer-events-none" />

      {/* Top Accent Band */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="relative z-10 bg-gradient-to-r from-orange-300 via-white to-orange-300 h-1 origin-left"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand & Logo Section */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] border-2 border-orange-500 cursor-pointer overflow-hidden p-1"
              >
                <img
                  src={skLogo}
                  alt="SK Marketings Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div>
                <div className="font-heading font-bold text-xl text-white tracking-tight leading-tight">SK Marketings</div>
                <div className="text-[10px] text-orange-400 tracking-[0.2em] uppercase font-black">Business Consultancy</div>
              </div>
            </div>
            <p className="text-white/90 font-body text-sm leading-relaxed mb-6">
              Empowering businesses across India and beyond with expert consultancy, financial guidance, and digital marketing solutions.
            </p>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20"
            >
              <span className="text-xl">🇮🇳</span>
              <span className="text-white font-body text-xs font-bold uppercase tracking-wider">Proudly Made in India</span>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg font-bold mb-6 text-white border-b-2 border-orange-500 w-fit pb-1">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Our Services', path: '/services' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'User Login', path: '/user-login', icon: <FaUser className="text-[10px]" /> },
                { label: 'Admin Portal', path: '/admin-login', icon: <FaUserShield className="text-[10px]" /> },
              ].map((link) => (
                <motion.li key={link.path} whileHover={{ x: 8 }}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-white transition-all duration-200 font-body text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full group-hover:bg-white transition-colors" />
                    <span className="flex items-center gap-2">
                      {link.icon && <span className="text-orange-400 group-hover:text-white">{link.icon}</span>}
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg font-bold mb-6 text-white border-b-2 border-orange-500 w-fit pb-1">Services</h4>
            <ul className="space-y-3">
              {['MSME Services', 'Business Promotions', 'Financial Services', 'Digital Marketing', 'Brand Strategy', 'Market Research'].map((s) => (
                <motion.li key={s} whileHover={{ x: 8 }}>
                  <Link
                    to="/services"
                    className="text-white/80 hover:text-white transition-all duration-200 font-body text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full group-hover:bg-white transition-colors" />
                    {s}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg font-bold mb-6 text-white border-b-2 border-orange-500 w-fit pb-1">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <FaMapMarkerAlt className="text-orange-400 mt-1 group-hover:text-white transition-colors flex-shrink-0" />
                <a
                  href="https://maps.app.goo.gl/MyqMMtETyY26mtfR6?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white font-body text-sm transition-colors"
                >
                  Sk Marketings, Tirupati, Andhra Pradesh 517502
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <FaPhone className="text-orange-400 group-hover:text-white transition-colors" />
                <a href="tel:+917995653959" className="text-white/90 hover:text-white font-body text-sm transition-colors">
                  +91 7995653959
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <FaEnvelope className="text-orange-400 group-hover:text-white transition-colors" />
                <a href="mailto:Skmarketingstpt@gmail.com" className="text-white/90 hover:text-white font-body text-sm transition-colors break-all">
                  skmarketingstpt@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-4">
              {[
                { icon: <FaInstagram size={20} />, color: 'hover:bg-orange-500', link: 'https://instagram.com' },
                { icon: <FaWhatsapp size={20} />, color: 'hover:bg-green-500', link: 'https://wa.me/918501011026' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-white text-orange-600 ${social.color} hover:text-white rounded-lg flex items-center justify-center transition-colors duration-300 shadow-lg`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Bottom Bar - BOLD & THICK */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 border-t border-white/20 bg-black/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white font-body text-sm font-black text-center tracking-wide uppercase">
            © {year} SK MARKETINGS. ALL RIGHTS RESERVED.
          </p>
          <motion.p
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-white font-body text-sm flex items-center gap-2 font-black tracking-wide uppercase"
          >
            DEVELOPED WITH <span className="text-orange-500 text-xl">⚡</span> IN INDIA 🇮🇳
          </motion.p>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer