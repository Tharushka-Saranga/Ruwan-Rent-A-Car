import React from 'react';
import {
  Car,
  Clock,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { PublicPage } from '../../types';
import { formatLKR } from '../../utils/currency';
import { OptimizedImage } from '../common/OptimizedImage';

interface OwnerDashboardPageProps {
  onNavigate: (page: PublicPage) => void;
}

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ onNavigate }) => {
  const { owners, vehicles } = useRental();
  const currentOwner = owners[1] || owners[0];

  const ownerVehicles = vehicles.filter(
    (v) =>
      v.ownerId === currentOwner.id ||
      v.ownerName?.includes('Partner') ||
      v.ownerName?.includes('Consignor')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-12 space-y-8 font-sans">
      {/* Header Profile Bar */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Host Consignor Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentOwner.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Registered Host ID: <span className="font-mono text-zinc-300">{currentOwner.id}</span> · Member since {currentOwner.joinedDate}
          </p>
        </div>

        <button
          onClick={() => onNavigate('list-your-car')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Consign Another Vehicle</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400">Total Lifetime Payouts</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
            {formatLKR(currentOwner.totalEarnings, { showCode: true })}
          </div>
          <span className="text-[10px] text-zinc-500">Net direct deposits received</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400">This Month's Projected Payout</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
            {formatLKR(currentOwner.monthlyRevenue, { showCode: true })}
          </div>
          <span className="text-[10px] text-emerald-400">80% owner revenue share</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400">Active Consigned Vehicles</span>
          <div className="text-3xl font-black font-mono text-purple-400 tabular-nums">
            {ownerVehicles.length}
          </div>
          <span className="text-[10px] text-zinc-500">Under commercial custody</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <span className="text-xs text-zinc-400">Next Payout Status</span>
          <div className="text-2xl font-black font-mono text-amber-400 flex items-center gap-1.5">
            <Clock className="w-5 h-5" />
            <span>{currentOwner.payoutStatus}</span>
          </div>
          <span className="text-[10px] text-zinc-500">Scheduled for 1st of month</span>
        </div>
      </div>

      {/* Consigned Vehicles Inventory */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-400" />
              <span>Your Consigned Fleet Units ({ownerVehicles.length})</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Current live rental statuses and vehicle condition logs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ownerVehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-black border border-zinc-800 flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4">
                <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                  <OptimizedImage
                    src={v.imageUrl}
                    alt={`${v.make} ${v.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <h3 className="font-bold text-white text-sm">
                    {v.make} {v.model} ({v.year})
                  </h3>
                  <div className="font-mono text-zinc-400 text-[11px]">
                    Plate: {v.licensePlate} · {v.category}
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.status === 'Available'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : v.status === 'Rented'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-medium">Daily Rate</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">{formatLKR(v.dailyRate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-medium">Est. Mo. Gross</span>
                  <span className="font-mono font-bold text-white tabular-nums">{formatLKR(v.dailyRate * 18)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase font-medium">Your 80% Cut</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    {formatLKR(Math.round(v.dailyRate * 18 * 0.8))}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Insured under commercial policy
                </span>
                <span className="text-zinc-500 font-mono">Odometer: {v.mileage.toLocaleString()} mi</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
