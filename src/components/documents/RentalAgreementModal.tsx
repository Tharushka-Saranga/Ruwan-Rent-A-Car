import React, { useEffect } from 'react';
import { X, Printer, Shield, CheckCircle, FileText } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/mockData';
import { RentalBooking } from '../../types';
import { formatLKR, formatRawLKR } from '../../utils/currency';

interface RentalAgreementModalProps {
  rental: RentalBooking | null;
  onClose: () => void;
}

export const RentalAgreementModal: React.FC<RentalAgreementModalProps> = ({
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
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none my-auto">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 print:hidden bg-black rounded-t-3xl">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <FileText className="w-4 h-4" />
            <span>Official Rental Agreement · Ready to Print / Sign</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-950/40 cursor-pointer min-h-[40px] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Agreement</span>
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

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 space-y-8 bg-zinc-950 print:bg-white text-zinc-200 print:text-black font-sans leading-relaxed">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-800 print:border-gray-300 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block print:hidden" />
                <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                  {BUSINESS_INFO.name}
                </h1>
              </div>
              <p className="text-xs text-zinc-400 print:text-gray-600 mt-1">
                {BUSINESS_INFO.addressPlaceholder}
              </p>
              <p className="text-xs text-zinc-400 print:text-gray-600">
                Phone: {BUSINESS_INFO.phonePlaceholder} | Desk: {BUSINESS_INFO.emailPlaceholder}
              </p>
              <p className="text-xs text-zinc-500 print:text-gray-500 font-mono mt-0.5">
                License: {BUSINESS_INFO.licenseNumberPlaceholder}
              </p>
            </div>
            <div className="text-left sm:text-right bg-zinc-900 print:bg-gray-100 p-3.5 rounded-2xl border border-zinc-800 print:border-gray-300">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 block">
                Master Rental Agreement
              </span>
              <span className="text-lg font-mono font-bold text-white print:text-black block">
                {rental.id}
              </span>
              <span className="text-xs text-zinc-400 print:text-gray-600">
                Issued: {new Date(rental.createdAt).toLocaleDateString()} ({rental.bookingType})
              </span>
            </div>
          </div>

          {/* Customer & Vehicle Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black print:bg-gray-50 p-5 rounded-2xl border border-zinc-850 print:border-gray-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 print:text-gray-500 mb-3 border-b border-zinc-850 pb-2">
                Primary Renter Information
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Full Legal Name:</span>
                  <span className="font-semibold text-white print:text-black">{rental.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Customer ID:</span>
                  <span className="font-mono text-zinc-300 print:text-black">{rental.customerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Contact Phone:</span>
                  <span className="text-zinc-300 print:text-black">{rental.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Email Address:</span>
                  <span className="text-zinc-300 print:text-black">{rental.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Customer Category:</span>
                  <span className="font-medium text-emerald-400 print:text-emerald-700">{rental.customerType}</span>
                </div>
              </div>
            </div>

            <div className="bg-black print:bg-gray-50 p-5 rounded-2xl border border-zinc-850 print:border-gray-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 print:text-gray-500 mb-3 border-b border-zinc-850 pb-2">
                Vehicle Assignment & Fleet Specs
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Assigned Vehicle:</span>
                  <span className="font-semibold text-white print:text-black">{rental.vehicleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">License Plate:</span>
                  <span className="font-mono font-bold text-white print:text-black">{rental.vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Category / Class:</span>
                  <span className="text-zinc-300 print:text-black">{rental.vehicleCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 print:text-gray-600">Pre-Rental Inspection:</span>
                  <span className="text-emerald-400 print:text-green-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 inline" /> Passed 150-Point Checklist
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-black print:bg-gray-50 p-5 rounded-2xl border border-zinc-850 print:border-gray-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 print:text-gray-500 mb-3 border-b border-zinc-850 pb-2">
              Rental Schedule & Return Checkpoints
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 print:text-gray-600 block">Pickup Date & Time</span>
                <span className="text-white print:text-black font-semibold text-sm">
                  {rental.pickupDate} at {rental.pickupTime}
                </span>
                <span className="text-[11px] text-zinc-500 print:text-gray-500 block mt-0.5">
                  {rental.pickupLocation}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 print:text-gray-600 block">Agreed Return Date & Time</span>
                <span className="text-white print:text-black font-semibold text-sm">
                  {rental.returnDate} at {rental.returnTime}
                </span>
                <span className="text-[11px] text-zinc-500 print:text-gray-500 block mt-0.5">
                  {rental.returnLocation}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 print:text-gray-600 block">Total Authorized Duration</span>
                <span className="text-emerald-400 print:text-emerald-700 font-bold text-sm">
                  {rental.rentalDurationDays} Day(s)
                </span>
                <span className="text-[11px] text-zinc-500 print:text-gray-500 block mt-0.5">
                  Counter Hours: 7:00 AM – 9:00 PM Daily
                </span>
              </div>
            </div>
          </div>

          {/* Rates Table */}
          <div className="border border-zinc-800 print:border-gray-300 rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-zinc-900 print:bg-gray-200 text-zinc-400 print:text-gray-700">
                <tr>
                  <th className="py-2.5 px-4 text-left font-semibold">Description</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Rate / Unit</th>
                  <th className="py-2.5 px-4 text-center font-semibold">Qty / Days</th>
                  <th className="py-2.5 px-4 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 print:divide-gray-200">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-white print:text-black">
                    Vehicle Rental: {rental.vehicleName}
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono">{formatLKR(rental.dailyRate)}/day</td>
                  <td className="py-2.5 px-4 text-center font-mono">{rental.rentalDurationDays}d</td>
                  <td className="py-2.5 px-4 text-right font-mono font-semibold text-white print:text-black">
                    {formatLKR(rental.dailyRate * rental.rentalDurationDays)}
                  </td>
                </tr>
                {rental.additionalCharges.map((chg) => (
                  <tr key={chg.id}>
                    <td className="py-2 px-4 text-zinc-300 print:text-gray-800">{chg.name}</td>
                    <td className="py-2 px-4 text-center font-mono text-zinc-400 print:text-gray-600">-</td>
                    <td className="py-2 px-4 text-center font-mono">1</td>
                    <td className="py-2 px-4 text-right font-mono text-white print:text-black">
                      {formatLKR(chg.amount)}
                    </td>
                  </tr>
                ))}
                {Boolean(rental.chargeableExtraHours && rental.chargeableExtraHours > 0) && (
                  <tr className="bg-amber-950/20 print:bg-amber-50">
                    <td className="py-2 px-4 text-amber-400 print:text-amber-800 font-medium">
                      Overtime Late Return ({rental.chargeableExtraHours} hours @ {formatRawLKR(rental.extraHourRate || 2500)}/hr)
                    </td>
                    <td className="py-2 px-4 text-center font-mono">{formatRawLKR(rental.extraHourRate || 2500)}/hr</td>
                    <td className="py-2 px-4 text-center font-mono">{rental.chargeableExtraHours} hrs</td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-amber-400 print:text-amber-800">
                      +{formatRawLKR(rental.extraHourTotal || 0)}
                    </td>
                  </tr>
                )}
                <tr className="bg-zinc-900 print:bg-gray-100 font-bold">
                  <td colSpan={3} className="py-3 px-4 text-right text-white print:text-black uppercase text-[11px] tracking-wider">
                    Total Rental Charges (Sri Lankan Rupees):
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-emerald-400 print:text-black font-mono">
                    {formatLKR(rental.totalAmount, { showCode: true })}
                  </td>
                </tr>
                <tr className="bg-black print:bg-gray-50 text-xs">
                  <td colSpan={3} className="py-2.5 px-4 text-right text-zinc-400 print:text-gray-600">
                    Refundable Security Deposit (Held separately):
                  </td>
                  <td className="py-2.5 px-4 text-right text-zinc-300 print:text-black font-mono font-semibold">
                    {formatLKR(rental.securityDeposit)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal Terms */}
          <div className="p-4 bg-black print:bg-gray-50 rounded-2xl border border-zinc-850 print:border-gray-200 text-[11px] text-zinc-400 print:text-gray-600 space-y-2">
            <div className="font-bold uppercase text-zinc-300 print:text-black flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Standard Rental Terms & Conditions</span>
            </div>
            <p>
              <strong>1. Operation & Authorized Driver:</strong> Vehicle must only be operated by the licensed individual named in this agreement. Operating under the influence or unapproved subleasing immediately voids commercial insurance coverage.
            </p>
            <p>
              <strong>2. Return Schedule & Extra Hour Charges:</strong> Vehicles must be returned during physical office hours (7:00 AM – 9:00 PM). If returned later than the agreed return time, additional charges apply: <strong>Extra Hour Rate × Number of Chargeable Extra Hours</strong> (Car rate: {formatRawLKR(rental.extraHourRate || 2500)}/hr).
            </p>
            <p>
              <strong>3. Security Deposit Terms:</strong> The refundable security deposit of {formatLKR(rental.securityDeposit)} is held until completion of post-rental physical inspection and toll/fuel reconciliation.
            </p>
          </div>

          {/* Signatures Area */}
          <div className="pt-6 border-t border-zinc-800 print:border-gray-300 grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="block text-zinc-400 print:text-gray-600 mb-8">
                Renter Signature & Agreement Acceptance:
              </span>
              <div className="border-b border-zinc-700 print:border-gray-400 pb-1 flex justify-between items-end">
                <span className="font-mono text-zinc-400 print:text-gray-500 italic text-[11px]">
                  X ____________________________________
                </span>
                <span className="text-[10px] text-zinc-500">Date: {new Date().toLocaleDateString()}</span>
              </div>
              <span className="block text-[11px] text-zinc-500 print:text-gray-500 mt-1 font-semibold">
                {rental.customerName} (Customer)
              </span>
            </div>
            <div>
              <span className="block text-zinc-400 print:text-gray-600 mb-8">
                Authorized Counter Agent / Fleet Staff:
              </span>
              <div className="border-b border-zinc-700 print:border-gray-400 pb-1 flex justify-between items-end">
                <span className="font-mono text-zinc-400 print:text-gray-500 italic text-[11px]">
                  X ____________________________________
                </span>
                <span className="text-[10px] text-zinc-500">Date: {new Date().toLocaleDateString()}</span>
              </div>
              <span className="block text-[11px] text-zinc-500 print:text-gray-500 mt-1 font-semibold">
                Ruwan Car Rentals Fleet Desk Officer [Agent #104]
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
