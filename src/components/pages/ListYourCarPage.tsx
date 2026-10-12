import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  TrendingUp,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { PublicPage, VehicleCategory } from '../../types';
import { formatLKR } from '../../utils/currency';

interface ListYourCarPageProps {
  onNavigate: (page: PublicPage) => void;
}

export const ListYourCarPage: React.FC<ListYourCarPageProps> = ({ onNavigate }) => {
  const { addConsignmentVehicle } = useRental();

  // Simulator State
  const [estMake, setEstMake] = useState('BMW');
  const [rentalDaysPerMonth, setRentalDaysPerMonth] = useState(18);

  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [make, setMake] = useState('Porsche');
  const [model, setModel] = useState('Macan GTS');
  const [year, setYear] = useState(2023);
  const [category, setCategory] = useState<VehicleCategory>('SUV');
  const [mileage, setMileage] = useState(14000);
  const [suggestedRate, setSuggestedRate] = useState(210);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Estimated revenue calculation
  const estimatedDaily = estMake === 'Porsche' ? 290 : estMake === 'BMW' ? 185 : estMake === 'Mercedes' ? 195 : 120;
  const grossMonthly = estimatedDaily * rentalDaysPerMonth;
  const ownerNetEarnings = Math.round(grossMonthly * 0.8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerEmail || !make || !model) return;
    addConsignmentVehicle(
      {
        make,
        model,
        year: Number(year),
        category,
        dailyRate: Number(suggestedRate),
        securityDeposit: Number(suggestedRate) * 4,
        mileage: Number(mileage),
        description: `Owner consignment registered by ${ownerName}. Scheduled for 150-point intake inspection.`,
      },
      {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
      }
    );
    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-12 space-y-16 font-sans">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-zinc-950 border border-zinc-800 p-8 sm:p-14 shadow-2xl overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Vehicle Consignment Program
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Turn Your Vehicle Into a High-Earning Fleet Asset
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            "Let us rent your vehicle and help you earn income." We store your car at our secure physical showroom, provide commercial insurance coverage, screen every driver, and wire 80% of net rental earnings directly to your bank account every month.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <a
              href="#consign-form"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>Submit Your Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => onNavigate('owner-dashboard')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs border border-zinc-750 transition-colors cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>View Host Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Earnings Calculator */}
      <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-3xl space-y-8 shadow-xl">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Earnings Simulator
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            How Much Can You Earn Consigning With Us?
          </h2>
          <p className="text-xs text-zinc-400">
            Calculate your estimated monthly net payout based on vehicle class and occupancy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
          <div className="md:col-span-7 space-y-4 text-xs">
            <div>
              <label htmlFor="prestige-select" className="block text-zinc-400 mb-1 font-semibold">Vehicle Class Tier</label>
              <select
                id="prestige-select"
                value={estMake}
                onChange={(e) => setEstMake(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-xs font-semibold min-h-[44px]"
              >
                <option value="Porsche">Porsche / High-Performance Exotic ({formatLKR(290)}/day avg)</option>
                <option value="BMW">BMW / Mercedes Executive ({formatLKR(185)}/day avg)</option>
                <option value="Standard">Toyota / Honda Premium ({formatLKR(120)}/day avg)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-zinc-400 mb-1 font-semibold">
                <span>Estimated Rented Days per Month:</span>
                <span className="font-mono text-emerald-400 font-bold">{rentalDaysPerMonth} Days</span>
              </div>
              <input
                type="range"
                min={5}
                max={26}
                value={rentalDaysPerMonth}
                onChange={(e) => setRentalDaysPerMonth(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>5 days (Weekend only)</span>
                <span>18 days (Average fleet occupancy)</span>
                <span>26 days (High demand)</span>
              </div>
            </div>

            <div className="p-3.5 bg-black rounded-xl border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Gross Monthly Bookings:</span>
                <span className="font-mono text-zinc-200">{formatLKR(grossMonthly)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Ruwan Fleet Management & Insurance (20%):</span>
                <span className="font-mono text-zinc-400">-{formatLKR(Math.round(grossMonthly * 0.2))}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-gradient-to-b from-emerald-950/40 via-black to-black border border-emerald-500/30 p-6 rounded-3xl text-center space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
              Estimated Monthly Payout
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tabular-nums">
              {formatLKR(ownerNetEarnings)}
            </div>
            <p className="text-[11px] text-zinc-400">
              Direct bank transfer on the 1st of every month. No hidden listing fees.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: Shield,
            title: '1. Commercial Insurance',
            desc: 'Comprehensive commercial liability and collision coverage automatically active on every rental.',
          },
          {
            icon: FileCheck,
            title: '2. Strict Driver Screening',
            desc: 'Every renter must pass driving license validation and background checks before receiving keys.',
          },
          {
            icon: CheckCircle,
            title: '3. 150-Point Fleet Care',
            desc: 'Our certified technical team performs inspection, fluid checks, and interior detailing after every dispatch.',
          },
          {
            icon: TrendingUp,
            title: '4. Monthly Payouts',
            desc: 'Track your car live in the Host Portal with automated direct deposit payments and monthly ledger summaries.',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Submission Form */}
      <div id="consign-form" className="max-w-3xl mx-auto bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Submit Your Car
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Consignment Onboarding Application
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Fill in your vehicle details to schedule an intake inspection at our physical showroom.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center bg-black border border-emerald-500/40 rounded-3xl space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Vehicle Application Successfully Submitted!</h3>
            <p className="text-xs text-zinc-300 max-w-md mx-auto">
              Your <strong>{year} {make} {model}</strong> has been added to our pending inspection queue. Our fleet manager will contact you at <strong>{ownerEmail}</strong> within 24 hours to arrange showroom drop-off.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigate('owner-dashboard')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
              >
                Go to Owner Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Owner Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Owner Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="07X XXX XXXX"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Make *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Porsche"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Macan GTS"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Model Year</label>
                <input
                  type="number"
                  min={2018}
                  max={2026}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-medium min-h-[44px]"
                >
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Sports">Sports</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Current Mileage (mi)</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Desired Daily Rate ($/d)</label>
                <input
                  type="number"
                  value={suggestedRate}
                  onChange={(e) => setSuggestedRate(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono text-emerald-400 font-bold min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              Submit Car for Consignment Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
