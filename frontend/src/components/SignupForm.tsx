import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authToasts } from "../utils/toast";
import SkeletonLoader from "./SkeletonLoader";

interface SignupFormProps {
  onSignup: (user: { email: string; name: string; avatar?: string }) => void;
}

export default function SignupForm({ onSignup }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFocus = (field: string) => {
    setFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      authToasts.fieldsRequired();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      authToasts.passwordMismatch();
      return;
    }

    if (formData.password.length < 6) {
      authToasts.weakPassword();
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        email: formData.email,
        name: formData.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=10b981&color=fff&size=150`
      };
      onSignup(user);
      authToasts.signupSuccess();
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignup = () => {
    authToasts.signupError("Google signup not implemented yet");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="opacity-90">Join us today</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus('name')}
                onBlur={() => handleBlur('name')}
                className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focused.name || formData.name ? 'top-2 text-xs text-green-600' : 'top-4 text-base text-gray-500'
              }`}>
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focused.email || formData.email ? 'top-2 text-xs text-green-600' : 'top-4 text-base text-gray-500'
              }`}>
                Email Address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focused.password || formData.password ? 'top-2 text-xs text-green-600' : 'top-4 text-base text-gray-500'
              }`}>
                Password
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
                className="w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                focused.confirmPassword || formData.confirmPassword ? 'top-2 text-xs text-green-600' : 'top-4 text-base text-gray-500'
              }`}>
                Confirm Password
              </label>
            </div>

            {loading ? (
              <SkeletonLoader variant="button" className="w-full" />
            ) : (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              >
                Create Account
              </button>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}