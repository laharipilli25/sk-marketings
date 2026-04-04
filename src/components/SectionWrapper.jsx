import { motion } from 'framer-motion'
import { fadeUp } from '../utils/animations'

function SectionWrapper({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default SectionWrapper
