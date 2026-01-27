import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [orderInfo, setOrderInfo] = useState(null)
  
  useEffect(() => {
    // Get order info from query params
    const orderId = searchParams.get('order_id')
    const orderNumber = searchParams.get('order_number')
    const amount = searchParams.get('amount')
    
    if (orderId && orderNumber && amount) {
      setOrderInfo({
        orderId,
        orderNumber,
        amount: parseFloat(amount)
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-dark-300 pt-20 flex items-center justify-center">
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-green-600/20 flex items-center justify-center">
              <CheckCircleIcon className="w-16 h-16 text-green-400" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-white mb-4">
            Pembayaran Berhasil!
          </h1>
          
          <p className="font-poppins text-gray-400 text-lg mb-8">
            Terima kasih atas pembayaran Anda. Order Anda sedang diproses.
          </p>

          {/* Order Info */}
          {orderInfo && (
            <div className="card glass p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400 font-poppins">Order Number:</span>
                  <span className="text-white font-montserrat font-semibold">{orderInfo.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400 font-poppins">Order ID:</span>
                  <span className="text-white font-montserrat">{orderInfo.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-poppins">Total Pembayaran:</span>
                  <span className="text-green-400 font-montserrat font-bold text-xl">
                    Rp {orderInfo.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="card bg-primary-600/10 border border-primary-500/20 p-6 mb-8">
            <p className="text-primary-300 font-poppins text-sm">
              📧 Email konfirmasi telah dikirim ke alamat email Anda.
              <br />
              Anda dapat melihat detail order di Dashboard.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary group"
            >
              Lihat Dashboard
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/services')}
              className="btn btn-secondary"
            >
              Lanjut Belanja
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
