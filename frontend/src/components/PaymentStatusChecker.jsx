import { useState, useEffect, useCallback } from 'react'
import { paymentsAPI } from '../services/api'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

/**
 * PaymentStatusChecker Component
 * Auto-polls payment status for pending payments
 * Shows manual refresh button
 */
export default function PaymentStatusChecker({ orderId, orderStatus, onStatusUpdate }) {
  const [checking, setChecking] = useState(false)
  const [paymentId, setPaymentId] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false)

  // Get payment for this order
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await paymentsAPI.getByOrder(orderId)
        if (response.data && response.data.length > 0) {
          const payment = response.data[0]
          setPaymentId(payment.id)
          setPaymentStatus(payment.status)
          
          // Enable auto-check only if payment is pending
          setAutoCheckEnabled(payment.status === 'pending')
        }
      } catch (error) {
        console.error('Failed to fetch payment:', error)
      }
    }

    if (orderId && orderStatus === 'pending') {
      fetchPayment()
    }
  }, [orderId, orderStatus])

  // Check payment status from iPaymu
  const checkPaymentStatus = useCallback(async (showToast = true) => {
    if (!paymentId || checking) return

    setChecking(true)
    
    try {
      const response = await paymentsAPI.checkStatus(paymentId)
      const updatedPayment = response.data

      setPaymentStatus(updatedPayment.status)

      // If status changed, notify parent and show message
      if (updatedPayment.status !== paymentStatus) {
        if (updatedPayment.status === 'success') {
          if (showToast) {
            toast.success('🎉 Pembayaran berhasil dikonfirmasi!')
          }
          setAutoCheckEnabled(false) // Stop auto-check
        } else if (updatedPayment.status === 'failed') {
          if (showToast) {
            toast.error('Pembayaran gagal atau expired')
          }
          setAutoCheckEnabled(false)
        } else if (showToast) {
          toast('Pembayaran masih dalam proses...', { icon: '⏳' })
        }

        // Notify parent component to refresh
        if (onStatusUpdate) {
          onStatusUpdate(updatedPayment)
        }
      } else if (showToast && updatedPayment.status === 'pending') {
        toast('Belum ada pembayaran masuk', { icon: 'ℹ️' })
      }

    } catch (error) {
      console.error('Failed to check payment status:', error)
      if (showToast) {
        toast.error('Gagal mengecek status pembayaran')
      }
    } finally {
      setChecking(false)
    }
  }, [paymentId, paymentStatus, checking, onStatusUpdate])

  // Auto-check every 10 seconds for pending payments
  useEffect(() => {
    if (!autoCheckEnabled || !paymentId || paymentStatus !== 'pending') {
      return
    }

    // Check immediately
    checkPaymentStatus(false)

    // Then check every 10 seconds
    const interval = setInterval(() => {
      checkPaymentStatus(false)
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [autoCheckEnabled, paymentId, paymentStatus, checkPaymentStatus])

  // Don't show button if order is not pending or no payment
  if (orderStatus !== 'pending' || !paymentId) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      {/* Auto-check indicator */}
      {autoCheckEnabled && paymentStatus === 'pending' && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="font-poppins">Auto-checking...</span>
        </div>
      )}

      {/* Manual refresh button */}
      <button
        onClick={() => checkPaymentStatus(true)}
        disabled={checking}
        className="btn btn-secondary btn-sm flex items-center gap-2 disabled:opacity-50"
        title="Refresh status pembayaran"
      >
        <ArrowPathIcon className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
        <span className="font-poppins">
          {checking ? 'Checking...' : 'Refresh Status'}
        </span>
      </button>
    </div>
  )
}
