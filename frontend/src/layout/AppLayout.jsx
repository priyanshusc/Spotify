import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from './Header';
import Footer from './Footer';

const AppLayout = () => {
    return (
        <div className="h-screen bg-black flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 bg-spotify-light mt-2 mr-2 mb-2 rounded-lg overflow-y-auto relative">
                    <Header />
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default AppLayout;