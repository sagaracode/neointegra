import { useEffect } from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import useAuthStore from '../store/authStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCartIcon },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

function DashboardHome() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-white">
          Selamat Datang, {user?.full_name || 'User'}!
        </h1>
        <p className="text-gray-400 font-poppins">
          Kelola layanan dan pesanan Anda dari dashboard ini.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Active Services', value: '3', color: 'from-blue-500 to-cyan-500' },
          { label: 'Pending Orders', value: '1', color: 'from-yellow-500 to-orange-500' },
          { label: 'Total Spent', value: 'Rp 2.5M', color: 'from-green-500 to-emerald-500' },
          { label: 'Support Tickets', value: '0', color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
              <span className="text-white text-xl font-bold">{stat.value.charAt(0)}</span>
            </div>
            <div className="font-montserrat font-bold text-2xl text-white mb-1">
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
        <h2 className="font-montserrat font-bold text-xl text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/services"
            className="p-4 rounded-xl bg-dark-200 hover:bg-dark-100 border border-white/5 hover:border-primary-500/30 transition-all group"
          >
            <div className="font-montserrat font-semibold text-white group-hover:text-primary-400">
              Order New Service
            </div>
            <p className="text-gray-500 text-sm">Browse our services</p>
          </Link>
          <Link
            to="/dashboard/orders"
            className="p-4 rounded-xl bg-dark-200 hover:bg-dark-100 border border-white/5 hover:border-primary-500/30 transition-all group"
          >
            <div className="font-montserrat font-semibold text-white group-hover:text-primary-400">
              View Orders
            </div>
            <p className="text-gray-500 text-sm">Check order status</p>
          </Link>
          <Link
            to="/contact"
            className="p-4 rounded-xl bg-dark-200 hover:bg-dark-100 border border-white/5 hover:border-primary-500/30 transition-all group"
          >
            <div className="font-montserrat font-semibold text-white group-hover:text-primary-400">
              Get Support
            </div>
            <p className="text-gray-500 text-sm">Contact our team</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function DashboardOrders() {
  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">
        My Orders
      </h1>
      <div className="card">
        <p className="text-gray-400 text-center py-8">
          No orders yet. <Link to="/services" className="text-primary-400 hover:text-primary-300">Browse our services</Link> to get started.
        </p>
      </div>
    </div>
  )
}

function DashboardPayments() {
  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">
        Payment History
      </h1>
      <div className="card">
        <p className="text-gray-400 text-center py-8">
          No payment history yet.
        </p>
      </div>
    </div>
  )
}

function DashboardProfile() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">
        Profile Settings
      </h1>
      <div className="card max-w-2xl">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.full_name}
                className="input"
              />
            </div>
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="input"
                disabled
              />
            </div>
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                defaultValue={user?.phone}
                className="input"
              />
            </div>
            <div>
              <label className="block font-poppins text-gray-300 mb-2">Company</label>
              <input
                type="text"
                defaultValue={user?.company}
                className="input"
              />
            </div>
          </div>
          <button className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardSettings() {
  return (
    <div>
      <h1 className="font-montserrat font-bold text-2xl text-white mb-6">
        Account Settings
      </h1>
      <div className="card max-w-2xl">
        <div className="space-y-6">
          <div>
            <h3 className="font-montserrat font-semibold text-lg text-white mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-poppins text-gray-300 mb-2">Current Password</label>
                <input type="password" className="input" />
              </div>
              <div>
                <label className="block font-poppins text-gray-300 mb-2">New Password</label>
                <input type="password" className="input" />
              </div>
              <div>
                <label className="block font-poppins text-gray-300 mb-2">Confirm New Password</label>
                <input type="password" className="input" />
              </div>
              <button className="btn btn-primary">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const location = useLocation()
  const { isAuthenticated, logout, fetchUser } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

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
                    <span className="font-poppins">{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all w-full"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-poppins">Logout</span>
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
