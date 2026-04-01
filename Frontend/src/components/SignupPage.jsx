
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Mail, Lock, User, Eye, EyeOff,
  CheckCircle, Shield, Loader2, UserCog
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveProfileFromSignup } from '../utils/studentProfileStorage';

export default function UserSignup() {
  const [userType, setUserType] = useState('user'); // 'user' or 'counsellor'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    heightCm: '',
    weightKg: '',
    acceptTerms: false,
    ageConfirmation: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { signup, signInWithGoogle } = useAuth();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.ageConfirmation) {
      newErrors.ageConfirmation = 'You must confirm you are 18 or older';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and privacy policy';
    }

    if (!formData.heightCm || Number(formData.heightCm) <= 0) {
      newErrors.heightCm = 'Please enter your height in cm';
    }
    if (!formData.weightKg || Number(formData.weightKg) <= 0) {
      newErrors.weightKg = 'Please enter your weight in kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      // Auth temporarily disabled – simulate successful signup
      localStorage.setItem('userType', userType);
      const uid = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('userId', uid);
      localStorage.setItem('devEmail', formData.email);
      localStorage.setItem('devDisplayName', formData.fullName);
      localStorage.removeItem('manasVeda_onboarding_complete');
      saveProfileFromSignup({
        fullName: formData.fullName,
        email: formData.email,
        heightCm: formData.heightCm,
        weightKg: formData.weightKg,
      });
      setIsSubmitted(true);
    }
  };

  const handleGoogleSignUp = async () => {
    // Auth temporarily disabled – treat as normal signup
    if (validate()) {
      localStorage.setItem('userType', userType);
      const uid = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('userId', uid);
      localStorage.setItem('devEmail', formData.email);
      localStorage.setItem('devDisplayName', formData.fullName);
      localStorage.removeItem('manasVeda_onboarding_complete');
      saveProfileFromSignup({
        fullName: formData.fullName,
        email: formData.email,
        heightCm: formData.heightCm,
        weightKg: formData.weightKg,
      });
      setIsSubmitted(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in border border-[#E0E7FF]">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#111827] mb-4">Welcome!</h2>
          <p className="text-[#6B7280] mb-6">
            Your account has been created successfully.
          </p>
          <p className="text-sm text-[#9CA3AF] mb-8">
            You can now start your mental wellness journey.
          </p>
          <button
            onClick={() => {
              if (userType === 'counsellor') {
                navigate('/counsellor-onboarding', { state: { userId: localStorage.getItem('userId') } });
              } else {
                window.location.href = '/onboarding';
              }
            }}
            className="bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4338CA] transition-all duration-300 w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const UserTypeToggle = () => (
    <div className="bg-[#EEF2FF] p-1 rounded-full flex w-full mb-8">
      <button
        type="button"
        onClick={() => setUserType('user')}
        disabled={isSubmitting}
        className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${userType === 'user' ? 'bg-white text-[#111827] shadow-md' : 'text-[#6B7280]'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <User className="w-4 h-4" />
        <span>User</span>
      </button>
      <button
        type="button"
        onClick={() => setUserType('counsellor')}
        disabled={isSubmitting}
        className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${userType === 'counsellor' ? 'bg-white text-[#111827] shadow-md' : 'text-[#6B7280]'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <UserCog className="w-4 h-4" />
        <span>Counsellor</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EEF2FF] font-sans p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#111827]">Create Account</h1>
          <p className="text-[#6B7280]">Join for guided mental wellness support.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-[#E0E7FF]">
          <UserTypeToggle />

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${errors.fullName ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.fullName ? '#ef4444' : '#E0E7FF' }}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${errors.email ? 'border-red-500' : ''}`}
                style={{ borderColor: errors.email ? '#ef4444' : '#E0E7FF' }}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${errors.password ? 'border-red-500' : ''}`}
                  style={{ borderColor: errors.password ? '#ef4444' : '#E0E7FF' }}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827]"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#6B7280]">Password strength:</span>
                    <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Body parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Height (cm) *
                </label>
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={formData.heightCm}
                  onChange={(e) => handleInputChange('heightCm', e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${errors.heightCm ? 'border-red-500' : ''}`}
                  style={{ borderColor: errors.heightCm ? '#ef4444' : '#E0E7FF' }}
                  placeholder="e.g., 170"
                />
                {errors.heightCm && <p className="text-red-500 text-sm mt-1">{errors.heightCm}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  min="20"
                  max="250"
                  value={formData.weightKg}
                  onChange={(e) => handleInputChange('weightKg', e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${errors.weightKg ? 'border-red-500' : ''}`}
                  style={{ borderColor: errors.weightKg ? '#ef4444' : '#E0E7FF' }}
                  placeholder="e.g., 65"
                />
                {errors.weightKg && <p className="text-red-500 text-sm mt-1">{errors.weightKg}</p>}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Confirm Password *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  style={{ borderColor: errors.confirmPassword ? '#ef4444' : '#E0E7FF' }}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d949d] hover:text-[#2e2f34]"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Age Confirmation */}
              <div className="bg-[#EEF2FF] p-4 rounded-lg">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.ageConfirmation}
                  onChange={(e) => handleInputChange('ageConfirmation', e.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 mt-1 text-[#4F46E5] focus:ring-[#4F46E5] rounded"
                  style={{ borderColor: '#E0E7FF' }}
                />
                <span className="ml-2 text-sm text-[#111827]">
                  I confirm that I am 18 years of age or older *
                </span>
              </label>
              {errors.ageConfirmation && <p className="text-red-500 text-sm mt-1">{errors.ageConfirmation}</p>}
            </div>

            {/* Terms and Privacy */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 mt-1 text-[#4F46E5] focus:ring-[#4F46E5] rounded"
                  style={{ borderColor: '#E0E7FF' }}
                />
                <span className="ml-2 text-sm text-[#111827]">
                  I agree to the <a href="/terms" target="_blank" className="font-medium text-[#4F46E5] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="font-medium text-[#4F46E5] hover:underline">Privacy Policy</a>. *
                </span>
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Your Privacy Matters</p>
                <p className="text-blue-800">
                  All your data is encrypted and confidential. We never share your personal information without your consent.
                </p>
              </div>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                {errors.general}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="pt-6 border-t space-y-3" style={{ borderColor: '#E0E7FF' }}>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#4F46E5] text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#4338CA] disabled:opacity-70 disabled:cursor-wait transition-all duration-300 flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-6 h-6" />
                    <span>Create Account</span>
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
                onClick={handleGoogleSignUp}
                disabled={isSubmitting}
                className="w-full bg-white border py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: '#c8ced1' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-[#6B7280]">
                Already have an account?{' '}
                <a href="/" className="text-[#4F46E5] hover:underline font-semibold">
                  Log in here
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Support */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-sm text-red-900">
            <strong>In Crisis?</strong> If you're experiencing a mental health emergency, please call{' '}
            <a href="tel:988" className="font-bold underline">988</a> (Suicide & Crisis Lifeline) immediately.
          </p>
        </div>
      </div>
    </div>
  );
}