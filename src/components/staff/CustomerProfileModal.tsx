import React, { useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Shield, Calendar, Car, CreditCard, FileCheck } from 'lucide-react';
import { Customer } from '../../types';
import { useRental } from '../../context/RentalContext';

interface CustomerProfileModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  onClose,
}) => {
  const { rentals, setSelectedRentalForAgreement, setSelectedRentalForReceipt } = useRental();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (customer) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customer, onClose]);

  if (!customer) return null;

  const customerRentals = rentals.filter(
    (r) => r.customerId === customer.id || r.customerEmail === customer.email
  );

  const activeRental = customerRentals.find(
    (r) => r.rentalStatus === 'Active' || r.rentalStatus === 'Reserved'
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center p-4 sm:p-6 items-center"
    >
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl overflow-hidden my-auto">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{customer.fullName}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                  {customer.id}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {customer.customerType}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Registered: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs touch-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black p-4 rounded-2xl border border-zinc-850 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-850 pb-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Personal Information</span>
              </h3>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Phone:</span>
                <span className="text-zinc-200 font-medium">{customer.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Email:</span>
                <span className="text-zinc-200 font-medium">{customer.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Address:</span>
                <span className="text-zinc-200 text-right font-medium max-w-[200px] truncate">{customer.homeAddress}</span>
              </div>
            </div>

            <div className="bg-black p-4 rounded-2xl border border-zinc-850 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-850 pb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Driver Verification</span>
              </h3>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">License Number:</span>
                <span className="text-zinc-200 font-mono font-bold">{customer.licenseNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Jurisdiction:</span>
                <span className="text-zinc-200">{customer.licenseCountryState}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Status:</span>
                <span className="text-emerald-400 font-medium">{customer.verificationStatus}</span>
              </div>
            </div>
          </div>

          {activeRental && (
            <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  <span>Current Active Rental</span>
                </span>
                <span className="text-xs font-mono font-bold text-white bg-emerald-500/20 px-2 py-0.5 rounded">
                  {activeRental.id}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-3">
                <div>
                  <span className="text-zinc-500 block">Vehicle</span>
                  <span className="font-semibold text-white">{activeRental.vehicleName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Dates</span>
                  <span className="text-zinc-200 font-medium">{activeRental.pickupDate} – {activeRental.returnDate}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Total</span>
                  <span className="font-mono font-bold text-emerald-400">${activeRental.totalAmount}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      setSelectedRentalForAgreement(activeRental);
                    }}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded min-h-[36px]"
                  >
                    Agreement
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setSelectedRentalForReceipt(activeRental);
                    }}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded min-h-[36px]"
                  >
                    Receipt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-black flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer min-h-[40px]"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
