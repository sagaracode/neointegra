import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    // You can return a loading spinner here if you want
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
