import React, { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  PlusCircle,
  Receipt,
  XCircle,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { useRouter } from '../../../context/RouterContext';
import { RentalBooking } from '../../../types';
import { formatLKR, formatRawLKR } from '../../../utils/currency';

export const AdminBookingsSection: React.FC = () => {
  const {
    rentals,
    cancelRental,
    extendRental,
    setSelectedRentalForAgreement,
    setSelectedRentalForReceipt,
  } = useRental();
  const { navigate } = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [extendModalBooking, setExtendModalBooking] = useState<RentalBooking | null>(null);
  const [extraDays, setExtraDays] = useState(1);

  const filteredBookings = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return rentals.filter((r) => {
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q) ||
        r.vehicleName.toLowerCase().includes(q) ||
        r.vehiclePlate.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (statusFilter !== 'all' && (r.bookingStatus || r.rentalStatus) !== statusFilter) return false;
      if (typeFilter !== 'all' && r.bookingType !== typeFilter) return false;
      return true;
    });
  }, [rentals, searchTerm, statusFilter, typeFilter]);

  const handleConfirmExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalBooking) return;
    extendRental(extendModalBooking.id, Number(extraDays));
    setExtendModalBooking(null);
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'Active':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Confirmed':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Unified Reservations System
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Bookings & Reservations Queue
          </h1>
          <p className="text-xs text-zinc-400">
            Centralized intake from Online Web, Physical Walk-In, and Telephone bookings
          </p>
        </div>
        <button
          onClick={() => navigate('/staff/walk-in')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search booking ID, customer name, vehicle, or license plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 min-h-[44px]"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 min-h-[44px]"
          >
            <option value="all">All Channels</option>
            <option value="Online">Online Web</option>
            <option value="Walk-In">Physical Walk-In</option>
            <option value="Phone">Telephone</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800 font-semibold">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Pickup</th>
                <th className="p-4">Return</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-zinc-500">
                    No bookings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const displayStatus = b.bookingStatus || (b.rentalStatus === 'Active' ? 'Active' : b.rentalStatus);
                  return (
                    <tr key={b.id} className="hover:bg-zinc-850/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-white">{b.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-zinc-100">{b.customerName}</div>
                        <div className="text-[11px] text-zinc-500">{b.customerPhone}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-zinc-200">{b.vehicleName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Plate: {b.vehiclePlate}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-zinc-200 font-semibold">{b.pickupDate}</div>
                        <div className="text-[10px] text-zinc-500">{b.pickupTime}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-zinc-200 font-semibold">{b.returnDate}</div>
                        <div className="text-[10px] text-zinc-500">{b.returnTime}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(displayStatus)}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${b.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono">
                        <div className="font-bold text-emerald-400 tabular-nums">{formatLKR(b.totalAmount)}</div>
                        {Boolean(b.chargeableExtraHours && b.chargeableExtraHours > 0) && (
                          <div className="text-[10px] text-amber-400 font-medium tabular-nums">
                            +{formatRawLKR(b.extraHourTotal || 0)} ({b.chargeableExtraHours}h late)
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRentalForAgreement(b)}
                            className="p-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title="Agreement"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => setSelectedRentalForReceipt(b)}
                            className="p-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title="Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                          {b.rentalStatus === 'Active' && (
                            <button
                              onClick={() => {
                                setExtendModalBooking(b);
                                setExtraDays(1);
                              }}
                              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] min-h-[36px]"
                            >
                              Extend
                            </button>
                          )}
                          {b.rentalStatus !== 'Completed' && b.rentalStatus !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`Cancel booking ${b.id}?`)) {
                                  cancelRental(b.id);
                                }
                              }}
                              className="p-2 bg-red-950/40 text-red-400 rounded-lg hover:bg-red-900/60 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                              title="Cancel"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTEND MODAL */}
      {extendModalBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 flex justify-center p-4"
        >
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-zinc-100 max-w-md w-full my-auto space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Extend Rental: {extendModalBooking.id}</h3>
            <p className="text-zinc-400">Current Return: {extendModalBooking.returnDate} ({extendModalBooking.rentalDurationDays} Days)</p>
            <form onSubmit={handleConfirmExtend} className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Additional Days</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={extraDays}
                  onChange={(e) => setExtraDays(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white font-mono min-h-[44px]"
                />
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl text-zinc-300 flex justify-between items-center">
                <span>Extra Extension (+{extraDays}d @ {formatLKR(extendModalBooking.dailyRate)}/d):</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">+{formatLKR(extendModalBooking.dailyRate * extraDays)}</span>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExtendModalBooking(null)}
                  className="px-4 py-2 bg-zinc-800 rounded-xl text-zinc-300 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-xl cursor-pointer min-h-[40px] active:scale-[0.98]"
                >
                  Confirm Extension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
