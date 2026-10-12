import React, { useEffect } from 'react';
import { X, Lock, FileText, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/mockData';

interface PrivacyTermsModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-4 items-center"
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              {type === 'privacy' ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-bold text-white">
                {type === 'privacy'
                  ? 'Customer Privacy & Driver License Protection'
                  : 'Commercial Rental Terms & Overtime Charges'}
              </h2>
              <p className="text-xs text-zinc-400">
                {BUSINESS_INFO.name} – Physical Showroom & Online Operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-zinc-300 space-y-4 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-200">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Driver License & Identity Protection Policy
                </span>
                We treat customer driver licenses, home addresses, and payment tokens with enterprise-grade privacy standards. Sensitive records collected at the physical counter or online are never displayed on public pages or shared with unauthorized third parties.
              </div>
              <h3 className="font-bold text-white text-sm">1. Information We Collect</h3>
              <p>
                When you rent a vehicle through our online platform or register in person at our physical office (7:00 AM – 9:00 PM Daily), our staff securely collects: legal name, date of birth, contact phone, email address, physical address, driver's license number, issuing jurisdiction, and emergency contact details.
              </p>
              <h3 className="font-bold text-white text-sm">2. Purpose of Collection</h3>
              <p>
                Information is collected strictly for fleet insurance verification, validation of driver eligibility, fraud prevention, expressway toll reconciliation, and fulfillment of the physical rental contract under Sri Lankan regulations.
              </p>
              <h3 className="font-bold text-white text-sm">3. Protected Staff Access</h3>
              <p>
                Access to full customer records is restricted to authenticated front-desk agents and fleet directors. Driver license numbers are obscured from public URLs and marketing displays.
              </p>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200">
                <span className="font-bold text-white block mb-1">
                  Master Fleet Terms & Vehicle Custody Agreement
                </span>
                All rentals initiated online or at our physical counter are governed by commercial fleet standards, local traffic regulations, and insurance guidelines in Sri Lanka.
              </div>
              <h3 className="font-bold text-white text-sm">1. Operating Hours & Return Timelines</h3>
              <p>
                Vehicles must be returned to our physical office during official operating hours (<strong>7:00 AM – 9:00 PM Daily</strong>). Returns outside these hours must be scheduled with desk staff in advance.
              </p>
              <h3 className="font-bold text-white text-sm">2. Transparent Overtime Extra Hour Rate</h3>
              <p>
                Unlike generic platforms with arbitrary late penalties, each car in our fleet has an explicit, independent <strong>Extra Hour Rate in Sri Lankan Rupees (LKR / Rs.)</strong> clearly displayed before booking. Late returns are calculated as: <em>Extra Hour Rate × Number of Chargeable Extra Hours</em>.
              </p>
              <h3 className="font-bold text-white text-sm">3. Security Deposit Hold</h3>
              <p>
                A refundable security deposit is authorized at the time of key handover. The deposit is credited back upon post-trip return technical inspection.
              </p>
              <h3 className="font-bold text-white text-sm">4. Fuel & Care Standard</h3>
              <p>
                Renters agree to return vehicles in equivalent clean condition with equal fuel level. Prohibited acts include unauthorized off-roading, smoking, and operation by unlisted drivers.
              </p>
            </>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-zinc-850">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer min-h-[44px]"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
