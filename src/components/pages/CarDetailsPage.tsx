import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Receipt,
  ArrowLeft,
  CreditCard,
  Lock,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { BUSINESS_INFO } from '../../data/mockData';
import { PaymentMethod, PublicPage, RentalBooking, Vehicle } from '../../types';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';
import {
  formatLKR,
  getVehicleExtraHourRate,
  formatExtraHourRate,
} from '../../utils/currency';
import { OptimizedImage } from '../common/OptimizedImage';

interface CarDetailsPageProps {
  vehicle: Vehicle | null;
  onNavigate: (page: PublicPage) => void;
  onOpenStaffPortal: () => void;
}

export const CarDetailsPage: React.FC<CarDetailsPageProps> = ({
  vehicle,
  onNavigate,
}) => {
  const {
    vehicles,
    createOnlineBooking,
    setSelectedRentalForAgreement,
    setSelectedRentalForReceipt,
  } = useRental();

  const currentVehicle = vehicle || vehicles.find((v) => v.status === 'Available') || vehicles[0];

  const vehicleImages = useMemo(() => {
    if (currentVehicle?.images && currentVehicle.images.length > 0) {
      return currentVehicle.images;
    }
    return currentVehicle ? [currentVehicle.imageUrl] : [];
  }, [currentVehicle]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentDisplayImage = vehicleImages[activeImageIndex] || currentVehicle?.imageUrl || '';

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultReturnStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(defaultReturnStr);
  const [returnTime, setReturnTime] = useState('18:00');
  const [pickupLocation, setPickupLocation] = useState(BUSINESS_INFO.defaultPickupLocation);

  const [insuranceSelected, setInsuranceSelected] = useState(true);
  const [childSeatSelected, setChildSeatSelected] = useState(false);
  const [tollSelected, setTollSelected] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit/Debit Card (Visa/Mastercard)');
  const [cryptoCoin, setCryptoCoin] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');

  const [confirmedBooking, setConfirmedBooking] = useState<RentalBooking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const durationDays = useMemo(() => {
    try {
      const p = new Date(`${pickupDate}T${pickupTime || '00:00'}`);
      const r = new Date(`${returnDate}T${returnTime || '00:00'}`);
      const diffMs = r.getTime() - p.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  const dailyRate = currentVehicle ? currentVehicle.dailyRate : 120;
  const deposit = currentVehicle ? currentVehicle.securityDeposit : 500;

  const additionalCharges = useMemo(() => {
    const list: { id: string; name: string; amount: number }[] = [];
    if (insuranceSelected) {
      list.push({ id: 'chg-ins', name: 'Collision Damage Waiver', amount: 30 * durationDays });
    }
    if (childSeatSelected) {
      list.push({ id: 'chg-seat', name: 'Booster / Child Seat', amount: 25 });
    }
    if (tollSelected) {
      list.push({ id: 'chg-toll', name: 'Unlimited Highway Toll Pass', amount: 35 });
    }
    return list;
  }, [insuranceSelected, childSeatSelected, tollSelected, durationDays]);

  const baseRentalCost = dailyRate * durationDays;
  const extrasTotal = additionalCharges.reduce((acc, c) => acc + c.amount, 0);
  const totalAmount = baseRentalCost + extrasTotal;

  if (!currentVehicle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-zinc-400">No vehicle selected.</p>
        <button
          onClick={() => onNavigate('find-car')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Fleet List
        </button>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (currentVehicle.status !== 'Available') {
      setErrorMsg(
        `This vehicle is currently ${currentVehicle.status}. You may reserve another available vehicle or visit our physical office for alternatives.`
      );
      return;
    }
    if (!fullName.trim() || !phone.trim() || !email.trim() || !licenseNumber.trim()) {
      setErrorMsg('Please complete all contact and driver license fields.');
      return;
    }

    try {
      const booking = createOnlineBooking({
        customer: {
          fullName,
          phone,
          email,
          licenseNumber,
          homeAddress: 'Entered via online checkout',
        },
        vehicleId: currentVehicle.id,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        durationDays,
        pickupLocation,
        returnLocation: pickupLocation,
        additionalCharges,
        paymentMethod,
      });
      setConfirmedBooking(booking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error completing reservation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-28 lg:pb-12 space-y-8 font-sans">
      {/* Top Header Breadcrumb & Business Hours */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4 sm:p-5 rounded-3xl shadow-xl">
        <button
          onClick={() => onNavigate('find-car')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Fleet Directory</span>
        </button>
        <div className="w-full md:w-auto">
          <BusinessHoursBadge variant="compact" />
        </div>
      </div>

      {/* CONFIRMATION SCREEN */}
      {confirmedBooking ? (
        <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Rental Successfully Registered
            </h2>
            <p className="text-xs text-zinc-400">
              Your online booking has been automatically synchronized with our physical office counter.
            </p>
          </div>

          <div className="bg-black border border-zinc-800 rounded-2xl p-6 text-left space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Rental Confirmation ID</span>
                <span className="text-lg font-mono font-bold text-white">{confirmedBooking.id}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[11px]">
                {confirmedBooking.paymentStatus} · Online Booking
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-zinc-500 block">Customer Name</span>
                <span className="font-bold text-white text-sm">{confirmedBooking.customerName}</span>
                <span className="text-zinc-400 block">{confirmedBooking.customerPhone}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Reserved Vehicle</span>
                <span className="font-bold text-white text-sm">{confirmedBooking.vehicleName}</span>
                <span className="text-zinc-400 font-mono block">Plate: {confirmedBooking.vehiclePlate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Pickup & Return</span>
                <span className="text-zinc-200">
                  {confirmedBooking.pickupDate} ({confirmedBooking.pickupTime})
                </span>
                <span className="text-zinc-400 block">
                  To: {confirmedBooking.returnDate} ({confirmedBooking.returnTime})
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block">Total Charged (LKR)</span>
                <span className="font-mono font-bold text-emerald-400 text-base tabular-nums">
                  {formatLKR(confirmedBooking.totalAmount, { showCode: true })}
                </span>
                <span className="text-[11px] text-zinc-500 block">Deposit: {formatLKR(confirmedBooking.securityDeposit)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-2">
              <div>
                <strong>Pickup Instructions:</strong> Visit our physical counter at <strong>{BUSINESS_INFO.defaultPickupLocation}</strong> during open hours (<strong>7:00 AM – 9:00 PM</strong>) with your valid driver license.
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800 text-xs">
                <span className="text-zinc-400">Need instant assistance?</span>
                <a href="tel:0705828190" className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 070 582 8190
                </a>
                <span className="text-zinc-600">/</span>
                <a href="tel:0759888895" className="text-emerald-400 font-mono font-bold hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 075 988 8895
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSelectedRentalForAgreement(confirmedBooking)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 transition-colors cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Print Agreement</span>
            </button>
            <button
              onClick={() => setSelectedRentalForReceipt(confirmedBooking)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 transition-colors cursor-pointer min-h-[44px]"
            >
              <Receipt className="w-4 h-4 text-blue-400" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        /* VEHICLE DETAIL & BOOKING CHECKOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photos & Technical Specs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden bg-black border border-zinc-800 h-80 sm:h-96 shadow-2xl">
                <OptimizedImage
                  src={currentDisplayImage}
                  alt={`${currentVehicle.make} ${currentVehicle.model}`}
                  priority={true}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${
                      currentVehicle.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-zinc-900/80 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {currentVehicle.status === 'Available' ? 'Available for Immediate Rent' : currentVehicle.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-200">
                  Plate: {currentVehicle.licensePlate} · Model Year {currentVehicle.year}
                </div>
              </div>

              {/* Gallery thumbnails */}
              {vehicleImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 px-1 touch-scroll">
                  {vehicleImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative w-24 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer min-h-[44px] ${
                        activeImageIndex === i
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <OptimizedImage src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Specifications */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {currentVehicle.make} {currentVehicle.model}
                  </h1>
                  <p className="text-xs text-zinc-400 mt-1">
                    {currentVehicle.category} Class · {currentVehicle.fuel} · {currentVehicle.transmission}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">
                    {formatLKR(currentVehicle.dailyRate)}
                  </span>
                  <span className="text-xs text-zinc-500 block">/day (LKR)</span>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Extra: {formatExtraHourRate(currentVehicle.extraHourRate || getVehicleExtraHourRate(currentVehicle))}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {currentVehicle.description}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-zinc-850 text-xs">
                <div className="p-3 rounded-xl bg-black border border-zinc-850">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Passenger Seats</span>
                  <span className="font-bold text-white text-sm">{currentVehicle.seats} Persons</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-zinc-850">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Luggage</span>
                  <span className="font-bold text-white text-sm">{currentVehicle.luggage} Bags</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-zinc-850">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Transmission</span>
                  <span className="font-bold text-white text-sm">{currentVehicle.transmission}</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-amber-500/30">
                  <span className="text-amber-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Extra Hour Rate
                  </span>
                  <span className="font-bold text-amber-300 font-mono text-sm">
                    {formatExtraHourRate(currentVehicle.extraHourRate || getVehicleExtraHourRate(currentVehicle))}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-zinc-850">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold block">Security Deposit</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{formatLKR(currentVehicle.securityDeposit)}</span>
                </div>
              </div>

              {/* Features list */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-zinc-400 block mb-2">Included Amenities:</span>
                <div className="flex flex-wrap gap-2">
                  {currentVehicle.features.map((f, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 text-zinc-300 text-xs font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Office Location & Support Card */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Physical Office Counter Pickup</span>
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Prefer not to wait? This vehicle is ready at our main showroom (<strong>7:00 AM – 9:00 PM Daily</strong>). Our desk staff will verify your physical driver license and hand over the keys in 60 seconds.
              </p>
              <div className="p-3 rounded-xl bg-black border border-zinc-850">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Office Location</span>
                <a
                  href="https://goo.gl/maps/yz3jrh4wQmJaijjn6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] underline break-all block"
                >
                  https://goo.gl/maps/yz3jrh4wQmJaijjn6
                </a>
              </div>

              <div className="pt-2 border-t border-zinc-850 space-y-2">
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                  Questions? Call or WhatsApp
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Phone Line 1</span>
                      <a href="tel:0705828190" className="font-mono font-bold text-white text-xs hover:text-emerald-400">
                        070 582 8190
                      </a>
                    </div>
                    <div className="flex gap-1.5">
                      <a href="tel:0705828190" className="p-2 rounded-lg bg-zinc-800 text-zinc-200 min-h-[40px] min-w-[40px] flex items-center justify-center" title="Call">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                      <a href="https://wa.me/94705828190" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-emerald-950 text-emerald-300 min-h-[40px] min-w-[40px] flex items-center justify-center" title="WhatsApp">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Phone Line 2</span>
                      <a href="tel:0759888895" className="font-mono font-bold text-white text-xs hover:text-emerald-400">
                        075 988 8895
                      </a>
                    </div>
                    <div className="flex gap-1.5">
                      <a href="tel:0759888895" className="p-2 rounded-lg bg-zinc-800 text-zinc-200 min-h-[40px] min-w-[40px] flex items-center justify-center" title="Call">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      </a>
                      <a href="https://wa.me/94759888895" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-emerald-950 text-emerald-300 min-h-[40px] min-w-[40px] flex items-center justify-center" title="WhatsApp">
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Checkout Engine */}
          <div id="booking-form-container" className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 sm:p-7 rounded-3xl shadow-2xl space-y-6">
            <div className="border-b border-zinc-850 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Reserve Online
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Calculate & Instant Book
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Synced with our counter terminal. Locks car for your dates.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              {/* Dates & Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pick-date-input" className="block text-zinc-400 mb-1 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Pickup Date
                  </label>
                  <input
                    id="pick-date-input"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="pick-time-input" className="block text-zinc-400 mb-1 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Pickup Time
                  </label>
                  <input
                    id="pick-time-input"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="ret-date-input" className="block text-zinc-400 mb-1 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Return Date
                  </label>
                  <input
                    id="ret-date-input"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
                <div>
                  <label htmlFor="ret-time-input" className="block text-zinc-400 mb-1 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Return Time
                  </label>
                  <input
                    id="ret-time-input"
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label htmlFor="loc-select" className="block text-zinc-400 mb-1 font-medium">Pickup & Return Location</label>
                <select
                  id="loc-select"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-200 min-h-[44px]"
                >
                  <option value={BUSINESS_INFO.defaultPickupLocation}>
                    {BUSINESS_INFO.defaultPickupLocation} (Showroom)
                  </option>
                  <option value={BUSINESS_INFO.airportPickupLocation}>
                    {BUSINESS_INFO.airportPickupLocation}
                  </option>
                </select>
              </div>

              {/* Protection & Extras */}
              <div className="space-y-2 pt-2 border-t border-zinc-850">
                <span className="block text-zinc-400 font-medium">Rental Protection & Extras</span>
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-800 cursor-pointer min-h-[44px]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={insuranceSelected}
                        onChange={(e) => setInsuranceSelected(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                      />
                      <span className="text-zinc-200">Zero-Excess Insurance ($30/d)</span>
                    </div>
                    <span className="font-mono text-zinc-400">{formatLKR(30 * durationDays)}</span>
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-800 cursor-pointer min-h-[44px]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tollSelected}
                        onChange={(e) => setTollSelected(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                      />
                      <span className="text-zinc-200">Unlimited Expressway Toll Pass</span>
                    </div>
                    <span className="font-mono text-zinc-400">{formatLKR(35)}</span>
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-800 cursor-pointer min-h-[44px]">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={childSeatSelected}
                        onChange={(e) => setChildSeatSelected(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-0"
                      />
                      <span className="text-zinc-200">Child Booster Seat</span>
                    </div>
                    <span className="font-mono text-zinc-400">{formatLKR(25)}</span>
                  </label>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 pt-2 border-t border-zinc-850">
                <span className="block text-zinc-400 font-medium">Customer Information</span>
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Driver's License / NIC Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono uppercase min-h-[44px]"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2 border-t border-zinc-850">
                <label className="text-zinc-400 font-medium block">Select Payment Method (Sri Lanka)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Credit/Debit Card (Visa/Mastercard)')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[50px] ${
                      paymentMethod === 'Credit/Debit Card (Visa/Mastercard)'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Card Payment
                    </span>
                    <span className="text-[10px] text-zinc-400">Visa, Mastercard, AMEX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Crypto (USDT / BTC / ETH)')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[50px] ${
                      paymentMethod === 'Crypto (USDT / BTC / ETH)'
                        ? 'bg-amber-950/40 border-amber-500 text-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-xs text-white">Crypto Payment</span>
                    <span className="text-[10px] text-zinc-400">Web3 USDT / BTC / ETH</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Genie / FriMi / LankaPay')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[50px] ${
                      paymentMethod === 'Genie / FriMi / LankaPay'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-xs text-white">Genie / FriMi / LankaPay</span>
                    <span className="text-[10px] text-zinc-400">Local LankaQR transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer min-h-[50px] ${
                      paymentMethod === 'Bank Transfer'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold text-xs text-white">Bank Deposit</span>
                    <span className="text-[10px] text-zinc-400">Commercial / BOC</span>
                  </button>
                </div>
                {paymentMethod === 'Crypto (USDT / BTC / ETH)' && (
                  <div className="p-3 bg-black rounded-xl border border-amber-900/40 space-y-2 mt-2">
                    <span className="text-[11px] text-amber-300 font-semibold block">Select Crypto Asset:</span>
                    <div className="flex gap-2">
                      {(['USDT', 'BTC', 'ETH'] as const).map((coin) => (
                        <button
                          key={coin}
                          type="button"
                          onClick={() => setCryptoCoin(coin)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                            cryptoCoin === coin
                              ? 'bg-amber-500 text-black'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {coin}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Calculation in Sri Lankan Rupees */}
              <div className="p-3.5 bg-black rounded-2xl border border-zinc-800 space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Base Rate ({durationDays} days @ {formatLKR(dailyRate)}/d):</span>
                  <span className="font-mono text-zinc-200">{formatLKR(baseRentalCost)}</span>
                </div>
                {additionalCharges.map((c) => (
                  <div key={c.id} className="flex justify-between text-zinc-400">
                    <span>{c.name}:</span>
                    <span className="font-mono text-zinc-200">+{formatLKR(c.amount)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-zinc-850 flex justify-between font-bold text-sm">
                  <span className="text-white">Estimated Total (LKR):</span>
                  <span className="font-mono text-emerald-400 text-base tabular-nums">{formatLKR(totalAmount, { showCode: true })}</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Refundable Deposit (Held on arrival):</span>
                  <span className="font-mono text-zinc-400">{formatLKR(deposit)}</span>
                </div>
                <div className="mt-2 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-amber-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Overtime Extra Hour Rate:</span>
                    </span>
                    <span className="font-mono font-bold tabular-nums">
                      {formatExtraHourRate(currentVehicle.extraHourRate || getVehicleExtraHourRate(currentVehicle))}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={currentVehicle.status !== 'Available'}
                className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98] ${
                  currentVehicle.status === 'Available'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {currentVehicle.status === 'Available'
                    ? 'Confirm Online Reservation'
                    : 'Vehicle Currently Reserved'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky Booking Bar */}
      {!confirmedBooking && currentVehicle && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 px-4 py-3 shadow-2xl flex items-center justify-between gap-3 safe-bottom">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider truncate max-w-[140px]">
              {currentVehicle.make} {currentVehicle.model}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-bold text-emerald-400 text-base tabular-nums">
                {formatLKR(dailyRate)}
              </span>
              <span className="text-[10px] text-zinc-400">/day</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:0705828190"
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Call Hotline at 070 582 8190"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => {
                document.getElementById('booking-form-container')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 min-h-[44px] flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Online</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
