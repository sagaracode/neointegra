import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore';

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Page Components
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import References from './pages/References'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentPending from './pages/PaymentPending'
import SubscriptionExpiry from './pages/SubscriptionExpiry'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { rehydrate } = useAuthStore();

  useEffect(() => {
    // Rehydrate is now synchronous, no timeout needed
    rehydrate();
  }, [rehydrate]);

  return (
    <div className="min-h-screen bg-dark-300 flex flex-col">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e2e',
            color: '#fff',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Services />} />
          <Route path="/references" element={<References />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/pending" element={<PaymentPending />} />
          <Route path="/subscription-expiry" element={<SubscriptionExpiry />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
