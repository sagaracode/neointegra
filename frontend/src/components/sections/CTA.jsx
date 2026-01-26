import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function CTA() {
  return (
    <section className="section bg-dark-300 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-900/20 to-transparent" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-6 py-2 bg-primary-600/20 rounded-full text-primary-400 font-poppins text-sm mb-6"
          >
            🚀 Mulai Sekarang
          </motion.span>

          {/* Headline */}
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
            Siap Mengintegrasikan <br className="hidden md:block" />
            <span className="gradient-text">Bisnis Anda ke Digital?</span>
          </h2>

          {/* Description */}
          <p className="font-poppins text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Bergabung dengan ribuan bisnis yang sudah mempercayakan kebutuhan teknologi mereka kepada NeoIntegraTech. 
            Dapatkan konsultasi gratis hari ini!
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/register"
              className="btn btn-primary text-lg px-10 py-4 group"
            >
              Daftar Sekarang
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary text-lg px-10 py-4"
            >
              Hubungi Kami
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <p className="text-gray-500 text-sm font-poppins mb-4">Dipercaya oleh berbagai bisnis</p>
            <div className="flex items-center justify-center gap-8 flex-wrap opacity-50">
              {/* Placeholder for client logos */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-24 h-10 bg-white/10 rounded-lg"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
