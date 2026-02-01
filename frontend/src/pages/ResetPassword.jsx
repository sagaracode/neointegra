import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Token reset password tidak valid')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Password tidak cocok')
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }

    setIsLoading(true)
    
    try {
      console.log('🔄 Sending reset password request...', { token: token?.substring(0, 20) + '...' })
      
      const response = await api.post('/auth/reset-password', {
        token: token,
        new_password: formData.newPassword
      })
      
      console.log('✅ Reset password successful:', response.data)
      setPasswordReset(true)
      toast.success('Password berhasil direset')
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      console.error('❌ Reset password failed:', error.response?.data || error.message)
      toast.error(error.response?.data?.detail || 'Gagal reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-dark-300 relative overflow-hidden">
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
            <div className="card text-center">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="font-montserrat font-bold text-2xl text-white mb-4">
                Password Berhasil Direset!
              </h2>
              <p className="font-poppins text-gray-400 mb-6">
                Password Anda telah berhasil diubah. Anda akan diarahkan ke halaman login...
              </p>
              <Link to="/login" className="btn btn-primary w-full">
                Login Sekarang
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-dark-300 relative overflow-hidden">
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
              Reset Password
            </h1>
            <p className="font-poppins text-gray-400">
              Masukkan password baru Anda
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="input pl-12 pr-12"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input pl-12 pr-12"
                    placeholder="Ulangi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Mereset...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
