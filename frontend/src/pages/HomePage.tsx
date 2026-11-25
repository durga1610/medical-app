import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera, Search, MapPin, ShieldCheck, Truck, Clock,
  ArrowRight, CheckCircle2, Pill, Sparkles, Building2
} from 'lucide-react';
import { api } from '../services/api';
import { Medicine } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [popularMedicines, setPopularMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    // Load sample popular medicines for display
    api.searchMedicines({ limit: 6 }).then((meds) => setPopularMedicines(meds)).catch(console.error);
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length >= 2) {
      try {
        const results = await api.getSuggestions(val);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-transparent pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-teal-200 text-teal-800 shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Smart Healthcare Accessibility Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-800 tracking-tight leading-tight">
              Your Medicine, <br className="hidden sm:inline" />
              <span className="text-teal-600">Just a Tap Away!</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Identify medicines, find nearby pharmacies, check availability, reserve medicines and get them delivered to your doorstep.
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/scan"
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 flex items-center gap-2 transition"
              >
                <Camera className="w-5 h-5" />
                <span>Scan Medicine Strip</span>
              </Link>
              <Link
                to="/search"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-navy-800 font-bold text-sm border border-slate-200 shadow-sm flex items-center gap-2 transition"
              >
                <Search className="w-5 h-5 text-teal-600" />
                <span>Search Catalog</span>
              </Link>
              <Link
                to="/pharmacies"
                className="px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm shadow-md flex items-center gap-2 transition"
              >
                <MapPin className="w-5 h-5 text-teal-400" />
                <span>Find Nearby Stores</span>
              </Link>
            </div>

            {/* Search Bar with autocomplete suggestions */}
            <div className="relative max-w-2xl mx-auto pt-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by brand name or generic compound (e.g., Dolo, Paracetamol, Cetirizine)..."
                  className="w-full pl-12 pr-28 py-4 rounded-2xl border-2 border-teal-600/30 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 shadow-lg text-sm transition outline-none bg-white"
                />
                <Search className="w-5 h-5 text-teal-600 absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Search
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 divide-y divide-slate-100 z-30 text-left overflow-hidden">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/medicines/${item.id}`)}
                      className="p-3.5 hover:bg-teal-50/50 cursor-pointer flex items-center justify-between transition"
                    >
                      <div>
                        <p className="text-sm font-bold text-navy-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.generic_name} • {item.strength}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800 tracking-tight">
            Comprehensive Accessibility Features
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built to bridge the gap between patients, verified medicine stocks, and neighborhood chemists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">1. Smart Strip Scanning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capture or upload the back foil of any blister strip. Tesseract OCR extracts active compounds, dosage, and matches against local records.
            </p>
            <Link to="/scan" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-4 hover:gap-1.5 transition">
              <span>Try OCR Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">2. Nearby Availability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time stock indicators across local pharmacies with exact inventory quantities, prices, and calculated distance from your location.
            </p>
            <Link to="/pharmacies" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-4 hover:gap-1.5 transition">
              <span>View Pharmacies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">3. Easy Reservation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never visit an empty counter. Reserve items in advance so the chemist holds the stock for you before you arrive for pickup.
            </p>
            <Link to="/search" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-4 hover:gap-1.5 transition">
              <span>Reserve Medicines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-800 mb-2">4. Doorstep Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select supported neighborhood pharmacies offering fast local courier and bike delivery directly to your door.
            </p>
            <Link to="/orders" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 mt-4 hover:gap-1.5 transition">
              <span>Order Tracking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50/80 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-800 tracking-tight mt-1">
              How MediAccess Works
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Five frictionless steps from medicine discovery to final collection or home delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-md shadow-teal-600/20">
                1
              </div>
              <h4 className="font-bold text-navy-800 text-sm">Scan or Search</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan your strip back foil or type medicine name in search.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-md shadow-teal-600/20">
                2
              </div>
              <h4 className="font-bold text-navy-800 text-sm">Identify Medicine</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verify brand, generic compound, and strength from the candidates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-md shadow-teal-600/20">
                3
              </div>
              <h4 className="font-bold text-navy-800 text-sm">Find Nearby Stores</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Compare pharmacy prices, distance in km, and real stock levels.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-md shadow-teal-600/20">
                4
              </div>
              <h4 className="font-bold text-navy-800 text-sm">Reserve Instantly</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add to cart and confirm your reservation with zero prepayment.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-sm mx-auto flex items-center justify-center shadow-md shadow-teal-600/20">
                5
              </div>
              <h4 className="font-bold text-navy-800 text-sm">Collect or Deliver</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pick up at counter or receive direct home delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medicine Catalog Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-800 tracking-tight">
              Essential Common Medicines
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sample verified medicine records available for instant availability checks.
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>View All (25+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularMedicines.map((med) => (
            <div
              key={med.id}
              onClick={() => navigate(`/medicines/${med.id}`)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Pill className="w-5 h-5 -rotate-45" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                    {med.strength}
                  </span>
                </div>
                <h3 className="font-bold text-navy-800 text-base mt-3 group-hover:text-teal-600 transition">
                  {med.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{med.generic_name}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {med.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{med.dosage_form} • {med.manufacturer}</span>
                <span className="font-bold text-teal-600 flex items-center gap-0.5">
                  <span>Check Stores</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
