import { Navigate, useLocation } from 'react-router-dom';
import { getAuthFromStorage } from '../api/auth';


export default function RequireAuth({ children }) {
  const location = useLocation();
  const { token, user } = getAuthFromStorage();

  if (!token || !user || user.status === "blocked") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
