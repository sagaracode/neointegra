import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [activeIndex, setActiveIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'general', name: 'Umum' },
    { id: 'service', name: 'Layanan' },
    { id: 'payment', name: 'Pembayaran' },
    { id: 'technical', name: 'Teknis' },
    { id: 'support', name: 'Support' }
  ]

  const faqs = [
    {
      category: 'general',
      question: 'Apa itu NeoIntegra Tech?',
      answer: 'NeoIntegra Tech adalah perusahaan penyedia layanan teknologi informasi yang fokus pada pembuatan website, aplikasi mobile, dan solusi digital untuk berbagai industri. Kami memiliki pengalaman lebih dari 8 tahun dengan 150+ project yang telah diselesaikan.'
    },
    {
      category: 'general',
      question: 'Dimana lokasi kantor NeoIntegra Tech?',
      answer: 'Kantor kami berlokasi di Jakarta, Indonesia. Namun kami melayani klien dari seluruh Indonesia dan juga beberapa negara Asia Tenggara. Sebagian besar komunikasi dan koordinasi dapat dilakukan secara online.'
    },
    {
      category: 'service',
      question: 'Layanan apa saja yang ditawarkan?',
      answer: 'Kami menawarkan berbagai layanan termasuk: Pembuatan Website (Company Profile, E-Commerce, Blog), Aplikasi Mobile (iOS & Android), Custom Software Development, UI/UX Design, Cloud Services & Hosting, Konsultasi IT, Digital Marketing, dan Maintenance & Support.'
    },
    {
      category: 'service',
      question: 'Berapa lama waktu pembuatan website?',
      answer: 'Waktu pengerjaan bervariasi tergantung kompleksitas: Website Company Profile (2-4 minggu), E-Commerce (6-8 minggu), Custom Web Application (8-16 minggu). Timeline detail akan didiskusikan saat konsultasi awal.'
    },
    {
      category: 'service',
      question: 'Apakah bisa request custom feature?',
      answer: 'Tentu saja! Kami sangat terbuka untuk custom feature sesuai kebutuhan bisnis Anda. Tim kami akan melakukan analisis kebutuhan dan memberikan solusi terbaik yang sesuai dengan budget dan timeline Anda.'
    },
    {
      category: 'payment',
      question: 'Bagaimana sistem pembayarannya?',
      answer: 'Untuk project custom, kami menggunakan sistem termin: 30% DP (saat kick-off), 40% progress payment (saat design/development 50% selesai), dan 30% pelunasan (saat project selesai dan ready launching). Untuk layanan subscription, pembayaran dilakukan di awal periode.'
    },
    {
      category: 'payment',
      question: 'Metode pembayaran apa saja yang diterima?',
      answer: 'Kami menerima berbagai metode pembayaran: Transfer Bank (BCA, Mandiri, BNI, BRI), Virtual Account, E-Wallet (GoPay, OVO, Dana), QRIS, dan Kartu Kredit. Semua pembayaran terintegrasi dengan payment gateway iPaymu.'
    },
    {
      category: 'payment',
      question: 'Apakah ada biaya maintenance?',
      answer: 'Kami memberikan garansi bug fixing gratis selama 30 hari setelah launching. Untuk maintenance berkelanjutan, kami menawarkan paket subscription mulai dari Rp 500.000/bulan yang mencakup: update konten, backup rutin, security monitoring, dan technical support.'
    },
    {
      category: 'technical',
      question: 'Teknologi apa yang digunakan?',
      answer: 'Kami menggunakan teknologi modern dan terbukti: Frontend (React.js, Vue.js, Next.js), Backend (Node.js, Python/FastAPI, PHP/Laravel), Mobile (React Native, Flutter), Database (PostgreSQL, MySQL, MongoDB), Cloud (AWS, Google Cloud, Azure), dan DevOps (Docker, Kubernetes, CI/CD).'
    },
    {
      category: 'technical',
      question: 'Apakah website yang dibuat responsive?',
      answer: 'Ya, semua website yang kami buat sudah responsive dan mobile-friendly. Kami menerapkan prinsip mobile-first design dan melakukan testing di berbagai device (smartphone, tablet, desktop) untuk memastikan tampilan optimal di semua layar.'
    },
    {
      category: 'technical',
      question: 'Apakah website sudah SEO-friendly?',
      answer: 'Ya, kami menerapkan SEO best practices pada setiap website yang kami buat, termasuk: struktur URL yang clean, meta tags yang optimal, sitemap XML, schema markup, optimasi kecepatan loading, dan mobile responsiveness. Untuk SEO advanced, kami juga menyediakan layanan Digital Marketing.'
    },
    {
      category: 'technical',
      question: 'Apakah source code diserahkan ke klien?',
      answer: 'Ya, untuk project custom development, source code akan diserahkan kepada klien setelah pelunasan 100%. Anda akan mendapatkan full access termasuk dokumentasi teknis. Namun untuk template atau framework third-party, lisensi tetap mengikuti ketentuan dari pengembang aslinya.'
    },
    {
      category: 'support',
      question: 'Apakah ada garansi?',
      answer: 'Ya, kami memberikan garansi bug fixing gratis selama 30 hari setelah launching. Garansi ini mencakup perbaikan error, bug, atau masalah teknis yang muncul akibat kesalahan development kami. Tidak termasuk perubahan feature atau desain baru.'
    },
    {
      category: 'support',
      question: 'Bagaimana cara mendapatkan support?',
      answer: 'Anda dapat menghubungi kami melalui: Email (support@neointegratech.com), WhatsApp Business, Form Contact di website, atau Dashboard klien. Jam operasional support: Senin-Jumat 09:00-17:00 WIB. Untuk klien subscription, tersedia priority support.'
    },
    {
      category: 'support',
      question: 'Berapa lama response time untuk support?',
      answer: 'Untuk klien dengan paket subscription: maksimal 4 jam di jam kerja. Untuk klien regular: maksimal 24 jam di hari kerja. Emergency support di luar jam kerja tersedia dengan biaya tambahan dan hanya untuk klien subscription premium.'
    },
    {
      category: 'general',
      question: 'Apakah ada paket bundling untuk hemat biaya?',
      answer: 'Ya! Kami menawarkan paket bundling seperti: Website + Mobile App (diskon 15%), Website + Hosting + Maintenance setahun (diskon 20%), dan Package Complete (Website + App + Marketing, diskon 25%). Hubungi sales kami untuk penawaran spesial.'
    },
    {
      category: 'payment',
      question: 'Bagaimana kebijakan refund?',
      answer: 'Kami memiliki kebijakan refund yang jelas: Refund 100% (dikurangi admin 5%) jika pembatalan sebelum pengerjaan dimulai, Refund 70% jika pembatalan di design fase (0-25% progress), Refund 50% jika pembatalan di development fase (25-50% progress). Detail lengkap ada di halaman Refund Policy.'
    },
    {
      category: 'service',
      question: 'Apakah bisa konsultasi gratis dulu?',
      answer: 'Tentu! Kami menyediakan konsultasi gratis untuk membahas kebutuhan project Anda. Anda bisa booking konsultasi melalui form contact di website atau langsung hubungi WhatsApp kami. Konsultasi berlangsung 30-60 menit via video call atau meeting.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
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
            <QuestionMarkCircleIcon className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Temukan jawaban untuk pertanyaan yang sering diajukan
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-dark-100 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-gray-700/50">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-100 text-gray-400 hover:bg-dark-200 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <QuestionMarkCircleIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Tidak ada pertanyaan yang ditemukan</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-dark-100 border border-gray-700/50 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                      <span className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors pr-4">
                        {faq.question}
                      </span>
                      <ChevronDownIcon
                        className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${
                          activeIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 text-gray-300 border-t border-gray-700/50 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Still have questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600/10 to-primary-700/10 border border-primary-500/30 rounded-xl p-8 text-center mt-12"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Masih Ada Pertanyaan?</h3>
              <p className="text-gray-300 mb-6">
                Jangan ragu untuk menghubungi tim support kami. Kami siap membantu Anda!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Hubungi Support
                </a>
                <a
                  href="mailto:support@neointegratech.com"
                  className="px-8 py-3 bg-dark-200 text-white rounded-lg font-semibold hover:bg-dark-100 transition-colors border border-gray-700"
                >
                  Email Kami
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
