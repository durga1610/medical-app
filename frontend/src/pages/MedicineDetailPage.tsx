import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Pill, Building2, MapPin, Phone, Clock, Truck, ShieldCheck,
  CheckCircle2, XCircle, ArrowLeft, ShoppingCart, Info, AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { Medicine, Pharmacy } from '../types';

export const MedicineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { coords } = useLocation();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantityMap, setQuantityMap] = useState<Record<number, number>>({});
  const [addedSuccessMessage, setAddedSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMedicineDetail(
          Number(id),
          coords?.lat,
          coords?.lng
        );
        setMedicine(data.medicine);
        setPharmacies(data.available_pharmacies);

        // Initialize quantity map default 1 for each pharmacy
        const initialQty: Record<number, number> = {};
        data.available_pharmacies.forEach((p) => {
          initialQty[p.id] = 1;
        });
        setQuantityMap(initialQty);
      } catch (err: any) {
        setError(err.message || 'Failed to load medicine details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, coords]);

  const handleQuantityChange = (pharmacyId: number, delta: number, maxStock?: number) => {
    setQuantityMap((prev) => {
      const current = prev[pharmacyId] || 1;
      const next = current + delta;
      if (next < 1) return prev;
      if (maxStock && next > maxStock) return prev;
      return { ...prev, [pharmacyId]: next };
    });
  };

  const handleAddToCart = (pharmacy: Pharmacy) => {
    if (!medicine || !pharmacy.medicine_price) return;
    const qty = quantityMap[pharmacy.id] || 1;
    addToCart(medicine, pharmacy, pharmacy.medicine_price, qty);
    setAddedSuccessMessage(`Added ${qty}x ${medicine.name} from "${pharmacy.name}" to cart!`);
    setTimeout(() => setAddedSuccessMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Checking pharmacy availability & stock...</p>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          {error || 'Medicine details not found.'}
        </div>
        <Link to="/search" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medicine Search</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to results</span>
      </button>

      {/* Success Notification Banner */}
      {addedSuccessMessage && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-800 font-semibold shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
            <span>{addedSuccessMessage}</span>
          </div>
          <Link to="/cart" className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold">
            Go to Cart & Reserve
          </Link>
        </div>
      )}

      {/* Medicine Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                {medicine.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {medicine.strength}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                {medicine.dosage_form}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
              {medicine.name}
            </h1>

            <p className="text-base text-teal-700 font-semibold">
              Generic Compound: {medicine.generic_name}
            </p>

            <p className="text-xs text-slate-400">
              Manufactured by: <strong className="text-slate-600">{medicine.manufacturer}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 max-w-sm text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-navy-800">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Patient Usage Guide</span>
            </div>
            <p className="leading-relaxed">{medicine.usage_instructions || 'Take as advised by your physician.'}</p>
            {medicine.side_effects && (
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <strong>Possible side effects:</strong> {medicine.side_effects}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Clinical Overview
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            {medicine.description}
          </p>
        </div>
      </div>

      {/* Available Pharmacies Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>Available Nearby Pharmacies</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live stock availability and verified pricing across {pharmacies.length} local pharmacy partners.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            Simulated Reference Location: {coords?.label.split(',')[0]}
          </span>
        </div>

        {pharmacies.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <p className="text-sm font-bold text-navy-800">No Pharmacy Has This Medicine Currently</p>
            <p className="text-xs text-slate-500">Please check back later or check alternative generic equivalents.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacies.map((pharm) => {
              const isAvailable = !!pharm.medicine_available && (pharm.medicine_stock || 0) > 0;
              const qty = quantityMap[pharm.id] || 1;

              return (
                <div
                  key={pharm.id}
                  className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between ${
                    isAvailable
                      ? 'border-slate-200 hover:border-teal-400 shadow-sm'
                      : 'border-slate-100 bg-slate-50/50 opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-navy-800 text-base">{pharm.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{pharm.address}</span>
                        </p>
                      </div>

                      {pharm.distance_km !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 flex-shrink-0">
                          {pharm.distance_km} km
                        </span>
                      )}
                    </div>

                    {/* Price and Stock status */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                          Store Price
                        </span>
                        <span className="text-lg font-extrabold text-navy-800">
                          ₹{pharm.medicine_price?.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-right">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-softgreen-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>In Stock ({pharm.medicine_stock} units)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery & Hours Info */}
                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pharm.opening_hours}</span>
                        </span>
                        <span>⭐ {pharm.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-teal-600" />
                          <span>
                            {pharm.home_delivery_available
                              ? `Home Delivery (₹${pharm.delivery_fee})`
                              : 'Counter Pickup Only'}
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-400">{pharm.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Reserve action */}
                  <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                    {isAvailable ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-600">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(pharm.id, -1, pharm.medicine_stock)}
                              disabled={qty <= 1}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 transition text-sm"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-navy-800">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(pharm.id, 1, pharm.medicine_stock)}
                              disabled={pharm.medicine_stock !== undefined && qty >= pharm.medicine_stock}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-40 transition text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(pharm)}
                          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-teal-600/20 flex items-center justify-center gap-2 transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Select Store & Reserve</span>
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 bg-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed text-center"
                      >
                        Currently Unavailable
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
