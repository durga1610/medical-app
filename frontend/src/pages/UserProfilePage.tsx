import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Camera, Search, MapPin, Calendar, PackageCheck,
  Save, CheckCircle2, AlertCircle, Phone, ArrowRight, ShieldCheck, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Reservation, Order } from '../types';

export const UserProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setPhone(user.phone || '');
      setAddress(user.address || '');

      // Load user's recent reservations & orders
      api.getUserReservations()
        .then((data) => setRecentReservations(data.slice(0, 3)))
        .catch(console.error);

      api.getUserOrders()
        .then((data) => setRecentOrders(data.slice(0, 3)))
        .catch(console.error);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(`Error updating profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-800">Please Sign In</h2>
        <Link to="/login" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold inline-block">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Dashboard Card */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30 uppercase tracking-wider">
              USER DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.full_name}!
            </h1>
            <p className="text-xs text-teal-100 max-w-md">
              Manage your profile, track upcoming medicine pickups, and initiate quick strip scans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/scan"
              className="px-4 py-2.5 bg-white text-teal-800 rounded-xl text-xs font-bold hover:bg-teal-50 transition shadow-sm flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-teal-600" />
              <span>Scan Strip</span>
            </Link>
            <Link
              to="/search"
              className="px-4 py-2.5 bg-teal-600/40 border border-teal-400/40 text-white rounded-xl text-xs font-bold hover:bg-teal-600/60 transition flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Catalog</span>
            </Link>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-teal-600/50">
          <Link
            to="/scan"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition text-center"
          >
            <Camera className="w-5 h-5 mx-auto text-teal-200 mb-1" />
            <span className="text-xs font-bold block">Scan Medicine</span>
            <span className="text-[10px] text-teal-200">OCR Camera</span>
          </Link>

          <Link
            to="/search"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition text-center"
          >
            <Search className="w-5 h-5 mx-auto text-teal-200 mb-1" />
            <span className="text-xs font-bold block">Search Drugs</span>
            <span className="text-[10px] text-teal-200">25+ Samples</span>
          </Link>

          <Link
            to="/pharmacies"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition text-center"
          >
            <MapPin className="w-5 h-5 mx-auto text-teal-200 mb-1" />
            <span className="text-xs font-bold block">Nearby Stores</span>
            <span className="text-[10px] text-teal-200">Stock Check</span>
          </Link>

          <Link
            to="/orders"
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs transition text-center"
          >
            <PackageCheck className="w-5 h-5 mx-auto text-teal-200 mb-1" />
            <span className="text-xs font-bold block">Track Orders</span>
            <span className="text-[10px] text-teal-200">Live Status</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Information Form (Left) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-navy-800 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>Personal Information</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
              {user.role}
            </span>
          </div>

          {message && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs font-semibold text-teal-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Registered Email</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Delivery Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment, Street, Landmark..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </form>
        </div>

        {/* Recent Activity (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Reservations */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Recent Reservations</span>
              </h2>
              <Link to="/reservations" className="text-xs font-bold text-teal-600 hover:underline">
                View All
              </Link>
            </div>

            {recentReservations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No reservations made yet.</p>
            ) : (
              <div className="space-y-3">
                {recentReservations.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition text-xs"
                  >
                    <div>
                      <span className="font-bold text-navy-800 block font-mono">
                        {r.reservation_code}
                      </span>
                      <span className="text-slate-500">
                        {r.pharmacy_name} • {r.items.length} item(s)
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 block mb-0.5">
                        {r.status}
                      </span>
                      <span className="font-extrabold text-navy-800">
                        ₹{r.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-navy-800 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-teal-600" />
                <span>Recent Orders</span>
              </h2>
              <Link to="/orders" className="text-xs font-bold text-teal-600 hover:underline">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No orders tracked yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition text-xs"
                  >
                    <div>
                      <span className="font-bold text-navy-800 block font-mono">
                        {o.order_code}
                      </span>
                      <span className="text-slate-500">
                        {o.pharmacy_name} • {o.delivery_type}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 block mb-0.5">
                        {o.status}
                      </span>
                      <Link
                        to={`/orders?track=${o.order_code}`}
                        className="text-[11px] font-bold text-teal-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
