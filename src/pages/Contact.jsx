import toast from 'react-hot-toast';
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram,
  FaWhatsapp, FaCheckCircle, FaArrowRight, FaSpinner
} from 'react-icons/fa'
import SEO from '../components/SEO'
import { pageTransition, staggerContainer, staggerItem, slideLeft } from '../utils/animations'

const contactDetails = [
  {
    icon: FaPhone,
    label: 'Phone',
    value: '+91 79956 53959',
    sub: '+91 79956 53959',
    href: 'tel:+917995653959',
    color: 'from-orange-400 to-orange-600',
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'skmarketingstpt@gmail.com',
    href: 'mailto:skmarketingstpt@gmail.com',
    color: 'from-orange-500 to-orange-700',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Location',
    value: 'Tirupati, Andhra Pradesh',
    sub: 'India — 517501',
    href: 'https://maps.app.goo.gl/MyqMMtETyY26mtfR6?g_st=aw',
    color: 'from-orange-600 to-red-500',
  },
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: '+91 79956 53959',
    href: 'https://wa.me/917995653959',
    color: 'from-green-500 to-green-600',
  },
]

const API_URL = import.meta.env.VITE_API_URL; // SK Marketings Backend

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '', location: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-()]{8,15}$/.test(form.phone.trim())) {
      errs.phone = 'Please enter a valid phone number'
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email'
    }
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          location: form.location,
          serviceRequired: form.service,
          message: form.message
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setForm({ name: '', phone: '', email: '', service: '', message: '', location: '' })
      } else {
        toast.error('Failed to submit inquiry. Please try again.')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  return (
    <motion.div {...pageTransition} className="bg-gray-50 min-h-screen">
      <SEO
        title="Contact Us | SK Marketings"
        description="Contact SK Marketings for business consultancy and digital marketing. Based in Tirupati, India."
        keywords="contact SK Marketings, business consultancy Tirupati"
      />

      {/* Hero Section */}
      <section className="relative pt-36 pb-32 bg-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[120px] -z-1" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto lg:mx-0 text-white"
          >
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 shadow-sm">
              📞 Get In Touch
            </motion.div>
            <motion.h1 variants={staggerItem} className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Let's Start Your <span className="text-orange-200 underline decoration-white/30 underline-offset-8">Growth Journey</span>
            </motion.h1>
            <motion.p variants={staggerItem} className="font-body text-orange-50 text-xl leading-relaxed max-w-2xl opacity-90 mx-auto lg:mx-0">
              Reach out for a free consultation. We help businesses navigate growth with expert marketing and financial guidance.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24"
          >
            {contactDetails.map((detail) => (
              <motion.a
                key={detail.label}
                href={detail.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerItem}
                className="group relative bg-white border border-gray-100 p-7 rounded-[2rem] shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 overflow-hidden"
                whileHover={{ y: -10 }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${detail.color} rounded-2xl flex items-center justify-center shadow-lg mb-5 group-hover:rotate-6 transition-transform`}>
                  <detail.icon className="text-white text-xl" />
                </div>
                <div>
                  <div className="font-body text-[10px] text-gray-800 font-black uppercase tracking-[0.2em] mb-1">{detail.label}</div>
                  <div className="font-body font-bold text-gray-1000 text-base group-hover:text-orange-600 transition-colors">{detail.value}</div>
                  {detail.sub && <div className="font-body text-xs text-gray-800 mt-1">{detail.sub}</div>}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-500 rounded-[4rem] overflow-hidden shadow-2xl shadow-orange-100 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-700 rounded-full -ml-20 -mb-20 blur-3xl opacity-20" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 items-stretch">
              <div className="lg:col-span-2 p-10 md:p-16 text-white flex flex-col justify-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideLeft}>
                  <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 leading-tight">
                    Tell Us About <br />
                    <span className="text-orange-200">Your Business</span>
                  </h2>
                  <p className="text-orange-50 text-lg mb-8 opacity-90 leading-relaxed font-medium">
                    Ready to scale? Fill out the form and our consultants will get back to you within 24 hours.
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-3 p-6 md:p-16 bg-white/5 backdrop-blur-md border-l border-white/10 flex items-center">
                <div className="w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-4xl">
                        <FaCheckCircle />
                      </div>
                      <h3 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Inquiry Received!</h3>
                      <p className="text-gray-500 font-medium mb-8">We will contact you shortly.</p>
                      <button onClick={() => setSubmitted(false)} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl">
                        New Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[12px] font-black text-orange-600 uppercase tracking-widest ml-1">Name *</label>
                          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name"
                            className={`w-full border-2 ${errors.name ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium`} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[12px] font-black text-orange-600 uppercase tracking-widest ml-1">Phone *</label>
                          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Mobile Number"
                            className={`w-full border-2 ${errors.phone ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium`} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-black text-orange-600 uppercase tracking-widest ml-1">Location</label>
                        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Your City / Location"
                          className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-black text-orange-600 uppercase tracking-widest ml-1">Service Required</label>
                        <select name="service" value={form.service} onChange={handleChange}
                          className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 focus:bg-white transition-all appearance-none cursor-pointer font-medium" >
                          <option value="">Select a service...</option>
                          <option>Insurance</option>
                          <option>MSME Services</option>
                          <option>Business Promotions</option>
                          <option>Financial Services</option>
                          <option>Digital Marketing</option>
                          <option>Products</option>
                          <option>Others</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-black text-orange-600 uppercase tracking-widest ml-1">Message *</label>
                        <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={4}
                          className={`w-full border-2 ${errors.message ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50'} rounded-2xl px-5 py-4 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none font-medium`} />
                      </div>
                      <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-orange-200 flex items-center justify-center gap-3 disabled:opacity-70 transition-all text-sm tracking-[0.2em]" >
                        {loading ? <FaSpinner className="animate-spin" /> : <>SEND MESSAGE <FaArrowRight /></>}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links Section */}
      <section className="pb-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] mb-10">Follow Our Updates</p>
          <div className="flex justify-center gap-8">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-20 h-20 bg-white text-orange-600 rounded-3xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shadow-xl hover:-translate-y-3">
              <FaInstagram size={32} />
            </a>
            <a href="https://wa.me/917995653959" target="_blank" rel="noreferrer" className="w-20 h-20 bg-white text-green-600 rounded-3xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-xl hover:-translate-y-3">
              <FaWhatsapp size={32} />
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Contact