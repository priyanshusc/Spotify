import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const [error, setError] = useState('');
  const { refetch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await api.post('/auth/login', data);

      if (res.data.success) {
        await refetch();
        navigate('/');
        toast.success('Login successful!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black p-4 pl-6 pb-6">
        <div className="w-full h-full relative overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1615554851544-e6249b92a492?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Music Auth Banner"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="flex justify-start mb-6">
            <div className="bg-spotify-green w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(30,215,96,0.2)]">
               <div className="w-1 h-5 bg-black rotate-[25deg] ml-1"></div>
               <div className="w-1 h-5 bg-black rotate-[25deg] ml-1"></div>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl text-white font-black mb-2 tracking-tight">Hi Music Lover</h2>
          <p className="text-sm font-medium text-spotify-green mb-10 tracking-widest uppercase">Welcome to Spotify</p>
          
          {error && <p className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-md mb-6 text-sm font-medium">{error}</p>}

          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Email or Username</label>
            <input
              name="username"
              type="text"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-spotify-green focus:bg-white/10 transition-all text-white placeholder-gray-500"
              placeholder="Email or Username"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Password</label>
            <input
              name="password"
              type="password"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-spotify-green focus:bg-white/10 transition-all text-white placeholder-gray-500"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="w-full bg-spotify-green text-black font-bold text-lg p-3 rounded-full hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(30,215,96,0.3)] transition-all active:scale-[0.98]">
            Log In
          </button>

          <p className="mt-6 text-center text-gray-400 text-sm font-medium">
            Don't have an account? <Link to="/register" className="text-white hover:text-spotify-green transition-colors pb-1 border-b border-transparent hover:border-spotify-green ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;   