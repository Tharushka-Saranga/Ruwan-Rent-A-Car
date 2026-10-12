import React, { useState } from 'react';
import {
  Settings,
  Clock,
  MapPin,
  Save,
  CheckCircle,
  RotateCcw,
  DollarSign,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { BusinessHoursBadge } from '../../common/BusinessHoursBadge';

export const AdminSettingsSection: React.FC = () => {
  const { settings, updateSettings, resetToDemoData, currentStaff } = useRental();

  const [businessName, setBusinessName] = useState(settings.businessName || 'Ruwan Car Rentals');
  const [openingTime, setOpeningTime] = useState(settings.openingTime || '07:00');
  const [closingTime, setClosingTime] = useState(settings.closingTime || '21:00');
  const [phone1, setPhone1] = useState(settings.phone1 || '0705828190');
  const [phone2, setPhone2] = useState(settings.phone2 || '0759888895');
  const [email, setEmail] = useState(settings.email || 'tharushkasaranga123@gmail.com');
  const [address, setAddress] = useState(
    settings.address || 'https://goo.gl/maps/yz3jrh4wQmJaijjn6'
  );
  const [timezone, setTimezone] = useState(settings.timezone || 'Asia/Colombo');
  const [defaultDeposit, setDefaultDeposit] = useState(settings.defaultSecurityDeposit || 500);
  const [lateFee, setLateFee] = useState(settings.lateFeePerHour || 2500);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isAdmin = currentStaff?.role === 'ADMIN';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      openingTime,
      closingTime,
      phone: `${phone1} / ${phone2}`,
      phone1,
      phone2,
      email,
      address,
      timezone,
      defaultSecurityDeposit: Number(defaultDeposit),
      lateFeePerHour: Number(lateFee),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Business & Office Configuration</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Physical office hours, terminal defaults, rental agreement terms, and system resets.
          </p>
        </div>
        <BusinessHoursBadge variant="card" />
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Business settings updated successfully and persisted.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Physical Office Operating Hours</h3>
          </div>
          <div className="text-xs text-zinc-400 leading-relaxed">
            The physical office is open every day from <strong>7:00 AM – 9:00 PM</strong> for counter customer checkouts, returns, and key collections.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Opening Time</label>
              <input
                type="time"
                disabled={!isAdmin}
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Closing Time</label>
              <input
                type="time"
                disabled={!isAdmin}
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Configured Timezone</label>
              <select
                disabled={!isAdmin}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              >
                <option value="Asia/Colombo">Sri Lanka Standard Time (Asia/Colombo)</option>
                <option value="Europe/London">Greenwich Mean Time (Europe/London)</option>
                <option value="America/New_York">Eastern Time (America/New_York)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Business Identity & Office Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Trading Business Name</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-bold min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Official Business Email</label>
              <input
                type="email"
                disabled={!isAdmin}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Phone Line 1</label>
              <input
                type="tel"
                disabled={!isAdmin}
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Phone Line 2</label>
              <input
                type="tel"
                disabled={!isAdmin}
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Rental Policy Defaults</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Default Security Deposit ($)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={defaultDeposit}
                onChange={(e) => setDefaultDeposit(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Default Late Fee ($ / hour)</label>
              <input
                type="number"
                disabled={!isAdmin}
                value={lateFee}
                onChange={(e) => setLateFee(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to initial baseline state?')) {
                resetToDemoData();
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Database to Initial State</span>
          </button>

          {isAdmin ? (
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center gap-2 min-h-[44px] active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          ) : (
            <span className="text-xs text-zinc-500">
              Settings can only be modified by accounts with the ADMIN role.
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
