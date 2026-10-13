import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const { t } = useAccessibility();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: 'en',
    fontSize: 'normal',
    highContrast: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        preferredLanguage: formData.preferredLanguage,
        accessibilityPreferences: {
          fontSize: formData.fontSize,
          highContrast: formData.highContrast,
        },
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.details || err.response?.data?.error || 'Registration failed. Please check your inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 mb-4">
            <UserPlus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
            Create SignBridge AI Account
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Set your personalized accessibility settings and communication shortcuts.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="priya@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 text-sm transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  Preferred Language
                </label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  Text Size Preset
                </label>
                <select
                  name="fontSize"
                  value={formData.fontSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-teal-400"
                >
                  <option value="normal">Normal (16px)</option>
                  <option value="large">Large (18px)</option>
                  <option value="xlarge">Extra Large (21px)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  name="highContrast"
                  checked={formData.highContrast}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-500 rounded border-slate-700 focus:ring-teal-400"
                />
                <span className="text-sm text-slate-300 font-medium">
                  Enable High Contrast Mode by default
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-4">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
