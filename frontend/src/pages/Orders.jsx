import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { ordersAPI } from '../services/api'
import useAuthStore from '../store/authStore'

const statusConfig = {
  pending: {
    label: 'Menunggu Pembayaran',
    icon: ClockIcon,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-600/20',
    borderColor: 'border-yellow-600/30'
  },
  paid: {
    label: 'Dibayar',
    icon: CheckCircleIcon,
    color: 'text-green-400',
    bgColor: 'bg-green-600/20',
    borderColor: 'border-green-600/30'
  },
  processing: {
    label: 'Diproses',
    icon: ClockIcon,
    color: 'text-blue-400',
    bgColor: 'bg-blue-600/20',
    borderColor: 'border-blue-600/30'
  },
  completed: {
    label: 'Selesai',
    icon: CheckCircleIcon,
    color: 'text-green-400',
    bgColor: 'bg-green-600/20',
    borderColor: 'border-green-600/30'
  },
  cancelled: {
    label: 'Dibatalkan',
    icon: XCircleIcon,
    color: 'text-red-400',
    bgColor: 'bg-red-600/20',
    borderColor: 'border-red-600/30'
  }
}

export default function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders')
      return
    }
    loadOrders()
  }, [isAuthenticated, navigate])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersAPI.getAll()
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.pending
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-400 font-poppins">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-300 pt-20">
      <div className="container-custom py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-3xl text-white">
                Riwayat Order
              </h1>
              <p className="text-gray-400 font-poppins">
                Lihat semua order dan status pembayaran Anda
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari order number atau service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-200/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-dark-200/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Pembayaran</option>
              <option value="paid">Dibayar</option>
              <option value="processing">Diproses</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card glass p-12 text-center"
          >
            <ShoppingBagIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="font-montserrat font-semibold text-xl text-white mb-2">
              {searchQuery || filterStatus !== 'all' ? 'Tidak ada order yang ditemukan' : 'Belum ada order'}
            </h3>
            <p className="text-gray-400 font-poppins mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Coba ubah filter atau pencarian Anda' 
                : 'Mulai order layanan untuk bisnis Anda'}
            </p>
            <button
              onClick={() => navigate('/services')}
              className="btn btn-primary"
            >
              Lihat Layanan
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const config = getStatusConfig(order.status)
              const StatusIcon = config.icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card glass p-6 hover:border-primary-500/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Status Icon */}
                    <div className={`w-16 h-16 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-8 h-8 ${config.color}`} />
                    </div>

                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-montserrat font-semibold text-lg text-white mb-1">
                            {order.service_name || 'Custom Order'}
                          </h3>
                          <p className="text-gray-400 font-poppins text-sm">
                            Order #{order.order_number}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}>
                          <span className={`text-sm font-poppins ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 font-poppins">Tanggal:</span>
                          <p className="text-gray-300 font-montserrat">
                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-poppins">Quantity:</span>
                          <p className="text-gray-300 font-montserrat">{order.quantity}x</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-poppins">Harga Satuan:</span>
                          <p className="text-gray-300 font-montserrat">
                            Rp {order.unit_price?.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-poppins">Total:</span>
                          <p className="text-white font-montserrat font-bold">
                            Rp {order.total_price?.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-3 bg-dark-200/50 rounded-lg">
                          <p className="text-gray-400 font-poppins text-sm">
                            <span className="text-gray-500">Catatan:</span> {order.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="btn btn-secondary group-hover:btn-primary transition-all"
                      >
                        Detail
                        <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Summary */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 card glass p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-montserrat font-bold text-white mb-1">
                  {filteredOrders.length}
                </div>
                <div className="text-gray-400 font-poppins text-sm">Total Order</div>
              </div>
              <div>
                <div className="text-3xl font-montserrat font-bold text-yellow-400 mb-1">
                  {filteredOrders.filter(o => o.status === 'pending').length}
                </div>
                <div className="text-gray-400 font-poppins text-sm">Pending</div>
              </div>
              <div>
                <div className="text-3xl font-montserrat font-bold text-green-400 mb-1">
                  {filteredOrders.filter(o => o.status === 'paid' || o.status === 'completed').length}
                </div>
                <div className="text-gray-400 font-poppins text-sm">Berhasil</div>
              </div>
              <div>
                <div className="text-3xl font-montserrat font-bold gradient-text mb-1">
                  Rp {filteredOrders.reduce((sum, o) => sum + (o.total_price || 0), 0).toLocaleString('id-ID')}
                </div>
                <div className="text-gray-400 font-poppins text-sm">Total Nilai</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
