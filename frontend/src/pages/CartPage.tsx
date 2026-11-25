import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Building2, MapPin, Phone, Truck,
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Clock, Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Reservation } from '../types';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedPharmacy,
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee
  } = useCart();

  // Delivery type: COLLECTION or DELIVERY
  const [deliveryType, setDeliveryType] = useState<'COLLECTION' | 'DELIVERY'>('COLLECTION');
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const finalTotal = deliveryType === 'DELIVERY'
    ? Math.round((subtotal + (selectedPharmacy?.delivery_fee || 0)) * 100) / 100
    : subtotal;

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedPharmacy) {
      setFormError('No pharmacy selected.');
      return;
    }

    if (items.length === 0) {
      setFormError('Cart is empty. Please add medicines first.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Please enter your full customer name.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setFormError('Please enter a valid phone number for order SMS/call verification.');
      return;
    }

    if (deliveryType === 'DELIVERY' && !deliveryAddress.trim()) {
      setFormError('Please enter your complete delivery address for home dispatch.');
      return;
    }

    setSubmitting(true);
    try {
      const reservationPayload = {
        pharmacy_id: selectedPharmacy.id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'DELIVERY' ? deliveryAddress.trim() : undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          medicine_id: i.medicine.id,
          quantity: i.quantity,
        })),
      };

      const res = await api.createReservation(reservationPayload);
      setConfirmedReservation(res);
      clearCart();
    } catch (err: any) {
      setFormError(err.message || 'Failed to place reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully submitted, display confirmation screen
  if (confirmedReservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-softgreen-100 text-softgreen-600 flex items-center justify-center mx-auto shadow-md">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Reservation Confirmed!
          </span>
          <h1 className="text-3xl font-extrabold text-navy-800">
            Thank You, {confirmedReservation.customer_name}!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your reservation request has been submitted to <strong>{confirmedReservation.pharmacy_name}</strong>.
          </p>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Reservation ID
              </p>
              <p className="text-base font-extrabold text-teal-700 font-mono">
                {confirmedReservation.reservation_code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Order Status
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {confirmedReservation.status}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>
              <strong>Fulfillment Mode:</strong>{' '}
              {confirmedReservation.delivery_type === 'COLLECTION'
                ? 'Counter Pickup at Pharmacy'
                : 'Home Doorstep Delivery'}
            </p>
            <p>
              <strong>Selected Store:</strong> {confirmedReservation.pharmacy_name} (
              {confirmedReservation.pharmacy_address})
            </p>
            <p>
              <strong>Contact Phone:</strong> {confirmedReservation.pharmacy_phone}
            </p>
            {confirmedReservation.delivery_address && (
              <p>
                <strong>Delivery Address:</strong> {confirmedReservation.delivery_address}
              </p>
            )}
            <p className="text-base font-extrabold text-navy-800 pt-2 border-t border-slate-100">
              Total Amount Payable at Pickup/Delivery: ₹{confirmedReservation.total_amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/reservations"
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            View in My Reservations
          </Link>
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 bg-navy-800 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Track Order Status
          </Link>
          <Link
            to="/search"
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
          Cart & Medicine Reservation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your selected medicines, choose counter pickup or home delivery, and finalize your reservation.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-navy-800">Your Cart is Currently Empty</h2>
          <p className="text-xs text-slate-500">
            Scan a medicine strip or browse the medicine catalog to find nearby pharmacy stock.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/scan"
              className="px-4 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition"
            >
              Scan Medicine Strip
            </Link>
            <Link
              to="/search"
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Search Medicines
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart items & selected pharmacy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selected Pharmacy banner */}
            {selectedPharmacy && (
              <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-xs flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-800 text-sm">{selectedPharmacy.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>{selectedPharmacy.address}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Phone: {selectedPharmacy.phone} • Hours: {selectedPharmacy.opening_hours}
                    </p>
                  </div>
                </div>

                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>
            )}

            {/* Items list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              <div className="p-4 bg-slate-50 text-xs font-bold text-navy-800 uppercase tracking-wider">
                Selected Items ({items.length})
              </div>

              {items.map((item) => (
                <div key={item.medicine.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-navy-800 text-sm">{item.medicine.name}</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-50 text-teal-700 rounded">
                        {item.medicine.strength}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{item.medicine.generic_name}</p>
                    <span className="text-xs font-bold text-navy-800 block mt-1">
                      ₹{item.unit_price.toFixed(2)} / unit
                    </span>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-navy-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right w-20">
                    <span className="text-sm font-extrabold text-navy-800 block">
                      ₹{(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.medicine.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Fulfillment selection & Reservation Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-navy-800 pb-3 border-b border-slate-100">
              Fulfillment & Reservation Form
            </h2>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Option A vs Option B */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-navy-800 uppercase tracking-wider block">
                Select Fulfillment Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('COLLECTION')}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                    deliveryType === 'COLLECTION'
                      ? 'border-teal-600 bg-teal-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span className="text-[10px] font-bold text-softgreen-600 uppercase">FREE</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-navy-800 block">Option A</span>
                    <span className="text-[11px] text-slate-500">Reserve & Collect</span>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!selectedPharmacy?.home_delivery_available}
                  onClick={() => setDeliveryType('DELIVERY')}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                    !selectedPharmacy?.home_delivery_available
                      ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                      : deliveryType === 'DELIVERY'
                      ? 'border-teal-600 bg-teal-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span className="text-[10px] font-bold text-slate-500">
                      ₹{selectedPharmacy?.delivery_fee} Fee
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-bold text-navy-800 block">Option B</span>
                    <span className="text-[11px] text-slate-500">Home Delivery</span>
                  </div>
                </button>
              </div>

              {!selectedPharmacy?.home_delivery_available && (
                <p className="text-[11px] text-amber-600 italic">
                  Note: {selectedPharmacy?.name} currently supports Counter Pickup only.
                </p>
              )}
            </div>

            {/* Customer Inputs Form */}
            <form onSubmit={handleSubmitReservation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
                />
              </div>

              {deliveryType === 'DELIVERY' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Doorstep Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Apartment, Street, Landmark, Pin Code..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Special Notes for Pharmacist (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Will collect at 6 PM, please keep blister strip intact"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 outline-none"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Medicine Subtotal:</span>
                  <span className="font-semibold text-navy-800">₹{subtotal.toFixed(2)}</span>
                </div>
                {deliveryType === 'DELIVERY' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Doorstep Courier Fee:</span>
                    <span className="font-semibold text-navy-800">
                      ₹{selectedPharmacy?.delivery_fee.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-navy-800">
                  <span>Total Payable:</span>
                  <span className="text-teal-700">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Confirm Reservation CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Saving Reservation to Database...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirm & Place Reservation</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                No advance online card payment required. Pay safely at the pharmacy counter or upon cash on delivery.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
