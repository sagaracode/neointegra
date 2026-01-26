import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await api.post('/auth/forgot-password', null, { params: { email } })
      setEmailSent(true)
      toast.success('Link reset password telah dikirim ke email Anda')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gagal mengirim email reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
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
            <div className="card text-center">
              <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="font-montserrat font-bold text-2xl text-white mb-4">
                Email Terkirim!
              </h2>
              <p className="font-poppins text-gray-400 mb-6">
                Kami telah mengirimkan link reset password ke <strong className="text-white">{email}</strong>
              </p>
              <p className="font-poppins text-gray-400 text-sm mb-6">
                Silakan cek inbox atau folder spam Anda. Link akan kadaluarsa dalam 1 jam.
              </p>
              <Link to="/login" className="btn btn-primary w-full">
                Kembali ke Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
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
              Lupa Password?
            </h1>
            <p className="font-poppins text-gray-400">
              Masukkan email Anda dan kami akan mengirimkan link untuk reset password
            </p>
          </div>

          {/* Form */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input pl-12"
                    placeholder="email@example.com"
                  />
                </div>
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
                    Mengirim...
                  </>
                ) : (
                  'Kirim Link Reset Password'
                )}
              </button>

              <div className="text-center pt-4 border-t border-dark-200">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 font-poppins text-primary-400 hover:text-primary-300"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
