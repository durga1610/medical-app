import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Mail, Lock, User, Phone, MapPin, AlertCircle, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Pharmacy } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'user' | 'pharmacy' | 'delivery'>('user');

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | ''>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If registering as a pharmacy manager, load available pharmacies to attach
    api.getPharmacies().then(setPharmacies).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (role === 'pharmacy' && !selectedPharmacyId) {
      setError('Please select the pharmacy you manage.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        confirm_password: confirmPassword,
        address: address.trim() || undefined,
        role,
        pharmacy_id: role === 'pharmacy' ? Number(selectedPharmacyId) : undefined
      });

      if (role === 'pharmacy') {
        navigate('/pharmacy-dashboard');
      } else if (role === 'delivery') {
        navigate('/delivery-portal');
      } else {
        navigate('/');
      }

    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/20">
          <Pill className="w-7 h-7 -rotate-45" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-800 tracking-tight">
          Create Your MediAccess Account
        </h1>
        <p className="text-xs text-slate-500">
          Join thousands of patients and neighborhood pharmacies for accessible healthcare.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="text-xs font-bold text-navy-800 uppercase tracking-wider block mb-1.5">
              Account Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center ${
                  role === 'user'
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                1. Patient
              </button>

              <button
                type="button"
                onClick={() => setRole('pharmacy')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center ${
                  role === 'pharmacy'
                    ? 'border-teal-600 bg-teal-50 text-teal-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                2. Pharmacy
              </button>

              <button
                type="button"
                onClick={() => setRole('delivery')}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center ${
                  role === 'delivery'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                3. Delivery
              </button>
            </div>

          </div>

          {/* Pharmacy Selection if pharmacy role */}
          {role === 'pharmacy' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Select Your Pharmacy *
              </label>
              <select
                required
                value={selectedPharmacyId}
                onChange={(e) => setSelectedPharmacyId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
              >
                <option value="">-- Choose registered pharmacy --</option>
                {pharmacies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.address})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Residential / Delivery Address (Optional)
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment, Street, Area..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-teal-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-1.5"
          >
            {submitting ? <span>Creating Account...</span> : <span>Complete Registration</span>}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
