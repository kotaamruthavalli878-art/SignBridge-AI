import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Sparkles, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { authApi } from '../services/api';

const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials or server unavailable.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    // Fill demo credentials
    const demoEmail = 'evaluator@signbridge.org';
    const demoPassword = 'Password123!';
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      // First try login, if not registered register then login
      try {
        await login(demoEmail, demoPassword);
        navigate(from, { replace: true });
      } catch (loginErr) {
        await authApi.register({
          name: 'Accessibility Evaluator',
          email: demoEmail,
          password: demoPassword,
          preferredLanguage: 'en',
          accessibilityPreferences: { fontSize: 'normal', highContrast: false }
        });
        await login(demoEmail, demoPassword);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Could not initialize demo login. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 mb-4">
            <LogIn className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
            Sign In to SignBridge AI
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Access your saved accessibility settings and custom communication cards.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option for evaluators & judges */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>1-Click Hackathon Evaluator Login</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Instantly signs in with a verified evaluator profile
            </p>
          </div>

        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-4">
            Sign up here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
