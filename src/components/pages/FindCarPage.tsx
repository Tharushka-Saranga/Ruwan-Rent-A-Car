import React, { useState, useMemo } from 'react';
import {
  Car,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { PublicPage, Vehicle, VehicleCategory } from '../../types';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';
import { formatLKR, getVehicleExtraHourRate, formatExtraHourRate } from '../../utils/currency';
import { OptimizedImage } from '../common/OptimizedImage';

interface FindCarPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (page: PublicPage) => void;
}

export const FindCarPage: React.FC<FindCarPageProps> = ({ onSelectVehicle, onNavigate }) => {
  const { vehicles } = useRental();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('all');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(400);

  const categories: ('all' | VehicleCategory)[] = ['all', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Electric'];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
      if (transmissionFilter !== 'all' && v.transmission !== transmissionFilter) return false;
      if (availabilityOnly && v.status !== 'Available') return false;
      if (v.dailyRate > maxPrice) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [vehicles, categoryFilter, transmissionFilter, availabilityOnly, maxPrice, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-12 space-y-8 font-sans">
      {/* Page Header with Business Hours badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Real-Time Showroom & Web Fleet
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Find & Reserve Your Vehicle
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Vehicles marked Available can be booked online immediately or picked up as a walk-in at our physical counter.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BusinessHoursBadge variant="compact" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-950/90 border border-zinc-800 p-5 rounded-3xl space-y-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Search text */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by make, model (e.g. Porsche, Tesla, BMW)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-750 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
            />
          </div>

          {/* Transmission Filter */}
          <div>
            <select
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-zinc-900 border border-zinc-750 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500 min-h-[44px]"
            >
              <option value="all">All Transmissions</option>
              <option value="Automatic">Automatic Only</option>
              <option value="Manual">Manual Only</option>
            </select>
          </div>

          {/* Max Daily Rate Slider */}
          <div className="flex flex-col justify-center px-1">
            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
              <span>Max Daily Rate:</span>
              <span className="font-bold font-mono text-emerald-400">{formatLKR(maxPrice)}/day</span>
            </div>
            <input
              type="range"
              min={70}
              max={400}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Category Pills & Availability Toggle */}
        <div className="pt-2 border-t border-zinc-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 touch-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[36px] active:scale-[0.98] ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'all' ? 'All Classes' : cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800 text-zinc-300 min-h-[44px]">
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => setAvailabilityOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
            />
            <span className="text-xs font-medium">Show Available Now Only</span>
          </label>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-zinc-950 border border-zinc-800 rounded-3xl text-zinc-500 space-y-2">
            <Car className="w-10 h-10 mx-auto text-zinc-600" aria-hidden="true" />
            <p className="text-sm font-semibold text-zinc-300">No vehicles match your criteria</p>
            <p className="text-xs text-zinc-500">Try adjusting your filters or price slider.</p>
          </div>
        ) : (
          filteredVehicles.map((v) => {
            const isAvail = v.status === 'Available';
            const extraHour = v.extraHourRate || getVehicleExtraHourRate(v);
            return (
              <div
                key={v.id}
                className="group rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 overflow-hidden transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image & Badges */}
                  <div className="relative h-56 w-full bg-black overflow-hidden">
                    <OptimizedImage
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model} (${v.year}) rental in Sri Lanka`}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                          isAvail
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-900/80 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {isAvail ? 'Available Today' : v.status}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-200">
                      {v.category}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-zinc-300 flex items-center gap-2">
                      <span>{v.transmission}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.fuel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.seats} Seats</span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {v.make} {v.model}
                        </h3>
                        <p className="text-xs text-zinc-400">{v.year} Model · {v.color}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 tabular-nums">
                          {formatLKR(v.dailyRate)}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">/day (LKR)</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black border border-amber-500/30 flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">Extra Hour Overtime:</span>
                      <span className="font-mono font-bold text-amber-300 tabular-nums">
                        {formatExtraHourRate(extraHour)}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {v.features.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-black border border-zinc-850 text-[11px] text-zinc-400 flex items-center justify-between">
                      <span className="truncate pr-2">Pickup: Ruwan Main Hub (Sri Lanka)</span>
                      <span className="text-zinc-400 font-mono shrink-0">Dep: {formatLKR(v.securityDeposit)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0 border-t border-zinc-850 mt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    {isAvail ? 'Instant Online Checkout' : 'Currently Reserved'}
                  </span>
                  <button
                    onClick={() => {
                      onSelectVehicle(v);
                      onNavigate('car-details');
                    }}
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer min-h-[44px] active:scale-[0.98] ${
                      isAvail
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
                        : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300'
                    }`}
                  >
                    <span>{isAvail ? 'Book This Car' : 'View Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
