import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Building2, MapPin, Phone, PackageCheck, AlertCircle,
  Clock, XCircle, CheckCircle2, ChevronRight, RefreshCw, ShoppingBag
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Reservation } from '../types';

export const MyReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUserReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      // If not logged in, prompt or redirect
      return;
    }
    fetchReservations();
  }, [user]);

  const handleCancelReservation = async (reservationId: number) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this reservation? The reserved medicine stock will be returned to the pharmacy inventory.'
    );
    if (!confirmCancel) return;

    setCancellingId(reservationId);
    try {
      const updated = await api.cancelReservation(reservationId);
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? updated : r)));
    } catch (err: any) {
      alert(`Error cancelling reservation: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ready for Collection':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Completed':
        return 'bg-softgreen-100 text-softgreen-600 border-green-200';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-800">Sign In to View Reservations</h2>
        <p className="text-xs text-slate-500">
          Please log in to your account to view and manage your medicine reservations.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
            My Reservations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your reserved medicines, collection readiness, and delivery status.
          </p>
        </div>

        <button
          onClick={fetchReservations}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Retrieving your reservations...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 text-sm">
          {error}
        </div>
      ) : reservations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-navy-800">No Reservations Yet</h2>
          <p className="text-xs text-slate-500">
            You have not reserved any medicines. Start by scanning a strip or searching nearby pharmacy stock.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/scan"
              className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
            >
              Scan Medicine Strip
            </Link>
            <Link
              to="/search"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
            >
              Search Medicines
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const canCancel = ['Pending', 'Confirmed'].includes(res.status);

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Reservation Reference
                    </span>
                    <span className="text-lg font-extrabold text-navy-800 font-mono">
                      {res.reservation_code}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Reserved on {new Date(res.created_at).toLocaleDateString()} at{' '}
                      {new Date(res.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                        res.status
                      )}`}
                    >
                      {res.status}
                    </span>

                    <Link
                      to={`/orders?track=${res.reservation_code}`}
                      className="px-3 py-1 bg-navy-800 hover:bg-navy-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                    >
                      <span>Track Status</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                  {/* Pharmacy details */}
                  <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-navy-800 flex items-center gap-1.5 text-sm">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>{res.pharmacy_name}</span>
                    </span>
                    <p className="text-slate-500">{res.pharmacy_address}</p>
                    <p className="text-slate-500">Phone: {res.pharmacy_phone}</p>
                    <p className="font-semibold text-teal-700 pt-1">
                      Mode: {res.delivery_type === 'COLLECTION' ? 'Counter Pickup' : 'Home Delivery'}
                    </p>
                    {res.delivery_address && (
                      <p className="text-slate-500">Address: {res.delivery_address}</p>
                    )}
                  </div>

                  {/* Items reserved */}
                  <div className="space-y-2">
                    <span className="font-bold text-navy-800 uppercase tracking-wider text-[11px] block">
                      Reserved Medicines ({res.items.length})
                    </span>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                      {res.items.map((item) => (
                        <div key={item.id} className="p-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-navy-800 block">{item.medicine_name}</span>
                            <span className="text-[11px] text-slate-400">
                              {item.strength} • Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="font-bold text-navy-800">
                            ₹{item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer total and cancellation */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Total Payable:</span>
                    <span className="text-base font-extrabold text-navy-800">
                      ₹{res.total_amount.toFixed(2)}
                    </span>
                  </div>

                  {canCancel && (
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      disabled={cancellingId === res.id}
                      className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition flex items-center gap-1 self-start sm:self-auto"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{cancellingId === res.id ? 'Cancelling...' : 'Cancel Reservation'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
