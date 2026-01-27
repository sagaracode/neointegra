import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const eligibleConditions = [
    "Layanan belum dimulai pengerjaannya (maksimal 3 hari kerja setelah pembayaran)",
    "Terjadi kesalahan teknis dari pihak kami yang menyebabkan layanan tidak dapat diberikan",
    "Layanan yang diberikan tidak sesuai dengan spesifikasi yang telah disepakati dalam kontrak",
    "Pembatalan dari pihak kami karena force majeure atau kondisi di luar kendali"
  ]

  const notEligibleConditions = [
    "Proyek telah memasuki tahap pengerjaan (setelah design/development dimulai)",
    "Pembayaran untuk layanan subscription yang sudah aktif/digunakan",
    "Perubahan keputusan atau kehilangan minat dari klien setelah pekerjaan dimulai",
    "Keterlambatan dari pihak klien dalam memberikan feedback atau material yang diperlukan",
    "Klien melanggar syarat dan ketentuan penggunaan layanan",
    "Domain, hosting, atau layanan third-party yang sudah terdaftar/aktif"
  ]

  const refundProcess = [
    {
      step: "1",
      title: "Ajukan Permohonan",
      description: "Kirim email ke support@neointegratech.com dengan subject 'Refund Request' disertai nomor invoice dan alasan pengembalian dana",
      time: "1-2 hari kerja"
    },
    {
      step: "2",
      title: "Verifikasi",
      description: "Tim kami akan melakukan verifikasi kelengkapan dokumen dan kelayakan permohonan sesuai kebijakan",
      time: "3-5 hari kerja"
    },
    {
      step: "3",
      title: "Persetujuan",
      description: "Anda akan menerima email konfirmasi persetujuan atau penolakan beserta alasannya",
      time: "1 hari kerja"
    },
    {
      step: "4",
      title: "Proses Pengembalian",
      description: "Dana akan dikembalikan ke rekening atau metode pembayaran yang sama dengan saat transaksi",
      time: "7-14 hari kerja"
    }
  ]

  const refundAmounts = [
    {
      condition: "Pembatalan sebelum pengerjaan dimulai",
      amount: "100%",
      note: "Dikurangi biaya administrasi 5%",
      color: "text-green-400"
    },
    {
      condition: "Pembatalan setelah design fase (0-25% progress)",
      amount: "70%",
      note: "Dari total pembayaran yang telah dilakukan",
      color: "text-yellow-400"
    },
    {
      condition: "Pembatalan di tengah development (25-50% progress)",
      amount: "50%",
      note: "Dari total pembayaran yang telah dilakukan",
      color: "text-orange-400"
    },
    {
      condition: "Pembatalan setelah 50% progress",
      amount: "Tidak ada pengembalian dana",
      note: "Pekerjaan yang sudah selesai tetap menjadi hak klien",
      color: "text-red-400"
    }
  ]

  const importantNotes = [
    "Biaya domain, hosting, SSL certificate, dan layanan third-party yang sudah dibeli tidak dapat dikembalikan",
    "Pengembalian dana hanya dapat dilakukan ke rekening atas nama pemilik invoice/pembayar",
    "Proses pengembalian dana memerlukan waktu 7-14 hari kerja tergantung metode pembayaran",
    "Untuk pembayaran dengan kartu kredit, refund akan diproses oleh payment gateway (7-14 hari kerja)",
    "Untuk transfer bank, refund akan langsung diproses ke rekening tujuan (3-7 hari kerja)",
    "Biaya transfer bank (jika ada) menjadi tanggungan penerima dana",
    "Kebijakan ini dapat berubah sewaktu-waktu dengan pemberitahuan di website"
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
            <CurrencyDollarIcon className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Kebijakan <span className="gradient-text">Pengembalian Dana</span>
            </h1>
            <p className="text-lg text-gray-300">
              Transparansi dan kepuasan klien adalah prioritas kami
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Terakhir diperbarui: 27 Januari 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eligible Conditions */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Eligible */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-dark-100 border border-green-500/30 rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircleIcon className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">Berhak Refund</h2>
                </div>
                <ul className="space-y-4">
                  {eligibleConditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{condition}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Not Eligible */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-dark-100 border border-red-500/30 rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <XCircleIcon className="w-8 h-8 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Tidak Berhak Refund</h2>
                </div>
                <ul className="space-y-4">
                  {notEligibleConditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{condition}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Refund Amounts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-dark-100 border border-gray-700/50 rounded-xl p-8 mb-16"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Jumlah Pengembalian Dana</h2>
              <div className="space-y-6">
                {refundAmounts.map((item, index) => (
                  <div key={index} className="bg-dark-200 rounded-lg p-6 border border-gray-700/50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{item.condition}</h3>
                        <p className="text-sm text-gray-400">{item.note}</p>
                      </div>
                      <div className={`text-3xl font-bold ${item.color}`}>
                        {item.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-dark-100 border border-gray-700/50 rounded-xl p-8 mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <DocumentCheckIcon className="w-8 h-8 text-primary-400" />
                <h2 className="text-2xl font-bold text-white">Proses Pengembalian Dana</h2>
              </div>
              
              <div className="space-y-6">
                {refundProcess.map((step, index) => (
                  <div key={index} className="relative">
                    {index < refundProcess.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-primary-600/30"></div>
                    )}
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 relative z-10">
                        {step.step}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-primary-400">
                            <ClockIcon className="w-4 h-4" />
                            {step.time}
                          </div>
                        </div>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Catatan Penting</h2>
              </div>
              <ul className="space-y-3">
                {importantNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-300 text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600/10 to-primary-700/10 border border-primary-500/30 rounded-xl p-8 text-center mt-12"
            >
              <h3 className="text-xl font-bold text-white mb-4">Butuh Bantuan dengan Pengembalian Dana?</h3>
              <p className="text-gray-300 mb-6">
                Tim customer support kami siap membantu Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@neointegratech.com"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Email Support
                </a>
                <a
                  href="/contact"
                  className="px-6 py-3 bg-dark-200 text-white rounded-lg font-semibold hover:bg-dark-100 transition-colors border border-gray-700"
                >
                  Hubungi Kami
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RefundPolicy
