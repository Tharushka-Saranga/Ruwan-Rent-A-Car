import React, { useEffect } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/mockData';
import { RentalBooking } from '../../types';

interface VehicleInspectionModalProps {
  rental: RentalBooking | null;
  onClose: () => void;
}

export const VehicleInspectionModal: React.FC<VehicleInspectionModalProps> = ({
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
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:w-full print:max-w-none my-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 print:hidden bg-black rounded-t-3xl">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <FileText className="w-4 h-4" />
            <span>Vehicle Condition & Pre-Return Inspection Report</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[40px] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Print Inspection Form</span>
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

        <div className="p-6 sm:p-10 space-y-6 bg-zinc-950 print:bg-white text-zinc-200 print:text-black font-sans text-xs leading-relaxed">
          <div className="flex justify-between items-start border-b border-zinc-800 print:border-gray-300 pb-4">
            <div>
              <h1 className="text-xl font-black text-white print:text-black">
                {BUSINESS_INFO.name}
              </h1>
              <p className="text-zinc-400 print:text-gray-600 text-[11px]">
                Fleet Technical Operations & 150-Point Standard
              </p>
              <p className="text-zinc-500 print:text-gray-500 text-[10px]">
                {BUSINESS_INFO.addressPlaceholder} · {BUSINESS_INFO.phonePlaceholder}
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-emerald-400 print:text-black text-sm block">
                {rental.id}
              </span>
              <span className="text-[11px] text-zinc-400 print:text-gray-600">
                Inspection Date: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black print:bg-gray-50 border border-zinc-850 print:border-gray-200">
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Assigned Vehicle</span>
              <div className="font-bold text-white print:text-black text-sm">{rental.vehicleName}</div>
              <div className="font-mono text-zinc-300 print:text-gray-800">License Plate: {rental.vehiclePlate}</div>
              <div className="text-zinc-400 print:text-gray-600">Category: {rental.vehicleCategory}</div>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Renter Name</span>
              <div className="font-bold text-white print:text-black text-sm">{rental.customerName}</div>
              <div className="text-zinc-400 print:text-gray-600">Customer ID: {rental.customerId}</div>
              <div className="text-zinc-400 print:text-gray-600">Contact: {rental.customerPhone}</div>
            </div>
          </div>

          <div className="border border-zinc-800 print:border-gray-300 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900 print:bg-gray-200 text-zinc-400 print:text-gray-700">
                <tr>
                  <th className="p-2.5 font-semibold">Checkpoint</th>
                  <th className="p-2.5 font-semibold text-center">Departure</th>
                  <th className="p-2.5 font-semibold text-center">Return</th>
                  <th className="p-2.5 font-semibold">Technical Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 print:divide-gray-200">
                {[
                  { item: 'Odometer Mileage', dep: 'Verified', ret: 'Recorded', notes: 'Logged in central fleet system' },
                  { item: 'Fuel Level', dep: 'Full Tank (100%)', ret: 'Full Tank', notes: 'Must match departure level' },
                  { item: 'Tire Tread & Pressures', dep: 'Passed (35 PSI)', ret: 'Passed', notes: 'No puncture or sidewall scuffs' },
                  { item: 'Windshield & Glass', dep: 'No chips', ret: 'No chips', notes: 'Inspected under showroom lighting' },
                  { item: 'Brake Disc & Pad Wear', dep: '8mm+ Pad Depth', ret: 'Passed', notes: 'ABS and sensors operational' },
                  { item: 'Interior Sanitation', dep: 'Sterilized', ret: 'Clean', notes: 'Smoke-free / no interior damage' },
                  { item: 'Spare Tire & Jack Tools', dep: 'Present', ret: 'Present', notes: 'Trunk equipment verified' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium text-white print:text-black">{row.item}</td>
                    <td className="p-2.5 text-center text-emerald-400 print:text-black font-semibold">{row.dep}</td>
                    <td className="p-2.5 text-center text-emerald-400 print:text-black font-semibold">{row.ret}</td>
                    <td className="p-2.5 text-zinc-400 print:text-gray-600">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-zinc-800 print:border-gray-300 grid grid-cols-2 gap-8">
            <div>
              <span className="block text-zinc-400 print:text-gray-600 mb-8 text-[11px]">
                Customer Inspection Acknowledgment:
              </span>
              <div className="border-b border-zinc-700 print:border-gray-400 pb-1 flex justify-between items-end">
                <span className="font-mono text-zinc-400 print:text-gray-500 italic text-[11px]">
                  X ____________________________________
                </span>
                <span className="text-[10px] text-zinc-500">Date: {new Date().toLocaleDateString()}</span>
              </div>
              <span className="block text-[10px] text-zinc-500 mt-1 font-semibold">
                {rental.customerName} (Driver)
              </span>
            </div>
            <div>
              <span className="block text-zinc-400 print:text-gray-600 mb-8 text-[11px]">
                Authorized Fleet Technician:
              </span>
              <div className="border-b border-zinc-700 print:border-gray-400 pb-1 flex justify-between items-end">
                <span className="font-mono text-zinc-400 print:text-gray-500 italic text-[11px]">
                  X ____________________________________
                </span>
                <span className="text-[10px] text-zinc-500">Date: {new Date().toLocaleDateString()}</span>
              </div>
              <span className="block text-[10px] text-zinc-500 mt-1 font-semibold">
                Ruwan Car Rentals Technical Inspector #04
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
