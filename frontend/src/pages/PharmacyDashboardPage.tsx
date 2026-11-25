import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store, Package, Calendar, CheckCircle2, XCircle, AlertCircle,
  Clock, Truck, Edit3, Save, Plus, RefreshCw, Phone, MapPin, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Pharmacy, PharmacyInventoryItem, Reservation, Order, Medicine
} from '../types';

export const PharmacyDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'inventory' | 'reservations' | 'orders' | 'profile'>('inventory');
  const [profile, setProfile] = useState<Pharmacy | null>(null);
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Inventory editing
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<boolean>(true);

  // Add new medicine to inventory
  const [selectedNewMedId, setSelectedNewMedId] = useState<number | ''>('');
  const [newPrice, setNewPrice] = useState<number>(50);
  const [newStock, setNewStock] = useState<number>(30);

  // Profile editing
  const [profilePhone, setProfilePhone] = useState('');
  const [profileHours, setProfileHours] = useState('');
  const [profileDelivery, setProfileDelivery] = useState(true);
  const [profileFee, setProfileFee] = useState(30);

  const showNotification = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profData, invData, resData, ordData, medsData] = await Promise.all([
        api.getPharmacyAdminProfile(),
        api.getPharmacyInventory(),
        api.getPharmacyAdminReservations(),
        api.getPharmacyAdminOrders(),
        api.searchMedicines({ limit: 100 })
      ]);
      setProfile(profData);
      setInventory(invData);
      setReservations(resData);
      setOrders(ordData);
      setAllMedicines(medsData);

      setProfilePhone(profData.phone);
      setProfileHours(profData.opening_hours);
      setProfileDelivery(profData.home_delivery_available);
      setProfileFee(profData.delivery_fee);
    } catch (err: any) {
      setError(err.message || 'Failed to load pharmacy dashboard data. Ensure you are signed in as a pharmacy manager.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'pharmacy') {
      return;
    }
    loadData();
  }, [user]);

  // Inventory actions
  const startEditing = (item: PharmacyInventoryItem) => {
    setEditingItemId(item.medicine_id);
    setEditPrice(item.price);
    setEditStock(item.stock_quantity);
    setEditAvailable(item.is_available);
  };

  const saveInventoryItem = async (medicineId: number) => {
    try {
      const updated = await api.updatePharmacyInventoryItem(medicineId, {
        price: editPrice,
        stock_quantity: editStock,
        is_available: editAvailable
      });
      setInventory((prev) => prev.map((i) => (i.medicine_id === medicineId ? updated : i)));
      setEditingItemId(null);
      showNotification(`Updated inventory record for "${updated.medicine_name}"!`);
    } catch (err: any) {
      alert(`Error updating item: ${err.message}`);
    }
  };

  const handleAddNewMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewMedId) return;
    try {
      const added = await api.updatePharmacyInventoryItem(Number(selectedNewMedId), {
        price: newPrice,
        stock_quantity: newStock,
        is_available: true
      });
      setInventory((prev) => {
        const filtered = prev.filter((i) => i.medicine_id !== added.medicine_id);
        return [...filtered, added].sort((a, b) => a.medicine_name.localeCompare(b.medicine_name));
      });
      setSelectedNewMedId('');
      showNotification(`Added "${added.medicine_name}" to your store inventory!`);
    } catch (err: any) {
      alert(`Failed to add medicine: ${err.message}`);
    }
  };

  // Reservation actions
  const handleUpdateReservation = async (reservationId: number, newStatus: string) => {
    try {
      const updated = await api.updateReservationStatus(reservationId, newStatus);
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? updated : r)));
      showNotification(`Reservation #${updated.reservation_code} updated to "${newStatus}"!`);
      // Reload inventory to reflect any stock restorations
      api.getPharmacyInventory().then(setInventory).catch(console.error);
    } catch (err: any) {
      alert(`Error updating reservation: ${err.message}`);
    }
  };

  // Order actions
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    const note = prompt(`Enter tracking status note for "${newStatus}" (optional):`) || undefined;
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, note);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showNotification(`Order #${updated.order_code} advanced to "${newStatus}"!`);
    } catch (err: any) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  // Profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updatePharmacyAdminProfile({
        phone: profilePhone,
        opening_hours: profileHours,
        home_delivery_available: profileDelivery,
        delivery_fee: profileFee
      });
      setProfile(updated);
      showNotification('Store profile settings saved successfully!');
    } catch (err: any) {
      alert(`Error saving profile: ${err.message}`);
    }
  };

  if (!user || user.role !== 'pharmacy') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-800">Pharmacy Portal Sign In Required</h2>
        <p className="text-xs text-slate-500">
          This dashboard is reserved for authorized pharmacy managers to manage stock and reservations.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
        >
          Sign In as Pharmacy Manager
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-navy-800 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              PHARMACY PORTAL
            </span>
            <span className="text-xs text-slate-400">ID #{profile?.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {profile?.name || 'Pharmacy Portal'}
          </h1>
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span>{profile?.address}, {profile?.city}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="px-4 py-2.5 rounded-2xl bg-navy-900 border border-navy-700 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Catalogue Items</span>
            <span className="text-lg font-extrabold text-teal-400">{inventory.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-navy-900 border border-navy-700 text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Incoming Res.</span>
            <span className="text-lg font-extrabold text-teal-400">{reservations.length}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-bold text-teal-800 flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto text-sm font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory & Pricing ({inventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'reservations'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Reservations ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Order Fulfillment ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-navy-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading store records...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Add Medicine to Inventory Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-navy-800 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-teal-600" />
                  <span>Add Medicine to Store Inventory</span>
                </h3>
                <form onSubmit={handleAddNewMedicine} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedNewMedId}
                      onChange={(e) => setSelectedNewMedId(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                      required
                    >
                      <option value="">-- Select Medicine from Master Catalog --</option>
                      {allMedicines.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.strength}) - {m.generic_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      placeholder="Price (₹)"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="Stock Units"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex-shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-navy-800 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Medicine Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Store Price (₹)</th>
                        <th className="p-4">Stock Units</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory.map((item) => {
                        const isEditing = editingItemId === item.medicine_id;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition">
                            <td className="p-4">
                              <span className="font-bold text-navy-800 block text-sm">
                                {item.medicine_name}
                              </span>
                              <span className="text-slate-500">
                                {item.generic_name} • {item.strength}
                              </span>
                            </td>

                            <td className="p-4 text-slate-600">{item.category}</td>

                            <td className="p-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.5"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-20 px-2 py-1 border border-teal-500 rounded font-bold"
                                />
                              ) : (
                                <span className="font-extrabold text-navy-800">
                                  ₹{item.price.toFixed(2)}
                                </span>
                              )}
                            </td>

                            <td className="p-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(Number(e.target.value))}
                                  className="w-20 px-2 py-1 border border-teal-500 rounded font-bold"
                                />
                              ) : (
                                <span
                                  className={`font-bold ${
                                    item.stock_quantity > 10
                                      ? 'text-softgreen-600'
                                      : item.stock_quantity > 0
                                      ? 'text-amber-600'
                                      : 'text-red-500'
                                  }`}
                                >
                                  {item.stock_quantity} units
                                </span>
                              )}
                            </td>

                            <td className="p-4">
                              {isEditing ? (
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editAvailable}
                                    onChange={(e) => setEditAvailable(e.target.checked)}
                                    className="rounded text-teal-600 focus:ring-teal-500"
                                  />
                                  <span>Available</span>
                                </label>
                              ) : (
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.is_available && item.stock_quantity > 0
                                      ? 'bg-softgreen-50 text-softgreen-600'
                                      : 'bg-red-50 text-red-600'
                                  }`}
                                >
                                  {item.is_available && item.stock_quantity > 0
                                    ? 'In Stock'
                                    : 'Unavailable'}
                                </span>
                              )}
                            </td>

                            <td className="p-4 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => saveInventoryItem(item.medicine_id)}
                                    className="p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                                    title="Save changes"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingItemId(null)}
                                    className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                                    title="Cancel"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditing(item)}
                                  className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-lg transition border border-teal-200 flex items-center gap-1 ml-auto"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INCOMING RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-navy-800">Customer Counter Reservations</h2>

              {reservations.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                  No incoming reservations for this pharmacy yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <span className="text-sm font-extrabold text-navy-800 font-mono">
                            {res.reservation_code}
                          </span>
                          <span className="text-xs text-slate-400 block">
                            Customer: <strong>{res.customer_name}</strong> • Phone:{' '}
                            <a href={`tel:${res.customer_phone}`} className="text-teal-600 underline">
                              {res.customer_phone}
                            </a>
                          </span>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {res.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p><strong>Mode:</strong> {res.delivery_type}</p>
                            {res.delivery_address && <p><strong>Address:</strong> {res.delivery_address}</p>}
                            {res.notes && <p><strong>Special Notes:</strong> {res.notes}</p>}
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl">
                            <strong>Reserved Items:</strong>
                            {res.items.map((i) => (
                              <div key={i.id} className="flex justify-between text-[11px] pt-1">
                                <span>{i.quantity}x {i.medicine_name}</span>
                                <span>₹{i.subtotal.toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-slate-200 mt-1 pt-1 font-bold flex justify-between">
                              <span>Total:</span>
                              <span>₹{res.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold text-slate-500 mr-2">Update Reservation:</span>
                        <button
                          onClick={() => handleUpdateReservation(res.id, 'Confirmed')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateReservation(res.id, 'Ready for Collection')}
                          className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-100 font-semibold"
                        >
                          Ready at Counter
                        </button>
                        <button
                          onClick={() => handleUpdateReservation(res.id, 'Completed')}
                          className="px-2.5 py-1 bg-softgreen-50 text-softgreen-600 border border-green-200 rounded-lg hover:bg-green-100 font-semibold"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateReservation(res.id, 'Rejected')}
                          className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER FULFILLMENT & TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-navy-800">Order Delivery Management</h2>

              {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-xs text-slate-500">
                  No orders recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                        <div>
                          <span className="font-bold text-navy-800 text-sm font-mono">{ord.order_code}</span>
                          <span className="text-slate-400 block">
                            Customer: {ord.customer_name} ({ord.customer_phone})
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-teal-50 text-teal-700">
                          Status: {ord.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-600">
                        <p><strong>Fulfillment Mode:</strong> {ord.delivery_type}</p>
                        {ord.delivery_address && <p><strong>Delivery Address:</strong> {ord.delivery_address}</p>}
                        {ord.tracking_notes && <p><strong>Tracking Notes:</strong> {ord.tracking_notes}</p>}
                        {ord.delivery_partner_name && (
                          <div className="p-2 bg-blue-50/80 border border-blue-200 rounded-lg text-blue-900 mt-2 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[11px] text-blue-700">Assigned Courier Partner (Phase 3):</span>
                              <p className="font-bold text-xs">{ord.delivery_partner_name} {ord.delivery_partner_phone ? `• ${ord.delivery_partner_phone}` : ''}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">Fleet Active</span>
                          </div>
                        )}
                      </div>

                      {/* Advance Order Status Workflow Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                        <span className="font-bold text-slate-500">Advance Phase:</span>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Pharmacy Confirmed')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                        >
                          1. Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Preparing')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                        >
                          2. Preparing
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Ready for Delivery')}
                          className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-medium"
                        >
                          3. Ready for Delivery
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Out for Delivery')}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium"
                        >
                          4. Hand to Courier
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Delivered')}
                          className="px-2.5 py-1 bg-softgreen-50 text-softgreen-600 hover:bg-green-100 rounded-lg font-medium"
                        >
                          5. Delivered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STORE SETTINGS & PROFILE */}
          {activeTab === 'profile' && profile && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-2xl space-y-4">
              <h3 className="text-sm font-bold text-navy-800">Pharmacy Store Configuration</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={profileHours}
                    onChange={(e) => setProfileHours(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="deliveryToggle"
                    checked={profileDelivery}
                    onChange={(e) => setProfileDelivery(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <label htmlFor="deliveryToggle" className="font-semibold text-slate-700 cursor-pointer">
                    Enable Doorstep Home Delivery for this Pharmacy
                  </label>
                </div>

                {profileDelivery && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Local Courier Delivery Fee (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={profileFee}
                      onChange={(e) => setProfileFee(Number(e.target.value))}
                      className="w-32 px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};
