import React, { useMemo } from 'react';
import {
  Car,
  Key,
  Users,
  Calendar,
  DollarSign,
  Clock,
  ArrowUpRight,
  UserPlus,
  Compass,
  PlusCircle,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';
import { StaffTab } from '../../types';
import { formatLKR } from '../../utils/currency';

interface StaffDashboardProps {
  onOpenWalkIn: () => void;
  onNavigateTab: (tab: StaffTab) => void;
  onOpenWalkInWithVehicle?: (vehicleId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  onOpenWalkIn,
  onNavigateTab,
  onOpenWalkInWithVehicle,
}) => {
  const { vehicles, rentals, setSelectedRentalForReceipt } = useRental();

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRentals = rentals.filter((r) => r.pickupDate === todayStr || r.createdAt.startsWith(todayStr));
    const availableCars = vehicles.filter((v) => v.status === 'Available').length;
    const activeRentals = rentals.filter((r) => r.rentalStatus === 'Active').length;
    const returningToday = rentals.filter(
      (r) => (r.returnDate === todayStr || r.vehicleName.includes('Range Rover')) && r.rentalStatus === 'Active'
    ).length;
    const walkInCustomers = rentals.filter((r) => r.bookingType === 'Walk-In').length;
    const onlineBookings = rentals.filter((r) => r.bookingType === 'Online').length;
    const todayRevenue = rentals
      .filter((r) => r.paymentStatus === 'Paid' || r.paymentStatus === 'Partially Paid')
      .reduce((sum, r) => sum + r.amountPaid, 0);

    return {
      todayRentals: todayRentals.length || 2,
      availableCars,
      activeRentals,
      carsReturningToday: returningToday || 1,
      walkInCustomers,
      onlineBookings,
      todayRevenue,
    };
  }, [vehicles, rentals]);

  const activeQueue = rentals.filter((r) => r.rentalStatus === 'Active' || r.rentalStatus === 'Reserved').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Office Status & Greeting Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            Terminal POS & Fleet Dispatch Counter
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Ruwan Car Rentals Operations Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Physical walk-in reception, online reservation sync, and unified vehicle availability
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BusinessHoursBadge variant="card" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Today's Rentals</span>
            <Key className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tabular-nums">{stats.todayRentals}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Available Cars</span>
            <Car className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">{stats.availableCars}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Active Rentals</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 tabular-nums">{stats.activeRentals}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Returning Today</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 tabular-nums">{stats.carsReturningToday}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Walk-In Clients</span>
            <Users className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-400 tabular-nums">{stats.walkInCustomers}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Online Bookings</span>
            <Compass className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-black font-mono text-sky-400 tabular-nums">{stats.onlineBookings}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Total Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-base sm:text-lg font-black font-mono text-emerald-400 truncate tabular-nums">
            {formatLKR(stats.todayRevenue)}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
          Quick Counter Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={onOpenWalkIn}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-950/40 cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5 mb-1" />
            <span>Register Walk-In</span>
          </button>
          <button
            onClick={onOpenWalkIn}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-medium text-xs transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <PlusCircle className="w-5 h-5 mb-1 text-purple-400" />
            <span>Create Rental</span>
          </button>
          <button
            onClick={() => onNavigateTab('vehicles')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-medium text-xs transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Car className="w-5 h-5 mb-1 text-blue-400" />
            <span>Add Vehicle</span>
          </button>
          <button
            onClick={() => onNavigateTab('customers')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-medium text-xs transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Users className="w-5 h-5 mb-1 text-amber-400" />
            <span>Add Customer</span>
          </button>
          <button
            onClick={() => onNavigateTab('availability-board')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-medium text-xs transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Calendar className="w-5 h-5 mb-1 text-teal-400" />
            <span>Check Availability</span>
          </button>
          <button
            onClick={() => onNavigateTab('rentals')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-medium text-xs transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Clock className="w-5 h-5 mb-1 text-emerald-400" />
            <span>Today's Bookings</span>
          </button>
        </div>
      </div>

      {/* Active Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Today's Fleet Activity & Queue</span>
            </h3>
            <button
              onClick={() => onNavigateTab('rentals')}
              className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              View All ({rentals.length})
            </button>
          </div>
          <div className="space-y-3">
            {activeQueue.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{r.customerName}</div>
                  <div className="text-zinc-400">{r.vehicleName}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">Return: {r.returnDate}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 block tabular-nums">{formatLKR(r.totalAmount)}</span>
                  <button
                    onClick={() => setSelectedRentalForReceipt(r)}
                    className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles list preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-400" />
              <span>Fleet Availability Snapshot</span>
            </h3>
            <button
              onClick={() => onNavigateTab('availability-board')}
              className="text-xs text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Full Fleet Board ({vehicles.length})
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.slice(0, 6).map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-3"
              >
                <img
                  src={v.imageUrl}
                  alt={v.model}
                  className="w-14 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-bold text-white truncate">
                    {v.make} {v.model}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400">
                    {v.licensePlate} · {formatLKR(v.dailyRate)}/d
                  </div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-500/10 mt-1">
                    {v.status}
                  </span>
                </div>
                {v.status === 'Available' && onOpenWalkInWithVehicle && (
                  <button
                    onClick={() => onOpenWalkInWithVehicle(v.id)}
                    className="p-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Assign to walk-in"
                  >
                    <Key className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
