import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';

export const AdminCalendarSection: React.FC = () => {
  const { rentals, vehicles, setSelectedRentalForAgreement } = useRental();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  const weekDays = useMemo(() => {
    const days = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + currentWeekOffset * 7);
    const dayOfWeek = baseDate.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    baseDate.setDate(baseDate.getDate() - distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isToday = isoStr === new Date().toISOString().split('T')[0];
      days.push({ date: isoStr, dayName, monthDay, isToday });
    }
    return days;
  }, [currentWeekOffset]);

  const filteredRentals = useMemo(() => {
    if (selectedVehicleId === 'all') return rentals;
    return rentals.filter((r) => r.vehicleId === selectedVehicleId);
  }, [rentals, selectedVehicleId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Fleet Calendar & Schedule</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Visual rental bookings timeline, daily dispatch schedule, and vehicle return board.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Previous Week"
              aria-label="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer min-h-[36px]"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Next Week"
              aria-label="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 min-h-[40px]"
            >
              <option value="all">All Vehicles ({vehicles.length})</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const pickupsOnDay = filteredRentals.filter((r) => r.pickupDate === day.date);
          const returnsOnDay = filteredRentals.filter((r) => r.returnDate === day.date);
          const activeOnDay = filteredRentals.filter(
            (r) =>
              r.pickupDate <= day.date &&
              r.returnDate >= day.date &&
              r.rentalStatus !== 'Cancelled' &&
              !pickupsOnDay.includes(r) &&
              !returnsOnDay.includes(r)
          );

          return (
            <div
              key={day.date}
              className={`rounded-2xl border p-3 flex flex-col min-h-[360px] transition-all ${
                day.isToday
                  ? 'bg-zinc-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                    {day.dayName}
                  </span>
                  <span className={`text-sm font-black ${day.isToday ? 'text-emerald-400' : 'text-white'}`}>
                    {day.monthDay}
                  </span>
                </div>
                {day.isToday && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Today
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto touch-scroll">
                {pickupsOnDay.map((r) => (
                  <div
                    key={`pickup-${r.id}`}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/70 text-zinc-200 text-xs space-y-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-emerald-400 text-[11px]">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Pickup {r.pickupTime}</span>
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">{r.id.split('-').pop()}</span>
                    </div>
                    <div className="font-semibold text-white truncate">{r.vehicleName}</div>
                    <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>{r.customerName}</span>
                    </div>
                    <div className="pt-1 flex justify-end gap-1">
                      <button
                        onClick={() => setSelectedRentalForAgreement(r)}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 cursor-pointer min-h-[28px]"
                      >
                        Doc
                      </button>
                    </div>
                  </div>
                ))}

                {returnsOnDay.map((r) => (
                  <div
                    key={`return-${r.id}`}
                    className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/70 text-zinc-200 text-xs space-y-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-blue-400 text-[11px]">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Return {r.returnTime}</span>
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">{r.id.split('-').pop()}</span>
                    </div>
                    <div className="font-semibold text-white truncate">{r.vehicleName}</div>
                    <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>{r.customerName}</span>
                    </div>
                  </div>
                ))}

                {activeOnDay.map((r) => (
                  <div
                    key={`active-${r.id}`}
                    className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 text-[11px] truncate flex items-center justify-between"
                  >
                    <span className="truncate">On road: {r.vehicleName}</span>
                    <span className="font-mono text-[10px] text-zinc-500">Active</span>
                  </div>
                ))}

                {pickupsOnDay.length === 0 && returnsOnDay.length === 0 && activeOnDay.length === 0 && (
                  <div className="h-28 flex flex-col items-center justify-center text-zinc-600 text-xs text-center">
                    <span>No dispatches</span>
                    <span className="text-[10px] text-zinc-700">scheduled</span>
                  </div>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500 flex justify-between font-mono">
                <span>↑ {pickupsOnDay.length} out</span>
                <span>↓ {returnsOnDay.length} in</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
