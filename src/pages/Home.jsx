import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaArrowRight, FaChartLine, FaBullhorn, FaLandmark, FaSearchDollar,
  FaStar, FaQuoteLeft, FaGlobeAsia, FaHandshake,
  FaAward, FaUsers
} from 'react-icons/fa'
import { HiLightningBolt, HiShieldCheck, HiTrendingUp } from 'react-icons/hi'
import SEO from '../components/SEO'
import { slideLeft, slideRight, staggerContainer, staggerItem, pageTransition } from '../utils/animations'

/* ─── 3D Rotating Cube Component ─────────── */
const BusinessCube = () => {
  const faces = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 [perspective:1000px] flex items-center justify-center z-10">
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: 360, rotateX: [0, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {faces.map((img, i) => {
          const rotations = [
            "rotateY(0deg) translateZ(128px)",
            "rotateY(90deg) translateZ(128px)",
            "rotateY(180deg) translateZ(128px)",
            "rotateY(-90deg) translateZ(128px)",
            "rotateX(90deg) translateZ(128px)",
            "rotateX(-90deg) translateZ(128px)"
          ];
          return (
            <div
              key={i}
              className="absolute inset-0 border-2 border-orange-400 shadow-2xl bg-white overflow-hidden rounded-lg"
              style={{ transform: rotations[i], backfaceVisibility: 'hidden' }}
            >
              <img
                src={img}
                alt="business collaboration"
                className="w-full h-full object-cover object-center grayscale-[20%] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-orange-500/5" />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

/* ─── Data ────────────────────────────────── */
const services = [
  { icon: FaLandmark, title: 'MSME Services', desc: 'Complete MSME registration, Udyam certification, and government scheme assistance.' },
  { icon: FaBullhorn, title: 'Business Promotions', desc: 'Strategic brand building and market expansion services to grow your reach.' },
  { icon: FaChartLine, title: 'Financial Services', desc: 'Expert financial planning, investment advisory, and loan facilitation.' },
  { icon: FaSearchDollar, title: 'Digital Marketing', desc: 'SEO, social media, and content marketing to dominate the digital landscape.' },
]

const whyUs = [
  { icon: FaAward, text: '5+ Years of Industry Experience' },
  { icon: FaUsers, text: '500+ Happy Clients Served' },
  { icon: FaGlobeAsia, text: 'Global Presence: India' },
  { icon: FaHandshake, text: 'Dedicated One-on-One Consultation' },
  { icon: HiShieldCheck, text: 'Trusted & Transparent Advisory' },
  { icon: HiTrendingUp, text: 'Results-Driven Strategies' },
]

const testimonials = [
  { name: 'Sasi Kumar Yadav', company: 'Sk Marketings, Tirupati', text: 'SK Marketings transformed our MSME process completely. Their team is professional and knowledgeable.' },
  { name: 'Priya Sharma', company: 'Sharma Digital, Hyderabad', text: 'Our digital presence grew 3x within 6 months. Outstanding results and excellent ROI.' },
  { name: 'Mohammed Al-Rashid', company: 'Gulf Trade LLC, UAE', text: 'Working with SK Marketings for our India market entry was seamless and highly professional.' },
]

const stats = [
  { value: '500+', label: 'Clients Served' },
  { value: '5+', label: 'Years Experience' },
  { value: '5', label: 'Countries' },
  { value: '98%', label: 'Satisfaction Rate' },
]

/* ─── Component ───────────────────────────── */
function Home() {
  return (
    <motion.div {...pageTransition} className="bg-white">
      <SEO
        title="Home"
        description="SK Marketings - Empowering enterprises across India. Expert business consultancy in Tirupati."
      />

      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.85]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')`,
          }}
        />
        {/* Adjusted Gradient to Light Orange overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/80 to-orange-400/40" />

        {/* Navbar Contrast Shadow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />

        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[100px] z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-black px-5 py-2 rounded-full mb-6 shadow-lg shadow-orange-100"
              >
                🇮🇳 Trusted Business Consultancy • Tirupati
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-5xl sm:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter"
              >
                Empowering <span className="text-orange-500">Enterprises,</span><br />
                Elevating <span className="underline decoration-orange-200 decoration-8 text-slate-800">India.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-slate-700 text-lg mb-10 leading-relaxed font-bold opacity-90"
              >
                Your trusted partner for growth. Providing expert MSME Registration and Digital Strategies to help your business dominate the market.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/contact" className="bg-orange-500 text-white px-8 py-4 rounded-xl font-black hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-100">
                  Get Consultation <FaArrowRight />
                </Link>
                <Link to="/services" className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-black hover:bg-orange-50 transition-all flex items-center justify-center">
                  Our Services
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center lg:justify-end drop-shadow-[0_20px_50px_rgba(249,115,22,0.25)] relative z-20"
            >
              <BusinessCube />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats - Switched to Light Orange ── */}
      <section className="relative z-30 py-10 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center text-white border-white/20 last:border-0 md:border-r">
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-black opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Overview ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem} className="text-orange-500 font-black uppercase tracking-widest text-xs mb-2">Our Expertise</motion.div>
            <motion.h2 variants={staggerItem} className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
              Premium Solutions for <span className="text-orange-500">Growth</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="bg-white p-8 rounded-3xl border border-orange-100 hover:border-orange-500 transition-all shadow-sm group">
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  <svc.icon size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{svc.title}</h3>
                <p className="text-slate-1000 text-sm leading-relaxed mb-6 font-bold opacity-80">{svc.desc}</p>
                <Link to="/services" className="inline-flex items-center gap-2 text-orange-500 font-black text-sm">
                  Explore Service <FaArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-orange-50/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">
                Why Partners <span className="text-orange-500">Choose SK</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whyUs.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-orange-100">
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-800 leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRight} className="bg-orange-500 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🇮🇳</div>
                <h3 className="text-3xl font-black mb-3 uppercase tracking-tight">Proudly Indian</h3>
                <p className="text-orange-50 text-lg mb-8 font-bold">Based in Tirupati, serving the global economy. Bridging the gap between Indian ambition and global standards.</p>
                <Link to="/about" className="inline-block bg-white text-orange-500 px-8 py-3 rounded-full font-black shadow-lg hover:scale-105 transition-transform">Learn Our Story</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-16 tracking-tighter">Trusted by the <span className="text-orange-500">Best</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {testimonials.map((t) => (
              <div key={t.name} className="p-8 bg-white border border-orange-50 rounded-[2rem] relative shadow-sm hover:border-orange-500 transition-all">
                <FaQuoteLeft className="text-orange-100 text-5xl absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-orange-400" size={14} />)}
                </div>
                <p className="text-slate-700 text-base italic mb-8 leading-relaxed font-bold opacity-90">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-black">{t.name[0]}</div>
                  <div>
                    <div className="text-base font-black text-slate-900 uppercase">{t.name}</div>
                    <div className="text-[10px] text-orange-500 font-black tracking-widest uppercase">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-orange-500 rounded-[2.5rem] p-10 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <HiLightningBolt className="text-5xl mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg text-orange-50 mb-8 max-w-xl mx-auto font-bold">Join 500+ successful enterprises. Your first consultation is on us.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link to="/contact" className="bg-white text-orange-500 px-10 py-4 rounded-xl font-black hover:scale-105 transition-transform shadow-xl text-base">
                Schedule Now
              </Link>
              <a href="https://wa.me/918501011026" target="_blank" rel="noreferrer" className="bg-orange-600 border border-orange-400 px-10 py-4 rounded-xl font-black hover:bg-orange-700 transition-colors text-base shadow-lg">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home