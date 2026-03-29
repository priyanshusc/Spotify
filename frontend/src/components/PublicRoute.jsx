import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>

    if (user) {
        return <Navigate to="/" replace />
    }

    return children;
};

export default PublicRoute;