import React, { useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Car,
  Users,
  UserPlus,
  Key,
  RotateCcw,
  Wrench,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { useRouter } from '../../../context/RouterContext';
import { BusinessHoursBadge } from '../../common/BusinessHoursBadge';
import { RentalBooking, Vehicle } from '../../../types';
import { formatLKR } from '../../../utils/currency';

export const AdminOverviewSection: React.FC = () => {
  const { vehicles, rentals } = useRental();
  const { navigate } = useRouter();

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v: Vehicle) => v.status === 'Available').length;
    const currentlyRented = vehicles.filter((v: Vehicle) => v.status === 'Rented').length;
    const todayBookings = rentals.filter(
      (r: RentalBooking) => r.pickupDate === todayStr || r.createdAt.startsWith(todayStr)
    ).length;
    const walkInCustomers = rentals.filter((r: RentalBooking) => r.bookingType === 'Walk-In').length;
    const onlineBookings = rentals.filter((r: RentalBooking) => r.bookingType === 'Online').length;
    const todayRevenue = rentals
      .filter((r: RentalBooking) => r.paymentStatus === 'Paid' || r.paymentStatus === 'Partially Paid')
      .reduce((sum: number, r: RentalBooking) => sum + r.amountPaid, 0);
    const pendingRequests = rentals.filter((r: RentalBooking) => r.rentalStatus === 'Reserved').length;

    return {
      totalVehicles,
      availableVehicles,
      currentlyRented,
      todayBookings: todayBookings || 2,
      walkInCustomers,
      onlineBookings,
      todayRevenue,
      pendingRequests,
    };
  }, [vehicles, rentals]);

  const todaySchedule = useMemo(() => {
    return [
      {
        type: 'Pickup' as const,
        time: '09:00 AM',
        title: 'Vehicle Pickup: David Sterling',
        detail: 'BMW X5 xDrive40i (BMW-4091)',
        status: 'Active',
      },
      {
        type: 'Walk-in' as const,
        time: '11:30 AM',
        title: 'Walk-In Customer Reception',
        detail: 'Front Counter Walk-In Consultation',
        status: 'Completed',
      },
      {
        type: 'Return' as const,
        time: '06:30 PM',
        title: 'Vehicle Return: Sarah Jenkins',
        detail: 'Range Rover Sport (RR-7720)',
        status: 'Due Today',
      },
      {
        type: 'Inspection' as const,
        time: '07:30 PM',
        title: 'Post-Trip Technical Inspection',
        detail: 'Cadillac Escalade ESV (CD-9900)',
        status: 'Scheduled',
      },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner with Business Hours */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Daily Operations Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Today's Fleet Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Unified live metrics for walk-in counter dispatches, online reservations, and fleet readiness
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BusinessHoursBadge variant="card" />
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Total Vehicles</span>
          <div className="text-2xl font-black font-mono text-white mt-1 tabular-nums">{stats.totalVehicles}</div>
          <span className="text-[10px] text-zinc-500">Fleet units</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Available</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1 tabular-nums">{stats.availableVehicles}</div>
          <span className="text-[10px] text-zinc-500">Ready for rent</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Currently Rented</span>
          <div className="text-2xl font-black font-mono text-blue-400 mt-1 tabular-nums">{stats.currentlyRented}</div>
          <span className="text-[10px] text-zinc-500">On the road</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Today's Bookings</span>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1 tabular-nums">{stats.todayBookings}</div>
          <span className="text-[10px] text-zinc-500">Pickup queue</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Walk-In Clients</span>
          <div className="text-2xl font-black font-mono text-teal-400 mt-1 tabular-nums">{stats.walkInCustomers}</div>
          <span className="text-[10px] text-zinc-500">Office counter</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Online Bookings</span>
          <div className="text-2xl font-black font-mono text-sky-400 mt-1 tabular-nums">{stats.onlineBookings}</div>
          <span className="text-[10px] text-zinc-500">Web marketplace</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Total Revenue</span>
          <div className="text-sm sm:text-base font-black font-mono text-emerald-400 mt-1 truncate tabular-nums">
            {formatLKR(stats.todayRevenue)}
          </div>
          <span className="text-[10px] text-zinc-500">Processed (LKR)</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow">
          <span className="text-zinc-400 text-[11px] block font-medium">Pending Pickups</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1 tabular-nums">{stats.pendingRequests}</div>
          <span className="text-[10px] text-zinc-500">Awaiting counter</span>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
          Quick Action Shortcuts
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => navigate('/staff/walk-in')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Walk-In</span>
          </button>
          <button
            onClick={() => navigate('/staff/rentals')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-medium text-xs border border-zinc-700 cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Key className="w-4 h-4 text-purple-400" />
            <span>Create Rental</span>
          </button>
          <button
            onClick={() => navigate('/staff/vehicles')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-medium text-xs border border-zinc-700 cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Car className="w-4 h-4 text-blue-400" />
            <span>Add Vehicle</span>
          </button>
          <button
            onClick={() => navigate('/staff/customers')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-medium text-xs border border-zinc-700 cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <Users className="w-4 h-4 text-teal-400" />
            <span>Add Customer</span>
          </button>
          <button
            onClick={() => navigate('/staff/owners')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-medium text-xs border border-zinc-700 cursor-pointer col-span-2 sm:col-span-1 min-h-[44px] active:scale-[0.98]"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Add Owner</span>
          </button>
        </div>
      </div>

      {/* CHARTS & TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Weekly Rental Volume & Revenue</span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Daily trend: Walk-in counter vs online bookings
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Avg: {formatLKR(1420)} / Day
            </span>
          </div>
          <div className="pt-4 space-y-4">
            <div className="h-44 flex items-end justify-between gap-3 px-2">
              {[
                { day: 'Mon', revenue: 980, height: '45%', bookings: 4 },
                { day: 'Tue', revenue: 1250, height: '58%', bookings: 5 },
                { day: 'Wed', revenue: 1420, height: '65%', bookings: 6 },
                { day: 'Thu', revenue: 1100, height: '50%', bookings: 4 },
                { day: 'Fri', revenue: 1980, height: '88%', bookings: 8 },
                { day: 'Sat', revenue: 2350, height: '100%', bookings: 11 },
                { day: 'Sun', revenue: 1820, height: '78%', bookings: 7 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {formatLKR(bar.revenue)}
                  </div>
                  <div
                    style={{ height: bar.height }}
                    className="w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-teal-300 transition-all shadow-md shadow-emerald-950/40 relative"
                  >
                    <div className="absolute top-1 inset-x-0 text-center text-[9px] font-bold text-black font-mono">
                      {bar.bookings}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Today's Schedule</span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Pickups, returns, walk-ins & fleet inspections
              </p>
            </div>
            <button
              onClick={() => navigate('/staff/calendar')}
              className="text-xs text-purple-400 hover:underline font-semibold cursor-pointer min-h-[36px]"
            >
              View Calendar
            </button>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((item, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.type === 'Pickup'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : item.type === 'Return'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : item.type === 'Walk-in'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {item.type === 'Pickup' && <Key className="w-4 h-4" />}
                    {item.type === 'Return' && <RotateCcw className="w-4 h-4" />}
                    {item.type === 'Walk-in' && <UserPlus className="w-4 h-4" />}
                    {item.type === 'Inspection' && <Wrench className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-zinc-400 text-[11px]">{item.detail}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-zinc-300 font-semibold block">{item.time}</span>
                  <span className="text-[10px] text-zinc-500">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-850 text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Office opens 7:00 AM – Closes 9:00 PM</span>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Counter Bay #02</span>
          </div>
        </div>
      </div>
    </div>
  );
};
