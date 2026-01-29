import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // Double-check: verify token exists in localStorage AND store
  const hasToken = token || localStorage.getItem('access_token');
  
  if (!isAuthenticated && !hasToken) {
    // Save the attempted URL for redirecting after login
    console.log('[PrivateRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
