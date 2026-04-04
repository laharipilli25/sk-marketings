import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaGlobeAsia } from 'react-icons/fa'
import SEO from '../components/SEO'
import { pageTransition, staggerContainer, staggerItem } from '../utils/animations'
import gmLogo from '../assets/genius-minds-logo.png'

// ─── Rotating 3D Cube Component ───────────────────────────────────────────────
function ServiceCube() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '8px 0 4px' }}>
      <style>{`
        .sk-cube-scene {
          width: 160px;
          height: 160px;
          perspective: 500px;
        }
        .sk-cube {
          width: 160px;
          height: 160px;
          position: relative;
          transform-style: preserve-3d;
          animation: skSpin 14s linear infinite;
        }
        .sk-face {
          position: absolute;
          width: 160px;
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          backface-visibility: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
        }
        .sk-face-front  { transform: rotateY(  0deg) translateZ(80px); }
        .sk-face-back   { transform: rotateY(180deg) translateZ(80px); }
        .sk-face-right  { transform: rotateY( 90deg) translateZ(80px); }
        .sk-face-left   { transform: rotateY(-90deg) translateZ(80px); }
        .sk-face-top    { transform: rotateX( 90deg) translateZ(80px); }
        .sk-face-bottom { transform: rotateX(-90deg) translateZ(80px); }
        @keyframes skSpin {
          0%   { transform: rotateX(12deg) rotateY(0deg);   }
          100% { transform: rotateX(12deg) rotateY(360deg); }
        }
      `}</style>

      <span className="text-[9px] font-black tracking-[0.2em] uppercase text-orange-500 font-heading">Our Focus</span>

      <div className="sk-cube-scene">
        <div className="sk-cube text-white">
          <div className="sk-face sk-face-front">
            <span className="text-2xl mb-1">🏛️</span>
            <div className="font-bold text-xs uppercase tracking-tighter">MSME</div>
          </div>
          <div className="sk-face sk-face-back">
            <span className="text-2xl mb-1">📣</span>
            <div className="font-bold text-xs uppercase tracking-tighter">Promo</div>
          </div>
          <div className="sk-face sk-face-right">
            <span className="text-2xl mb-1">📈</span>
            <div className="font-bold text-xs uppercase tracking-tighter">Finance</div>
          </div>
          <div className="sk-face sk-face-left">
            <span className="text-2xl mb-1">🌐</span>
            <div className="font-bold text-xs uppercase tracking-tighter">Digital</div>
          </div>
          <div className="sk-face sk-face-top">
            <span className="text-2xl mb-1">🇮🇳</span>
            <div className="font-bold text-xs uppercase tracking-tighter">India</div>
          </div>
          <div className="sk-face sk-face-bottom">
            <span className="text-2xl mb-1">⭐</span>
            <div className="font-bold text-xs uppercase tracking-tighter">500+</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const industries = [
  { label: 'All', value: 'all' },
  { label: 'Elite Partners', value: 'elite' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Retail', value: 'retail' },
  { label: 'Technology', value: 'technology' },
]

const clients = [
  {
    name: 'Genius Minds Making Code',industry: 'elite',location: 'Madanapalli, India',initials: 'GM',logo: gmLogo,color: 'from-orange-500 to-orange-600' },
  { name: 'Balaji Exports', industry: 'manufacturing', location: 'Tirupati, India', initials: 'BE', color: 'from-orange-400 to-orange-500' },
  { name: 'MedCare Clinics', industry: 'healthcare', location: 'Hyderabad, India', initials: 'MC', color: 'from-orange-300 to-orange-400' },
  { name: 'FreshMart Retail', industry: 'retail', location: 'Chennai, India', initials: 'FM', color: 'from-orange-400 to-orange-500' },
  { name: 'TechNova Solutions', industry: 'technology', location: 'Bangalore, India', initials: 'TN', color: 'from-orange-300 to-orange-400' },
  { name: 'Skyline Realtors', industry: 'realestate', location: 'Mumbai, India', initials: 'SR', color: 'from-orange-400 to-orange-500' },
  { name: 'BrightMinds Academy', industry: 'education', location: 'Delhi, India', initials: 'BA', color: 'from-orange-300 to-orange-400' },
  { name: 'Gulf Trade LLC', industry: 'manufacturing', location: 'Dubai, UAE', initials: 'GT', color: 'from-orange-400 to-orange-500' },
  { name: 'Müller Handels GmbH', industry: 'retail', location: 'Frankfurt, Germany', initials: 'MH', color: 'from-orange-300 to-orange-400' },
]

const testimonials = [
  {
    name: 'Sasi Kumar Yadav',
    company: 'Sk Marketings, Tirupati',
    text: "SK Marketings completely transformed our MSME journey. Their team guided us through every step.",
    flag: '🇮🇳',
  },
  {
    name: 'Priya Sharma',
    company: 'TechNova Solutions, Bangalore',
    text: 'Our online presence grew 3x within just 6 months. Every rupee spent delivered results.',
    flag: '🇮🇳',
  },
]

const geographies = [
  { country: 'India', flag: '🇮🇳', count: '400+', desc: 'Across states', code: 'IN' },
  { country: 'UAE', flag: '🇦🇪', count: '30+', desc: 'Dubai, Abu Dhabi', code: 'AE' },
  { country: 'Germany', flag: '🇩🇪', count: '15+', desc: 'Frankfurt, Berlin', code: 'DE' },
  { country: 'Saudi Arabia', flag: '🇸🇦', count: '20+', desc: 'Riyadh, Jeddah', code: 'SA' },
  { country: 'USA', flag: '🇺🇸', count: '10+', desc: 'New York, Texas', code: 'US' },
]

function Clients() {
  const [activeIndustry, setActiveIndustry] = useState('all')
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  const filtered = activeIndustry === 'all' ? clients : clients.filter((c) => c.industry === activeIndustry)
  const prev = () => setTestimonialIdx((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () => setTestimonialIdx((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  return (
    <motion.div {...pageTransition}>
      <SEO title="Our Clients" description="Serving 500+ clients across India and worldwide." />

      {/* Hero Section */}
      <section className="relative pt-28 pb-14 bg-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center md:text-left">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 bg-white text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 shadow-xl uppercase tracking-tighter">
              🤝 Our Growing Family
            </motion.div>
            <motion.h1 variants={staggerItem} className="font-heading text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-tight">
              Trusted <span className="underline decoration-white/30">Globally</span>
            </motion.h1>
            <motion.p variants={staggerItem} className="font-body text-white text-lg font-bold opacity-90">
              Supporting 500+ businesses with local expertise.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Geographic Presence - BORDERS ADDED HERE */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {geographies.map((geo) => (
              <motion.div 
                key={geo.country} 
                className="bg-white border-4 border-orange-500 p-6 rounded-2xl text-center group transition-all hover:shadow-xl hover:shadow-orange-100/50" 
                whileHover={{ y: -5 }}
              >
                <div className="font-heading text-xl font-black text-slate-900 mb-1">{geo.code}</div>
                <div className="font-heading text-2xl font-black text-orange-500">{geo.count}</div>
                <div className="font-body font-black text-slate-400 uppercase text-[9px] tracking-widest">{geo.country}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Grid */}
      <section className="py-12 bg-orange-50/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* LEFT — Cube card */}
            <div className="w-full lg:w-64 flex-shrink-0 mx-auto lg:mx-0">
              <div className="bg-white border-2 border-orange-50 shadow-2xl shadow-orange-100/50 rounded-[2rem] p-6 flex flex-col items-center group hover:border-orange-500 transition-colors">
                <ServiceCube />
                <div className="mt-4 text-center">
                  <h3 className="font-heading text-sm font-black text-slate-900 uppercase tracking-tighter">SK Marketings</h3>
                </div>
              </div>
            </div>

            {/* RIGHT — Filter & Grid */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                {industries.map((ind) => (
                  <button
                    key={ind.value}
                    onClick={() => setActiveIndustry(ind.value)}
                    className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all ${
                      activeIndustry === ind.value ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white border-2 border-orange-50 text-slate-500 hover:border-orange-500 hover:text-orange-500'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>

             <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
  <AnimatePresence>
    {filtered.map((client) => (
      <motion.div
        key={client.name}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-2 border-orange-50 p-4 rounded-2xl text-center shadow-sm hover:border-orange-500 transition-all hover:shadow-xl hover:shadow-orange-100/30"
      >

        {/* LOGO / INITIALS */}
        <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-xl shadow-md overflow-hidden bg-white">
          {client.name === 'Genius Minds Making Code' ? (
            <img
              src={client.logo}
              alt={client.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${client.color} flex items-center justify-center text-white font-black text-sm`}>
              {client.initials}
            </div>
          )}
        </div>

        {/* NAME */}
        <div className="font-heading font-black text-slate-900 text-[11px] uppercase truncate tracking-tight">
          {client.name}
        </div>

        {/* LOCATION */}
        <div className="text-[9px] text-orange-500 font-bold uppercase">
          {client.location}
        </div>

      </motion.div>
    ))}
  </AnimatePresence>
</motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-orange-500 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div key={testimonialIdx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative border-2 border-orange-300">
              <FaQuoteLeft className="text-orange-50 text-4xl absolute top-6 left-6" />
              <p className="relative z-10 font-body text-slate-700 text-lg md:text-xl leading-relaxed font-bold italic mb-8">
                "{testimonials[testimonialIdx].text}"
              </p>
              <div className="flex items-center gap-4 border-t border-orange-50 pt-6">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-100">
                  {testimonials[testimonialIdx].name.charAt(0)}
                </div>
                <div>
                  <div className="font-heading font-black text-slate-900 text-sm uppercase tracking-tight">{testimonials[testimonialIdx].name}</div>
                  <div className="font-body text-orange-500 font-black text-[10px] uppercase tracking-widest">{testimonials[testimonialIdx].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={prev} className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><FaChevronLeft size={16} /></button>
            <button onClick={next} className="w-10 h-10 bg-white text-orange-500 rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform"><FaChevronRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* Industries List */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-black text-slate-900 uppercase mb-8 tracking-tighter">Sectors We <span className="text-orange-500">Empower</span></h2>
          <div className="flex flex-wrap justify-center gap-2">
            {['Manufacturing', 'Healthcare', 'Retail', 'Technology', 'Real Estate', 'Education'].map((ind) => (
              <span key={ind} className="bg-orange-50/50 text-orange-600 border-2 border-orange-100 font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all cursor-default">
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Clients