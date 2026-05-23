import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaGlobeAsia,
  FaBuilding,
  FaBullhorn,
  FaChartLine,
  FaLaptopCode,
  FaMapMarkerAlt,
  FaAward
} from 'react-icons/fa'
import SEO from '../components/SEO'
import { pageTransition, staggerContainer, staggerItem } from '../utils/animations'
import gmLogo from '../assets/genius-minds-logo.png'

// ─── Core Pillars Panel Component ───────────────────────────────────────────────
const pillars = [
  {
    title: 'MSME Solutions',
    desc: 'Credit & Scale Advisory',
    icon: FaBuilding,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    hoverBg: 'hover:bg-blue-50/40',
    barColor: 'bg-blue-500',
  },
  {
    title: 'Brand Promotion',
    desc: 'Multi-Channel Marketing',
    icon: FaBullhorn,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    hoverBg: 'hover:bg-purple-50/40',
    barColor: 'bg-purple-500',
  },
  {
    title: 'Financial Advisory',
    desc: 'Audit & Funding Support',
    icon: FaChartLine,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    hoverBg: 'hover:bg-emerald-50/40',
    barColor: 'bg-emerald-500',
  },
  {
    title: 'Digital Systems',
    desc: 'Sleek Web & Tech Dev',
    icon: FaLaptopCode,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    hoverBg: 'hover:bg-cyan-50/40',
    barColor: 'bg-cyan-500',
  },
  {
    title: 'Pan-India Reach',
    desc: 'Serving 15+ Major States',
    icon: FaGlobeAsia,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    hoverBg: 'hover:bg-amber-50/40',
    barColor: 'bg-amber-500',
  },
  {
    title: 'Elite Scale',
    desc: '500+ Active Enterprises',
    icon: FaAward,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    hoverBg: 'hover:bg-rose-50/40',
    barColor: 'bg-rose-500',
  },
]

function CorePillarsPanel() {
  return (
    <div className="w-full flex flex-col gap-3.5">
      <div className="text-center pb-3 border-b border-slate-100">
        <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-orange-500 font-heading">
          Our Focus
        </span>
        <h3 className="font-heading text-base font-black text-slate-800 tracking-tight mt-1">
          Core Competencies
        </h3>
      </div>
      <div className="flex flex-col gap-1.5">
        {pillars.map((pillar) => {
          const Icon = pillar.icon
          return (
            <motion.div
              key={pillar.title}
              whileHover={{ x: 6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`flex items-center gap-3 p-2 rounded-xl border border-transparent ${pillar.hoverBg} transition-colors group cursor-default relative overflow-hidden`}
            >
              {/* Left active accent bar */}
              <div className={`absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-r-md ${pillar.barColor} scale-y-0 group-hover:scale-y-100 transition-transform origin-center`} />

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${pillar.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={14} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-heading font-black text-[11px] text-slate-800 uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                  {pillar.title}
                </div>
                <div className="font-body text-[9px] text-slate-500 font-bold truncate">
                  {pillar.desc}
                </div>
              </div>
            </motion.div>
          )
        })}
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
  { label: 'Real Estate', value: 'realestate' },
  { label: 'Education', value: 'education' },
]

const clients = [
  {
    name: 'Genius Minds Making Code', industry: 'elite', location: 'Madanapalli, India', initials: 'GM', logo: gmLogo, color: 'from-orange-500 to-amber-600'
  },
  { name: 'Balaji Exports', industry: 'manufacturing', location: 'Tirupati, India', initials: 'BE', color: 'from-blue-500 to-indigo-600' },
  { name: 'MedCare Clinics', industry: 'healthcare', location: 'Hyderabad, India', initials: 'MC', color: 'from-emerald-400 to-teal-600' },
  { name: 'FreshMart Retail', industry: 'retail', location: 'Chennai, India', initials: 'FM', color: 'from-amber-400 to-orange-500' },
  { name: 'TechNova Solutions', industry: 'technology', location: 'Bangalore, India', initials: 'TN', color: 'from-cyan-500 to-blue-600' },
  { name: 'Skyline Realtors', industry: 'realestate', location: 'Mumbai, India', initials: 'SR', color: 'from-purple-500 to-indigo-600' },
  { name: 'BrightMinds Academy', industry: 'education', location: 'Delhi, India', initials: 'BA', color: 'from-violet-500 to-fuchsia-600' },
  { name: 'Gulf Trade LLC', industry: 'manufacturing', location: 'Dubai, UAE', initials: 'GT', color: 'from-slate-600 to-slate-800' },
  { name: 'Müller Handels GmbH', industry: 'retail', location: 'Frankfurt, Germany', initials: 'MH', color: 'from-rose-500 to-red-600' },
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

      {/* Geographic Presence */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {geographies.map((geo) => (
              <motion.div
                key={geo.country}
                className="bg-white border border-slate-100 p-5 rounded-2xl text-center group transition-all hover:shadow-xl hover:shadow-orange-100/20 hover:border-orange-500 relative overflow-hidden"
                whileHover={{ y: -6 }}
              >
                <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-black">
                  <span className="text-lg filter drop-shadow-sm leading-none">{geo.flag}</span>
                  <span className="font-heading tracking-wider text-[9px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md uppercase font-black">{geo.code}</span>
                </div>
                <div className="font-heading text-3xl font-black text-orange-500 tracking-tight group-hover:scale-105 transition-transform">{geo.count}</div>
                <div className="font-body font-extrabold text-slate-700 text-[10px] uppercase tracking-wider mt-1">{geo.country}</div>
                <div className="font-body text-[9px] text-slate-400 font-bold mt-1.5">{geo.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Grid */}
      <section className="py-12 bg-orange-50/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* LEFT — Focus card */}
            <div className="w-full lg:w-64 flex-shrink-0 mx-auto lg:mx-0">
              <div className="bg-white border border-slate-100 shadow-2xl shadow-slate-100 rounded-[2rem] p-6 flex flex-col items-center group hover:border-orange-500 transition-colors">
                <CorePillarsPanel />
              </div>
            </div>

            {/* RIGHT — Filter & Grid */}
            <div className="flex-1 w-full">
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                {industries.map((ind) => {
                  const count = ind.value === 'all' ? clients.length : clients.filter((c) => c.industry === ind.value).length
                  const isActive = activeIndustry === ind.value
                  return (
                    <button
                      key={ind.value}
                      onClick={() => setActiveIndustry(ind.value)}
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border-2 ${isActive
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-orange-500 hover:text-orange-500'
                        }`}
                    >
                      <span>{ind.label}</span>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {filtered.map((client) => {
                    const getIndustryBadge = (industry) => {
                      switch (industry) {
                        case 'elite':
                          return { label: 'Elite Partner', styles: 'bg-rose-50 text-rose-600 border-rose-100' }
                        case 'manufacturing':
                          return { label: 'Manufacturing', styles: 'bg-blue-50 text-blue-600 border-blue-100' }
                        case 'healthcare':
                          return { label: 'Healthcare', styles: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
                        case 'retail':
                          return { label: 'Retail', styles: 'bg-amber-50 text-amber-600 border-amber-100' }
                        case 'technology':
                          return { label: 'Technology', styles: 'bg-cyan-50 text-cyan-600 border-cyan-100' }
                        case 'realestate':
                          return { label: 'Real Estate', styles: 'bg-purple-50 text-purple-600 border-purple-100' }
                        case 'education':
                          return { label: 'Education', styles: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
                        default:
                          return { label: industry, styles: 'bg-slate-50 text-slate-600 border-slate-100' }
                      }
                    }
                    const badge = getIndustryBadge(client.industry)

                    return (
                      <motion.div
                        key={client.name}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -6 }}
                        className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:border-orange-500 transition-all hover:shadow-2xl hover:shadow-orange-100/30 flex flex-col justify-between items-center group relative overflow-hidden min-h-[220px]"
                      >
                        {/* Industry Badge at top left */}
                        <div className="w-full flex justify-between items-center mb-1">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.styles}`}>
                            {badge.label}
                          </span>
                          <span className="text-[9px] text-orange-500 font-extrabold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaStar size={8} />
                            Partner
                          </span>
                        </div>

                        {/* LOGO SHOWCASE AREA (LARGE & RECTANGULAR) */}
                        <div className="w-full h-24 flex items-center justify-center mb-2 mt-1 relative">
                          {client.name === 'Genius Minds Making Code' ? (
                            <div className="w-full h-full flex items-center justify-center p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50 group-hover:bg-slate-50 transition-colors">
                              <img
                                src={client.logo}
                                alt={client.name}
                                className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${client.color} flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-white/10 mix-blend-overlay opacity-40" />
                              <span className="relative tracking-tighter">{client.initials}</span>
                            </div>
                          )}
                        </div>

                        {/* TEXT INFO (CENTERED & UNIFORM) */}
                        <div className="w-full text-center mt-auto">
                          {/* NAME with line clamp instead of truncate to handle longer names beautifully */}
                          <div className="font-heading font-black text-slate-800 text-[12px] uppercase tracking-tight w-full min-h-[32px] flex items-center justify-center px-1 leading-tight group-hover:text-orange-500 transition-colors">
                            <span className="line-clamp-2">{client.name}</span>
                          </div>

                          {/* LOCATION */}
                          <div className="flex items-center justify-center gap-1 text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">
                            <FaMapMarkerAlt className="text-orange-500/70" size={9} />
                            <span>{client.location}</span>
                          </div>
                        </div>

                      </motion.div>
                    )
                  })}
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