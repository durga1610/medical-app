import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Phone, Clock, Truck, Star, Filter,
  ArrowRight, Search, CheckCircle2, XCircle, ShoppingBag, X
} from 'lucide-react';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { Pharmacy, PharmacyInventoryItem } from '../types';

export const NearbyPharmaciesPage: React.FC = () => {
  const navigate = useNavigate();
  const { coords, requestCurrentLocation } = useLocation();

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDeliveryOnly, setFilterDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState('nearest');
  const [selectedPharmacyForModal, setSelectedPharmacyForModal] = useState<Pharmacy | null>(null);
  const [pharmacyInventory, setPharmacyInventory] = useState<PharmacyInventoryItem[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        const data = await api.getPharmacies({
          lat: coords?.lat,
          lng: coords?.lng,
          delivery_only: filterDeliveryOnly,
          sort_by: sortBy
        });
        setPharmacies(data);
      } catch (err) {
        console.error('Failed to load pharmacies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [coords, filterDeliveryOnly, sortBy]);

  const handleOpenPharmacyCatalogue = async (pharmacy: Pharmacy) => {
    setSelectedPharmacyForModal(pharmacy);
    setInventoryLoading(true);
    try {
      const data = await api.getPharmacyDetail(pharmacy.id, coords?.lat, coords?.lng);
      setPharmacyInventory(data.inventory);
    } catch (err) {
      console.error('Failed to load pharmacy inventory:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
            Nearby Registered Pharmacies
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover local neighborhood dispensaries, check available inventory, and verify store operating hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={requestCurrentLocation}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Update GPS Location</span>
          </button>
        </div>
      </div>

      {/* Filter and sorting toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterDeliveryOnly}
              onChange={(e) => setFilterDeliveryOnly(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Home Delivery Available Only</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-navy-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="nearest">Distance (Nearest First)</option>
            <option value="rating">Rating (Highest Rated)</option>
          </select>
        </div>
      </div>

      {/* Pharmacy Cards Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Locating partner pharmacies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharm) => (
            <div
              key={pharm.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-navy-800 text-base">{pharm.name}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{pharm.rating}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>{pharm.address}, {pharm.city}</span>
                    </p>
                  </div>
                </div>

                {pharm.distance_km !== undefined && (
                  <div className="px-3 py-1.5 rounded-xl bg-teal-50/70 border border-teal-100/70 flex items-center justify-between text-xs">
                    <span className="text-teal-900 font-medium">Distance from your reference:</span>
                    <span className="font-bold text-teal-700 font-mono">{pharm.distance_km} km</span>
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{pharm.opening_hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{pharm.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-teal-600" />
                    <span>
                      {pharm.home_delivery_available
                        ? `Delivery available (₹${pharm.delivery_fee} fee)`
                        : 'Store pickup only'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenPharmacyCatalogue(pharm)}
                  className="w-full py-2.5 bg-navy-800 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-teal-400" />
                  <span>View Store Inventory & Stock</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Pharmacy Inventory Catalogue */}
      {selectedPharmacyForModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-navy-800">
                  {selectedPharmacyForModal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedPharmacyForModal.address} • Phone: {selectedPharmacyForModal.phone}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    {selectedPharmacyForModal.opening_hours}
                  </span>
                  {selectedPharmacyForModal.home_delivery_available && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Home Delivery Supported
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedPharmacyForModal(null)}
                className="p-2 text-slate-400 hover:text-navy-800 rounded-full hover:bg-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inventory List Content */}
            <div className="p-6 overflow-y-auto divide-y divide-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                In-Stock Medicines Catalogue
              </h4>

              {inventoryLoading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Loading store catalogue...
                </div>
              ) : pharmacyInventory.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No inventory items listed for this pharmacy.
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  {pharmacyInventory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy-800 text-sm">
                            {item.medicine_name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                            {item.strength}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{item.generic_name}</p>
                        <span className="text-[10px] text-slate-400">
                          {item.dosage_form} • {item.category}
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div>
                          <span className="text-base font-extrabold text-navy-800 block">
                            ₹{item.price.toFixed(2)}
                          </span>
                          <span
                            className={`text-[11px] font-bold ${
                              item.is_available && item.stock_quantity > 0
                                ? 'text-softgreen-600'
                                : 'text-red-500'
                            }`}
                          >
                            {item.is_available && item.stock_quantity > 0
                              ? `Stock: ${item.stock_quantity}`
                              : 'Out of Stock'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedPharmacyForModal(null);
                            navigate(`/medicines/${item.medicine_id}`);
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedPharmacyForModal(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Catalogue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
