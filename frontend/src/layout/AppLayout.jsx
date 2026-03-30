import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div className="min-h-screen bg-black" />;
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header />
                <Outlet />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <div className="flex-1 flex flex-col relative overflow-y-auto">
                    <Header />

                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AppLayout;