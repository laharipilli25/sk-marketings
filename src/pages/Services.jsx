import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FaLandmark, FaIdCard, FaFileContract, FaHandshake,
  FaBullhorn, FaStore, FaChartLine, FaStar,
  FaPiggyBank, FaCreditCard, FaChartBar, FaCalculator,
  FaSearchDollar, FaInstagram, FaGoogle, FaEnvelope,
  FaArrowRight
} from 'react-icons/fa'
import SEO from '../components/SEO'
import { pageTransition, staggerContainer, staggerItem } from '../utils/animations'

const categories = [
  {
    id: 'msme',
    icon: FaLandmark,
    title: 'MSME Services',
    color: 'bg-orange-500',
    desc: 'Complete end-to-end support for Micro, Small & Medium Enterprises — from registration to benefits.',
    services: [
      { icon: FaIdCard, name: 'Udyam Registration', desc: 'Official MSME/Udyam certification with all government requirements handled.' },
      { icon: FaFileContract, name: 'MSME Loan Assistance', desc: 'Facilitating collateral-free loans through government schemes and banks.' },
      { icon: FaHandshake, name: 'Govt Scheme Access', desc: 'Connecting you to PM schemes, subsidies, and MSME development programs.' },
      { icon: FaChartLine, name: 'Business Compliance', desc: 'GST, PAN, trade licenses, and all statutory compliances managed.' },
    ],
  },
  {
    id: 'promotions',
    icon: FaBullhorn,
    title: 'Business Promotions',
    color: 'bg-orange-500',
    desc: 'Strategic promotion services to build visibility, attract customers, and expand your market.',
    services: [
      { icon: FaBullhorn, name: 'Brand Building', desc: 'Crafting a powerful brand identity that resonates with your target audience.' },
      { icon: FaStore, name: 'Local Market Expansion', desc: 'Penetrating new geographic markets with tailored local strategies.' },
      { icon: FaStar, name: 'Trade Show Support', desc: 'End-to-end support for exhibitions, trade shows, and B2B networking events.' },
      { icon: FaChartLine, name: 'Market Research', desc: 'Data-driven insights on market trends, competition, and opportunities.' },
    ],
  },
  {
    id: 'financial',
    icon: FaChartLine,
    title: 'Financial Services',
    color: 'bg-orange-500',
    desc: 'Expert financial planning and advisory services to maximize growth and minimize risks.',
    services: [
      { icon: FaPiggyBank, name: 'Financial Planning', desc: 'Strategic financial roadmaps aligned with your short and long-term goals.' },
      { icon: FaCreditCard, name: 'Business Loan Facilitation', desc: 'Connecting businesses with the right lenders and optimal loan structures.' },
      { icon: FaChartBar, name: 'Investment Advisory', desc: 'Smart investment strategies for surplus capital and business expansion.' },
      { icon: FaCalculator, name: 'Tax Planning', desc: 'Comprehensive tax optimization and compliance management.' },
    ],
  },
  {
    id: 'digital',
    icon: FaSearchDollar,
    title: 'Digital Marketing',
    color: 'bg-orange-500',
    desc: 'Full-stack digital marketing to dominate online, generate leads, and scale your brand.',
    services: [
      { icon: FaSearchDollar, name: 'SEO Optimization', desc: 'Rank higher on Google with proven white-hat SEO strategies.' },
      { icon: FaInstagram, name: 'Social Media Marketing', desc: 'Engaging content and campaigns across Instagram, Facebook & LinkedIn.' },
      { icon: FaGoogle, name: 'Paid Advertising (PPC)', desc: 'High-ROI Google Ads and Meta Ads campaigns that convert.' },
      { icon: FaEnvelope, name: 'Email Marketing', desc: 'Automated email campaigns that nurture leads and retain customers.' },
    ],
  },
]

function Services() {
  return (
    <motion.div {...pageTransition} className="bg-white">
      <SEO
        title="Services"
        description="SK Marketings offers MSME services, business promotions, financial services, and digital marketing in India."
      />

      {/* ── Hero Section - Lighter Orange ── */}
      <section className="relative pt-28 pb-16 bg-orange-500 overflow-hidden border-b-4 border-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 bg-white text-orange-500 text-[10px] font-black px-4 py-1.5 rounded-full mb-4 shadow-lg uppercase">
              💼 Professional Solutions
            </motion.div>
            
            <motion.h1 variants={staggerItem} className="font-heading text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-tight">
              Expert <span className="underline decoration-white/40">Services</span>
            </motion.h1>
            
            <motion.p variants={staggerItem} className="font-body text-white text-lg font-bold opacity-100 max-w-2xl">
              Fueling your business growth with data-driven strategies and professional guidance.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Service Categories ── */}
      {categories.map((cat, catIndex) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`py-12 ${catIndex % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex flex-col md:flex-row md:items-end gap-4 mb-10"
            >
              <div className="flex-1">
                <motion.div
                  variants={staggerItem}
                  className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-100 border-2 border-white"
                >
                  <cat.icon className="text-white text-2xl" />
                </motion.div>
                
                <motion.div variants={staggerItem} className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-1">
                  {String(catIndex + 1).padStart(2, '0')} — Category
                </motion.div>
                
                <motion.h2 variants={staggerItem} className="font-heading text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">
                  {cat.title}
                </motion.h2>
                
                <motion.p variants={staggerItem} className="mt-2 font-body text-slate-700 text-base max-w-2xl font-bold leading-relaxed">
                  {cat.desc}
                </motion.p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.services.map((svc) => (
                <motion.div
                  key={svc.name}
                  variants={staggerItem}
                  className="bg-white rounded-[1.5rem] border-2 border-orange-100 p-6 group cursor-pointer hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-50 transition-all duration-500"
                  whileHover={{ y: -6 }}
                >
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg border border-white">
                    <svc.icon size={20} />
                  </div>
                  
                  <h3 className="font-heading text-lg font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {svc.name}
                  </h3>
                  
                  <p className="font-body text-slate-600 text-xs leading-relaxed font-bold">
                    {svc.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA Section ── */}
      <section className="py-16 bg-orange-500 border-t-4 border-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={staggerItem} className="font-heading text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase leading-none">
              Start Your <span className="text-white opacity-80">Journey</span>
            </motion.h2>
            
            <motion.p variants={staggerItem} className="font-body text-white text-lg mb-8 font-bold">
              We craft bespoke consultancy packages tailored to your vision.
            </motion.p>
            
            <motion.div variants={staggerItem}>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-3 bg-white text-orange-500 px-10 py-4 rounded-xl font-black hover:scale-105 transition-transform shadow-2xl text-lg uppercase tracking-tight border-2 border-white active:scale-95"
              >
                Get Custom Package <FaArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Services