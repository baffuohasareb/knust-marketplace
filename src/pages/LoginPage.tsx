import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function LoginPage() {
  const { userType } = useParams<{ userType: string }>();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate UITS authentication
    setTimeout(() => {
      if (email.endsWith('@knust.edu.gh') && password.length > 0) {
        // Mock student data
        const mockUser = {
          id: '1',
          name: 'John Doe',
          email: email,
          indexNumber: '20123456',
          programme: 'Computer Engineering',
          year: 3,
          hall: 'Unity Hall'
        };

        dispatch({ type: 'LOGIN', payload: mockUser });
        
        if (userType === 'buyer') {
          navigate('/buyer/home');
        } else {
          // For sellers, redirect to seller dashboard (not implemented in this spec)
          alert('Seller dashboard not implemented in this demo');
        }
      } else {
        alert('Please use a valid KNUST email address');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">KM</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sign in as {userType === 'buyer' ? 'Buyer' : 'Seller'}
              </h1>
              <p className="text-gray-600">
                Use your KNUST credentials to continue
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  KNUST Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@knust.edu.gh"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:transform active:scale-95'
                }`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                This uses KNUST's UITS authentication system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}