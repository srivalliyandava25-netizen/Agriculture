import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { LANGUAGE_OPTIONS, useLanguage } from '../context/LanguageContext.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-700 text-white shadow-md shadow-primary-700/20 mb-2">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Mitti Mitra
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your personalized soil reports, crop recommendations, and mandi analytics.
          </p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="login-language">
              Website Language
            </label>
            <select
              id="login-language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              aria-label="Choose website language"
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language.code} value={language.code} title={language.states}>
                  {language.native}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="farmer@mittimitra.org or 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary-700 hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md shadow-primary-700/20 transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign In to Farm Dashboard'}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-3">
              Demo Login Details
            </span>
            <div className="space-y-2 text-xs">
              <div className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-2.5">
                <strong className="text-primary-900">Farmer:</strong>{' '}
                <span className="text-slate-700">farmer@mittimitra.org / Farmer@123</span>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
                <strong className="text-blue-900">Agronomist:</strong>{' '}
                <span className="text-slate-700">expert@mittimitra.org / Expert@123</span>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
                <strong className="text-amber-900">Admin:</strong>{' '}
                <span className="text-slate-700">admin@mittimitra.org / Admin@123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-primary-700 hover:underline">
            Register your farm free
          </Link>
        </p>
      </div>
    </div>
  );
};

