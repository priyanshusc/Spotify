import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children;
};

export default ProtectedRoute;