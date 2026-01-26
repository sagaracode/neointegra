import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast.success('Login berhasil! Selamat datang kembali.')
      
      // Check if this is the special customer
      if (formData.email === 'web@rsppn.co.id') {
        navigate('/subscription-expiry')
      } else {
        navigate('/dashboard')
      }
    } else {
      toast.error(result.error || 'Login gagal. Periksa email dan password Anda.')
    }
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-dark-300 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <img
                src="/assets/NeoIntegraTech.png"
                alt="NeoIntegraTech"
                className="h-12 w-auto"
              />
              <span className="font-montserrat font-bold text-2xl text-white">
                Neo<span className="gradient-text">IntegraTech</span>
              </span>
            </Link>
            <h1 className="font-montserrat font-bold text-3xl text-white mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="font-poppins text-gray-400">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input pl-12"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input pl-12 pr-12"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 bg-dark-200 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-poppins text-gray-400 text-sm">
                    Ingat saya
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="font-poppins text-primary-400 text-sm hover:text-primary-300"
                >
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-100 text-gray-500 font-poppins">
                  Atau
                </span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center font-poppins text-gray-400">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
