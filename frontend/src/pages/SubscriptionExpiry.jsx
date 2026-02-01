import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ExclamationTriangleIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import useAuthStore from '../store/authStore'
import api from '../services/api'

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

export default function SubscriptionExpiry() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      // Try expiring-soon first
      let response = await api.get('/subscriptions/expiring-soon')
      if (response.data && response.data.length > 0) {
        setSubscription(response.data[0])
      } else {
        // Fallback to my-subscriptions if no expiring found
        response = await api.get('/subscriptions/my-subscriptions')
        if (response.data && response.data.length > 0) {
          setSubscription(response.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      toast.error('Gagal memuat data subscription')
    } finally {
      setLoading(false)
    }
  }

  const calculateDaysRemaining = () => {
    if (!subscription) return 0
    const endDate = new Date(subscription.end_date)
    const today = new Date()
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleRenewal = async () => {
    if (!subscription) return
    
    // Show bank selection modal
    setShowBankModal(true)
  }

  const handleBankSelected = async () => {
    if (!selectedBank || !subscription) {
      console.error('❌ Missing selectedBank or subscription')
      toast.error('Data tidak lengkap. Silakan coba lagi.')
      setShowBankModal(true) // Reopen modal
      return
    }
    
    setShowBankModal(false)
    setCreating(true)
    
    try {
      console.log('🔄 [SubscriptionExpiry] Creating renewal for subscription:', subscription.id)
      
      // Step 1: Create renewal order
      const orderResponse = await api.post(`/subscriptions/renew/${subscription.id}`)
      const { order_id, order } = orderResponse.data
      console.log('✅ [SubscriptionExpiry] Renewal order created:', order_id)

      // Step 2: Create payment with selected bank
      const paymentResponse = await api.post('/payments/', {
        order_id: order_id,
        payment_method: 'va',
        payment_channel: selectedBank,
        amount: order?.total_price || subscription.renewal_price || subscription.price || 0
      })

      const paymentData = paymentResponse.data
      console.log('✅ [SubscriptionExpiry] Payment created:', paymentData)

      // Step 3: Show success with VA number
      const vaNumber = paymentData.va_number || paymentData.payment_no || 'Lihat di dashboard'
      const bankName = BANK_CHANNELS.find(b => b.code === selectedBank)?.name || selectedBank.toUpperCase()
      
      toast.success(
        `🎉 Pembayaran perpanjangan berhasil dibuat!\n\nNomor VA ${bankName}: ${vaNumber}\n\nSalin dan lakukan pembayaran.`,
        { duration: 15000 }
      )

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard/payments')
      }, 2000)
    } catch (error) {
      console.error('❌ [SubscriptionExpiry] Failed to create renewal:', error)
      console.error('Error details:', error.response?.data)
      
      // Handle specific errors
      if (error.response?.status === 401) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
        setTimeout(() => navigate('/login'), 2000)
        return
      }
      
      const errorMsg = error.response?.data?.detail || error.message || 'Gagal membuat pembayaran perpanjangan'
      toast.error(`❌ ${errorMsg}`)
      
      // Reopen modal on error for retry
      setShowBankModal(true)
    } finally {
      setCreating(false)
      setSelectedBank(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-dark-300 pt-28 flex items-center justify-center p-4">
        <div className="card max-w-2xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-montserrat font-bold text-2xl text-white mb-2">
            Tidak Ada Langganan yang Akan Habis
          </h1>
          <p className="text-gray-400 font-poppins mb-6">
            Semua langganan Anda masih aktif dan tidak ada yang perlu diperpanjang saat ini.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  const daysRemaining = calculateDaysRemaining()
  const isUrgent = daysRemaining <= 7

  return (
    <div className="min-h-screen bg-dark-300 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card mb-8 border-2 ${
            isUrgent ? 'border-red-500' : 'border-yellow-500'
          }`}
        >
          <div className="flex items-start">
            <ExclamationTriangleIcon
              className={`h-8 w-8 ${
                isUrgent ? 'text-red-500' : 'text-yellow-500'
              } mr-4 flex-shrink-0`}
            />
            <div className="flex-1">
              <h2 className="font-montserrat font-bold text-xl text-white mb-2">
                {isUrgent ? 'Peringatan Penting!' : 'Pemberitahuan Langganan'}
              </h2>
              <p className="text-gray-300 font-poppins">
                Langganan Anda akan berakhir dalam{' '}
                <span className="font-bold text-primary-400">{daysRemaining} hari</span>{' '}
                pada tanggal{' '}
                <span className="font-bold">
                  {new Date(subscription.end_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <h3 className="font-montserrat font-bold text-2xl text-white mb-6">
            Detail Langganan
          </h3>

          <div className="space-y-4">
            <div className="flex items-center p-4 rounded-xl bg-dark-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-poppins text-sm text-gray-400">Paket Langganan</div>
                <div className="font-montserrat font-bold text-lg text-white">
                  {subscription.package_name}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-dark-200">
                <div className="font-poppins text-sm text-gray-400 mb-1">
                  Tanggal Mulai
                </div>
                <div className="font-montserrat font-semibold text-white">
                  {new Date(subscription.start_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-dark-200">
                <div className="font-poppins text-sm text-gray-400 mb-1">
                  Tanggal Berakhir
                </div>
                <div className="font-montserrat font-semibold text-red-400">
                  {new Date(subscription.end_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {subscription.notes && (
              <div className="p-4 rounded-xl bg-dark-200">
                <div className="font-poppins text-sm text-gray-400 mb-1">Catatan</div>
                <div className="font-poppins text-white">{subscription.notes}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Renewal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="font-montserrat font-bold text-2xl text-white mb-6">
            Perpanjang Langganan
          </h3>

          {/* Price */}
          <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30">
            <div className="font-poppins text-sm text-gray-300 mb-2">
              Harga Perpanjangan
            </div>
            <div className="font-montserrat font-bold text-4xl text-white mb-2">
              {formatCurrency(subscription.renewal_price || subscription.price)}
            </div>
            <div className="font-poppins text-sm text-gray-400">
              Perpanjangan untuk 1 tahun
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <CreditCardIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-poppins font-semibold text-white mb-1">
                  Metode Pembayaran
                </div>
                <div className="font-poppins text-sm text-blue-300">
                  Virtual Account - Pilih bank setelah klik tombol perpanjang
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRenewal}
              disabled={creating}
              className="flex-1 btn-primary py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                '🔄 Perpanjang Sekarang'
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary py-4 text-lg font-bold"
            >
              Nanti Saja
            </button>
          </div>

          {/* Information */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <p className="font-poppins text-sm text-blue-300">
              ℹ️ Setelah melakukan pembayaran, langganan Anda akan otomatis diperpanjang
              selama 1 tahun ke depan. Anda akan menerima email konfirmasi setelah
              pembayaran berhasil.
            </p>
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
                      : 'border-white/10 hover:border-primary-400/50 bg-dark-100/50'
                  }`}
                >
                  <img src={bank.logo} alt={bank.name} className="h-12 w-auto mx-auto mb-2 object-contain" />
                  <div className="font-poppins font-semibold text-white text-sm">
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
                disabled={!selectedBank || creating}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  'Lanjutkan Pembayaran'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
