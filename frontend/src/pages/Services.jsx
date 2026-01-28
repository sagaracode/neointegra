import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline'
import { servicesAPI, ordersAPI, paymentsAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const serviceData = {
  'all-in': {
    title: 'Paket All In Service',
    badge: '⭐ REKOMENDASI',
    description: 'Paket paling hemat & optimal untuk bisnis jangka panjang',
    icon: '⭐',
    gradient: 'from-yellow-500 to-orange-500',
    price: 'Rp 81.000.000',
    period: '/ Tahun',
    savings: 'Hemat Rp 36.000.000',
    isRecommended: true,
    features: [
      'Website Service - Pembuatan website profesional (custom UI/UX)',
      'SEO Service (12 bulan) - Optimasi berkelanjutan',
      'Mail Server Service - Email bisnis dengan domain perusahaan',
      'Cloudflare Protection - Keamanan & performa maksimal',
      'Hosting performa tinggi',
      'Support teknis lengkap',
    ],
    note: '💡 Paket paling hemat & optimal untuk bisnis jangka panjang',
    cta: 'Ambil Paket All In',
  },
  'website': {
    title: 'Website Service',
    description: 'Website Service Profesional - Pembuatan website custom dengan performa tinggi.',
    icon: '🌐',
    gradient: 'from-blue-500 to-cyan-500',
    price: 'Rp 36.000.000',
    period: '/ Tahun',
    comparisonNote: 'Layanan tahunan - Tidak direkomendasikan jika diambil terpisah',
    features: [
      'Pembuatan website profesional (custom UI/UX)',
      'Hosting performa tinggi',
      'Optimasi kecepatan website',
      'Maintenance & update rutin',
      'Backup & keamanan dasar',
      'Support teknis',
    ],
    note: 'Harga tahunan lebih hemat daripada bulanan. Akan lebih murah signifikan jika digabung dalam Paket All In.',
    cta: 'Bandingkan dengan Paket All In',
  },
  'seo': {
    title: 'SEO Service',
    description: 'SEO Service Berkelanjutan (12 Bulan) - Optimasi mesin pencari profesional.',
    icon: '📈',
    gradient: 'from-red-500 to-orange-500',
    price: 'Rp 42.000.000',
    period: '/ Tahun',
    comparisonNote: 'Layanan tatunan - Tidak direkomendasikan jika diambil terpisah',
    features: [
      'SEO On-Page & Technical',
      'Optimasi struktur & kecepatan website',
      'Setup Google Search Console & Analytics',
      'Monitoring keyword bulanan',
      'Laporan performa SEO',
      'Optimasi berkelanjutan selama 12 bulan',
    ],
    note: 'SEO adalah proses jangka panjang. Nilai terbaik diperoleh saat dikombinasikan dengan Website & Cloudflare dalam Paket All In.',
    cta: 'Lihat Paket All In',
  },
  'mail-server': {
    title: 'Mail Server Service',
    description: 'Mail Server Bisnis Profesional - Email bisnis dengan domain perusahaan.',
    icon: '✉️',
    gradient: 'from-purple-500 to-pink-500',
    price: 'Rp 15.000.000',
    period: '/ Tahun',
    comparisonNote: 'Layanan tahunan - Tidak direkomendasikan jika diambil terpisah',
    features: [
      'Email bisnis dengan domain perusahaan',
      'Setup SPF, DKIM, DMARC',
      'Perlindungan spam & phishing',
      'Sinkronisasi webmail & perangkat',
      'Maintenance & support',
    ],
    note: 'Email bisnis paling optimal jika terintegrasi dengan sistem website & keamanan Cloudflare.',
    cta: 'Paket Email dalam All In',
  },
  'cloudflare': {
    title: 'Cloudflare Service',
    description: 'Cloudflare Protection & Performance - Keamanan dan performa maksimal.',
    icon: '🛡️',
    gradient: 'from-orange-500 to-yellow-500',
    price: 'Rp 24.000.000',
    period: '/ Tahun',
    comparisonNote: 'Layanan tahunan - Tidak direkomendasikan jika diambil terpisah',
    features: [
      'CDN global & caching',
      'Proteksi DDoS & Firewall',
      'SSL Full Encryption',
      'Proteksi bot & traffic berbahaya',
      'Monitoring keamanan 24/7',
    ],
    note: 'Perlindungan maksimal diperoleh saat Cloudflare menjadi bagian dari sistem terpadu Paket All In.',
    cta: 'Amankan Website dengan Paket All In',
  },
  'comparison': {
    title: 'Perbandingan Harga',
    description: 'Mana yang Lebih Efisien? Bandingkan harga paket vs layanan terpisah.',
    icon: '📊',
    gradient: 'from-green-500 to-blue-500',
    comparisonData: {
      separate: {
        title: 'Layanan Terpisah',
        price: 'Rp 117.000.000',
        period: '/ tahun'
      },
      package: {
        title: 'Paket All In',
        price: 'Rp 81.000.000',
        period: '/ tahun'
      },
      savings: 'Hemat Rp 36.000.000 / tahun'
    },
    cta: 'Pilih Paket All In',
  },
}

export default function Services() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await servicesAPI.getAll()
      setServices(response.data)
    } catch (error) {
      console.error('Failed to load services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (serviceSlug) => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login?redirect=/services')
      return
    }

    setCheckoutLoading(serviceSlug)
    
    try {
      // 1. Create order
      const orderResponse = await ordersAPI.create({
        service_slug: serviceSlug,
        quantity: 1,
        notes: `Order from Services page - ${serviceSlug}`
      })
      
      const orderId = orderResponse.data.id
      const totalPrice = orderResponse.data.total_price

      // 2. Create payment
      const paymentResponse = await paymentsAPI.create({
        order_id: orderId,
        payment_method: 'va',
        payment_channel: 'bca',
        amount: totalPrice
      })

      const paymentData = paymentResponse.data

      // 3. Redirect to payment URL
      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url
      } else {
        toast.error('URL pembayaran tidak tersedia')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error?.response?.data?.detail || error.message || 'Gagal melakukan checkout'
      toast.error(errorMessage)
    } finally {
      setCheckoutLoading(null)
    }
  }

  // If slug is provided, show single service detail
  if (slug && serviceData[slug]) {
    const service = serviceData[slug]
    
    // Special handling for All In Service package
    if (slug === 'all-in') {
      return (
        <div className="pt-20">
          {/* Hero */}
          <section className="section bg-dark-300 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-3xl`} />
            </div>

            <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-yellow-600/20 rounded-full text-yellow-400 font-poppins text-sm mb-4">
                    {service.badge}
                  </span>
                </div>
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-5xl mx-auto mb-8 shadow-glow`}>
                  {service.icon}
                </div>
                <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-6">
                  {service.title}
                </h1>
                <div className="mb-8">
                  <div className="font-montserrat font-bold text-5xl md:text-6xl gradient-text mb-2">
                    {service.price}
                  </div>
                  <div className="text-gray-400 text-xl">{service.period}</div>
                  <div className="inline-block px-4 py-2 bg-green-600/20 rounded-full text-green-400 font-poppins text-sm mt-4">
                    {service.savings}
                  </div>
                </div>
                <p className="font-poppins text-gray-400 text-lg">
                  {service.description}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Features */}
          <section className="section bg-dark-200">
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-montserrat font-bold text-3xl text-white mb-8">
                  Termasuk <span className="gradient-text">Layanan</span>
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-5 h-5 text-primary-400" />
                    </div>
                    <span className="font-poppins text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-block p-4 bg-yellow-600/10 rounded-2xl border border-yellow-600/20 mb-8">
                  <p className="text-yellow-400 font-poppins">{service.note}</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section bg-dark-300">
            <div className="container-custom text-center">
              <h2 className="font-montserrat font-bold text-3xl text-white mb-6">
                Siap Mengembangkan Bisnis Anda?
              </h2>
              <p className="font-poppins text-gray-400 mb-8 max-w-xl mx-auto">
                Konsultasikan kebutuhan digital Anda dan dapatkan solusi paling efisien untuk pertumbuhan jangka panjang.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleCheckout('all-in')}
                  disabled={checkoutLoading === 'all-in'}
                >
                  {checkoutLoading === 'all-in' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    'Checkout & Bayar Sekarang'
                  )}
                </button>
                <Link to="/services/comparison" className="btn btn-secondary">
                  Lihat Perbandingan Harga
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Konsultasi Gratis
                </Link>
              </div>
            </div>
          </section>
        </div>
      )
    }

    // Special handling for comparison page
    if (slug === 'comparison') {
      return (
        <div className="pt-20">
          {/* Hero */}
          <section className="section bg-dark-300 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-3xl`} />
            </div>

            <div className="container-custom relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-5xl mx-auto mb-8 shadow-glow`}>
                  {service.icon}
                </div>
                <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-6">
                  {service.title}
                </h1>
                <p className="font-poppins text-gray-400 text-lg">
                  {service.description}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Comparison */}
          <section className="section bg-dark-200">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="card text-center"
                  >
                    <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
                      {service.comparisonData.separate.title}
                    </h3>
                    <div className="font-montserrat font-bold text-4xl text-red-400 mb-2">
                      {service.comparisonData.separate.price}
                    </div>
                    <div className="text-gray-400">{service.comparisonData.separate.period}</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="card text-center border-2 border-primary-600/50 relative"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                        REKOMENDASI
                      </span>
                    </div>
                    <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
                      {service.comparisonData.package.title}
                    </h3>
                    <div className="font-montserrat font-bold text-4xl gradient-text mb-2">
                      {service.comparisonData.package.price}
                    </div>
                    <div className="text-gray-400">{service.comparisonData.package.period}</div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-block p-6 bg-green-600/10 rounded-2xl border border-green-600/20">
                    <div className="text-3xl font-montserrat font-bold text-green-400 mb-2">
                      🎯 {service.comparisonData.savings}
                    </div>
                    <p className="text-gray-300">dengan memilih Paket All In Service</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section bg-dark-300">
            <div className="container-custom text-center">
              <h2 className="font-montserrat font-bold text-3xl text-white mb-6">
                Sudah Jelas Mana yang Lebih Menguntungkan?
              </h2>
              <p className="font-poppins text-gray-400 mb-8 max-w-xl mx-auto">
                Investasi terbaik untuk pertumbuhan bisnis jangka panjang dengan penghematan maksimal.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/services/all-in" className="btn btn-primary">
                  {service.cta}
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Konsultasi Gratis
                </Link>
              </div>
            </div>
          </section>
        </div>
      )
    }
    
    // Regular service pages
    return (
      <div className="pt-20">
        {/* Hero */}
        <section className="section bg-dark-300 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-3xl`} />
          </div>

          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              {service.comparisonNote && (
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-orange-600/20 rounded-full text-orange-400 font-poppins text-sm">
                    🔹 {service.comparisonNote}
                  </span>
                </div>
              )}
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-5xl mx-auto mb-8 shadow-glow`}>
                {service.icon}
              </div>
              <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-6">
                {service.title}
              </h1>
              <div className="mb-8">
                <div className="font-montserrat font-bold text-4xl md:text-5xl gradient-text mb-2">
                  {service.price}
                </div>
                <div className="text-gray-400 text-xl">{service.period}</div>
              </div>
              <p className="font-poppins text-gray-400 text-lg">
                {service.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="section bg-dark-200">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-montserrat font-bold text-3xl text-white mb-8">
                  Layanan Ini <span className="gradient-text">Mencakup</span>
                </h2>
                <div className="space-y-4">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-5 h-5 text-primary-400" />
                      </div>
                      <span className="font-poppins text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="font-montserrat font-bold text-3xl text-white mb-8">
                  Catatan <span className="gradient-text">Harga</span>
                </h2>
                <div className="p-6 bg-yellow-600/10 rounded-2xl border border-yellow-600/20">
                  <p className="text-gray-300 font-poppins leading-relaxed">
                    {service.note}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button
                    className="btn btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleCheckout(slug)}
                    disabled={checkoutLoading === slug}
                  >
                    {checkoutLoading === slug ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Memproses...
                      </span>
                    ) : (
                      'Checkout & Bayar Sekarang'
                    )}
                  </button>
                  <Link to="/services/all-in" className="btn btn-primary w-full">
                    {service.cta}
                  </Link>
                  <Link to="/services/comparison" className="btn btn-secondary w-full">
                    Lihat Perbandingan Harga
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer Notice */}
        <section className="section bg-dark-300">
          <div className="container-custom text-center">
            <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 max-w-2xl mx-auto">
              <h3 className="font-montserrat font-bold text-lg text-white mb-3">
                🔒 Ketentuan Layanan
              </h3>
              <p className="font-poppins text-gray-400 text-sm">
                Seluruh layanan kami disediakan dalam bentuk paket atau kontrak tahunan.
                Kami tidak menyediakan layanan satuan bulanan.
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Show all services list
  return (
    <div className="pt-20">
      <section className="section bg-dark-300 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary-600/20 rounded-full text-primary-400 font-poppins text-sm mb-6">
              Our Services
            </span>
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-6">
              Layanan <span className="gradient-text">Kami</span>
            </h1>
            <p className="font-poppins text-gray-400 text-lg">
              Solusi lengkap untuk kebutuhan teknologi bisnis Anda
            </p>
          </motion.div>

          {/* All In Package - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <Link to="/services/all-in" className="block">
              <div className="card card-hover relative overflow-hidden border-2 border-yellow-600/50 bg-gradient-to-r from-yellow-600/10 to-orange-600/10">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ REKOMENDASI
                  </span>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-5xl shadow-glow">
                      ⭐
                    </div>
                  </div>
                  <div className="flex-grow text-center lg:text-left">
                    <h2 className="font-montserrat font-bold text-3xl text-white mb-3">
                      Paket All In Service
                    </h2>
                    <p className="font-poppins text-gray-300 mb-4">
                      Paket paling hemat & optimal untuk bisnis jangka panjang
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">Website Service</span>
                      <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">SEO Service</span>
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">Mail Server</span>
                      <span className="px-3 py-1 bg-orange-600/20 text-orange-400 rounded-full text-sm">Cloudflare</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <div className="font-montserrat font-bold text-4xl gradient-text mb-2">
                      Rp 81.000.000
                    </div>
                    <div className="text-gray-400 mb-2">/ Tahun</div>
                    <div className="inline-block px-3 py-1 bg-green-600/20 rounded-full text-green-400 text-sm font-bold">
                      Hemat Rp 36.000.000
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-6 text-yellow-400 font-poppins font-medium group">
                  Lihat Detail Paket
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Section Divider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-12"
          >
            <div className="inline-block p-6 bg-orange-600/10 rounded-2xl border border-orange-600/20">
              <h2 className="font-montserrat font-bold text-2xl text-white mb-3">
                🔹 Layanan Tahunan <span className="text-orange-400">(Sebagai Pembanding Nilai)</span>
              </h2>
              <p className="text-gray-400">
                Layanan berikut tersedia hanya kontrak tahunan
              </p>
              <p className="text-orange-400 font-medium">
                Tidak direkomendasikan jika diambil terpisah
              </p>
            </div>
          </motion.div>

          {/* Individual Services */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {Object.entries(serviceData)
              .filter(([key]) => !['all-in', 'comparison'].includes(key))
              .map(([key, service], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="h-full flex flex-col">
                    <Link to={`/services/${key}`} className="block flex-grow">
                      <div className="card card-hover h-full flex flex-col opacity-75 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-2xl`}>
                            {service.icon}
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-montserrat font-bold text-lg text-white">
                              {service.title}
                            </h3>
                            <div className="font-montserrat font-bold text-xl text-gray-300">
                              {service.price} <span className="text-sm text-gray-500">{service.period}</span>
                            </div>
                          </div>
                        </div>
                        <p className="font-poppins text-gray-400 text-sm mb-4 flex-grow">
                          {service.description}
                        </p>
                        <div className="flex items-center text-gray-400 font-poppins text-sm group">
                          Lihat Detail
                          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                    <button
                      className="btn btn-success w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleCheckout(key)}
                      disabled={checkoutLoading === key}
                    >
                      {checkoutLoading === key ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Memproses...
                        </span>
                      ) : (
                        'Checkout & Bayar'
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Total Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-block p-6 bg-red-600/10 rounded-2xl border border-red-600/20">
              <h3 className="font-montserrat font-bold text-xl text-white mb-3">
                💸 Total jika diambil terpisah:
              </h3>
              <div className="font-montserrat font-bold text-3xl text-red-400 line-through">
                Rp 117.000.000 / tahun
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to="/services/all-in" className="btn btn-primary">
              Pilih Paket All In
            </Link>
            <Link to="/services/comparison" className="btn btn-secondary">
              Perbandingan Harga Detail
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Konsultasi Gratis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer Notice */}
      <section className="section bg-dark-200">
        <div className="container-custom text-center">
          <div className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700/50 max-w-4xl mx-auto">
            <h3 className="font-montserrat font-bold text-2xl text-white mb-6">
              🔒 Kalimat Penegas
            </h3>
            <p className="font-poppins text-gray-300 text-lg leading-relaxed">
              Seluruh layanan kami disediakan dalam bentuk paket atau kontrak tahunan.
              <br />
              <span className="text-primary-400 font-medium">
                Kami tidak menyediakan layanan satuan bulanan.
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
