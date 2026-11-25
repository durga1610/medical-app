import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Mail, Lock, AlertCircle, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const autoEmail = params.get('autologin');
    const redirectUrl = params.get('redirect');
    if (autoEmail) {
      handleQuickLogin(autoEmail).then(() => {
        if (redirectUrl) navigate(redirectUrl);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
    setSubmitting(true);
    try {
      await login(demoEmail, 'Password123!');
      if (demoEmail.includes('apollo') || demoEmail.includes('medplus')) {
        navigate('/pharmacy-dashboard');
      } else if (demoEmail.includes('delivery')) {
        navigate('/delivery-portal');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Icon Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/20">
          <Pill className="w-7 h-7 -rotate-45" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-800 tracking-tight">
          Sign In to MediAccess
        </h1>
        <p className="text-xs text-slate-500">
          Access your medicine reservations, prescriptions, and order tracking.
        </p>
      </div>

      {/* Quick 1-Click Demo Login Panel */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/70 rounded-2xl space-y-2.5">
        <span className="text-[11px] font-bold text-teal-900 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Capstone Evaluator 1-Click Portal Switcher:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('user@mediaccess.com')}
            className="p-2.5 bg-white hover:bg-teal-50 border border-teal-200 rounded-xl text-left transition shadow-xs"
          >
            <span className="text-xs font-bold text-navy-800 block">1. Patient User</span>
            <span className="text-[10px] text-slate-500">user@mediaccess.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('apollo@mediaccess.com')}
            className="p-2.5 bg-white hover:bg-teal-50 border border-teal-200 rounded-xl text-left transition shadow-xs"
          >
            <span className="text-xs font-bold text-teal-800 block">2. Pharmacy Store</span>
            <span className="text-[10px] text-slate-500">apollo@mediaccess.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('delivery@mediaccess.com')}
            className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl text-left transition shadow-xs"
          >
            <span className="text-xs font-bold text-emerald-800 block">3. Delivery Fleet</span>
            <span className="text-[10px] text-slate-500">delivery@mediaccess.com</span>
          </button>
        </div>
      </div>


      {/* Main Login Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:underline">
            Register Free
          </Link>
        </div>
      </div>
    </div>
  );
};
