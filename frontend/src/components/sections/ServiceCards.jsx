import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

const services = [
  {
    id: 1,
    title: 'Jual Beli Domain',
    slug: 'domain',
    description: 'Registrasi dan transfer domain dengan 500+ TLD tersedia. Harga kompetitif dengan proses cepat.',
    icon: '🌐',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['500+ TLD', 'Transfer Mudah', 'DNS Management', 'WHOIS Privacy'],
    price: 'Mulai Rp 99.000/tahun',
  },
  {
    id: 2,
    title: 'Langganan Cloudflare',
    slug: 'cloudflare',
    description: 'CDN & Security premium dari Cloudflare untuk performa dan keamanan website optimal.',
    icon: '☁️',
    gradient: 'from-orange-500 to-yellow-500',
    features: ['CDN Global', 'DDoS Protection', 'SSL/TLS', 'Web Analytics'],
    price: 'Mulai Rp 200.000/bulan',
  },
  {
    id: 3,
    title: 'Hosting',
    slug: 'hosting',
    description: 'High-performance hosting dengan SSD NVMe, 99.9% uptime guarantee, dan support 24/7.',
    icon: '🖥️',
    gradient: 'from-green-500 to-emerald-500',
    features: ['SSD NVMe', '99.9% Uptime', 'Free SSL', 'Daily Backup'],
    price: 'Mulai Rp 50.000/bulan',
  },
  {
    id: 4,
    title: 'Mail Server',
    slug: 'mail-server',
    description: 'Email hosting profesional dengan custom domain untuk branding bisnis yang lebih baik.',
    icon: '📧',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Custom Domain', 'Anti-Spam', 'Unlimited Alias', 'Mobile Sync'],
    price: 'Mulai Rp 25.000/bulan',
  },
  {
    id: 5,
    title: 'SEO Service',
    slug: 'seo',
    description: 'Optimasi mesin pencari profesional untuk meningkatkan visibilitas dan traffic website Anda.',
    icon: '📈',
    gradient: 'from-red-500 to-orange-500',
    features: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Monthly Report'],
    price: 'Mulai Rp 1.500.000/bulan',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function ServiceCards() {
  return (
    <section className="section bg-dark-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-600/20 rounded-full text-primary-400 font-poppins text-sm mb-4">
            Our Services
          </span>
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            Layanan <span className="gradient-text">Premium</span> untuk Bisnis Anda
          </h2>
          <p className="font-poppins text-gray-400 text-lg">
            Solusi lengkap teknologi dengan harga kompetitif dan sistem pembayaran otomatis
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className="group"
            >
              <div className="card card-hover h-full flex flex-col">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {service.icon}
                  </div>
                  <span className="px-3 py-1 bg-primary-600/20 rounded-full text-primary-400 text-xs font-poppins">
                    Popular
                  </span>
                </div>

                {/* Card Content */}
                <h3 className="font-montserrat font-bold text-xl text-white mb-3 group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>
                <p className="font-poppins text-gray-400 text-sm mb-6 flex-grow">
                  {service.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                      <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-poppins">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-gray-500 text-xs font-poppins">Mulai dari</span>
                      <p className="text-white font-montserrat font-bold text-lg">{service.price.replace('Mulai ', '')}</p>
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-poppins font-medium transition-colors group/btn"
                    >
                      Detail
                      <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/services" className="btn btn-outline">
            Lihat Semua Layanan
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
