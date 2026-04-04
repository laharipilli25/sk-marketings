import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/918501011026?text=Hello%20SK%20Marketings%2C%20I%20need%20a%20consultation."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg whatsapp-pulse"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaWhatsapp size={28} />
    </motion.a>
  )
}

export default WhatsAppButton
