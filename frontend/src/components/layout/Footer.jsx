import { Link } from 'react-router-dom'
import { 
  StarIcon,
  GlobeAltIcon, 
  CloudIcon, 
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'References', href: '/references' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
]

const services = [
  { name: 'Paket All In Service', href: '/services/all-in', icon: StarIcon, highlight: true },
  { name: 'Website Service', href: '/services/website', icon: GlobeAltIcon },
  { name: 'SEO Service', href: '/services/seo', icon: ChartBarIcon },
  { name: 'Mail Server Service', href: '/services/mail-server', icon: EnvelopeIcon },
  { name: 'Cloudflare Service', href: '/services/cloudflare', icon: CloudIcon },
  { name: 'Perbandingan Harga', href: '/services/comparison', icon: CurrencyDollarIcon },
]

const paymentMethods = [
  { name: 'BCA Virtual Account', type: 'va' },
  { name: 'BNI Virtual Account', type: 'va' },
  { name: 'BRI Virtual Account', type: 'va' },
  { name: 'Mandiri Virtual Account', type: 'va' },
  { name: 'GoPay', type: 'ewallet' },
  { name: 'OVO', type: 'ewallet' },
  { name: 'DANA', type: 'ewallet' },
  { name: 'QRIS', type: 'qris' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-200 border-t border-white/5">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo & Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/NeoIntegraTech.png"
                alt="NeoIntegraTech"
                className="h-12 w-auto"
              />
              <span className="font-montserrat font-bold text-xl text-white">
                Neo<span className="gradient-text">IntegraTech</span>
              </span>
            </Link>
            <p className="text-gray-400 font-poppins text-sm leading-relaxed">
              Solusi Integrasi Teknologi Terpadu. Kami menyediakan Paket All In Service yang mencakup 
              Website, SEO, Mail Server, dan Cloudflare dengan sistem terintegrasi dan harga terbaik.
            </p>
            <div className="flex items-center gap-4">
              {/* Social Media Icons */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-dark-100 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:bg-primary-600/20 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-dark-100 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:bg-primary-600/20 transition-all"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-dark-100 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:bg-primary-600/20 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-dark-100 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:bg-primary-600/20 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-lg text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 font-poppins transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                <span className="font-poppins text-sm">hello@neointegratech.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <PhoneIcon className="w-5 h-5 text-primary-400" />
                <span className="font-poppins text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPinIcon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="font-poppins text-sm">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h4 className="font-montserrat font-bold text-lg text-white mb-6">
              Layanan Kami
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className={`flex items-center gap-3 font-poppins transition-colors group ${
                      service.highlight
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-400 hover:text-primary-400'
                    }`}
                  >
                    <service.icon className={`w-5 h-5 ${
                      service.highlight
                        ? 'group-hover:text-yellow-300'
                        : 'group-hover:text-primary-400'
                    }`} />
                    {service.name}
                    {service.highlight && (
                      <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full font-bold">
                        HOT
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Payment Partners */}
          <div>
            <h4 className="font-montserrat font-bold text-lg text-white mb-6">
              Payment Partners
            </h4>
            
            {/* iPaymu Logo */}
            <div className="mb-6 p-4 bg-white rounded-xl inline-block">
              <img 
                src="/assets/ipaymu.png" 
                alt="iPaymu Payment Gateway" 
                className="h-8"
              />
              <p className="text-gray-600 text-xs mt-2 font-poppins">Secure Payment Gateway</p>
            </div>
            
            {/* Payment Methods */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-poppins">Accepted Payments:</p>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.slice(0, 8).map((method) => (
                  <div
                    key={method.name}
                    className="px-3 py-2 bg-dark-100 rounded-lg text-gray-400 text-xs font-poppins text-center"
                  >
                    {method.name.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 font-poppins text-sm text-center md:text-left">
              Copyright © {currentYear} NeoIntegraTech. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-gray-500 hover:text-gray-300 font-poppins text-sm transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/refund-policy"
                className="text-gray-500 hover:text-gray-300 font-poppins text-sm transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
