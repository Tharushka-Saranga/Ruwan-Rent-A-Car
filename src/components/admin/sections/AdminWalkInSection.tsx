import React, { useState, useMemo } from 'react';
import {
  User,
  Car,
  Calendar,
  CreditCard,
  CheckCircle,
  Printer,
  ArrowRight,
  AlertTriangle,
  Receipt,
  FileText,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { useRouter } from '../../../context/RouterContext';
import { BUSINESS_INFO } from '../../../data/mockData';
import { CustomerType, PaymentMethod, PaymentStatus, RentalBooking, Vehicle } from '../../../types';
import { formatLKR, formatRawLKR, getVehicleExtraHourRate, formatExtraHourRate } from '../../../utils/currency';

export const AdminWalkInSection: React.FC = () => {
  const {
    vehicles,
    registerWalkIn,
    checkVehicleAvailability,
    setSelectedRentalForAgreement,
    setSelectedRentalForReceipt,
    setSelectedInspectionRental,
  } = useRental();
  const { navigate } = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [confirmedRental, setConfirmedRental] = useState<RentalBooking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // STEP 1 – Customer
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1994-06-15');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-10-15');
  const [licenseCountryState, setLicenseCountryState] = useState('LK, Sri Lanka');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('Walk-In Customer');

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
  const [pickupLocation] = useState(BUSINESS_INFO.defaultPickupLocation);
  const [returnLocation] = useState(BUSINESS_INFO.defaultPickupLocation);

  const availableVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const check = checkVehicleAvailability(v.id, pickupDate, returnDate);
      return check.available;
    });
  }, [vehicles, pickupDate, returnDate, checkVehicleAvailability]);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  React.useEffect(() => {
    if (!selectedVehicleId && availableVehicles.length > 0) {
      setSelectedVehicleId(availableVehicles[0].id);
    }
  }, [availableVehicles, selectedVehicleId]);

  const currentVehicle: Vehicle | undefined = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  const rentalDurationDays = useMemo(() => {
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
  const securityDeposit = currentVehicle ? currentVehicle.securityDeposit : 500;

  const [extraInsurance, setExtraInsurance] = useState(true);
  const [childSeat] = useState(false);
  const [tollPass, setTollPass] = useState(true);
  const [discountAmount] = useState<number>(0);

  const additionalCharges = useMemo(() => {
    const list: { id: string; name: string; amount: number }[] = [];
    if (extraInsurance) {
      list.push({ id: 'chg-ins', name: 'Comprehensive Damage Waiver', amount: 30 * rentalDurationDays });
    }
    if (childSeat) {
      list.push({ id: 'chg-seat', name: 'Child Safety Seat', amount: 25 });
    }
    if (tollPass) {
      list.push({ id: 'chg-toll', name: 'Unlimited Toll Pass', amount: 35 });
    }
    return list;
  }, [extraInsurance, childSeat, tollPass, rentalDurationDays]);

  const subtotal = dailyRate * rentalDurationDays;
  const extrasTotal = additionalCharges.reduce((acc, c) => acc + c.amount, 0);
  const totalAmount = Math.max(0, subtotal + extrasTotal - discountAmount);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [staffNotes] = useState('Walk-in registered at counter. License verified.');

  const handleNextStep = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!fullName.trim() || !phone.trim() || !licenseNumber.trim()) {
        setErrorMsg('Please enter customer full name, contact phone, and driver license.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedVehicleId) {
        setErrorMsg('Please select an available vehicle.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const check = checkVehicleAvailability(selectedVehicleId, pickupDate, returnDate);
      if (!check.available) {
        setErrorMsg(check.reason || 'Vehicle is not available for these dates.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      try {
        const res = registerWalkIn({
          customer: {
            fullName,
            dateOfBirth,
            phone,
            email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}+guest@ruwancarrentals.com`,
            homeAddress: address || 'Physical office walk-in',
            emergencyContactName: emergencyContactName || 'Self',
            emergencyContactPhone: emergencyContactPhone || phone,
            licenseNumber,
            licenseExpiry,
            licenseCountryState,
            verificationStatus: 'Verified',
            customerType,
            notes: staffNotes,
          },
          rental: {
            vehicleId: selectedVehicleId,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            rentalDurationDays,
            pickupLocation,
            returnLocation,
            dailyRate,
            extraHourRate: currentVehicle?.extraHourRate || (currentVehicle ? getVehicleExtraHourRate(currentVehicle) : 2500),
            securityDeposit,
            additionalCharges,
            discount: discountAmount,
            totalAmount,
            paymentStatus,
            paymentMethod,
            amountPaid: paymentStatus === 'Paid' ? totalAmount : paymentStatus === 'Partially Paid' ? Math.round(totalAmount / 2) : 0,
            staffNotes,
          },
        });
        setConfirmedRental(res.rental);
        setCurrentStep(5);
      } catch (err: any) {
        setErrorMsg(err.message || 'Error creating rental');
      }
    }
  };

  const handleDemoFill = () => {
    setFullName('Marcus Rodriguez');
    setPhone('077 123 4567');
    setEmail('m.rodriguez@example.com');
    setAddress('820 Galle Road, Colombo 03');
    setLicenseNumber('B-9842104');
    setEmergencyContactName('Elena Rodriguez (Spouse)');
    setEmergencyContactPhone('077 123 4568');
    setErrorMsg(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Front Counter POS Operation
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Register Walk-In Customer
          </h1>
          <p className="text-xs text-zinc-400">
            5-step counter check-in, live vehicle assignment, and automated agreement generation
          </p>
        </div>
        {currentStep < 5 && (
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors min-h-[40px]"
          >
            Fill Sample Customer
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-xs">
          {[
            { step: 1, label: 'Customer' },
            { step: 2, label: 'Vehicle' },
            { step: 3, label: 'Rental' },
            { step: 4, label: 'Payment' },
            { step: 5, label: 'Done' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  currentStep === item.step
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-950'
                    : currentStep > item.step
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </div>
              <span
                className={`hidden sm:inline font-semibold ${
                  currentStep === item.step ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              <span>STEP 1 – Customer Information</span>
            </h2>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value as CustomerType)}
              className="bg-zinc-950 border border-zinc-750 text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 min-h-[36px]"
            >
              <option value="Walk-In Customer">Walk-In Customer</option>
              <option value="Returning Customer">Returning Customer</option>
              <option value="Corporate Customer">Corporate Customer</option>
              <option value="Online Customer">Online Customer</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-zinc-400 mb-1 font-semibold">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Rodriguez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="07X XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-zinc-400 mb-1 font-semibold">Home Address</label>
              <input
                type="text"
                placeholder="Residential Address, City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Driver's License Number *</label>
              <input
                type="text"
                required
                placeholder="DL-XXXX-XXXX"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono uppercase min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Emergency Contact Name</label>
              <input
                type="text"
                placeholder="Relative / Next of Kin"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Emergency Contact Phone</label>
              <input
                type="tel"
                placeholder="07X XXX XXXX"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>Continue to Vehicle Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" />
                <span>STEP 2 – Select Available Vehicle</span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Only vehicles available for the requested rental period are selectable.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {availableVehicles.length} Vehicles Available
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {availableVehicles.map((v) => {
              const isSelected = selectedVehicleId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/40'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={v.imageUrl}
                    alt={v.model}
                    className="w-24 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white">{v.make} {v.model}</span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-400 block tabular-nums">{formatLKR(v.dailyRate)}/d</span>
                        <span className="text-[10px] font-mono text-amber-400 font-medium block tabular-nums">
                          +{formatExtraHourRate(v.extraHourRate || getVehicleExtraHourRate(v))}
                        </span>
                      </div>
                    </div>
                    <div className="text-zinc-400 text-[11px]">
                      Reg: <span className="font-mono text-zinc-200">{v.licensePlate}</span>
                    </div>
                    <div className="text-zinc-400 text-[11px]">
                      Class: {v.category} · {v.fuel}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-emerald-400 text-[10px] font-bold">● {v.status}</span>
                      <span className="text-zinc-500 text-[10px]">Loc: {v.officeLocation}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold min-h-[44px]"
            >
              Back to Customer
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>Continue to Dates & Cost</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>STEP 3 – Dates & Cost Breakdown</span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Vehicle assigned: <strong>{currentVehicle?.make} {currentVehicle?.model}</strong> ({formatLKR(dailyRate)}/day)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Pickup Time</label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Return Time</label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
              />
            </div>
          </div>
          <div className="space-y-2 text-xs pt-2 border-t border-zinc-800">
            <span className="text-zinc-400 font-semibold block">Optional Protection & Equipment</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={extraInsurance}
                  onChange={(e) => setExtraInsurance(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span className="text-zinc-300">Collision Damage Waiver ($30/d)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={tollPass}
                  onChange={(e) => setTollPass(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span className="text-zinc-300">Unlimited Toll Pass ($35 flat)</span>
              </label>
            </div>
          </div>
          <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Rental Duration:</span>
              <span className="font-mono text-zinc-200 font-bold">{rentalDurationDays} Days</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Daily Rate:</span>
              <span className="font-mono text-zinc-200">{formatLKR(dailyRate)}/day</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span className="font-mono text-zinc-200">{formatLKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-1 border-t border-zinc-850">
              <span>Security Deposit (Refundable):</span>
              <span className="font-mono text-zinc-200 font-bold">{formatLKR(securityDeposit)}</span>
            </div>
            <div className="flex justify-between items-center text-white font-bold text-sm pt-2 border-t border-zinc-800">
              <span>Total Charges (LKR):</span>
              <span className="font-mono text-emerald-400 text-base tabular-nums">{formatLKR(totalAmount, { showCode: true })}</span>
            </div>
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold min-h-[44px]"
            >
              Back to Vehicle
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>STEP 4 – Payment Collection & Finalize</span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Total to collect: <strong className="text-emerald-400 font-mono">{formatLKR(totalAmount)}</strong> + {formatLKR(securityDeposit)} deposit hold
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-medium min-h-[44px]"
              >
                <option value="Cash">Cash (Physical Counter Register)</option>
                <option value="Card">Card (POS Counter Terminal)</option>
                <option value="Credit/Debit Card (Visa/Mastercard)">Credit/Debit Card Online</option>
                <option value="Genie / FriMi / LankaPay">Genie / FriMi / LankaPay</option>
                <option value="Bank Transfer">Bank Transfer (BOC / Commercial)</option>
                <option value="Crypto (USDT / BTC / ETH)">Crypto (USDT / BTC / ETH)</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-semibold">Payment Status *</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-semibold min-h-[44px]"
              >
                <option value="Paid">Paid (Full Amount)</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold min-h-[44px]"
            >
              Back to Rental Details
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>Confirm & Issue Rental</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 */}
      {currentStep === 5 && confirmedRental && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Rental Successfully Created
            </h2>
            <p className="text-xs text-zinc-400">
              The contract is active and the vehicle has been marked Rented in central fleet inventory.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedRentalForAgreement(confirmedRental)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs border border-zinc-700 cursor-pointer min-h-[44px]"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Print Agreement</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRentalForReceipt(confirmedRental)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs border border-zinc-700 cursor-pointer min-h-[44px]"
            >
              <Receipt className="w-4 h-4 text-blue-400" />
              <span>Print Receipt</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedInspectionRental(confirmedRental)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs border border-zinc-700 cursor-pointer min-h-[44px]"
            >
              <Printer className="w-4 h-4 text-purple-400" />
              <span>Inspection Form</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/staff/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer min-h-[44px] active:scale-[0.98]"
            >
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
