import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { ordersAPI, paymentsAPI, usersAPI } from '../services/api'
import api from '../services/api'
import SEOAnalytics from './SEOAnalytics'

// Available payment channels from iPaymu
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Pesanan Saya', href: '/dashboard/orders', icon: ShoppingCartIcon },
  { name: 'Riwayat Pembayaran', href: '/dashboard/payments', icon: CreditCardIcon },
  { name: 'Profil', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

const statusConfig = {
  pending: { label: 'Menunggu', color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
  paid: { label: 'Dibayar', color: 'text-green-400', bg: 'bg-green-600/20' },
  processing: { label: 'Diproses', color: 'text-blue-400', bg: 'bg-blue-600/20' },
  completed: { label: 'Selesai', color: 'text-green-400', bg: 'bg-green-600/20' },
  cancelled: { label: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-600/20' },
  failed: { label: 'Gagal', color: 'text-red-400', bg: 'bg-red-600/20' },
}

// Dashboard Home Component
function DashboardHome() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await ordersAPI.getAll()
      const orders = response.data || []
      
      setRecentOrders(orders.slice(0, 5))
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        totalSpent: orders.filter(o => o.status === 'paid' || o.status === 'completed')
          .reduce((sum, o) => sum + (o.total_price || 0), 0)
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-white">
          Selamat Datang, {user?.full_name || 'User'}!
        </h1>
        <p className="text-gray-400 font-poppins">
          Kelola layanan dan pesanan Anda dari dashboard ini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pesanan', value: stats.totalOrders, color: 'from-blue-500 to-cyan-500' },
          { label: 'Menunggu Bayar', value: stats.pendingOrders, color: 'from-yellow-500 to-orange-500' },
          { label: 'Selesai', value: stats.completedOrders, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Belanja', value: formatCurrency(stats.totalSpent), color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <span className="text-white text-sm font-bold">
                {typeof stat.value === 'number' ? stat.value : '💰'}
              </span>
            </div>
            <div className="font-montserrat font-bold text-xl text-white mb-1">
              {stat.value}
            </div>
            <div className="text-gray-400 font-poppins text-sm">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Service Access Links - Only for specific users */}
      {user?.email === 'web@rsppn.co.id' && (
        <div className="card">
          <h2 className="font-montserrat font-bold text-lg text-white mb-4">
            Layanan Anda
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://rsppn.co.id/cpanel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/30 hover:border-orange-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                  cP
                </div>
                <div className="font-montserrat font-semibold text-white group-hover:text-orange-400 transition-colors">
                  cPanel
                </div>
              </div>
              <p className="text-gray-400 text-sm">Kelola hosting & domain</p>
              <div className="mt-2 text-xs text-orange-400 flex items-center gap-1">
                <span>Buka cPanel</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
            
            <a
              href="https://rsppn.co.id/wp-admin"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  WP
                </div>
                <div className="font-montserrat font-semibold text-white group-hover:text-blue-400 transition-colors">
                  WordPress
                </div>
              </div>
              <p className="text-gray-400 text-sm">Kelola konten website</p>
              <div className="mt-2 text-xs text-blue-400 flex items-center gap-1">
                <span>Buka Dashboard</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
            
            <a
              href="https://webmail.rsppn.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  ✉️
                </div>
                <div className="font-montserrat font-semibold text-white group-hover:text-purple-400 transition-colors">
                  Webmail
                </div>
              </div>
              <p className="text-gray-400 text-sm">Akses email bisnis</p>
              <div className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                <span>Buka Webmail</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>

            <Link
              to="/dashboard/seo/rsppn-analytics"
              className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-cyan-500/30 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group relative overflow-hidden"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <RocketLaunchIcon className="w-5 h-5" />
                  </div>
                  <div className="font-montserrat font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    SEO Report
                  </div>
                </div>
                <p className="text-gray-400 text-sm">Analitik SEO rsppn.co.id</p>
                <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                  <span>Lihat Report</span>
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-montserrat font-bold text-lg text-white mb-4">
          Aksi Cepat
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/services"
            className="p-4 rounded-xl bg-dark-200 hover:bg-dark-100 border border-white/5 hover:border-primary-500/30 transition-all"
          >
            <div className="font-montserrat font-semibold text-white">Order Layanan Baru</div>
            <p className="text-gray-500 text-sm">Lihat katalog layanan kami</p>
          </Link>
          <Link
            to="/dashboard/orders"
            className="p-4 rounded-xl bg-dark-200 hover:bg-dark-100 border border-white/5 hover:border-primary-500/30 transition-all"
          >
            <div className="font-montserrat font-semibold text-white">Lihat Pesanan</div>
            <p className="text-gray-500 text-sm">Cek status pesanan Anda</p>
          </Link>
          <Link
            to="/contact"
            className="p-4 rounded-xl bg-dark-200 hover:bg-dark-100 border border-white/5 hover:border-primary-500/30 transition-all"
          >
            <div className="font-montserrat font-semibold text-white">Bantuan</div>
            <p className="text-gray-500 text-sm">Hubungi tim support</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-montserrat font-bold text-lg text-white">Pesanan Terbaru</h2>
          <Link to="/dashboard/orders" className="text-primary-400 text-sm hover:text-primary-300">
            Lihat Semua →
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Belum ada pesanan. <Link to="/services" className="text-primary-400">Order sekarang</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending
              return (
                <div key={order.id} className="flex items-center justify-between p-3 bg-dark-200 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{order.order_number}</div>
                    <div className="text-sm text-gray-400">{order.service_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{formatCurrency(order.total_price)}</div>
                    <span className={`text-xs px-2 py-1 rounded ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Dashboard Orders Component
function DashboardOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderPayments, setOrderPayments] = useState({}) // Store payment info for each order
  const [creatingPayment, setCreatingPayment] = useState(null) // Track which order is creating payment
  const [creatingRenewal, setCreatingRenewal] = useState(null) // Track which order is creating renewal
  const [subscription, setSubscription] = useState(null)
  
  // Bank selection modal
  const [showBankModal, setShowBankModal] = useState(false)
  const [showRenewalBankModal, setShowRenewalBankModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedBank, setSelectedBank] = useState('bca')
  const [renewalOrderId, setRenewalOrderId] = useState(null)

  useEffect(() => {
    loadOrders()
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      const response = await api.get('/subscriptions/my-subscriptions')
      console.log('📊 [DashboardOrders] Loaded subscriptions:', response.data)
      if (response.data && response.data.length > 0) {
        setSubscription(response.data[0])
        console.log('✅ [DashboardOrders] Subscription set:', response.data[0])
      } else {
        console.log('⚠️ [DashboardOrders] No subscription found')
      }
    } catch (error) {
      console.error('❌ [DashboardOrders] Failed to load subscription:', error)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      const ordersData = response.data || []
      setOrders(ordersData)
      
      // Load payment info for pending orders
      const pendingOrders = ordersData.filter(o => o.status === 'pending')
      for (const order of pendingOrders) {
        try {
          const paymentResponse = await paymentsAPI.getByOrder(order.id)
          if (paymentResponse.data && paymentResponse.data.length > 0) {
            const latestPayment = paymentResponse.data[0] // Get the latest payment
            setOrderPayments(prev => ({
              ...prev,
              [order.id]: latestPayment
            }))
          }
        } catch (err) {
          console.log(`No payment found for order ${order.id}`)
        }
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayNow = async (order) => {
    const payment = orderPayments[order.id]
    
    // If payment already exists with URL, redirect to it
    if (payment?.payment_url) {
      window.open(payment.payment_url, '_blank')
      return
    }
    
    // If payment exists with VA number, show it
    if (payment?.va_number) {
      const bankName = BANK_CHANNELS.find(b => b.code === payment.payment_channel)?.name || payment.payment_channel?.toUpperCase() || 'Bank'
      toast.success(
        `VA ${bankName}: ${payment.va_number}\n\nSalin nomor VA dan lakukan pembayaran.`,
        { duration: 15000 }
      )
      return
    }
    
    // If no payment exists, show bank selection modal
    setSelectedOrder(order)
    setShowBankModal(true)
  }

  const handleRenewOrder = async (order) => {
    // Check if subscription exists for this order
    if (!subscription) {
      toast.error('Subscription tidak ditemukan')
      return
    }
    
    setRenewalOrderId(order.id)
    setShowRenewalBankModal(true)
  }

  const handleRenewalBankSelected = async () => {
    if (!selectedBank || !subscription) {
      console.error('❌ Missing selectedBank or subscription')
      toast.error('Data tidak lengkap. Silakan coba lagi.')
      return
    }
    
    setShowRenewalBankModal(false)
    setCreatingRenewal(renewalOrderId)
    
    try {
      console.log('🔄 [DashboardOrders] Creating renewal for subscription:', subscription.id)
      
      // Step 1: Create renewal order (send payment method & channel as required by backend)
      const orderResponse = await api.post(`/subscriptions/renew/${subscription.id}`, {
        payment_method: 'va',
        payment_channel: selectedBank
      })
      const { order_id, order } = orderResponse.data
      console.log('✅ [DashboardOrders] Renewal order created:', order_id)

      // Step 2: Create payment with selected bank
      const paymentResponse = await paymentsAPI.create({
        order_id: order_id,
        payment_method: 'va',
        payment_channel: selectedBank,
        amount: order?.total_price || subscription.renewal_price || subscription.price || 0
      })

      const paymentData = paymentResponse.data
      console.log('✅ [DashboardOrders] Payment created:', paymentData)
      
      const vaNumber = paymentData.va_number || paymentData.payment_no || 'Lihat di dashboard'
      const bankName = BANK_CHANNELS.find(b => b.code === selectedBank)?.name || selectedBank.toUpperCase()
      
      toast.success(
        `🎉 Perpanjangan berhasil dibuat!\n\nNomor VA ${bankName}: ${vaNumber}\n\nSalin dan lakukan pembayaran.`,
        { duration: 15000 }
      )

      // Reload orders
      await loadOrders()
      await loadSubscription()
    } catch (error) {
      console.error('❌ [DashboardOrders] Failed to create renewal:', error)
      console.error('Error details:', error.response?.data)
      
      // Handle specific errors
      if (error.response?.status === 401) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
        setTimeout(() => window.location.href = '/login', 2000)
        return
      }
      
      const errorMsg = error.response?.data?.detail || error.message || 'Gagal membuat perpanjangan'
      toast.error(`❌ ${errorMsg}`)
    } finally {
      setCreatingRenewal(null)
      setRenewalOrderId(null)
      setSelectedBank('bca')
    }
  }
  
  const handleBankSelected = async () => {
    if (!selectedBank || !selectedOrder) return
    
    setShowBankModal(false)
    setCreatingPayment(selectedOrder.id)
    
    try {
      const paymentResponse = await paymentsAPI.create({
        order_id: selectedOrder.id,
        payment_method: 'va',
        payment_channel: selectedBank,
        amount: selectedOrder.total_price
      })
      
      const paymentData = paymentResponse.data
      
      console.log('[Payment Created]', paymentData)
      
      // Update local state
      setOrderPayments(prev => ({
        ...prev,
        [selectedOrder.id]: paymentData
      }))
      
      // Show VA number
      if (paymentData.va_number) {
        const bankName = BANK_CHANNELS.find(b => b.code === selectedBank)?.name || selectedBank.toUpperCase()
        toast.success(
          `✅ Pembayaran berhasil dibuat!\n\nVA ${bankName}: ${paymentData.va_number}\n\nSalin nomor VA dan lakukan pembayaran.`,
          { duration: 15000 }
        )
        // Reload to show in UI
        loadOrders()
      } else if (paymentData.payment_url) {
        // Redirect payment - open URL
        toast.success('✅ Pembayaran berhasil dibuat! Membuka halaman pembayaran...')
        window.open(paymentData.payment_url, '_blank')
      } else {
        // No payment info - just refresh
        toast.success('✅ Pembayaran berhasil dibuat! Refresh halaman untuk melihat detail.')
        loadOrders()
      }
    } catch (error) {
      console.error('Failed to create payment:', error)
      
      // Handle 401 specifically with user-friendly message
      if (error.response?.status === 401) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
        navigate('/login?redirect=/dashboard/orders')
        return
      }
      
      const errorMsg = error.response?.data?.detail || 'Gagal membuat pembayaran'
      toast.error(errorMsg)
    } finally {
      setCreatingPayment(null)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-montserrat font-bold text-2xl text-white">Pesanan Saya</h1>
        <Link to="/services" className="btn btn-primary text-sm">
          + Order Baru
        </Link>
      </div>
      
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingCartIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Belum ada pesanan.</p>
          <Link to="/services" className="btn btn-primary">Lihat Layanan</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending
            const payment = orderPayments[order.id] // Get payment info for this order
            
            // Debug log untuk setiap order
            const showRenewalButton = (order.status === 'completed' || order.status === 'paid') && subscription
            console.log(`🔍 [Order ${order.order_number}] Status: ${order.status}, Subscription:`, subscription ? '✅ EXISTS' : '❌ NULL', 'ShowButton:', showRenewalButton)
            
            return (
              <div key={order.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-montserrat font-bold text-white">{order.order_number}</span>
                      <span className={`text-xs px-2 py-1 rounded ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-1">{order.service_name}</p>
                    <p className="text-gray-500 text-sm mb-3">{formatDate(order.created_at)}</p>
                    
                    {/* Payment Info for Pending Orders */}
                    {order.status === 'pending' && payment && (
                      <div className="bg-dark-100 border border-primary-500/20 rounded-lg p-3 mt-3">
                        <p className="text-xs text-gray-400 mb-2">Informasi Pembayaran:</p>
                        {payment.va_number && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-500">Virtual Account {payment.payment_channel?.toUpperCase()}</p>
                            <p className="text-white font-mono font-semibold">{payment.va_number}</p>
                          </div>
                        )}
                        {payment.qr_code_url && (
                          <p className="text-xs text-primary-400">QRIS tersedia</p>
                        )}
                        {payment.expired_at && (
                          <p className="text-xs text-yellow-400 mt-2">
                            Berlaku sampai: {formatDate(payment.expired_at)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="font-montserrat font-bold text-xl text-white mb-3">
                      {formatCurrency(order.total_price)}
                    </div>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handlePayNow(order)}
                        disabled={creatingPayment === order.id}
                        className="btn btn-primary text-sm inline-flex items-center gap-2"
                      >
                        {creatingPayment === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>💳</span>
                            <span>Bayar Sekarang</span>
                          </>
                        )}
                      </button>
                    )}
                    {(order.status === 'completed' || order.status === 'paid') && subscription && (
                      <button
                        onClick={() => handleRenewOrder(order)}
                        disabled={creatingRenewal === order.id}
                        className="btn btn-primary text-sm inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        {creatingRenewal === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <span>🔄</span>
                            <span>Perpanjang Sekarang</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Bank Selection Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-300 rounded-2xl border border-gray-700/50 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-montserrat font-bold text-2xl text-white">
                Pilih Bank untuk Pembayaran
              </h3>
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSelectedOrder(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-gray-400 mb-6">
              Pilih bank untuk mendapatkan nomor Virtual Account
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {BANK_CHANNELS.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => setSelectedBank(bank.code)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedBank === bank.code
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-gray-300 hover:border-primary-400 bg-white'
                  }`}
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="h-12 mx-auto object-contain mb-2"
                  />
                  <p className="text-sm text-gray-900 font-medium text-center">
                    {bank.name}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSelectedOrder(null)
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleBankSelected}
                disabled={!selectedBank}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjutkan Pembayaran
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Renewal Bank Selection Modal */}
      {showRenewalBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-200 rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-montserrat font-bold text-xl text-white">
                Pilih Bank untuk Perpanjangan
              </h3>
              <button
                onClick={() => {
                  setShowRenewalBankModal(false)
                  setRenewalOrderId(null)
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              Pilih bank untuk perpanjangan langganan Anda
            </p>

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
                  <div className="font-poppins font-semibold text-gray-900 text-sm">{bank.name}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRenewalBankModal(false)
                  setRenewalOrderId(null)
                  setSelectedBank('bca')
                }}
                className="flex-1 btn btn-secondary"
              >
                Batal
              </button>
              <button
                onClick={handleRenewalBankSelected}
                disabled={!selectedBank || creatingRenewal}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingRenewal ? 'Memproses...' : 'Lanjutkan Pembayaran'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Dashboard Payments Component
function DashboardPayments() {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [creatingRenewal, setCreatingRenewal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState('bca')

  useEffect(() => {
    loadPayments()
    loadSubscription()
  }, [])

  const loadPayments = async () => {
    try {
      // Get all orders and extract payment info
      const response = await ordersAPI.getAll()
      const orders = response.data || []
      // Filter orders that have payment info
      const paidOrders = orders.filter(o => o.status !== 'pending' && o.status !== 'cancelled')
      setPayments(paidOrders)
    } catch (error) {
      console.error('Failed to load payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSubscription = async () => {
    try {
      // Try expiring-soon first for warning display
      let response = await api.get('/subscriptions/expiring-soon')
      if (response.data && response.data.length > 0) {
        setSubscription(response.data[0])
      } else {
        // Fallback to my-subscriptions to get any active subscription
        response = await api.get('/subscriptions/my-subscriptions')
        if (response.data && response.data.length > 0) {
          setSubscription(response.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    } finally {
      setLoadingSubscription(false)
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

  const handleRenewal = () => {
    setShowBankModal(true)
  }

  const handleBankSelected = async () => {
    if (!selectedBank || !subscription) {
      console.error('❌ Missing selectedBank or subscription')
      toast.error('Data tidak lengkap. Silakan coba lagi.')
      return
    }
    
    setShowBankModal(false)
    setCreatingRenewal(true)
    
    try {
      console.log('🔄 [DashboardPayments] Creating renewal for subscription:', subscription.id)
      
      // Step 1: Create renewal order (send payment method & channel as required by backend)
      const orderResponse = await api.post(`/subscriptions/renew/${subscription.id}`, {
        payment_method: 'va',
        payment_channel: selectedBank
      })
      const { order_id, order } = orderResponse.data
      console.log('✅ [DashboardPayments] Renewal order created:', order_id)

      // Step 2: Create payment with selected bank - Use paymentsAPI for consistency
      const paymentResponse = await paymentsAPI.create({
        order_id: order_id,
        payment_method: 'va',
        payment_channel: selectedBank,
        amount: order?.total_price || subscription.renewal_price || subscription.price || 0
      })

      const paymentData = paymentResponse.data
      console.log('✅ [DashboardPayments] Payment created:', paymentData)

      // Step 3: Show success with VA number
      const vaNumber = paymentData.va_number || paymentData.payment_no || 'Lihat di dashboard'
      const bankName = BANK_CHANNELS.find(b => b.code === selectedBank)?.name || selectedBank.toUpperCase()
      
      toast.success(
        `🎉 Perpanjangan berhasil dibuat!\n\nNomor VA ${bankName}: ${vaNumber}\n\nSalin dan lakukan pembayaran.`,
        { duration: 15000 }
      )

      // Reload data
      await loadPayments()
      await loadSubscription()
    } catch (error) {
      console.error('❌ [DashboardPayments] Failed to create renewal:', error)
      console.error('Error details:', error.response?.data)
      
      // Handle specific errors
      if (error.response?.status === 401) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
        setTimeout(() => window.location.href = '/login', 2000)
        return
      }
      
      const errorMsg = error.response?.data?.detail || error.message || 'Gagal membuat pembayaran perpanjangan'
      toast.error(`❌ ${errorMsg}`)
    } finally {
      setCreatingRenewal(false)
      setSelectedBank('bca')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const daysRemaining = subscription ? calculateDaysRemaining() : 0
  const isUrgent = daysRemaining > 0 && daysRemaining <= 7
  const showExpiryWarning = daysRemaining > 0 && daysRemaining <= 30 // Show warning within 30 days

  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">Riwayat Pembayaran</h1>
      
      {/* Subscription Expiry Warning - Only show if expiring within 30 days */}
      {!loadingSubscription && subscription && showExpiryWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card mb-6 border-2 ${
            isUrgent ? 'border-red-500' : 'border-yellow-500'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isUrgent ? 'bg-red-500/20' : 'bg-yellow-500/20'
            }`}>
              <ExclamationTriangleIcon className={`w-6 h-6 ${
                isUrgent ? 'text-red-500' : 'text-yellow-500'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-montserrat font-bold text-lg text-white mb-2">
                {isUrgent ? '⚠️ Peringatan Penting!' : '📢 Pemberitahuan Langganan'}
              </h3>
              <p className="text-gray-300 font-poppins mb-4">
                Langganan <span className="font-bold text-primary-400">{subscription.service_name}</span> Anda akan berakhir dalam{' '}
                <span className={`font-bold ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`}>
                  {daysRemaining} hari
                </span>{' '}
                pada tanggal{' '}
                <span className="font-bold">
                  {new Date(subscription.end_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleRenewal}
                  disabled={creatingRenewal}
                  className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
                >
                  {creatingRenewal ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Memproses...</span>
                    </span>
                  ) : (
                    <span>🔄 Perpanjang Sekarang</span>
                  )}
                </button>
                <div className="text-sm text-gray-400 flex items-center">
                  <span>Harga Perpanjangan: </span>
                  <span className="font-bold text-white ml-2">
                    {formatCurrency(subscription.renewal_price || subscription.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {loading ? (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat riwayat...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCardIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Belum ada riwayat pembayaran.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Order</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Layanan</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tanggal</th>
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Jumlah</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const status = statusConfig[payment.status] || statusConfig.paid
                return (
                  <tr key={payment.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white font-medium">{payment.order_number}</td>
                    <td className="py-3 px-4 text-gray-300">{payment.service_name}</td>
                    <td className="py-3 px-4 text-gray-400">{formatDate(payment.created_at)}</td>
                    <td className="py-3 px-4 text-white text-right font-medium">{formatCurrency(payment.total_price)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bank Selection Modal for Renewal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-200 rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-montserrat font-bold text-xl text-white">
                Pilih Bank untuk Perpanjangan
              </h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

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
                  <div className="font-poppins font-semibold text-gray-900 text-sm">{bank.name}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSelectedBank('bca')
                }}
                className="flex-1 btn btn-secondary"
              >
                Batal
              </button>
              <button
                onClick={handleBankSelected}
                disabled={!selectedBank || creatingRenewal}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingRenewal ? 'Memproses...' : 'Lanjutkan Pembayaran'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Dashboard Profile Component
function DashboardProfile() {
  const { user, fetchUser } = useAuthStore()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        company_name: user.company_name || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await usersAPI.updateProfile(formData)
      toast.success('Profil berhasil diperbarui!')
      fetchUser()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">Profil Saya</h1>
      
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="input bg-dark-100 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
            </div>
            <div>
              <label className="block font-poppins text-gray-300 mb-2">No. Telepon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Perusahaan</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Dashboard Settings Component
function DashboardSettings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (passwords.new !== passwords.confirm) {
      toast.error('Password baru tidak cocok!')
      return
    }
    
    if (passwords.new.length < 8) {
      toast.error('Password minimal 8 karakter!')
      return
    }

    setSaving(true)
    try {
      await usersAPI.updateProfile({ password: passwords.new })
      toast.success('Password berhasil diperbarui!')
      setPasswords({ current: '', new: '', confirm: '' })
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal mengubah password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">Pengaturan Akun</h1>
      
      <div className="card max-w-2xl">
        <h3 className="font-montserrat font-semibold text-lg text-white mb-4">Ubah Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-poppins text-gray-300 mb-2">Password Saat Ini</label>
            <input 
              type="password" 
              name="current"
              value={passwords.current}
              onChange={handleChange}
              className="input" 
              required
            />
          </div>
          <div>
            <label className="block font-poppins text-gray-300 mb-2">Password Baru</label>
            <input 
              type="password" 
              name="new"
              value={passwords.new}
              onChange={handleChange}
              className="input" 
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block font-poppins text-gray-300 mb-2">Konfirmasi Password Baru</label>
            <input 
              type="password" 
              name="confirm"
              value={passwords.confirm}
              onChange={handleChange}
              className="input" 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function Dashboard() {
  const location = useLocation()
  const { user, logout, fetchUser } = useAuthStore()

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [])

  const isActive = (href) => location.pathname === href

  return (
    <div className="min-h-screen pt-20 bg-dark-300">
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card sticky top-28">
              {/* User Info */}
              <div className="text-center pb-4 border-b border-white/10 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <h3 className="font-medium text-white truncate">{user?.full_name || 'User'}</h3>
                <p className="text-sm text-gray-400 truncate">{user?.email || ''}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.href)
                        ? 'bg-primary-600/20 text-primary-400'
                        : 'text-gray-400 hover:text-white hover:bg-dark-200'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-poppins text-sm">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all w-full"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-poppins text-sm">Keluar</span>
                </button>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4"
          >
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="payments" element={<DashboardPayments />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="seo/rsppn-analytics" element={<SEOAnalytics />} />
            </Routes>
          </motion.main>
        </div>
      </div>
    </div>
  )
}
