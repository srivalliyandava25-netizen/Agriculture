import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, KeyRound, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { Alert } from '../components/common/Alert.jsx';

export const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await api.post('/auth/forgot-password', { identifier });
      setSuccessMsg(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-700 text-white shadow-md mb-2">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-xs text-slate-500">
            Enter your registered email address or phone number to receive a secure password reset token.
          </p>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        {successMsg && <Alert type="success" message={successMsg} />}

        {resetToken && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900">
            <p className="font-bold">Password Reset Token (Generated for Testing/Demo):</p>
            <code className="block p-2 bg-white rounded border border-amber-300 font-mono text-[11px] select-all break-all">
              {resetToken}
            </code>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="inline-flex items-center gap-1 font-bold text-primary-700 hover:underline pt-1"
            >
              <span>Proceed to Reset Password &rarr;</span>
            </Link>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="farmer@mittimitra.org or 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-primary-700 hover:bg-primary-800 shadow-md transition-all text-sm disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Generate Reset Token'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-primary-700 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

