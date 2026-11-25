import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Pill, ArrowRight, RefreshCw, X } from 'lucide-react';
import { api } from '../services/api';
import { Medicine } from '../types';

export const SearchMedicinePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [categories, setCategories] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await api.searchMedicines({
          q: queryParam,
          category: categoryParam,
          limit: 100
        });
        setMedicines(results);
      } catch (err: any) {
        setError(err.message || 'Failed to search medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryParam, categoryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (searchTerm.trim()) params.q = searchTerm.trim();
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const handleCategorySelect = (cat: string) => {
    const newCat = selectedCategory === cat ? '' : cat;
    setSelectedCategory(newCat);
    const params: Record<string, string> = {};
    if (searchTerm.trim()) params.q = searchTerm.trim();
    if (newCat) params.category = newCat;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-navy-800 tracking-tight">
          Medicine Catalog Search
        </h1>
        <p className="text-sm text-slate-600">
          Search over 25+ essential medicines by trade name, generic chemical compound, or health category.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type medicine name or generic composition (e.g. Paracetamol, Dolo, Montair, Azithromycin)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 shadow-sm text-sm outline-none bg-white transition"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            !selectedCategory
              ? 'bg-navy-800 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Filter Indicators */}
      {(queryParam || categoryParam) && (
        <div className="flex items-center justify-between bg-teal-50/60 p-3 rounded-xl border border-teal-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-teal-800">Filtered by:</span>
            {queryParam && (
              <span className="px-2 py-0.5 rounded bg-white text-teal-700 border border-teal-200 font-medium">
                Keyword: "{queryParam}"
              </span>
            )}
            {categoryParam && (
              <span className="px-2 py-0.5 rounded bg-white text-teal-700 border border-teal-200 font-medium">
                Category: {categoryParam}
              </span>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* Results grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Searching medicine inventory...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 text-sm max-w-lg mx-auto">
          {error}
        </div>
      ) : medicines.length === 0 ? (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-navy-800">No Medicines Found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any medicine matching your criteria. Try searching for generic names such as "Paracetamol", "Cetirizine", or "Amoxicillin".
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <div
              key={med.id}
              onClick={() => navigate(`/medicines/${med.id}`)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                    {med.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                    {med.strength}
                  </span>
                </div>

                <h3 className="font-bold text-navy-800 text-lg mt-3 group-hover:text-teal-600 transition">
                  {med.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{med.generic_name}</p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {med.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {med.dosage_form} • {med.manufacturer}
                </span>
                <span className="font-bold text-teal-600 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  <span>View Stores</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
