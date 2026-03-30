import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const { refetch } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await api.post('/auth/register', data);

      if (res.data.success) {
        await refetch();
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
      // toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black p-4 pl-6 pb-6">
        <div className="w-full h-full relative overflow-hidden rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
            alt="Music Auth Banner"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <form onSubmit={handleRegister} className="w-full max-w-md">
          <div className="flex justify-start mb-6">
            <div className="bg-spotify-green w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(30,215,96,0.2)]">
              <div className="w-1 h-5 bg-black rotate-[25deg] ml-1"></div>
              <div className="w-1 h-5 bg-black rotate-[25deg] ml-1"></div>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl text-white font-black mb-2 tracking-tight">Join the Vibe</h2>
          <p className="text-sm font-medium text-spotify-green mb-8 tracking-widest uppercase">Create your Spotify account</p>

          {error && <p className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-md mb-6 text-sm font-medium">{error}</p>}

          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Username</label>
            <input
              name="username"
              type="text"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-spotify-green focus:bg-white/10 transition-all text-white placeholder-gray-500"
              placeholder="What should we call you?"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Email address</label>
            <input
              name="email"
              type="email"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-spotify-green focus:bg-white/10 transition-all text-white placeholder-gray-500"
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Password</label>
            <input
              name="password"
              type="password"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-spotify-green focus:bg-white/10 transition-all text-white placeholder-gray-500"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">
              I am a...
            </label>
            <div className="flex gap-4">
              {/* Listener Option */}
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="p-3 text-center bg-white/5 border border-white/10 rounded-lg text-white transition-all peer-checked:border-spotify-green peer-checked:bg-spotify-green/10 peer-checked:text-spotify-green hover:bg-white/10">
                  Listener
                </div>
              </label>

              {/* Artist Option */}
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="artist"
                  className="sr-only peer"
                />
                <div className="p-3 text-center bg-white/5 border border-white/10 rounded-lg text-white transition-all peer-checked:border-spotify-green peer-checked:bg-spotify-green/10 peer-checked:text-spotify-green hover:bg-white/10">
                  Artist
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-spotify-green text-black font-bold text-lg p-3 rounded-full hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(30,215,96,0.3)] transition-all active:scale-[0.98]">
            Sign Up
          </button>

          <p className="mt-6 text-center text-gray-400 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-white hover:text-spotify-green transition-colors pb-1 border-b border-transparent hover:border-spotify-green ml-1">Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;