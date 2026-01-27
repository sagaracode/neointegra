import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center hero-bg overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-full mb-8"
            >
              <SparklesIcon className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 font-poppins text-sm">
                Powered by iPaymu Payment Gateway
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Integrasikan Bisnis Anda ke{' '}
              <span className="gradient-text">Masa Depan Digital</span>
            </h1>

            {/* Sub-headline */}
            <p className="font-poppins text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Layanan Domain, Hosting, dan Cloudflare premium dengan sistem pembayaran otomatis iPaymu. Solusi lengkap untuk transformasi digital bisnis Anda.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/services"
                className="btn btn-primary text-lg px-8 py-4 group"
              >
                Mulai Sekarang
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Konsultasi Gratis
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10"
            >
              <div className="text-center lg:text-left">
                <div className="font-montserrat font-bold text-3xl gradient-text">99.9%</div>
                <div className="font-poppins text-gray-500 text-sm mt-1">Uptime Server</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-montserrat font-bold text-3xl gradient-text">24/7</div>
                <div className="font-poppins text-gray-500 text-sm mt-1">Technical Support</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-montserrat font-bold text-3xl gradient-text">1000+</div>
                <div className="font-poppins text-gray-500 text-sm mt-1">Happy Clients</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Visual Container */}
            <div className="relative">
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-8 -left-8 card glass p-4 shadow-glow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-montserrat font-semibold text-sm">Domain</div>
                    <div className="text-gray-400 text-xs">500+ TLDs Available</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/3 -right-12 card glass p-4 shadow-glow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-montserrat font-semibold text-sm">Cloudflare</div>
                    <div className="text-gray-400 text-xs">CDN & Security</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 left-1/4 card glass p-4 shadow-glow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-montserrat font-semibold text-sm">Pembayaran</div>
                    <div className="text-gray-400 text-xs">Auto via iPaymu</div>
                  </div>
                </div>
              </motion.div>

              {/* Central Circle */}
              <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/60 border border-gray-700/40 flex items-center justify-center animate-pulse-glow">
                <div className="w-60 h-60 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-800/40 border border-gray-600/30 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center shadow-2xl">
                    <img
                      src="/assets/NeoIntegraTech.png"
                      alt="NeoIntegraTech"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="font-poppins text-xs">Scroll Down</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
