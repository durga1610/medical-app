import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-navy-800 text-slate-300 border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Pill className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Medi<span className="text-teal-400">Access</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering patients, seniors, and caregivers with intelligent medicine strip identification, real-time local pharmacy availability checking, instant reservations, and reliable doorstep delivery.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-teal-400" /> Free & Open Source
              </span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-teal-400" /> Senior Accessible
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scan" className="hover:text-teal-400 transition">
                  Scan Medicine Strip
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-teal-400 transition">
                  Medicine Catalog Search
                </Link>
              </li>
              <li>
                <Link to="/pharmacies" className="hover:text-teal-400 transition">
                  Nearby Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-teal-400 transition">
                  Cart & Reservation
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-teal-400 transition">
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency / Demo Disclaimer */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide">Medical Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              MediAccess provides availability information and digital OCR convenience. It is not a substitute for professional medical diagnosis or doctor prescriptions.
            </p>
            <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-700 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span className="text-[11px] text-slate-300">
                Medical Emergency? Call local helpline <strong>112 / 108</strong>.
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MediAccess Healthcare Ecosystem. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Integrated 3-Phase Network: Patient • Pharmacy • Delivery</p>
        </div>

      </div>
    </footer>
  );
};
