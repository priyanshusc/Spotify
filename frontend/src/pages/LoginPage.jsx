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
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleLogin} className="bg-spotify-light p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-3xl text-white font-bold mb-6 text-center">Log in to Spotify</h2>

        {error && <p className="text-red-500 bg-red-500/10 p-3 rounded mb-4 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Username</label>
          <input
            name="username"
            type="username"
            className="w-full p-3 bg-spotify-grey rounded outline-none focus:ring-1 focus:ring-white"
            placeholder="Email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            name="password"
            type="password"
            className="w-full p-3 bg-spotify-grey rounded outline-none focus:ring-1 focus:ring-white"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="w-full bg-spotify-green text-black font-bold p-3 rounded-full hover:scale-105 transition">
          Log In
        </button>

        <p className="mt-6 text-center text-spotify-text-muted text-sm">
          Don't have an account? <Link to="/register" className="text-white hover:text-spotify-green underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;   