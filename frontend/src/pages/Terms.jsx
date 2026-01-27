import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sections = [
    {
      icon: DocumentTextIcon,
      title: "Definisi",
      content: [
        "Website: Merujuk pada platform digital NeoIntegra Tech yang dapat diakses melalui neointegratech.com",
        "Layanan: Semua produk dan jasa yang ditawarkan oleh NeoIntegra Tech termasuk pembuatan website, aplikasi mobile, dan konsultasi IT",
        "Pengguna: Setiap individu atau entitas yang mengakses atau menggunakan layanan kami",
        "Akun: Akses terdaftar yang diberikan kepada pengguna untuk menggunakan layanan kami"
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: "Penggunaan Layanan",
      content: [
        "Anda harus berusia minimal 18 tahun atau memiliki izin dari orang tua/wali untuk menggunakan layanan kami",
        "Informasi yang Anda berikan harus akurat, lengkap, dan terkini",
        "Anda bertanggung jawab menjaga kerahasiaan akun dan password Anda",
        "Anda tidak diperkenankan menggunakan layanan untuk aktivitas ilegal atau melanggar hukum",
        "Dilarang melakukan reverse engineering, dekompilasi, atau disassembly terhadap sistem kami"
      ]
    },
    {
      icon: ScaleIcon,
      title: "Hak Kekayaan Intelektual",
      content: [
        "Semua konten, kode, desain, logo, dan material lainnya adalah hak milik NeoIntegra Tech",
        "Source code yang kami kembangkan untuk proyek custom menjadi hak milik klien setelah pelunasan 100%",
        "Template dan framework yang kami gunakan tetap menjadi hak milik pengembang aslinya",
        "Anda tidak diperkenankan menggunakan, memodifikasi, atau mendistribusikan konten kami tanpa izin tertulis"
      ]
    },
    {
      icon: InformationCircleIcon,
      title: "Pembayaran dan Tagihan",
      content: [
        "Pembayaran harus dilakukan sesuai dengan metode yang telah disepakati",
        "Untuk proyek custom, pembayaran dilakukan dengan sistem termin: 30% DP, 40% progress, 30% selesai",
        "Layanan berlangganan akan diperpanjang otomatis kecuali dibatalkan sebelum tanggal perpanjangan",
        "Harga dapat berubah sewaktu-waktu dengan pemberitahuan minimal 30 hari sebelumnya",
        "Pajak yang berlaku akan ditambahkan sesuai regulasi pemerintah"
      ]
    }
  ]

  const additionalTerms = [
    {
      title: "Pembatalan dan Pengembalian Dana",
      items: [
        "Pembatalan proyek setelah DP dibayarkan akan dikenakan biaya administrasi 30%",
        "Pengembalian dana hanya berlaku untuk layanan yang belum dimulai pengerjaannya",
        "Untuk detail lengkap, silakan baca Kebijakan Pengembalian Dana kami"
      ]
    },
    {
      title: "Batasan Tanggung Jawab",
      items: [
        "NeoIntegra Tech tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial",
        "Tanggung jawab kami terbatas pada nilai kontrak atau pembayaran yang telah diterima",
        "Kami tidak menjamin layanan akan bebas dari kesalahan atau gangguan",
        "Force majeure (bencana alam, perang, dll) akan membebaskan kami dari kewajiban"
      ]
    },
    {
      title: "Kerahasiaan Data",
      items: [
        "Kami berkomitmen melindungi data pribadi sesuai regulasi yang berlaku",
        "Data proyek klien tidak akan dibagikan kepada pihak ketiga tanpa izin",
        "Kami menggunakan enkripsi dan sistem keamanan standar industri",
        "Untuk informasi lengkap, lihat Kebijakan Privasi kami"
      ]
    },
    {
      title: "Dukungan dan Pemeliharaan",
      items: [
        "Garansi bug fixing gratis selama 30 hari setelah launching",
        "Dukungan teknis tersedia pada jam kerja (Senin-Jumat, 09:00-17:00 WIB)",
        "Pemeliharaan rutin dan update keamanan tersedia dengan paket berlangganan",
        "Support di luar jam kerja akan dikenakan biaya tambahan"
      ]
    },
    {
      title: "Perubahan Layanan",
      items: [
        "Kami berhak mengubah, memodifikasi, atau menghentikan layanan kapan saja",
        "Perubahan signifikan akan diberitahukan minimal 30 hari sebelumnya",
        "Anda akan diberikan opsi untuk migrasi atau pembatalan jika tidak setuju dengan perubahan"
      ]
    },
    {
      title: "Penyelesaian Sengketa",
      items: [
        "Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia",
        "Sengketa akan diselesaikan secara musyawarah terlebih dahulu",
        "Jika musyawarah gagal, penyelesaian melalui pengadilan Jakarta Selatan",
        "Bahasa resmi untuk interpretasi adalah Bahasa Indonesia"
      ]
    }
  ]

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
            <DocumentTextIcon className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Syarat & <span className="gradient-text">Ketentuan</span>
            </h1>
            <p className="text-lg text-gray-300">
              Mohon baca dengan seksama syarat dan ketentuan penggunaan layanan NeoIntegra Tech
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Terakhir diperbarui: 27 Januari 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-100 border border-gray-700/50 rounded-xl p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                  </div>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Additional Terms */}
            {additionalTerms.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (sections.length + index) * 0.1 }}
                className="bg-dark-100 border border-gray-700/50 rounded-xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">{term.title}</h2>
                <ul className="space-y-3">
                  {term.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600/10 to-primary-700/10 border border-primary-500/30 rounded-xl p-8 text-center"
            >
              <h3 className="text-xl font-bold text-white mb-4">Pertanyaan tentang Syarat & Ketentuan?</h3>
              <p className="text-gray-300 mb-6">
                Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Hubungi Kami
                </a>
                <a
                  href="/faq"
                  className="px-6 py-3 bg-dark-200 text-white rounded-lg font-semibold hover:bg-dark-100 transition-colors border border-gray-700"
                >
                  Lihat FAQ
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Terms
