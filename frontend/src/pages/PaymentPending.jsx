import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  DocumentDuplicateIcon, 
  QrCodeIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function PaymentPending() {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentInfo, setPaymentInfo] = useState(null)

  useEffect(() => {
    // Get payment info from navigation state
    const info = location.state?.paymentInfo
    
    if (!info) {
      // If no payment info, redirect to dashboard
      navigate('/dashboard')
      return
    }
    
    setPaymentInfo(info)
  }, [location, navigate])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Disalin ke clipboard!')
  }

  if (!paymentInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-300 pt-20">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-600/20 flex items-center justify-center">
              <ClockIcon className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-4">
              Menunggu Pembayaran
            </h1>
            <p className="font-poppins text-gray-400 text-lg">
              Silakan selesaikan pembayaran Anda sebelum batas waktu
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="card glass p-8 mb-6">
            <div className="space-y-6">
              {/* Order Info */}
              <div className="border-b border-white/10 pb-6">
                <h3 className="font-montserrat font-semibold text-xl text-white mb-4">
                  Informasi Pembayaran
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-poppins">Order ID:</span>
                    <span className="text-white font-montserrat">{paymentInfo.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-poppins">Total Pembayaran:</span>
                    <span className="text-white font-montserrat font-bold text-xl">
                      Rp {paymentInfo.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {paymentInfo.expired_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-poppins">Batas Waktu:</span>
                      <span className="text-yellow-400 font-montserrat">
                        {new Date(paymentInfo.expired_at).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Details */}
              {paymentInfo.payment_method === 'va' && paymentInfo.va_number && (
                <div>
                  <h4 className="font-montserrat font-semibold text-lg text-white mb-4">
                    Virtual Account Number
                  </h4>
                  <div className="bg-dark-200/50 rounded-xl p-6 border border-primary-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 font-poppins text-sm">
                        {paymentInfo.payment_channel?.toUpperCase() || 'Bank'} Virtual Account
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="font-montserrat text-3xl text-white tracking-wider">
                          {paymentInfo.va_number}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(paymentInfo.va_number)}
                        className="btn btn-secondary py-3"
                      >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="mt-6 card bg-primary-600/10 border border-primary-500/20 p-6">
                    <h5 className="font-montserrat font-semibold text-white mb-3">
                      Cara Pembayaran:
                    </h5>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300 font-poppins text-sm">
                      <li>Buka aplikasi mobile banking atau internet banking Anda</li>
                      <li>Pilih menu Transfer / Bayar</li>
                      <li>Pilih Virtual Account</li>
                      <li>Masukkan nomor VA di atas</li>
                      <li>Konfirmasi pembayaran</li>
                      <li>Status akan otomatis terupdate setelah pembayaran berhasil</li>
                    </ol>
                  </div>
                </div>
              )}

              {paymentInfo.payment_method === 'qris' && paymentInfo.qr_code_url && (
                <div>
                  <h4 className="font-montserrat font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <QrCodeIcon className="w-6 h-6" />
                    QRIS Payment
                  </h4>
                  <div className="bg-white rounded-xl p-6 flex justify-center">
                    <img 
                      src={paymentInfo.qr_code_url} 
                      alt="QRIS Code" 
                      className="max-w-xs w-full"
                    />
                  </div>
                  
                  {/* Instructions */}
                  <div className="mt-6 card bg-primary-600/10 border border-primary-500/20 p-6">
                    <h5 className="font-montserrat font-semibold text-white mb-3">
                      Cara Pembayaran:
                    </h5>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300 font-poppins text-sm">
                      <li>Buka aplikasi e-wallet atau mobile banking yang mendukung QRIS</li>
                      <li>Pilih menu Scan QR atau Bayar QRIS</li>
                      <li>Scan QR code di atas</li>
                      <li>Konfirmasi pembayaran</li>
                      <li>Status akan otomatis terupdate</li>
                    </ol>
                  </div>
                </div>
              )}

              {paymentInfo.payment_url && (
                <div>
                  <a 
                    href={paymentInfo.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full group"
                  >
                    Bayar Sekarang
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Kembali ke Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline"
            >
              Refresh Status
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
