import { motion } from 'framer-motion'
import { FaEye, FaBullseye, FaAward, FaChartLine, FaUsers, FaLinkedinIn } from 'react-icons/fa'
import founderImg from '../assets/founder.png'
import SEO from '../components/SEO'
import { pageTransition, staggerContainer, staggerItem, slideLeft, slideRight } from '../utils/animations'

const team = [
  { name: 'Sasi Kumar Yadav', role: 'Founder & CEO', initials: 'SK', expertise: 'Managing Director| Business Architecture' },
  { name: 'Kavitha Reddy', role: 'Chief Financial Officer', initials: 'KR', expertise: 'Corporate Finance & Governance' },
  { name: 'Arjun Sharma', role: 'Head of Growth', initials: 'AS', expertise: 'Market Penetration & ROI' },
  { name: 'Divya Lakshmi', role: 'Director of Operations', initials: 'DL', expertise: 'Client Lifecycle Management' },
]

function About() {
  return (
    <motion.div {...pageTransition} className="bg-white selection:bg-orange-100">
      <SEO
        title="About Us | SK Marketings"
        description="A decade of excellence in business consultancy based in Tirupati led by Sasi Kumar Yadav."
      />

      {/* ── SECTION 1: HEADER & HERO (ORANGE) ── */}
      <section className="relative pt-40 pb-32 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={staggerItem} className="flex items-center gap-3 text-white font-black text-[12px] uppercase tracking-[0.4em] mb-6">
              <span className="w-12 h-[2px] bg-white"></span>
              ESTABLISHED 2021
            </motion.div>
            <motion.h1 variants={staggerItem} className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-10 uppercase">
              A Decade of <br /> Strategic <span className="text-orange-200">Dominance.</span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-xl text-orange-50 leading-relaxed font-bold max-w-2xl">
              Architecting growth for 500+ enterprises through uncompromising integrity and high-impact structural innovation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: FOUNDER PROFILE (WHITE - IMAGE FIT) ── */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-0 items-stretch min-h-[600px]">
            {/* Founder Image - Fitted to Section */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft} className="relative flex justify-center py-12 lg:py-20">
              <div className="relative w-full max-w-md aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-orange-500 bg-slate-50">
                <img
                  src={founderImg}
                  alt="Sasi Kumar Yadav - Founder"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>

            {/* Founder Content */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight} className="flex flex-col justify-center p-12 lg:p-24">
              <h4 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[12px] mb-4">The Leadership</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter whitespace-nowrap">Sasi Kumar  Yadav</h2>
              <p className="text-orange-600 font-black text-lg mb-8 tracking-widest uppercase">CEO & Founder</p>

              <div className="space-y-6 text-slate-700 leading-relaxed text-lg font-medium">
                <p>
                  As a visionary strategist with over 5 years of cross-industry expertise, <strong>Sasi Kumar Yadav</strong> has redefined the consultancy landscape in India. His dual background in technical architecture and business administration allows him to solve complex fiscal challenges with surgical precision.
                </p>
                <p>
                  Under his command, SK Marketings has transformed from a regional firm into a powerhouse for MSME growth, digital ROI strategies, and corporate governance.
                </p>
                <div className="pt-8">
                  <a href="#" className="inline-flex items-center gap-3 bg-orange-500 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl hover:shadow-orange-200">
                    <FaLinkedinIn size={16} /> View Executive Bio
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: VISION & MISSION (ORANGE) ── */}
      <section className="py-24 bg-orange-500 text-white border-y-[15px] border-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-orange-600/30 p-12 rounded-[2rem] border border-white/20">
              <FaEye size={40} className="mb-8 text-white" />
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">Corporate Vision</h3>
              <p className="text-orange-50 text-xl leading-relaxed font-bold">
                To serve as the definitive catalyst for Indian entrepreneurship, evolving local businesses into globally recognized brands through technological integration.
              </p>
            </div>
            <div className="bg-white p-12 rounded-[2rem] shadow-2xl">
              <FaBullseye size={40} className="mb-8 text-orange-500" />
              <h3 className="text-3xl font-black mb-6 uppercase tracking-tight text-slate-900">Core Mission</h3>
              <p className="text-slate-600 text-xl leading-relaxed font-bold">
                Providing aggressive, evidence-based business solutions that facilitate rapid growth while maintaining structural integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE BOARD (WHITE) ── */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center">
            <p className="text-orange-500 font-black uppercase tracking-[0.6em] text-[12px] mb-4">Board of Directors</p>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">Executive <span className="text-orange-500">Board</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member) => (
              <motion.div key={member.name} whileHover={{ y: -15 }} className="p-10 bg-slate-50 rounded-[3rem] border-4 border-transparent hover:border-orange-500 transition-all text-center group shadow-sm hover:shadow-2xl">
                <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-2xl font-black shadow-lg group-hover:rotate-6 transition-transform">
                  {member.initials}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1 uppercase tracking-tight">{member.name}</h3>
                <p className="text-orange-600 text-[11px] font-black uppercase tracking-widest mb-6">{member.role}</p>
                <div className="bg-white py-4 px-4 rounded-2xl text-[11px] text-slate-500 font-black uppercase tracking-tighter border border-slate-200">
                  {member.expertise}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: GLOBAL FOOTPRINT (ORANGE) ── */}
      <section className="bg-orange-500 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-white">
          {[
            { val: '10+', lab: 'Years Legacy', icon: FaAward },
            { val: '500+', lab: 'Enterprises Scaled', icon: FaUsers },
            { val: '98%', lab: 'Client Retention', icon: FaChartLine },
            { val: '24/7', lab: 'Advisory Support', icon: FaChartLine },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-black mb-2">{s.val}</div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">{s.lab}</div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

export default About