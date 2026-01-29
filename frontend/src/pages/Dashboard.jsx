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
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { ordersAPI, paymentsAPI, usersAPI } from '../services/api'

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
  
  // Bank selection modal
  const [showBankModal, setShowBankModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedBank, setSelectedBank] = useState('bca')

  useEffect(() => {
    loadOrders()
  }, [])

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
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-dark-200'
                  }`}
                >
                  <img
                    src={bank.logo}
                    alt={bank.name}
                    className="h-12 mx-auto object-contain mb-2"
                  />
                  <p className="text-sm text-gray-300 font-medium text-center">
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
    </div>
  )
}

// Dashboard Payments Component
function DashboardPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
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

  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">Riwayat Pembayaran</h1>
      
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
            </Routes>
          </motion.main>
        </div>
      </div>
    </div>
  )
}
