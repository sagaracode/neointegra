import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  HeartIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const References = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      client: "Fashion Retailer Indonesia",
      category: "E-Commerce",
      description: "Platform toko online dengan sistem pembayaran terintegrasi, manajemen inventory real-time, dan dashboard analytics.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop",
      tech: ["React", "Node.js", "PostgreSQL", "Payment Gateway"],
      features: [
        "Multi-vendor marketplace",
        "Real-time inventory tracking",
        "Integrated payment system",
        "Advanced analytics dashboard"
      ],
      icon: ShoppingCartIcon,
      year: "2025"
    },
    {
      id: 2,
      title: "Healthcare Management System",
      client: "RS Mitra Sehat",
      category: "Healthcare",
      description: "Sistem manajemen rumah sakit komprehensif untuk pendaftaran pasien, rekam medis elektronik, dan jadwal dokter.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
      tech: ["React", "FastAPI", "MySQL", "Cloud Storage"],
      features: [
        "Electronic medical records",
        "Appointment scheduling",
        "Prescription management",
        "Patient portal"
      ],
      icon: HeartIcon,
      year: "2025"
    },
    {
      id: 3,
      title: "Learning Management System",
      client: "Universitas Digital Indonesia",
      category: "Education",
      description: "Platform pembelajaran online dengan fitur video conference, quiz interaktif, dan progress tracking.",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop",
      tech: ["React", "Django", "PostgreSQL", "WebRTC"],
      features: [
        "Live video classes",
        "Interactive assessments",
        "Progress analytics",
        "Certificate generation"
      ],
      icon: AcademicCapIcon,
      year: "2024"
    },
    {
      id: 4,
      title: "Corporate ERP System",
      client: "PT Maju Bersama",
      category: "Enterprise",
      description: "Sistem ERP terintegrasi untuk manajemen HR, keuangan, inventory, dan operasional perusahaan.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop",
      tech: ["Vue.js", "Laravel", "MySQL", "Redis"],
      features: [
        "HR & Payroll management",
        "Financial accounting",
        "Inventory control",
        "Business intelligence"
      ],
      icon: BuildingOfficeIcon,
      year: "2024"
    },
    {
      id: 5,
      title: "Mobile Banking App",
      client: "Bank Digital Nusantara",
      category: "Finance",
      description: "Aplikasi mobile banking dengan fitur transfer, pembayaran tagihan, dan investasi digital.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop",
      tech: ["React Native", "Node.js", "MongoDB", "Blockchain"],
      features: [
        "Secure transactions",
        "Bill payments",
        "Investment portfolio",
        "Biometric authentication"
      ],
      icon: DevicePhoneMobileIcon,
      year: "2024"
    },
    {
      id: 6,
      title: "Social Media Analytics",
      client: "Digital Marketing Agency",
      category: "Marketing",
      description: "Platform analytics untuk monitoring dan analisis performa media sosial dengan AI-powered insights.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      tech: ["React", "Python", "TensorFlow", "MongoDB"],
      features: [
        "Multi-platform monitoring",
        "AI sentiment analysis",
        "Competitor tracking",
        "Custom reporting"
      ],
      icon: ChartBarIcon,
      year: "2023"
    }
  ]

  const stats = [
    { label: "Projects Completed", value: "150+", icon: CheckCircleIcon },
    { label: "Happy Clients", value: "120+", icon: UserGroupIcon },
    { label: "Years Experience", value: "8+", icon: GlobeAltIcon },
    { label: "Team Members", value: "25+", icon: ComputerDesktopIcon }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Our References - NeoIntegra Tech</title>
        <meta name="description" content="Portfolio dan referensi project yang telah kami kerjakan untuk berbagai industri." />
      </Helmet>

      <div className="min-h-screen bg-dark-300">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary-600/10 via-dark-200 to-dark-300 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Our <span className="gradient-text">References</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Portfolio project dan klien yang telah mempercayai kami untuk membangun solusi digital mereka
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-dark-100/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-primary-500/50 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20">
          <div className="container-custom">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group bg-dark-100 rounded-xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
                >
                  {/* Project Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-dark-100/50 to-transparent opacity-60"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-dark-100/90 backdrop-blur-sm text-gray-300 text-xs font-semibold rounded-full">
                        {project.year}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                        <project.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-primary-400 mb-3">{project.client}</p>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-dark-200 text-gray-300 text-xs rounded border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {project.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-600/10 to-dark-200">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan 120+ klien yang telah mempercayai kami untuk mengembangkan solusi digital mereka
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/services"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
                >
                  View Services
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default References
