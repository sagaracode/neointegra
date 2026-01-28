import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ExclamationTriangleIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import useAuthStore from '../store/authStore'
import api from '../services/api'

export default function SubscriptionExpiry() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [paymentMethods] = useState([
    { id: 'va', name: 'Virtual Account', channels: ['bca', 'bni', 'bri', 'mandiri'] },
    { id: 'qris', name: 'QRIS', channels: ['qris'] },
  ])
  const [selectedMethod, setSelectedMethod] = useState('va')
  const [selectedChannel, setSelectedChannel] = useState('bca')

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/subscriptions/expiring-soon')
      if (response.data && response.data.length > 0) {
        // Get the first expiring subscription
        setSubscription(response.data[0])
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
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
    
    setCreating(true)
    try {
      // Step 1: Create renewal order
      const orderResponse = await api.post(`/subscriptions/renew/${subscription.id}`)
      const { order_id } = orderResponse.data

      // Step 2: Create payment
      const paymentResponse = await api.post('/payments/', {
        order_id: order_id,
        payment_method: selectedMethod,
        payment_channel: selectedChannel,
      })

      const paymentData = paymentResponse.data

      // Step 3: Redirect to payment page or show payment instructions
      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url
      } else if (paymentData.va_number || paymentData.qr_code_url) {
        // Show VA number or QRIS - redirect to payment pending page
        navigate('/payment/pending', { 
          state: { 
            paymentInfo: paymentData
          } 
        })
      } else {
        toast.success('Pembayaran berhasil dibuat! Silakan cek dashboard untuk detail pembayaran.')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Failed to create renewal:', error)
      toast.error('Gagal membuat pembayaran perpanjangan. Silakan coba lagi.')
    } finally {
      setCreating(false)
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
      <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-dark-300 py-12 px-4 sm:px-6 lg:px-8">
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

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="font-montserrat font-semibold text-white mb-3 block">
              Pilih Metode Pembayaran
            </label>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <label
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-white/10 bg-dark-200 hover:border-primary-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => {
                        setSelectedMethod(e.target.value)
                        if (method.channels.length > 0) {
                          setSelectedChannel(method.channels[0])
                        }
                      }}
                      className="mr-3"
                    />
                    <CreditCardIcon className="h-6 w-6 text-primary-400 mr-3" />
                    <span className="font-poppins font-semibold text-white">
                      {method.name}
                    </span>
                  </label>

                  {/* Channel Selection */}
                  {selectedMethod === method.id && method.channels.length > 1 && (
                    <div className="mt-2 ml-12 space-y-2">
                      {method.channels.map((channel) => (
                        <label
                          key={channel}
                          className="flex items-center p-3 rounded-lg bg-dark-200 cursor-pointer hover:bg-dark-100"
                        >
                          <input
                            type="radio"
                            name="payment_channel"
                            value={channel}
                            checked={selectedChannel === channel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                            className="mr-3"
                          />
                          <span className="font-poppins text-white uppercase">
                            {channel}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
    </div>
  )
}
