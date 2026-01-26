import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  ServerStackIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Keamanan Terjamin',
    description: 'Semua transaksi dilindungi enkripsi SSL dan gateway pembayaran yang tersertifikasi PCI DSS.',
    // iPaymu hidden sementara
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BoltIcon,
    title: 'Aktivasi Instan',
    description: 'Layanan aktif otomatis dalam hitungan menit setelah pembayaran dikonfirmasi.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Harga Kompetitif',
    description: 'Dapatkan layanan premium dengan harga terjangkau tanpa biaya tersembunyi.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: ServerStackIcon,
    title: '99.9% Uptime',
    description: 'Infrastruktur data center tier-3 dengan redundansi ganda untuk keandalan maksimal.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: ClockIcon,
    title: 'Support 24/7',
    description: 'Tim technical support siap membantu Anda kapan saja, tanpa hari libur.',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Konsultasi Gratis',
    description: 'Dapatkan saran ahli untuk kebutuhan teknologi bisnis Anda tanpa biaya.',
    gradient: 'from-indigo-500 to-purple-500',
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function Features() {
  return (
    <section className="section bg-dark-200 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-600/20 rounded-full text-primary-400 font-poppins text-sm mb-4">
            Why Choose Us
          </span>
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6">
            Mengapa <span className="gradient-text">NeoIntegraTech</span>?
          </h2>
          <p className="font-poppins text-gray-400 text-lg">
            Kami berkomitmen memberikan layanan terbaik dengan teknologi terkini
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="relative p-8 rounded-2xl bg-dark-100/50 border border-white/5 hover:border-primary-500/30 transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-montserrat font-bold text-xl text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-poppins text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600/0 via-primary-600/5 to-primary-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-primary-900/50 to-primary-800/30 border border-primary-500/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-2">1000+</div>
              <div className="font-poppins text-gray-400">Happy Clients</div>
            </div>
            <div>
              <div className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-2">5000+</div>
              <div className="font-poppins text-gray-400">Domains Managed</div>
            </div>
            <div>
              <div className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-2">99.9%</div>
              <div className="font-poppins text-gray-400">Uptime Average</div>
            </div>
            <div>
              <div className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-2">24/7</div>
              <div className="font-poppins text-gray-400">Support Available</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
