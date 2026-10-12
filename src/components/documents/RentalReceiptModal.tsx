import React, { useEffect } from 'react';
import { X, Printer, Receipt, CheckCircle, CreditCard } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/mockData';
import { RentalBooking } from '../../types';
import { formatLKR, formatRawLKR } from '../../utils/currency';

interface RentalReceiptModalProps {
  rental: RentalBooking | null;
  onClose: () => void;
}

export const RentalReceiptModal: React.FC<RentalReceiptModalProps> = ({
  rental,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (rental) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rental, onClose]);

  if (!rental) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static"
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none my-auto">
        {/* Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 print:hidden bg-black rounded-t-3xl">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Receipt className="w-4 h-4" />
            <span>Official Rental Invoice & Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-950/40 cursor-pointer min-h-[40px] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-6 sm:p-10 space-y-6 bg-zinc-950 print:bg-white text-zinc-200 print:text-black font-sans">
          <div className="text-center pb-6 border-b border-zinc-800 print:border-gray-300 space-y-1">
            <div className="inline-block p-2 rounded-full bg-emerald-500/10 text-emerald-400 print:text-black mb-1">
              <CheckCircle className="w-7 h-7 mx-auto" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
              {BUSINESS_INFO.name}
            </h1>
            <p className="text-xs text-zinc-400 print:text-gray-600">
              {BUSINESS_INFO.addressPlaceholder}
            </p>
            <p className="text-xs text-zinc-400 print:text-gray-600">
              Phone: {BUSINESS_INFO.phonePlaceholder} | Desk: {BUSINESS_INFO.emailPlaceholder}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">
              Operating Daily 7:00 AM – 9:00 PM · Sri Lanka
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="flex justify-between items-center text-xs bg-black print:bg-gray-100 p-4 rounded-2xl border border-zinc-850 print:border-gray-200">
            <div>
              <span className="text-zinc-400 print:text-gray-600 block">Receipt / Rental ID</span>
              <span className="font-mono font-bold text-white print:text-black text-sm">{rental.id}</span>
              <span className="text-[11px] text-zinc-500 block">Type: {rental.bookingType} Order</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 print:text-gray-600 block">Date & Time</span>
              <span className="font-mono text-zinc-200 print:text-black">{new Date().toLocaleString()}</span>
              <span className="text-[11px] text-emerald-400 print:text-emerald-800 font-semibold uppercase block">
                Status: {rental.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer & Vehicle */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-black print:bg-gray-50 rounded-xl border border-zinc-850 print:border-gray-200">
              <span className="font-semibold text-zinc-400 print:text-gray-600 uppercase text-[10px] tracking-wider block mb-1">
                Billed To
              </span>
              <div className="font-bold text-white print:text-black">{rental.customerName}</div>
              <div className="text-zinc-400 print:text-gray-600">{rental.customerPhone}</div>
              <div className="text-zinc-400 print:text-gray-600">{rental.customerEmail}</div>
              <div className="text-[11px] text-zinc-500">Account: {rental.customerId}</div>
            </div>
            <div className="p-3.5 bg-black print:bg-gray-50 rounded-xl border border-zinc-850 print:border-gray-200">
              <span className="font-semibold text-zinc-400 print:text-gray-600 uppercase text-[10px] tracking-wider block mb-1">
                Vehicle Rented
              </span>
              <div className="font-bold text-white print:text-black">{rental.vehicleName}</div>
              <div className="text-zinc-400 print:text-gray-600">Plate: <span className="font-mono font-semibold">{rental.vehiclePlate}</span></div>
              <div className="text-zinc-400 print:text-gray-600">Class: {rental.vehicleCategory}</div>
              <div className="text-[11px] text-zinc-500">
                {rental.pickupDate} ({rental.pickupTime}) – {rental.returnDate} ({rental.returnTime})
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="border border-zinc-800 print:border-gray-300 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-zinc-900 print:bg-gray-200 text-zinc-400 print:text-gray-700">
                <tr>
                  <th className="py-2 px-3 text-left font-semibold">Item & Details</th>
                  <th className="py-2 px-3 text-center font-semibold">Qty</th>
                  <th className="py-2 px-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 print:divide-gray-200">
                <tr>
                  <td className="py-2 px-3 font-medium text-white print:text-black">
                    Vehicle Rental: {rental.vehicleName} ({formatLKR(rental.dailyRate)}/day)
                  </td>
                  <td className="py-2 px-3 text-center font-mono">{rental.rentalDurationDays}d</td>
                  <td className="py-2 px-3 text-right font-mono text-white print:text-black">
                    {formatLKR(rental.dailyRate * rental.rentalDurationDays)}
                  </td>
                </tr>
                {rental.additionalCharges.map((chg) => (
                  <tr key={chg.id}>
                    <td className="py-1.5 px-3 text-zinc-300 print:text-gray-800">{chg.name}</td>
                    <td className="py-1.5 px-3 text-center font-mono">1</td>
                    <td className="py-1.5 px-3 text-right font-mono text-white print:text-black">
                      {formatLKR(chg.amount)}
                    </td>
                  </tr>
                ))}
                {Boolean(rental.chargeableExtraHours && rental.chargeableExtraHours > 0) && (
                  <tr className="bg-amber-950/20 print:bg-amber-50">
                    <td className="py-1.5 px-3 text-amber-400 print:text-amber-800 font-medium">
                      Overtime Late Return ({rental.chargeableExtraHours}h @ {formatRawLKR(rental.extraHourRate || 2500)}/h)
                    </td>
                    <td className="py-1.5 px-3 text-center font-mono">{rental.chargeableExtraHours}h</td>
                    <td className="py-1.5 px-3 text-right font-mono text-amber-400 print:text-amber-800 font-bold">
                      +{formatRawLKR(rental.extraHourTotal || 0)}
                    </td>
                  </tr>
                )}
                <tr className="bg-zinc-900 print:bg-gray-100 font-bold">
                  <td colSpan={2} className="py-2.5 px-3 text-right text-white print:text-black uppercase text-[11px]">
                    Total Charged (Sri Lankan Rupees):
                  </td>
                  <td className="py-2.5 px-3 text-right text-sm text-emerald-400 print:text-black font-mono">
                    {formatLKR(rental.totalAmount, { showCode: true })}
                  </td>
                </tr>
                <tr className="bg-black print:bg-gray-50 text-xs">
                  <td colSpan={2} className="py-2 px-3 text-right text-zinc-400 print:text-gray-600">
                    Security Deposit Held (Refundable upon inspection):
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-medium text-zinc-300 print:text-black">
                    {formatLKR(rental.securityDeposit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tender details */}
          <div className="flex items-center justify-between p-3.5 bg-black print:bg-gray-100 rounded-2xl border border-zinc-850 print:border-gray-200 text-xs">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400 print:text-black" />
              <div>
                <span className="font-semibold text-white print:text-black">
                  Tender: {rental.paymentMethod}
                </span>
                <span className="text-zinc-500 block text-[11px]">
                  Processed at Counter POS Terminal #02
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-sm text-emerald-400 print:text-black">
                {formatLKR(rental.amountPaid)} Paid
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
