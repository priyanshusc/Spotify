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
    <div className="flex items-center justify-center min-h-[90vh] py-10">
      <form onSubmit={handleRegister} className="bg-spotify-light p-8 rounded-lg w-full max-w-md shadow-xl border border-spotify-grey">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign up to start listening</h2>

        {error && <p className="text-red-500 bg-red-500/10 p-3 rounded mb-4 text-sm border border-red-500/20">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Username</label>
          <input
            name="username"
            type="text"
            className="w-full p-3 bg-spotify-grey rounded outline-none focus:ring-1 focus:ring-white transition"
            placeholder="What should we call you?"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email address</label>
          <input
            name="email"
            type="email"
            className="w-full p-3 bg-spotify-grey rounded outline-none focus:ring-1 focus:ring-white transition"
            placeholder="name@domain.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            name="password"
            type="password"
            className="w-full p-3 bg-spotify-grey rounded outline-none focus:ring-1 focus:ring-white transition"
            placeholder="Create a password"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">I am a...</label>
          <select 
            name="role" 
            className="w-full p-3 bg-spotify-grey rounded outline-none focus:ring-1 focus:ring-white cursor-pointer"
          >
            <option value="user">Listener</option>
            <option value="artist">Artist</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-spotify-green text-black font-bold p-3 rounded-full hover:scale-105 transition-transform active:scale-95">
          Sign Up
        </button>

        <p className="mt-6 text-center text-spotify-text-muted text-sm">
          Already have an account? <Link to="/login" className="text-white hover:text-spotify-green underline ml-1">Log in here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;