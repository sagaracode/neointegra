import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Token verifikasi tidak valid')
        setVerifying(false)
        return
      }

      try {
        await api.post('/auth/verify-email', null, { params: { token } })
        setSuccess(true)
        toast.success('Email berhasil diverifikasi!')
        setTimeout(() => navigate('/login'), 3000)
      } catch (err) {
        setError(err.response?.data?.detail || 'Gagal verifikasi email')
        toast.error(error)
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [token, navigate, error])

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
            {verifying ? (
              <>
                <div className="inline-block w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="font-montserrat font-bold text-2xl text-white mb-4">
                  Memverifikasi Email...
                </h2>
                <p className="font-poppins text-gray-400">
                  Mohon tunggu sebentar
                </p>
              </>
            ) : success ? (
              <>
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="font-montserrat font-bold text-2xl text-white mb-4">
                  Email Terverifikasi! 🎉
                </h2>
                <p className="font-poppins text-gray-400 mb-6">
                  Akun Anda telah berhasil diverifikasi. Selamat datang di NeoIntegraTech!
                </p>
                <Link to="/login" className="btn btn-primary w-full">
                  Login Sekarang
                </Link>
              </>
            ) : (
              <>
                <XCircleIcon className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h2 className="font-montserrat font-bold text-2xl text-white mb-4">
                  Verifikasi Gagal
                </h2>
                <p className="font-poppins text-gray-400 mb-6">
                  {error}
                </p>
                <div className="space-y-3">
                  <Link to="/register" className="btn btn-primary w-full">
                    Daftar Ulang
                  </Link>
                  <Link to="/login" className="btn btn-secondary w-full">
                    Kembali ke Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
