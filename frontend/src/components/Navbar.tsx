import React, { useState } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import {
  Pill, Camera, Search, MapPin, Calendar, PackageCheck,
  ShoppingCart, User as UserIcon, LogOut, Menu, X, Store, ChevronDown, Truck
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

export const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { coords, availableDemoPresets, setManualLocation, requestCurrentLocation } = useLocation();
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => routerLocation.pathname === path;

  const handleSwitchPhase = async (targetRole: 'user' | 'pharmacy' | 'delivery') => {
    try {
      if (targetRole === 'user') {
        if (!user || user.role !== 'user') {
          await login('user@mediaccess.com', 'Password123!');
        }
        navigate('/');
      } else if (targetRole === 'pharmacy') {
        if (!user || user.role !== 'pharmacy') {
          await login('apollo@mediaccess.com', 'Password123!');
        }
        navigate('/pharmacy-dashboard');
      } else if (targetRole === 'delivery') {
        if (!user || user.role !== 'delivery') {
          await login('delivery@mediaccess.com', 'Password123!');
        }
        navigate('/delivery-portal');
      }
    } catch (err) {
      console.error('Error switching phase:', err);
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* 3-Phase Interactive Ecosystem Switcher */}
      <div className="bg-navy-900 text-white text-xs py-1.5 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
              3-PHASE NETWORK
            </span>
            <span className="text-slate-300 hidden md:inline">
              Switch role to experience connected live order handovers:
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-navy-950 p-1 rounded-xl border border-navy-800">
            <button
              onClick={() => handleSwitchPhase('user')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                user?.role === 'user' || !user
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-3 h-3" />
              <span>Phase 1: Patient</span>
            </button>

            <button
              onClick={() => handleSwitchPhase('pharmacy')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                user?.role === 'pharmacy'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3 h-3" />
              <span>Phase 2: Pharmacy</span>
            </button>

            <button
              onClick={() => handleSwitchPhase('delivery')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                user?.role === 'delivery'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>Phase 3: Delivery</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition">
              <Pill className="w-6 h-6 transform -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-800">
                Medi<span className="text-teal-600">Access</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Healthcare Accessibility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/scan"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                isActive('/scan')
                  ? 'text-white bg-teal-600 shadow-sm'
                  : 'text-teal-700 bg-teal-50/80 hover:bg-teal-100/70'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Scan Medicine</span>
            </Link>
            <Link
              to="/search"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                isActive('/search') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            <Link
              to="/pharmacies"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                isActive('/pharmacies') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Nearby Pharmacies</span>
            </Link>
            {user && (
              <>
                {user.role === 'delivery' && (
                  <Link
                    to="/delivery-portal"
                    className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition ${
                      isActive('/delivery-portal')
                        ? 'text-white bg-emerald-600 shadow-sm'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Delivery Portal</span>
                  </Link>
                )}
                {user.role === 'pharmacy' && (
                  <Link
                    to="/pharmacy-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition ${
                      isActive('/pharmacy-dashboard')
                        ? 'text-white bg-teal-600 shadow-sm'
                        : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Pharmacy Dashboard</span>
                  </Link>
                )}
                <Link
                  to="/reservations"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                    isActive('/reservations') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Reservations</span>
                </Link>
                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                    isActive('/orders') ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Orders</span>
                </Link>
              </>
            )}

          </nav>

          {/* Right utility actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location selector dropdown */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition max-w-[170px]"
                title="Current simulated location for distance calculation"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span className="truncate">{coords?.label.split(',')[0] || 'Set Location'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-navy-800">Your Location</span>
                    <button
                      onClick={() => {
                        requestCurrentLocation();
                        setLocationDropdownOpen(false);
                      }}
                      className="text-[11px] text-teal-600 hover:underline font-medium"
                    >
                      Use GPS
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Select Location Area:</p>
                    {availableDemoPresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setManualLocation(preset.lat, preset.lng, preset.label);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition flex items-center justify-between ${
                          coords?.label === preset.label
                            ? 'bg-teal-50 text-teal-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-600 hover:text-navy-800 hover:bg-slate-100 transition"
              title="View Cart & Reserve"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-teal-400 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-navy-800 max-w-[100px] truncate">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy-800 truncate">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-100 text-slate-600">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'delivery' && (
                      <Link
                        to="/delivery-portal"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Delivery Portal</span>
                      </Link>
                    )}

                    {user.role === 'pharmacy' && (
                      <Link
                        to="/pharmacy-dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        <Store className="w-4 h-4" />
                        <span>Pharmacy Dashboard</span>
                      </Link>
                    )}


                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>User Profile</span>
                    </Link>

                    <Link
                      to="/reservations"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>My Reservations</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <PackageCheck className="w-4 h-4 text-slate-400" />
                      <span>My Orders</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-navy-800 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-navy-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/scan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50"
          >
            Scan Medicine Strip
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Search Medicine
          </Link>
          <Link
            to="/pharmacies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Nearby Pharmacies
          </Link>
          {user ? (
            <>
              {user.role === 'pharmacy' && (
                <Link
                  to="/pharmacy-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50"
                >
                  Pharmacy Dashboard
                </Link>
              )}
              <Link
                to="/reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Reservations
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-teal-600 rounded-lg"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
