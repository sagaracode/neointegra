import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon, 
  XMarkIcon, 
  ChevronDownIcon,
  StarIcon,
  GlobeAltIcon,
  CloudIcon,
  EnvelopeIcon,
  ChartBarIcon,
  UserCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import useAuthStore from '../../store/authStore'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  {
    name: 'Layanan',
    href: '#',
    dropdown: [
      { 
        name: 'Paket All In Service', 
        href: '/services/all-in', 
        icon: StarIcon,
        badge: 'REKOMENDASI',
        highlight: true
      },
      { name: 'Website Service', href: '/services/website', icon: GlobeAltIcon },
      { name: 'SEO Service', href: '/services/seo', icon: ChartBarIcon },
      { name: 'Mail Server Service', href: '/services/mail-server', icon: EnvelopeIcon },
      { name: 'Cloudflare Service', href: '/services/cloudflare', icon: CloudIcon },
      { 
        name: 'Perbandingan Harga', 
        href: '/services/comparison', 
        icon: CurrencyDollarIcon,
        divider: true
      },
    ],
  },
  { name: 'References', href: '/references' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const isActive = (href) => location.pathname === href

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-200/95 nav-blur shadow-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/NeoIntegraTech.png"
              alt="NeoIntegraTech"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-montserrat font-bold text-xl text-white hidden sm:block">
              Neo<span className="gradient-text">IntegraTech</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) =>
              item.dropdown ? (
                <Menu as="div" className="relative" key={item.name}>
                  {({ open }) => (
                    <>
                      <Menu.Button className="flex items-center gap-1 text-gray-300 hover:text-white font-poppins font-medium transition-colors">
                        {item.name}
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Menu.Items className="absolute left-0 mt-4 w-72 bg-dark-100 rounded-xl border border-white/10 shadow-xl overflow-hidden">
                          <div className="p-2">
                            {item.dropdown.map((subItem, index) => (
                              <Fragment key={subItem.name}>
                                {subItem.divider && index > 0 && (
                                  <div className="my-2 border-t border-white/10" />
                                )}
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to={subItem.href}
                                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                                        subItem.highlight
                                          ? active
                                            ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/40'
                                            : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                                          : active
                                          ? 'bg-primary-600/20 text-primary-400'
                                          : 'text-gray-300 hover:text-white'
                                      }`}
                                    >
                                      <subItem.icon className="w-5 h-5" />
                                      <span className="font-poppins flex-grow">{subItem.name}</span>
                                      {subItem.badge && (
                                        <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full font-bold">
                                          {subItem.badge}
                                        </span>
                                      )}
                                    </Link>
                                  )}
                                </Menu.Item>
                              </Fragment>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-poppins font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <UserCircleIcon className="w-6 h-6" />
                  <span className="font-poppins">{user?.full_name || 'Account'}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Menu.Items className="absolute right-0 mt-4 w-48 bg-dark-100 rounded-xl border border-white/10 shadow-xl overflow-hidden">
                    <div className="p-2">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`block px-4 py-2 rounded-lg ${
                              active ? 'bg-primary-600/20 text-primary-400' : 'text-gray-300'
                            }`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={`w-full text-left px-4 py-2 rounded-lg ${
                              active ? 'bg-red-600/20 text-red-400' : 'text-gray-300'
                            }`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login / Client Area
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <Transition
          show={mobileMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-4"
        >
          <div className="lg:hidden absolute left-0 right-0 top-20 bg-dark-200/98 nav-blur border-b border-white/10">
            <div className="container-custom py-4 space-y-2">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div key={item.name} className="space-y-1">
                    <div className="px-4 py-2 text-gray-400 font-poppins font-medium">
                      {item.name}
                    </div>
                    {item.dropdown.map((subItem, index) => (
                      <Fragment key={subItem.name}>
                        {subItem.divider && index > 0 && (
                          <div className="mx-4 border-t border-white/10 my-2" />
                        )}
                        <Link
                          to={subItem.href}
                          className={`flex items-center gap-3 px-6 py-2 transition-colors ${
                            subItem.highlight
                              ? 'text-yellow-400 hover:text-yellow-300'
                              : 'text-gray-300 hover:text-primary-400'
                          }`}
                        >
                          <subItem.icon className="w-5 h-5" />
                          <span className="flex-grow">{subItem.name}</span>
                          {subItem.badge && (
                            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full font-bold">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      </Fragment>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-2 font-poppins font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
              
              <div className="pt-4 border-t border-white/10">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block px-4 py-2">
                    <span className="btn btn-primary w-full">Login / Client Area</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  )
}
