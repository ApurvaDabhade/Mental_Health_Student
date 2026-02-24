import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, UserCog, Mail, Lock, Heart, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [userType, setUserType] = useState('user'); // 'user' or 'counsellor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {   
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    // Auth temporarily disabled – accept any credentials
    localStorage.setItem('userType', userType);
    if (userType === 'counsellor') {
      navigate('/counsellor');
    } else {
      navigate('/mainpage');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    // Auth temporarily disabled – treat Google button same as normal login
    localStorage.setItem('userType', userType);
    if (userType === 'counsellor') {
      navigate('/counsellor');
    } else {
      navigate('/mainpage');
    }
    setLoading(false);
  };

  const UserTypeToggle = () => (
    <div className="bg-[#EEF2FF] p-1 rounded-full flex w-full max-w-sm mx-auto mb-8">
      <button
        type="button"
        onClick={() => setUserType('user')}
        disabled={loading}
        className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${userType === 'user' ? 'bg-white text-[#111827] shadow-md' : 'text-[#6B7280]'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <User className="w-4 h-4" />
        <span>User</span>
      </button>
      <button
        type="button"
        onClick={() => setUserType('counsellor')}
        disabled={loading}
        className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${userType === 'counsellor' ? 'bg-white text-[#111827] shadow-md' : 'text-[#6B7280]'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <UserCog className="w-4 h-4" />
        <span>Counsellor</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex flex-col justify-center items-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-[#6366F1] p-2 rounded-xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">Student Wellness</h1>
            <p className="text-[#6B7280]">Your mental wellbeing companion</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border" style={{ borderColor: '#c8ced1' }}>
          <UserTypeToggle />

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#111827]">Welcome back</h2>
            <p className="text-[#6B7280]">
              Please sign in to your {userType === 'user' ? 'user' : 'counsellor'} account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-2">
                {userType === 'user' ? 'Email Address' : 'Professional Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={userType === 'user' ? 'your.email@example.com' : 'counsellor@clinic.com'}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  style={{ borderColor: '#E0E7FF' }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8d949d]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  style={{ borderColor: '#E0E7FF' }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2dc8ca] focus:ring-[#3d9098] rounded"
                  style={{ borderColor: '#c8ced1' }}
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2e2f34]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-[#6366F1] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6366F1] text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-[#4F46E5] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E0E7FF' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#6B7280]">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white border py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: '#E0E7FF' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-[#6B7280]">
            {userType === 'user' ? "Don't have an account?" : "Haven't registered as a counsellor?"}{' '}
            <a href={userType === 'user' ? '/register-user' : '/register-counsellor'} className="font-medium text-[#6366F1] hover:underline">
              Register here
              <ArrowRight className="inline ml-1 w-4 h-4" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}