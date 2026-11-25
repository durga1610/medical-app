import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PackageCheck, Truck, CheckCircle2, Clock, Search,
  Building2, MapPin, AlertCircle, RefreshCw, XCircle, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

const ORDER_STEPS = [
  { key: 'Order Placed', label: 'Order Placed', desc: 'Received by pharmacy system' },
  { key: 'Pharmacy Confirmed', label: 'Confirmed', desc: 'Pharmacy verified prescription' },
  { key: 'Ready for Delivery', label: 'Packed & Ready', desc: 'Prescription sealed for courier' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier en route to your address' },
  { key: 'Delivered', label: 'Delivered', desc: 'Package handed over successfully' }
];


export const MyOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const trackQuery = searchParams.get('track') || '';

  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchCode, setSearchCode] = useState(trackQuery);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.getUserOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (trackQuery) {
      handleSearchOrder(trackQuery);
    }
  }, [trackQuery]);

  const handleSearchOrder = async (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;
    setSearchError(null);
    setLoading(true);
    try {
      const order = await api.trackOrderByCode(cleanCode);
      setTrackedOrder(order);
    } catch (err: any) {
      setSearchError(err.message || `No active order found with tracking code "${cleanCode}".`);
      setTrackedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Pharmacy Confirmed':
        return 1;
      case 'Preparing':
      case 'Ready for Delivery':
        return 2;
      case 'Picked up from Pharmacy':
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };


  const renderVisualProgress = (order: Order) => {
    const isCancelled = order.status === 'Cancelled';
    const currentStep = getStepIndex(order.status);

    if (isCancelled) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">This Order Was Cancelled</p>
            <p>{order.tracking_notes || 'The order has been cancelled and medicines restored to pharmacy stock.'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="py-4">
        {/* Progress Bar Container */}
        <div className="relative">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          {/* Active Filled Line */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-teal-600 -translate-y-1/2 transition-all duration-500 z-0"
            style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
          />

          {/* Steps */}
          <div className="relative flex justify-between z-10">
            {ORDER_STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isPast
                        ? 'bg-teal-600 text-white'
                        : isCurrent
                        ? 'bg-navy-800 text-white ring-4 ring-teal-100 scale-110'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <span
                    className={`text-[11px] font-bold mt-2 text-center max-w-[80px] hidden sm:block ${
                      isCurrent ? 'text-navy-800' : isPast ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current status note */}
        <div className="mt-6 p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-teal-900">Current Phase: {order.status}</span>
            <p className="text-teal-800 mt-0.5">
              {order.tracking_notes || ORDER_STEPS[currentStep]?.desc}
            </p>
          </div>
        </div>

        {/* Live Delivery Driver Assignment Card */}
        {order.delivery_partner_name && (
          <div className="mt-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                  Assigned Delivery Rider
                </span>
                <span className="font-extrabold text-navy-800 text-sm">
                  {order.delivery_partner_name}
                </span>
                <span className="text-slate-500 block text-[11px]">
                  Contact: {order.delivery_partner_phone || 'Courier Logistics'}
                </span>
              </div>
            </div>

            {order.delivery_partner_phone && (
              <a
                href={`tel:${order.delivery_partner_phone}`}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1 self-start sm:self-auto text-xs shadow-xs"
              >
                <span>Call Rider</span>
              </a>
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
          Order Tracking & Live Status
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your prescription prep, pharmacy verification, and real-time order progression.
        </p>
      </div>

      {/* Quick Lookup Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-navy-800">Track Any Order or Reservation Code</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchOrder(searchCode);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Order Code (e.g. ORD-B4F29A) or Reservation Code..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Track Order</span>
          </button>
        </form>

        {searchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Display Tracked Order (from search or param) */}
      {trackedOrder && (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-500 shadow-md space-y-6 animate-scale-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                Tracked Order
              </span>
              <span className="text-xl font-extrabold text-navy-800 font-mono">
                {trackedOrder.order_code}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Placed on {new Date(trackedOrder.created_at).toLocaleString()}
              </span>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-800 text-white">
              {trackedOrder.status}
            </span>
          </div>

          {/* Visual Step Tracker */}
          {renderVisualProgress(trackedOrder)}

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-navy-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>{trackedOrder.pharmacy_name}</span>
              </span>
              <p>Mode: {trackedOrder.delivery_type === 'COLLECTION' ? 'Counter Pickup' : 'Home Delivery'}</p>
              {trackedOrder.delivery_address && <p>Address: {trackedOrder.delivery_address}</p>}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <span className="font-bold text-navy-800">Items Ordered:</span>
              {trackedOrder.items.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>
                    {i.quantity}x {i.medicine_name} ({i.strength})
                  </span>
                  <span className="font-semibold">₹{i.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 font-bold text-navy-800 flex justify-between">
                <span>Total Amount:</span>
                <span>₹{trackedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User's Order History */}
      {user && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-teal-600" />
            <span>My Order History</span>
          </h2>

          {loading && !trackedOrder ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
              No orders placed under this account yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-xs font-bold text-navy-800 font-mono">
                        {ord.order_code}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        {ord.pharmacy_name} • {new Date(ord.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                        {ord.status}
                      </span>
                      <button
                        onClick={() => setTrackedOrder(ord)}
                        className="text-xs font-bold text-teal-600 hover:underline"
                      >
                        Inspect Progress
                      </button>
                    </div>
                  </div>

                  {renderVisualProgress(ord)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
