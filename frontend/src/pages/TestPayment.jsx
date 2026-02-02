import { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ordersAPI, paymentsAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const BANK_CHANNELS = [
  { code: 'bca', name: 'BCA', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/bca.png' },
  { code: 'bni', name: 'BNI', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/bni.png' },
  { code: 'bri', name: 'BRI', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/bri.png' },
  { code: 'mandiri', name: 'Mandiri', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/mandiri.png' },
  { code: 'cimb', name: 'CIMB Niaga', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/niaga.png' },
  { code: 'permata', name: 'Permata', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/permata.png' },
  { code: 'bsi', name: 'BSI', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/bsi.png' },
  { code: 'danamon', name: 'Danamon', logo: 'https://storage.googleapis.com/ipaymu-docs/assets/danamon.png' },
]

export default function TestPayment() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)

  const handleTestPayment = () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login?redirect=/test-payment')
      return
    }

    setShowBankModal(true)
  }

  const handleBankSelected = async () => {
    if (!selectedBank) return

    setShowBankModal(false)
    setLoading(true)

    try {
      // 1. Create test order with Rp 5.000
      const orderResponse = await ordersAPI.create({
        service_slug: 'test-payment',
        quantity: 1,
        notes: 'Test Payment - Rp 5.000'
      })

      const orderId = orderResponse.data.id

      // 2. Create payment with selected bank
      const paymentResponse = await paymentsAPI.create({
        order_id: orderId,
        payment_method: 'va',
        payment_channel: selectedBank,
        amount: 5000 // Rp 5.000
      })

      const paymentData = paymentResponse.data

      // 3. Show success with VA number
      const vaNumber = paymentData.va_number || paymentData.payment_no || 'Lihat di dashboard'
      toast.success(`🎉 Test payment berhasil dibuat!\nNomor VA ${selectedBank.toUpperCase()}: ${vaNumber}`, {
        duration: 15000,
      })

      // Redirect to dashboard orders
      navigate('/dashboard/orders')
    } catch (error) {
      console.error('Test payment error:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Gagal membuat test payment'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
      setSelectedBank(null)
    }
  }

  return (
    <section className="min-h-screen bg-dark-300 pt-32 pb-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary-600/20 rounded-full text-primary-400 font-poppins text-sm mb-4">
              Test Payment
            </span>
            <h1 className="font-montserrat font-bold text-4xl text-white mb-4">
              Test Pembayaran Rp 5.000
            </h1>
            <p className="text-gray-400 font-poppins text-lg">
              Halaman untuk test integrasi pembayaran dengan nilai minimal
            </p>
          </div>

          {/* Card */}
          <div className="card glass p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <div>
                <h3 className="font-montserrat font-bold text-xl text-white mb-2">
                  Test Payment Service
                </h3>
                <p className="text-gray-400 text-sm">
                  Service khusus untuk testing pembayaran
                </p>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-xs mb-1">Harga Test</div>
                <div className="font-montserrat font-bold text-2xl text-primary-400">
                  Rp 5.000
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <div className="text-white font-poppins">Nominal minimal untuk test</div>
                  <div className="text-gray-500 text-sm">Hanya Rp 5.000 untuk testing</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <div className="text-white font-poppins">Pilih bank untuk Virtual Account</div>
                  <div className="text-gray-500 text-sm">8 bank tersedia (BCA, BNI, BRI, dll)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <div className="text-white font-poppins">Test integrasi email</div>
                  <div className="text-gray-500 text-sm">Cek email notifikasi pembayaran</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <div className="text-white font-poppins">Lihat di dashboard</div>
                  <div className="text-gray-500 text-sm">Order dan payment muncul di dashboard</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleTestPayment}
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                '💳 Bayar Test Rp 5.000'
              )}
            </button>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-300">
                  <strong>Catatan:</strong> Ini adalah test payment dengan nominal minimal. 
                  Setelah pembayaran berhasil, Anda akan menerima email notifikasi.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bank Selection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-200 rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-montserrat font-bold text-xl text-white">
                Pilih Bank untuk Virtual Account
              </h3>
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSelectedBank(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Bank Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {BANK_CHANNELS.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => setSelectedBank(bank.code)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedBank === bank.code
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-gray-300 hover:border-primary-400 bg-white'
                  }`}
                >
                  <img src={bank.logo} alt={bank.name} className="h-12 w-auto mx-auto mb-2 object-contain" />
                  <div className="font-poppins font-semibold text-gray-900 text-sm">
                    {bank.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSelectedBank(null)
                }}
                className="btn btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleBankSelected}
                disabled={!selectedBank}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjutkan Test Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
