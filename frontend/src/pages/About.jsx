import { motion } from 'framer-motion'
import { 
  RocketLaunchIcon, 
  UserGroupIcon, 
  LightBulbIcon, 
  HeartIcon 
} from '@heroicons/react/24/outline'

const values = [
  {
    icon: RocketLaunchIcon,
    title: 'Inovasi',
    description: 'Kami selalu mengadopsi teknologi terbaru untuk memberikan solusi terbaik.',
  },
  {
    icon: UserGroupIcon,
    title: 'Kolaborasi',
    description: 'Bekerja sama dengan klien untuk memahami dan memenuhi kebutuhan mereka.',
  },
  {
    icon: LightBulbIcon,
    title: 'Keahlian',
    description: 'Tim profesional dengan pengalaman bertahun-tahun di industri teknologi.',
  },
  {
    icon: HeartIcon,
    title: 'Dedikasi',
    description: 'Berkomitmen penuh untuk kesuksesan setiap klien yang kami layani.',
  },
]

const team = [
  {
    name: 'Ahmad Fauzan',
    role: 'Founder & CEO',
    image: '/team/ceo.jpg',
  },
  {
    name: 'Siti Nurhaliza',
    role: 'CTO',
    image: '/team/cto.jpg',
  },
  {
    name: 'Budi Santoso',
    role: 'Lead Developer',
    image: '/team/dev.jpg',
  },
  {
    name: 'Maya Putri',
    role: 'Customer Success',
    image: '/team/cs.jpg',
  },
]

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section bg-dark-300 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-primary-600/20 rounded-full text-primary-400 font-poppins text-sm mb-6">
              Tentang Kami
            </span>
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Membangun Masa Depan <span className="gradient-text">Digital Indonesia</span>
            </h1>
            <p className="font-poppins text-gray-400 text-lg md:text-xl leading-relaxed">
              NeoIntegraTech didirikan dengan visi untuk menyederhanakan transformasi digital 
              bagi bisnis di Indonesia. Kami percaya setiap bisnis berhak mendapatkan teknologi 
              terbaik dengan harga terjangkau.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-dark-200">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
                Cerita <span className="gradient-text">Kami</span>
              </h2>
              <div className="space-y-4 text-gray-400 font-poppins">
                <p>
                  Berawal dari kebutuhan akan layanan teknologi yang mudah diakses dan terpercaya, 
                  NeoIntegraTech lahir di tahun 2020. Kami memulai dengan fokus pada layanan domain 
                  dan hosting, kemudian berkembang menjadi penyedia solusi teknologi terpadu.
                </p>
                <p style={{ display: 'none' }}>
                  Dengan integrasi iPaymu sebagai payment gateway, kami memastikan setiap transaksi 
                  berjalan aman dan layanan teraktivasi secara otomatis. Tidak ada lagi menunggu 
                  konfirmasi manual yang memakan waktu.
                </p>
                <p>
                  Hari ini, kami bangga melayani ribuan klien dari berbagai industri, dari startup 
                  hingga perusahaan besar, membantu mereka mencapai kesuksesan di era digital.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="card p-6 text-center">
                    <div className="font-montserrat font-bold text-4xl gradient-text mb-2">5+</div>
                    <div className="font-poppins text-gray-400 text-sm">Years Experience</div>
                  </div>
                  <div className="card p-6 text-center bg-gradient-primary">
                    <div className="font-montserrat font-bold text-4xl text-white mb-2">1000+</div>
                    <div className="font-poppins text-white/80 text-sm">Happy Clients</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="card p-6 text-center">
                    <div className="font-montserrat font-bold text-4xl gradient-text mb-2">5000+</div>
                    <div className="font-poppins text-gray-400 text-sm">Websites Managed</div>
                  </div>
                  <div className="card p-6 text-center">
                    <div className="font-montserrat font-bold text-4xl gradient-text mb-2">24/7</div>
                    <div className="font-poppins text-gray-400 text-sm">Support Available</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-dark-300">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
              Nilai-Nilai <span className="gradient-text">Kami</span>
            </h2>
            <p className="font-poppins text-gray-400">
              Prinsip yang memandu setiap langkah kami dalam melayani klien
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-white mb-3">
                  {value.title}
                </h3>
                <p className="font-poppins text-gray-400 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-dark-200">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-6">
              Tim <span className="gradient-text">Kami</span>
            </h2>
            <p className="font-poppins text-gray-400">
              Orang-orang hebat di balik NeoIntegraTech
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <div className="w-full h-full rounded-full bg-gradient-primary p-1">
                    <div className="w-full h-full rounded-full bg-dark-200 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white group-hover:text-primary-400 transition-colors">
                  {member.name}
                </h3>
                <p className="font-poppins text-gray-400 text-sm">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
