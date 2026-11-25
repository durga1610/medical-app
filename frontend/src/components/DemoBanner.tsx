import React, { useState } from 'react';
import { Info, X, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { user, login } = useAuth();

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-800 via-navy-800 to-navy-900 text-white text-xs py-2 px-4 border-b border-teal-700/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-teal-500/30 text-teal-200 border border-teal-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
            DEMO DATA MODE
          </span>
          <span className="text-slate-300">
            Pharmacy stocks and distances are simulated for local capstone evaluation without requiring external paid APIs.
          </span>
        </div>

        {!user && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-teal-400" /> 1-Click Demo Portals:
            </span>
            <button
              onClick={() => login('user@mediaccess.com', 'Password123!')}
              className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-2 py-0.5 rounded transition text-[11px]"
            >
              Phase 1: Patient
            </button>
            <button
              onClick={() => login('apollo@mediaccess.com', 'Password123!')}
              className="bg-navy-700 hover:bg-navy-600 text-teal-200 border border-teal-500/30 font-medium px-2 py-0.5 rounded transition text-[11px]"
            >
              Phase 2: Pharmacy
            </button>
            <button
              onClick={() => login('delivery@mediaccess.com', 'Password123!')}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-2 py-0.5 rounded transition text-[11px]"
            >
              Phase 3: Delivery
            </button>
          </div>

        )}

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white transition ml-2"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
