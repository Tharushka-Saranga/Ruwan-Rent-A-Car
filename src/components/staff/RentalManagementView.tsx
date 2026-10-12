import React, { useState } from 'react';
import {
  Car,
  Clock,
  PlusCircle,
  FileText,
  RotateCcw,
  Receipt,
  Search,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { RentalBooking, RentalStatus } from '../../types';
import {
  formatLKR,
  formatRawLKR,
  getVehicleExtraHourRate,
} from '../../utils/currency';

export const RentalManagementView: React.FC<{ onOpenWalkIn: () => void }> = ({ onOpenWalkIn }) => {
  const {
    rentals,
    vehicles,
    completeReturn,
    setSelectedRentalForAgreement,
    setSelectedRentalForReceipt,
  } = useRental();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RentalStatus>('all');
  const [returnModalRental, setReturnModalRental] = useState<RentalBooking | null>(null);

  const [returnDateTime, setReturnDateTime] = useState(() => new Date().toISOString().replace('T', ' ').slice(0, 16));
  const [returnMileage, setReturnMileage] = useState<number>(10000);
  const [chargeableExtraHours, setChargeableExtraHours] = useState<number>(0);
  const [carExtraHourRate, setCarExtraHourRate] = useState<number>(2500);
  const [extraCharges, setExtraCharges] = useState<number>(0);
  const [extraChargesNote, setExtraChargesNote] = useState('');
  const [depositRefundStatus, setDepositRefundStatus] = useState<
    'Pending' | 'Refunded Full' | 'Partially Retained' | 'Retained'
  >('Refunded Full');
  const [markAvailableImmediately, setMarkAvailableImmediately] = useState(false);

  const filteredRentals = rentals.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.toLowerCase().includes(q) ||
      r.vehicleName.toLowerCase().includes(q) ||
      r.vehiclePlate.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && r.rentalStatus !== statusFilter) return false;
    return true;
  });

  const handleOpenReturnModal = (rental: RentalBooking) => {
    const veh = vehicles.find((v) => v.id === rental.vehicleId);
    const rate = veh?.extraHourRate || getVehicleExtraHourRate(veh);
    setReturnModalRental(rental);
    setCarExtraHourRate(rate);
    setChargeableExtraHours(0);
    setReturnMileage((veh?.mileage || 10000) + 120);
    setExtraCharges(0);
    setExtraChargesNote('');
    setDepositRefundStatus('Refunded Full');
    setMarkAvailableImmediately(false);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalRental) return;
    const lateReturnCost = Math.round(Number(carExtraHourRate) * Number(chargeableExtraHours));
    const totalExtra = Math.round(Number(extraCharges) || 0);

    completeReturn(returnModalRental.id, {
      actualReturnDateTime: returnDateTime,
      returnMileage: Number(returnMileage),
      chargeableExtraHours: Number(chargeableExtraHours),
      extraHourRate: Number(carExtraHourRate),
      extraHourTotal: lateReturnCost,
      extraChargesAmount: totalExtra,
      depositRefundStatus,
      staffNotes: `${extraChargesNote ? `${extraChargesNote}. ` : ''}Chargeable late hours: ${chargeableExtraHours}h @ Rs. ${carExtraHourRate}/h = Rs. ${lateReturnCost}`,
      markAvailableImmediately,
    });
    setReturnModalRental(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <span>Rental Management & Dispatch Counter</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dispatch, check-in returns, record counter payments & print legal agreements
          </p>
        </div>
        <button
          onClick={onOpenWalkIn}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Rental Booking</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search bookings by ID, customer name, vehicle, or license plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs touch-scroll">
          {(['all', 'Active', 'Reserved', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[36px] ${
                statusFilter === st
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {st === 'all' ? 'All Bookings' : st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRentals.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 text-xs">
            No bookings found matching current search.
          </div>
        ) : (
          filteredRentals.map((r) => {
            const isFinished = r.rentalStatus === 'Completed' || r.rentalStatus === 'Cancelled';
            return (
              <div
                key={r.id}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-white px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800">
                      {r.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        r.rentalStatus === 'Active'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : r.rentalStatus === 'Reserved'
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : r.rentalStatus === 'Completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {r.rentalStatus}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {r.bookingType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRentalForAgreement(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors min-h-[36px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Agreement</span>
                    </button>
                    <button
                      onClick={() => setSelectedRentalForReceipt(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors min-h-[36px]"
                    >
                      <Receipt className="w-3.5 h-3.5 text-blue-400" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 text-[11px] uppercase font-semibold tracking-wider block">Customer</span>
                    <div className="font-bold text-white text-sm">{r.customerName}</div>
                    <div className="text-zinc-400">{r.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] uppercase font-semibold tracking-wider block">Vehicle</span>
                    <div className="font-bold text-white text-sm">{r.vehicleName}</div>
                    <div className="text-zinc-400 font-mono">Plate: {r.vehiclePlate}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px] uppercase font-semibold tracking-wider block">Dates</span>
                    <div className="text-zinc-300">{r.pickupDate} – {r.returnDate}</div>
                    <div className="text-zinc-500">{r.rentalDurationDays} Days</div>
                  </div>
                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/80">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Total (LKR):</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                        {formatLKR(r.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {!isFinished && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button
                      onClick={() => handleOpenReturnModal(r)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/30 cursor-pointer min-h-[36px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Check-In Vehicle Return</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Return Modal */}
      {returnModalRental && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-zinc-100 my-auto shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Check-In Return: {returnModalRental.vehicleName}</h3>
              <button
                onClick={() => setReturnModalRental(null)}
                className="text-zinc-400 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Late Return Overtime Calculation (LKR / Rs.)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Car's Extra Hour Rate</label>
                    <input
                      type="number"
                      value={carExtraHourRate}
                      onChange={(e) => {
                        const newRate = Number(e.target.value);
                        setCarExtraHourRate(newRate);
                        setExtraCharges(newRate * chargeableExtraHours);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-100 font-mono text-xs min-h-[40px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Chargeable Extra Hours</label>
                    <input
                      type="number"
                      min={0}
                      value={chargeableExtraHours}
                      onChange={(e) => {
                        const hours = Math.max(0, Number(e.target.value));
                        setChargeableExtraHours(hours);
                        setExtraCharges(carExtraHourRate * hours);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-100 font-mono text-xs min-h-[40px]"
                    />
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-mono text-[11px]">{formatRawLKR(carExtraHourRate)} × {chargeableExtraHours} hrs:</span>
                  <span className="text-sm font-black font-mono text-amber-400">+{formatRawLKR(carExtraHourRate * chargeableExtraHours)}</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Odometer Mileage on Return (mi)</label>
                <input
                  type="number"
                  value={returnMileage}
                  onChange={(e) => setReturnMileage(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalRental(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer min-h-[40px]"
                >
                  Complete Return & Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
