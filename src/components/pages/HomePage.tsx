import React, { useState, useMemo } from 'react';
import {
  Car,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Phone,
  Award,
  Key,
  Shield,
} from 'lucide-react';
import { PublicPage, Vehicle } from '../../types';
import { useRental } from '../../context/RentalContext';
import { formatLKR, getVehicleExtraHourRate, formatExtraHourRate } from '../../utils/currency';
import { CarScrollBackground } from '../common/CarScrollBackground';
import { OptimizedImage } from '../common/OptimizedImage';

interface HomePageProps {
  onNavigate: (page: PublicPage) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenStaffPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectVehicle,
}) => {
  const { vehicles } = useRental();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Featured fleet items (3 items)
  const featuredFleet = useMemo(() => {
    if (selectedCategory === 'all') return vehicles.slice(0, 3);
    const filtered = vehicles.filter((v) => v.category === selectedCategory);
    return filtered.length > 0 ? filtered.slice(0, 3) : vehicles.slice(0, 3);
  }, [vehicles, selectedCategory]);

  return (
    <div className="relative min-h-screen text-white font-sans space-y-16 lg:space-y-24 pb-12 overflow-x-hidden">
      {/* High-Performance Canvas Scroll Background */}
      <CarScrollBackground />

      {/* SECTION 1: HERO VIEWPORT */}
      <section
        aria-labelledby="hero-title"
        className="relative z-10 min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center pt-6 pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto w-full">
          {/* Left Column: Title, Information, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Status & Business Hours Tag */}
            <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-2xl shadow-lg">
              <div className="flex flex-col text-left leading-none">
                <span className="text-[11px] font-black uppercase tracking-widest text-white">
                  RUWAN
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  CAR RENTALS
                </span>
              </div>
              <span className="w-px h-5 bg-white/15" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold tracking-wider uppercase">
                  LIVE
                </span>
                <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Open 7:00 AM – 9:00 PM Daily</span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1
                id="hero-title"
                className="text-3xl sm:text-4xl lg:text-[54px] font-medium text-white tracking-tight leading-[1.14] text-balance"
              >
                Rent Premium Cars.
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-emerald-400 tracking-tight">
                Your Freedom. Your Ride.
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed">
                Find the right vehicle for your journey across Sri Lanka. Browse transparent daily rates in Sri Lankan Rupees (LKR) with verified per-car extra hour overtime rates and 60-second counter key handover.
              </p>
            </div>

            {/* Responsive CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('book-a-car')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 transition-all cursor-pointer group min-h-[44px] active:scale-[0.98]"
              >
                <Car className="w-4 h-4" aria-hidden="true" />
                <span>Book a Car</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <button
                onClick={() => onNavigate('find-car')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
              >
                <span>Explore Fleet</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-black/60 backdrop-blur-md hover:bg-zinc-900 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer min-h-[44px]"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>Contact & Office</span>
              </button>
              <a
                href="tel:0705828190"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-black/60 backdrop-blur-md hover:bg-zinc-900 text-white font-mono text-xs border border-white/10 transition-colors min-h-[44px]"
                title="Direct Hotline 1"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>070 582 8190</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-white">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-[11px]">No Hidden Charges</span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-[11px]">60s Key Handover</span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span className="text-[11px]">Sri Lanka Showroom</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with CDN Optimization & Lazy Loading */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-2xl group h-[320px] sm:h-[400px] lg:h-[460px]">
              <OptimizedImage
                src="https://res.cloudinary.com/x0wfgiln/image/upload/v1791707856/Gemini_Generated_Image.jpg"
                alt="Featured premium rental vehicle in Sri Lanka"
                priority={true}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Verified badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-black/60 border border-white/15 text-emerald-300 text-xs font-semibold backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span>Verified Fleet · Ready for Handover</span>
                </span>
              </div>

              {/* Compact bottom feature cards */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between gap-3">
                <div className="bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 max-w-[180px] w-full flex items-center gap-2.5 shadow-xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-300 uppercase font-bold tracking-wider block truncate">
                      Checked Fleet
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      150-Pt Protocol
                    </span>
                  </div>
                </div>

                <div className="bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 max-w-[180px] w-full flex items-center gap-2.5 shadow-xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-zinc-300 uppercase font-bold tracking-wider block truncate">
                      Clear Overtime
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      Hourly in LKR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP: VALUE PROPOSITIONS */}
      <section aria-label="Key Advantages" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Key className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-white">60s Key Handover</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Fast counter verification with driver license or passport. Drive away in under 60 seconds.
            </p>
          </div>

          <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Shield className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-white">150-Point Inspection</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Every engine, brake rotor, tire, and AC system thoroughly serviced and certified road-ready.
            </p>
          </div>

          <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-white">Clear Overtime Rates</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              Exact per-car hourly overtime rate in LKR clearly stated upfront with zero hidden penalties.
            </p>
          </div>

          <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 p-5 rounded-2xl shadow-xl transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-white">Island-Wide Coverage</h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              24/7 direct telephone support, roadside towing, and airport VIP dispatch at Bandaranaike International.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR FLEET */}
      <section
        id="our-fleet-section"
        aria-labelledby="fleet-heading"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Fleet Inventory
            </span>
            <h2 id="fleet-heading" className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Our Fleet
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              Top featured vehicles with real-time daily prices and transparent extra-hour overtime rates in Sri Lankan Rupees (LKR).
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'Sedan', 'SUV', 'Luxury', 'Sports'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] active:scale-[0.98] ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-950 text-zinc-300 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'all' ? 'All Classes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFleet.map((v) => {
            const extraHour = v.extraHourRate || getVehicleExtraHourRate(v);
            const isAvail = v.status === 'Available';
            return (
              <div
                key={v.id}
                className="group rounded-3xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 overflow-hidden transition-all duration-300 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image */}
                  <div className="relative h-56 w-full bg-black overflow-hidden">
                    <OptimizedImage
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model} (${v.year}) for rent in Sri Lanka`}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                          isAvail
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                            : 'bg-zinc-900/80 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {isAvail ? 'Available Today' : v.status}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-200">
                      {v.category}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-zinc-300 flex items-center gap-2">
                      <span>{v.transmission}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.fuel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.seats} Seats</span>
                    </div>
                  </div>

                  {/* Vehicle Specifications & Pricing */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {v.make} {v.model}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {v.year} Model · License: <span className="font-mono text-zinc-200">{v.licensePlate}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 block tabular-nums">
                          {formatLKR(v.dailyRate)}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">/day (LKR)</span>
                      </div>
                    </div>

                    {/* Overtime Rate */}
                    <div className="p-2.5 rounded-xl bg-black border border-amber-500/30 flex items-center justify-between text-xs">
                      <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                        <span>Extra Hour Rate:</span>
                      </span>
                      <span className="font-mono font-bold text-amber-300 tabular-nums">
                        {formatExtraHourRate(extraHour)}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {v.features.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-black text-zinc-300 border border-white/10"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-black border border-white/5 text-[11px] text-zinc-400 flex items-center justify-between">
                      <span className="truncate">Pickup: Showroom Hub (Sri Lanka)</span>
                      <span className="font-mono text-zinc-300 shrink-0">Deposit: {formatLKR(v.securityDeposit)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 border-t border-white/10 mt-2 flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      onSelectVehicle(v);
                      onNavigate('car-details');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-white/15 transition-colors cursor-pointer text-center min-h-[44px] active:scale-[0.98]"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectVehicle(v);
                      onNavigate('book-a-car');
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-center min-h-[44px] active:scale-[0.98] ${
                      isAvail
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                        : 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    {isAvail ? 'Book Now' : 'Reserved'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Fleet CTA */}
        <div className="pt-4 text-center">
          <button
            onClick={() => onNavigate('find-car')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs border border-white/15 shadow-xl transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <span>View All Fleet Vehicles ({vehicles.length})</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};
