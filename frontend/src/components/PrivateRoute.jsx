import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Simply check if authenticated - no loading state needed
  // Token check is done synchronously in store initialization
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
