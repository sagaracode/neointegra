import { motion } from 'framer-motion'
import { ArrowTopRightOnSquareIcon, ServerIcon, GlobeAltIcon, UserIcon } from '@heroicons/react/24/outline'

export default function CPanelInfo() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-montserrat font-bold text-2xl text-white mb-6">
          Informasi Umum
        </h1>

        {/* Detail cPanel Card */}
        <div className="card max-w-3xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <ServerIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-montserrat font-bold text-xl text-white">
              Detail cPanel
            </h2>
          </div>

          <div className="space-y-6">
            {/* Tautan Akses */}
            <div className="bg-dark-200 rounded-xl p-5 border border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-2 font-poppins">Tautan Akses</p>
                  <a
                    href="http://rsppn.co.id/cpanel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-2 transition-colors group"
                  >
                    <span className="font-mono">http://rsppn.co.id/cpanel</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="bg-dark-200 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-5 h-5 text-primary-400" />
                <p className="text-gray-400 text-sm font-poppins">Username</p>
              </div>
              <p className="text-white font-mono font-semibold text-lg ml-8">rspp3052</p>
            </div>

            {/* Nameserver */}
            <div className="bg-dark-200 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <GlobeAltIcon className="w-5 h-5 text-primary-400" />
                <p className="text-gray-400 text-sm font-poppins">Nameserver</p>
              </div>
              <div className="ml-8 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">NS1:</span>
                  <span className="text-white font-mono">ns1.rsppn.co.id</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">NS2:</span>
                  <span className="text-white font-mono">ns2.rsppn.co.id</span>
                </div>
              </div>
            </div>

            {/* Alamat IP */}
            <div className="bg-dark-200 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <ServerIcon className="w-5 h-5 text-primary-400" />
                <p className="text-gray-400 text-sm font-poppins">Alamat IP</p>
              </div>
              <p className="text-white font-mono font-semibold text-lg ml-8">162.159.26.118</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <a
              href="http://rsppn.co.id/cpanel"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center gap-2 w-full justify-center"
            >
              <span>Buka cPanel</span>
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
