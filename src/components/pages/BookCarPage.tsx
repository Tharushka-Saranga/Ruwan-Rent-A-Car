import React, { useState, useMemo } from 'react';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Phone,
  X,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { PublicPage, Vehicle } from '../../types';
import { BUSINESS_INFO } from '../../data/mockData';
import { formatLKR, getVehicleExtraHourRate, formatExtraHourRate } from '../../utils/currency';
import { OptimizedImage } from '../common/OptimizedImage';

interface BookCarPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigate: (page: PublicPage) => void;
}

export const BookCarPage: React.FC<BookCarPageProps> = ({
  onSelectVehicle,
  onNavigate,
}) => {
  const { vehicles } = useRental();

  const [pickupLocation, setPickupLocation] = useState(BUSINESS_INFO.defaultPickupLocation);
  const [returnLocation, setReturnLocation] = useState(BUSINESS_INFO.defaultPickupLocation);
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('09:00');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for instant reservation
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentOption, setPaymentOption] = useState<'counter' | 'card'>('counter');
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const diffTime = end.getTime() - start.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 1;
    } catch {
      return 1;
    }
  }, [pickupDate, returnDate]);

  const availableVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [vehicles, selectedCategory, searchQuery]);

  const handleOpenBookingModal = (v: Vehicle) => {
    setBookingVehicle(v);
    setConfirmedBookingRef(null);
    setBookingSubmitted(false);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingVehicle) return;
    const refCode = `RWN-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedBookingRef(refCode);
    setBookingSubmitted(true);
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 pb-24 lg:pb-12">
      {/* Top Banner & Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-950 border border-emerald-500/30 text-xs shadow-lg">
          <span className="font-bold uppercase tracking-wider text-emerald-400">
            SHOWROOM COUNTER OPEN 7:00 AM – 9:00 PM DAILY
          </span>
          <span className="text-zinc-500 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-zinc-300 hidden sm:inline">
            Fast Key Handover
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Book Your Rental Vehicle
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Select your dates, pick your desired car from our verified Sri Lanka fleet, and lock in your reservation with transparent daily rates and independent extra-hour overtime pricing in LKR.
        </p>
      </div>

      {/* Main Booking Search Engine Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="border-b border-zinc-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Rental Schedule & Location</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            Duration: <strong className="text-emerald-400">{rentalDays} Day{rentalDays > 1 ? 's' : ''}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Pickup Location */}
          <div className="space-y-1.5">
            <label htmlFor="pickup-loc" className="block text-zinc-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Pickup Location</span>
            </label>
            <select
              id="pickup-loc"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500 min-h-[44px]"
            >
              <option value={BUSINESS_INFO.defaultPickupLocation}>
                {BUSINESS_INFO.defaultPickupLocation} (Showroom Hub)
              </option>
              <option value={BUSINESS_INFO.airportPickupLocation}>
                {BUSINESS_INFO.airportPickupLocation}
              </option>
              <option value="Colombo City Center">Colombo City Center</option>
              <option value="Negombo Beach Road">Negombo Beach Road</option>
            </select>
          </div>

          {/* Pickup Date & Time */}
          <div className="space-y-1.5">
            <label htmlFor="pickup-date" className="block text-zinc-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Pickup Date & Time</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="col-span-2 w-full bg-black border border-zinc-800 rounded-xl px-2.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 min-h-[44px]"
              />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="col-span-1 w-full bg-black border border-zinc-800 rounded-xl px-1.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 min-h-[44px]"
                aria-label="Pickup time"
              />
            </div>
          </div>

          {/* Return Date & Time */}
          <div className="space-y-1.5">
            <label htmlFor="return-date" className="block text-zinc-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Return Date & Time</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                id="return-date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="col-span-2 w-full bg-black border border-zinc-800 rounded-xl px-2.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 min-h-[44px]"
              />
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="col-span-1 w-full bg-black border border-zinc-800 rounded-xl px-1.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 min-h-[44px]"
                aria-label="Return time"
              />
            </div>
          </div>

          {/* Return Location */}
          <div className="space-y-1.5">
            <label htmlFor="return-loc" className="block text-zinc-300 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Drop-Off Location</span>
            </label>
            <select
              id="return-loc"
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500 min-h-[44px]"
            >
              <option value={pickupLocation}>Same as Pickup Location</option>
              <option value={BUSINESS_INFO.defaultPickupLocation}>
                {BUSINESS_INFO.defaultPickupLocation}
              </option>
              <option value={BUSINESS_INFO.airportPickupLocation}>
                {BUSINESS_INFO.airportPickupLocation}
              </option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-850">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-400 mr-1 font-semibold">Category:</span>
            {['all', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Electric'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] active:scale-[0.98] ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-black text-zinc-300 hover:text-white border border-zinc-800'
                }`}
              >
                {cat === 'all' ? 'All Vehicles' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-400">
            Showing <strong className="text-white">{availableVehicles.length}</strong> available vehicle{availableVehicles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Available Vehicles Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-400" aria-hidden="true" />
            <span>Select Vehicle for {rentalDays} Day{rentalDays > 1 ? 's' : ''}</span>
          </h2>
          <span className="text-xs text-zinc-400">
            Live prices in Sri Lankan Rupees (LKR)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableVehicles.map((v) => {
            const extraHour = v.extraHourRate || getVehicleExtraHourRate(v);
            const totalEstimated = v.dailyRate * rentalDays;
            const isAvail = v.status === 'Available';
            return (
              <div
                key={v.id}
                className="group rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image */}
                  <div className="relative h-56 w-full bg-black overflow-hidden">
                    <OptimizedImage
                      src={v.imageUrl}
                      alt={`${v.make} ${v.model} (${v.year}) in Sri Lanka`}
                      className="w-full h-full group-hover:scale-104 transition-transform duration-500"
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

                  {/* Vehicle Specs & Price Breakdown */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {v.make} {v.model}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          {v.year} · License: <span className="font-mono text-zinc-200">{v.licensePlate}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 block tabular-nums">
                          {formatLKR(v.dailyRate)}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">/day</span>
                      </div>
                    </div>

                    {/* Estimated Total for Selected Duration */}
                    <div className="p-3 rounded-2xl bg-black border border-emerald-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                          Est. Total ({rentalDays} Day{rentalDays > 1 ? 's' : ''}):
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-300 tabular-nums">
                          {formatLKR(totalEstimated)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                          Deposit:
                        </span>
                        <span className="font-mono text-xs text-zinc-200">
                          {formatLKR(v.securityDeposit)}
                        </span>
                      </div>
                    </div>

                    {/* Extra Hour Rate Badge */}
                    <div className="p-2.5 rounded-xl bg-black border border-amber-500/30 flex items-center justify-between text-xs">
                      <span className="text-zinc-300 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                        <span>Extra Hour Rate:</span>
                      </span>
                      <span className="font-mono font-bold text-amber-300 tabular-nums">
                        {formatExtraHourRate(extraHour)}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {v.features.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-black text-zinc-300 border border-zinc-800"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 border-t border-zinc-850 mt-2 flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      onSelectVehicle(v);
                      onNavigate('car-details');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-zinc-800 transition-colors cursor-pointer text-center min-h-[44px] active:scale-[0.98]"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => handleOpenBookingModal(v)}
                    disabled={!isAvail}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-center min-h-[44px] active:scale-[0.98] ${
                      isAvail
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                        : 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    {isAvail ? 'Reserve Now' : 'Reserved'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          <h3 className="font-bold text-white text-sm">60-Second Counter Handover</h3>
          <p className="text-zinc-400 leading-relaxed">
            Fast document check and digital key handover at our Sri Lanka showroom counter or airport dispatch gate.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          <h3 className="font-bold text-white text-sm">Clear Overtime Charges</h3>
          <p className="text-zinc-400 leading-relaxed">
            Transparent per-car hourly overtime rate clearly shown before you sign, avoiding surprise end-of-trip penalties.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
          <Phone className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          <h3 className="font-bold text-white text-sm">Direct Phone & WhatsApp Hotline</h3>
          <p className="text-zinc-400 leading-relaxed">
            Need custom dates or airport meet-and-greet? Call 070 582 8190 or 075 988 8895 directly.
          </p>
        </div>
      </div>

      {/* Reservation Modal */}
      {bookingVehicle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setBookingVehicle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close booking modal"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSubmitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-black text-white">Booking Confirmed!</h3>
                <div className="p-4 rounded-2xl bg-black border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Booking Reference:</span>
                  <div className="text-xl font-mono font-black text-emerald-400">
                    {confirmedBookingRef}
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Your reservation for <strong>{bookingVehicle.make} {bookingVehicle.model}</strong> ({rentalDays} Day{rentalDays > 1 ? 's' : ''}) has been registered in our counter dispatch system.
                </p>
                <div className="text-xs text-zinc-400 p-3 rounded-xl bg-black border border-zinc-800 space-y-1 text-left">
                  <p>· <strong>Pickup:</strong> {pickupLocation}</p>
                  <p>· <strong>Dates:</strong> {pickupDate} ({pickupTime}) to {returnDate} ({returnTime})</p>
                  <p>· <strong>Estimated Total:</strong> {formatLKR(bookingVehicle.dailyRate * rentalDays)} (LKR)</p>
                </div>
                <div className="pt-2 flex gap-3">
                  <a
                    href="tel:0705828190"
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl border border-zinc-800 flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Call Showroom</span>
                  </a>
                  <button
                    onClick={() => {
                      setBookingVehicle(null);
                      onNavigate('home');
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 cursor-pointer min-h-[44px]"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Confirm Reservation
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {bookingVehicle.make} {bookingVehicle.model} ({bookingVehicle.year})
                  </h3>
                  <p className="text-zinc-400 mt-1">
                    {rentalDays} Day rental · {formatLKR(bookingVehicle.dailyRate * rentalDays)} estimated total
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="cust-name" className="block text-zinc-300 font-medium mb-1">Your Full Legal Name *</label>
                    <input
                      id="cust-name"
                      type="text"
                      required
                      placeholder="e.g. Kasun Perera"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="cust-phone" className="block text-zinc-300 font-medium mb-1">Phone Number *</label>
                      <input
                        id="cust-phone"
                        type="tel"
                        required
                        placeholder="07X XXX XXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="cust-email" className="block text-zinc-300 font-medium mb-1">Email Address *</label>
                      <input
                        id="cust-email"
                        type="email"
                        required
                        placeholder="email@domain.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Payment Method Preference</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentOption('counter')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all min-h-[44px] ${
                          paymentOption === 'counter'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white'
                            : 'bg-black border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="font-bold text-white text-xs">Pay at Counter</div>
                        <div className="text-[10px] text-zinc-400">Cash or Card upon Key Handover</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentOption('card')}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all min-h-[44px] ${
                          paymentOption === 'card'
                            ? 'bg-emerald-950/40 border-emerald-500 text-white'
                            : 'bg-black border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="font-bold text-white text-xs">Online Card / Crypto</div>
                        <div className="text-[10px] text-zinc-400">Instant digital reservation hold</div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex justify-between text-zinc-300">
                    <span>Daily Rate:</span>
                    <span className="font-mono">{formatLKR(bookingVehicle.dailyRate)}/d</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Overtime Extra Hour:</span>
                    <span className="font-mono text-amber-300">
                      {formatExtraHourRate(bookingVehicle.extraHourRate || getVehicleExtraHourRate(bookingVehicle))}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-zinc-850">
                    <span>Total Estimated ({rentalDays} Days):</span>
                    <span className="font-mono text-emerald-400">{formatLKR(bookingVehicle.dailyRate * rentalDays)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98]"
                >
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Confirm Vehicle Reservation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
