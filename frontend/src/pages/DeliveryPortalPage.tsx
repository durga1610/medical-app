import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, PackageCheck, MapPin, Phone, Building2, Clock, CheckCircle2,
  AlertCircle, DollarSign, Star, RefreshCw, ChevronRight, Check, ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Order, DeliveryStats } from '../types';

export const DeliveryPortalPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [availableJobs, setAvailableJobs] = useState<Order[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<Order[]>([]);
  const [stats, setStats] = useState<DeliveryStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4500);
  };

  const loadDeliveryData = async () => {
    setLoading(true);
    try {
      const [jobsData, myData, statsData] = await Promise.all([
        api.getAvailableDeliveryJobs(),
        api.getMyDeliveries(),
        api.getDeliveryStats()
      ]);
      setAvailableJobs(jobsData);
      setMyDeliveries(myData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to load delivery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'delivery') {
      return;
    }
    loadDeliveryData();
  }, [user]);

  const handleAcceptJob = async (orderId: number) => {
    setAcceptingId(orderId);
    try {
      const accepted = await api.acceptDeliveryJob(orderId);
      showNotice(`Accepted order #${accepted.order_code}! Assigned to your delivery queue.`);
      await loadDeliveryData();
      setActiveTab('active');
    } catch (err: any) {
      alert(`Could not accept delivery: ${err.message}`);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleUpdateStatus = async (orderId: number, nextStatus: string) => {
    const note = prompt(`Enter delivery note for "${nextStatus}" (or leave blank for standard):`) || undefined;
    setUpdatingId(orderId);
    try {
      const updated = await api.updateDeliveryStatus(orderId, nextStatus, note);
      showNotice(`Order #${updated.order_code} updated to "${nextStatus}"!`);
      await loadDeliveryData();
    } catch (err: any) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user || user.role !== 'delivery') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-800">Delivery Partner Portal</h2>
        <p className="text-xs text-slate-500">
          This portal is reserved for registered delivery riders and couriers to manage order pickups and door handovers.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
        >
          Sign In as Delivery Partner
        </button>
      </div>
    );
  }

  const activeDeliveriesList = myDeliveries.filter((d) => d.status !== 'Delivered' && d.status !== 'Cancelled');
  const completedDeliveriesList = myDeliveries.filter((d) => d.status === 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Rider Header & Live Stats */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
              PHASE 3: DELIVERY FLEET
            </span>
            <span className="text-xs text-slate-300">Rider ID #{user.id}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user.full_name}
          </h1>

          <p className="text-xs text-slate-300 flex items-center gap-2">
            <span>Phone: {user.phone || '+91 98888 77777'}</span>
            <span>•</span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isOnline ? 'bg-softgreen-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {isOnline ? '● On Duty' : '○ Offline'}
            </button>
          </p>
        </div>

        {/* Live Earnings & Stats Badges */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-emerald-200 block font-bold uppercase">Active</span>
            <span className="text-xl font-extrabold">{stats?.active_deliveries || 0}</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-emerald-200 block font-bold uppercase">Completed</span>
            <span className="text-xl font-extrabold">{stats?.total_completed || 0}</span>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[10px] text-emerald-200 block font-bold uppercase">Earnings</span>
            <span className="text-xl font-extrabold text-emerald-300">₹{stats?.total_earnings || 0}</span>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-sm font-bold">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'available'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Available Jobs ({availableJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Active Pickups ({activeDeliveriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Delivered History ({completedDeliveriesList.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Checking delivery job network...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: AVAILABLE DELIVERY JOBS */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-navy-800">
                    Live Home Delivery Requests
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select open prescription orders ready for pickup from local pharmacies.
                  </p>
                </div>

                <button
                  onClick={loadDeliveryData}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Refresh Queue</span>
                </button>
              </div>

              {availableJobs.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-800">All Delivery Orders Assigned!</h3>
                  <p className="text-xs text-slate-500">
                    There are no open delivery requests at this moment. You can check back or place a new delivery order from the patient portal to see it appear here!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Order ID
                            </span>
                            <span className="text-base font-extrabold text-navy-800 font-mono">
                              {job.order_code}
                            </span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {job.status}
                          </span>
                        </div>

                        {/* Route Locations */}
                        <div className="space-y-2 text-xs">
                          {/* Store */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="font-bold text-navy-800 flex items-center gap-1.5 text-xs">
                              <Building2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>Pickup: {job.pharmacy_name}</span>
                            </span>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              {job.pharmacy_address || 'Central Pharmacy Store'}
                            </p>
                          </div>

                          {/* Customer */}
                          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                            <span className="font-bold text-navy-800 flex items-center gap-1.5 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Deliver To: {job.customer_name}</span>
                            </span>
                            <p className="text-slate-600 text-[11px] mt-0.5 font-medium">
                              {job.delivery_address}
                            </p>
                            <p className="text-slate-400 text-[10px] mt-0.5">
                              Customer Phone: {job.customer_phone}
                            </p>
                          </div>
                        </div>

                        {/* Items & Earnings */}
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-500 block">Package Contents:</span>
                            <span className="font-bold text-navy-800">{job.items.length} Medicine Item(s)</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block">Delivery Earning:</span>
                            <span className="font-extrabold text-emerald-600 text-sm">₹40.00</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        disabled={acceptingId === job.id}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {acceptingId === job.id ? (
                          <span>Accepting Job...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Accept Delivery Job & Start Route</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY ACTIVE DELIVERIES */}
          {activeTab === 'active' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-navy-800">
                My Active Assigned Deliveries
              </h2>

              {activeDeliveriesList.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-800">No Active Deliveries</h3>
                  <p className="text-xs text-slate-500">
                    You currently have no active deliveries in progress. Accept an available job above to get started!
                  </p>
                  <button
                    onClick={() => setActiveTab('available')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    View Open Jobs
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeDeliveriesList.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-sm space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                            Active Delivery Assignment
                          </span>
                          <span className="text-lg font-extrabold text-navy-800 font-mono">
                            {order.order_code}
                          </span>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-800 text-white">
                          Status: {order.status}
                        </span>
                      </div>

                      {/* Route & Contact Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                        {/* Store Pickup */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                          <span className="font-bold text-navy-800 flex items-center gap-1.5 text-sm">
                            <Building2 className="w-4 h-4 text-teal-600" />
                            <span>1. Store Pickup</span>
                          </span>
                          <p className="font-semibold text-slate-800">{order.pharmacy_name}</p>
                          <p className="text-slate-500">{order.pharmacy_address || 'Address provided at store'}</p>
                          <a
                            href={`tel:${order.pharmacy_phone}`}
                            className="inline-flex items-center gap-1 text-teal-700 hover:underline font-bold mt-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Pharmacy ({order.pharmacy_phone || 'Store Phone'})</span>
                          </a>
                        </div>

                        {/* Customer Dropoff */}
                        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                          <span className="font-bold text-navy-800 flex items-center gap-1.5 text-sm">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>2. Doorstep Delivery</span>
                          </span>
                          <p className="font-semibold text-slate-800">{order.customer_name}</p>
                          <p className="text-slate-700 font-medium">{order.delivery_address}</p>
                          <a
                            href={`tel:${order.customer_phone}`}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold mt-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Customer ({order.customer_phone})</span>
                          </a>
                        </div>
                      </div>

                      {/* Package Item Summary */}
                      <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-navy-800">Prescription Medicines in Package:</span>
                        {order.items.map((i) => (
                          <div key={i.id} className="flex justify-between text-slate-600">
                            <span>{i.quantity}x {i.medicine_name} ({i.strength})</span>
                            <span className="font-semibold">₹{i.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-200 pt-1 font-bold flex justify-between text-navy-800">
                          <span>Cash on Delivery to Collect:</span>
                          <span>₹{order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Advance Delivery Phase Workflow Buttons */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-xs font-bold text-navy-800 uppercase tracking-wider block">
                          Driver Workflow Actions:
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Picked up from Pharmacy')}
                            disabled={updatingId === order.id || order.status === 'Picked up from Pharmacy'}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>1. Confirm Store Pickup</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Out for Delivery')}
                            disabled={updatingId === order.id}
                            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-amber-200"
                          >
                            <span>2. En Route to Customer</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                            disabled={updatingId === order.id}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>3. Confirm Delivered & Handover</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DELIVERED HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-navy-800">Completed Deliveries</h2>

              {completedDeliveriesList.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                  No completed delivery records yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {completedDeliveriesList.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-navy-800 font-mono text-sm block">
                          {ord.order_code}
                        </span>
                        <span className="text-slate-500">
                          {ord.customer_name} • {ord.delivery_address}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Delivered on {new Date(ord.updated_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 block mb-1">
                          Delivered
                        </span>
                        <span className="font-extrabold text-emerald-600 text-sm">
                          +₹40.00
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
