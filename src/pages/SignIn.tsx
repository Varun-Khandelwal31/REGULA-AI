import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user exists in localStorage, redirect to dashboard
    const auth = localStorage.getItem('regulaai_auth');
    const onboarded = localStorage.getItem('regulaai_onboarding_complete');
    if (auth) {
      if (onboarded) {
        navigate('/app/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // For demo, accept any credentials
      const existingUser = localStorage.getItem('regulaai_user');
      if (existingUser) {
        login(JSON.parse(existingUser));
      } else {
        login({
          fullName: 'Demo User',
          email: formData.email,
          businessName: 'Demo Business',
        });
      }
      const onboarded = localStorage.getItem('regulaai_onboarding_complete');
      navigate(onboarded ? '/app/dashboard' : '/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark with particles */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-dark relative overflow-hidden">
        <canvas className="absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <Scale className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">RegulaAI</span>
          </Link>
          <div className="max-w-md text-center">
            <div className="glass rounded-card p-8">
              <div className="text-4xl mb-4">👩‍🍳</div>
              <blockquote className="text-lg italic mb-4">
                "Files GST in one tap now. No more last-minute rush!"
              </blockquote>
              <div className="text-text-tertiary">— Priya Sharma, Pune</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <Scale className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-text-primary">RegulaAI</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Welcome back</h1>
          <p className="text-text-secondary mb-8">Sign in to continue your compliance journey</p>

          <button className="w-full py-3 px-4 border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-surface transition mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.19 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-text-primary font-medium">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-tertiary">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.email ? 'border-accent-red' : 'border-border'}`}
              />
              {errors.email && <p className="text-accent-red text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition pr-12 ${errors.password ? 'border-accent-red' : 'border-border'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-accent-red text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-text-secondary mt-6">
            New here?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
