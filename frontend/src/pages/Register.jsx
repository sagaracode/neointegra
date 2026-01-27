import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok!')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password minimal 8 karakter!')
      return
    }

    const result = await register({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.company_name,
      password: formData.password,
    })

    if (result.success) {
      toast.success('Registrasi berhasil! Silakan login.')
      navigate('/login')
    } else {
      toast.error(result.error || 'Registrasi gagal. Silakan coba lagi.')
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
          className="max-w-lg mx-auto"
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
              Buat Akun Baru
            </h1>
            <p className="font-poppins text-gray-400">
              Daftar untuk mulai menggunakan layanan kami
            </p>
          </div>

          {/* Register Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="input pl-12"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
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

              {/* Phone & Company */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-poppins text-gray-300 mb-2">
                    No. Telepon
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="08123456789"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-poppins text-gray-300 mb-2">
                    Perusahaan
                  </label>
                  <div className="relative">
                    <BuildingOfficeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="Nama perusahaan"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
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
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-poppins text-gray-300 mb-2">
                  Konfirmasi Password <span className="text-red-400">*</span>
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
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-gray-600 bg-dark-200 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-poppins text-gray-400 text-sm">
                  Saya setuju dengan{' '}
                  <Link to="/terms" className="text-primary-400 hover:text-primary-300">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link to="/privacy" className="text-primary-400 hover:text-primary-300">
                    Kebijakan Privasi
                  </Link>
                </span>
              </label>

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
                  'Daftar Sekarang'
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

            {/* Login Link */}
            <p className="text-center font-poppins text-gray-400">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
