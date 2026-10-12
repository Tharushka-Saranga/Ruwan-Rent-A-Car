import React from 'react';
import {
  MapPin,
  ShieldCheck,
  FileCheck,
  Compass,
  Award,
} from 'lucide-react';
import { PublicPage } from '../../types';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';

interface AboutPageProps {
  onNavigate: (page: PublicPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-12 space-y-16 font-sans">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2">
          <BusinessHoursBadge variant="compact" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Why Choose Ruwan Car Rentals
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Founded and led by <strong>Ruwan Thilakarathne</strong>, Ruwan Car Rentals unites the speed of an online digital marketplace with the hands-on reliability of a verified physical showroom in Sri Lanka. We operate transparently with daily rates in Sri Lankan Rupees (LKR), zero hidden fees, and dedicated counter service from 7:00 AM to 9:00 PM Daily.
        </p>
      </div>

      {/* The Dual Model Explained */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Physical Rental Showroom</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Unlike purely virtual car-sharing apps where you hunt for lockboxes in remote alleys, our physical showroom is fully staffed every single day. Walk in without an appointment, inspect the car in person, complete counter check-in, and drive away in minutes.
          </p>
          <div className="p-3 bg-black rounded-xl border border-zinc-850 text-xs text-zinc-300 font-mono">
            Hours: 7:00 AM – 9:00 PM (Daily) · On-site fleet technicians
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Online Digital Fleet Platform</h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Reserve ahead from anywhere. Browse transparent daily rates, choose vehicle categories, calculate exact insurance options, and review official rental agreements. Your car is sanitized and reserved exclusively for you upon arrival.
          </p>
          <div className="p-3 bg-black rounded-xl border border-zinc-850 text-xs text-zinc-300 font-mono">
            Real-time synchronization between website and physical counter
          </div>
        </div>
      </div>

      {/* 150-Point Inspection Standards */}
      <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-12 rounded-3xl space-y-8 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Quality & Safety Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Our 150-Point Fleet Standard
          </h2>
          <p className="text-xs text-zinc-400">
            Every vehicle whether company-owned or owner-consigned passes technical verification before receiving dispatch approval.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Mechanical & Brake Testing</h3>
            <p className="text-zinc-400 leading-relaxed">
              Full brake rotor depth check, tire tread calibration, electronic system diagnostics, and fluid levels inspected after every trip.
            </p>
          </div>
          <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-2">
            <Award className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Sanitization & Detailing</h3>
            <p className="text-zinc-400 leading-relaxed">
              Medical-grade interior ozone sterilization, steam leather conditioning, and exterior touchless wash prior to each handover.
            </p>
          </div>
          <div className="p-5 bg-black rounded-2xl border border-zinc-850 space-y-2">
            <FileCheck className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Commercial Insurance</h3>
            <p className="text-zinc-400 leading-relaxed">
              Every rental is covered under our state-approved commercial fleet policy, with 24/7 emergency roadside towing across Sri Lanka.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Ready to experience Ruwan Car Rentals?</h2>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
          Reserve your vehicle online with verified per-car pricing in LKR or walk directly into our Sri Lanka showroom.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('book-a-car')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-950 min-h-[44px] active:scale-[0.98]"
          >
            Book a Car Online
          </button>
          <button
            onClick={() => onNavigate('find-car')}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            Browse Available Fleet
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            Visit Our Office
          </button>
        </div>
      </div>
    </div>
  );
};
