import React, { useMemo } from 'react';
import {
  TrendingUp,
  Printer,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { formatLKR } from '../../../utils/currency';

export const AdminReportsSection: React.FC = () => {
  const { rentals, vehicles } = useRental();

  const metrics = useMemo(() => {
    const totalRevenue = rentals
      .filter((r) => r.paymentStatus === 'Paid' || r.paymentStatus === 'Partially Paid')
      .reduce((sum, r) => sum + r.amountPaid, 0);

    const walkInRentals = rentals.filter((r) => r.bookingType === 'Walk-In');
    const onlineRentals = rentals.filter((r) => r.bookingType === 'Online');

    const walkInRevenue = walkInRentals.reduce((sum, r) => sum + r.amountPaid, 0);
    const onlineRevenue = onlineRentals.reduce((sum, r) => sum + r.amountPaid, 0);

    const totalRentedOrReserved = vehicles.filter((v) => v.status === 'Rented' || v.status === 'Reserved').length;
    const fleetUtilizationRate =
      vehicles.length > 0 ? Math.round((totalRentedOrReserved / vehicles.length) * 100) : 0;

    const avgDailyRate =
      vehicles.length > 0
        ? Math.round(vehicles.reduce((sum, v) => sum + v.dailyRate, 0) / vehicles.length)
        : 0;

    const avgDuration =
      rentals.length > 0
        ? Math.round(rentals.reduce((sum, r) => sum + r.rentalDurationDays, 0) / rentals.length)
        : 3;

    return {
      totalRevenue,
      walkInRevenue,
      onlineRevenue,
      walkInCount: walkInRentals.length,
      onlineCount: onlineRentals.length,
      fleetUtilizationRate,
      avgDailyRate,
      avgDuration,
    };
  }, [rentals, vehicles]);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Financial & Fleet Reports</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Performance analytics across physical office walk-ins and digital bookings.
          </p>
        </div>
        <button
          onClick={handlePrintReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white font-bold text-xs border border-zinc-700 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Print Summary Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Gross Booking Revenue</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">{formatLKR(metrics.totalRevenue)}</div>
          <p className="text-[11px] text-zinc-500">All channels combined</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Fleet Utilization</span>
          <div className="text-2xl font-black text-blue-400 tabular-nums">{metrics.fleetUtilizationRate}%</div>
          <p className="text-[11px] text-zinc-500">Currently out / reserved</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Avg Daily Rate</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">{formatLKR(metrics.avgDailyRate)}/day</div>
          <p className="text-[11px] text-zinc-500">Fleet average tier</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Avg Rental Duration</span>
          <div className="text-2xl font-black text-amber-400 tabular-nums">{metrics.avgDuration} Days</div>
          <p className="text-[11px] text-zinc-500">Per customer checkout</p>
        </div>
      </div>

      {/* Channel Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Physical Rental Office</span>
              <h3 className="text-base font-black text-white">Walk-In Counter Performance</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Office POS
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] text-zinc-500">Walk-In Bookings</span>
              <div className="text-xl font-black text-white mt-0.5 tabular-nums">{metrics.walkInCount}</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] text-zinc-500">Walk-In Revenue</span>
              <div className="text-lg font-black text-emerald-400 mt-0.5 font-mono tabular-nums">{formatLKR(metrics.walkInRevenue)}</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">Web Marketplace</span>
              <h3 className="text-base font-black text-white">Online Bookings Performance</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Digital Platform
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] text-zinc-500">Online Bookings</span>
              <div className="text-xl font-black text-white mt-0.5 tabular-nums">{metrics.onlineCount}</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
              <span className="text-[11px] text-zinc-500">Online Revenue</span>
              <div className="text-lg font-black text-blue-400 mt-0.5 font-mono tabular-nums">{formatLKR(metrics.onlineRevenue)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
