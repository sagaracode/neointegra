import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const contactInfo = [
  {
    icon: EnvelopeIcon,
    title: 'Email',
    value: 'hello@neointegratech.com',
    link: 'mailto:hello@neointegratech.com',
  },
  {
    icon: PhoneIcon,
    title: 'Phone',
    value: '+62 851 2136 9617',
    link: 'tel:+6285121369617',
  },
  {
    icon: ChatBubbleLeftRightIcon,
      title: 'WhatsApp',
      value: '+62 851 2136 9617',
      link: 'https://wa.me/6285121369617',
  },
  {
    icon: MapPinIcon,
    title: 'Address',
    value: 'Komplek, Sentral Senayan II, Plaza Senayan, Jl. Asia Afrika No.8 11th floor, Senayan, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10270',
    link: 'https://share.google/7N7vsQ7a1xNwZWW06',
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="pt-20">
      {/* Hero */}
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
              Contact Us
            </span>
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-white mb-6">
              Hubungi <span className="gradient-text">Kami</span>
            </h1>
            <p className="font-poppins text-gray-400 text-lg">
              Punya pertanyaan atau butuh bantuan? Tim kami siap membantu Anda 24/7.
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover text-center group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white mb-2">
                  {info.title}
                </h3>
                <p className="font-poppins text-gray-400 text-sm">
                  {info.value}
                </p>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-montserrat font-bold text-3xl text-white mb-6">
                Kirim <span className="gradient-text">Pesan</span>
              </h2>
              <p className="font-poppins text-gray-400 mb-8">
                Isi form di bawah ini dan kami akan menghubungi Anda dalam waktu 24 jam.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-poppins text-gray-300 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block font-poppins text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-poppins text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Topik pesan Anda"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-gray-300 mb-2">
                    Pesan
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input resize-none"
                    placeholder="Tuliskan pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Pesan'
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map or Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="card h-64 md:h-80 flex items-center justify-center bg-dark-100 p-0 overflow-hidden">
                <iframe
                  title="Lokasi Kantor Neointegra"
                  src="https://share.google/7N7vsQ7a1xNwZWW06"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="card">
                <h3 className="font-montserrat font-bold text-xl text-white mb-4">
                  Jam Operasional
                </h3>
                <div className="space-y-3 font-poppins text-gray-400">
                  <div className="flex justify-between">
                    <span>Senin - Jumat</span>
                    <span className="text-white">09:00 - 18:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sabtu</span>
                    <span className="text-white">09:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu</span>
                    <span className="text-gray-500">Tutup</span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-primary-400">
                      💬 Support 24/7 via WhatsApp & Email
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
