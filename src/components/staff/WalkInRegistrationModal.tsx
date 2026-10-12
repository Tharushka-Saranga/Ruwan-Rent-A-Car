import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  Shield,
  Car,
  CreditCard,
  CheckCircle,
  Calendar,
  ArrowRight,
  FileText,
  AlertTriangle,
  Receipt,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { BUSINESS_INFO } from '../../data/mockData';
import { CustomerType, PaymentMethod, PaymentStatus, RentalBooking, Vehicle } from '../../types';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';
import { formatLKR, getVehicleExtraHourRate } from '../../utils/currency';

interface WalkInRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedVehicleId?: string;
}

export const WalkInRegistrationModal: React.FC<WalkInRegistrationModalProps> = ({
  isOpen,
  onClose,
  preSelectedVehicleId,
}) => {
  const {
    vehicles,
    registerWalkIn,
    setSelectedRentalForAgreement,
    setSelectedRentalForReceipt,
  } = useRental();

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmedRental, setConfirmedRental] = useState<RentalBooking | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultReturnStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('1994-06-15');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [customerType, setCustomerType] = useState<CustomerType>('Walk-In Customer');

  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-10-15');
  const [licenseCountryState, setLicenseCountryState] = useState('LK, Sri Lanka');
  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Pending Verification' | 'Requires Review'>('Verified');

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === 'Available' || v.id === preSelectedVehicleId),
    [vehicles, preSelectedVehicleId]
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preSelectedVehicleId || (availableVehicles[0]?.id ?? '')
  );

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(defaultReturnStr);
  const [returnTime, setReturnTime] = useState('18:00');
  const [pickupLocation, setPickupLocation] = useState(BUSINESS_INFO.defaultPickupLocation);
  const [returnLocation, setReturnLocation] = useState(BUSINESS_INFO.defaultPickupLocation);

  const [extraInsurance, setExtraInsurance] = useState(true);
  const [tollPass, setTollPass] = useState(true);
  const [discountAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [staffNotes] = useState('Walk-in customer at physical office. DL verified, payment cleared at counter.');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const dailyRate = currentVehicle ? currentVehicle.dailyRate : 100;
  const securityDeposit = currentVehicle ? currentVehicle.securityDeposit : 500;

  const additionalCharges = useMemo(() => {
    const list: { id: string; name: string; amount: number }[] = [];
    if (extraInsurance) {
      list.push({ id: 'chg-ins', name: 'Comprehensive Collision Damage Waiver', amount: 30 * rentalDurationDays });
    }
    if (tollPass) {
      list.push({ id: 'chg-toll', name: 'Unlimited Express Highway Toll Pass', amount: 35 });
    }
    return list;
  }, [extraInsurance, tollPass, rentalDurationDays]);

  const baseRentalCost = dailyRate * rentalDurationDays;
  const extrasTotal = additionalCharges.reduce((acc, c) => acc + c.amount, 0);
  const totalAmount = Math.max(0, baseRentalCost + extrasTotal - discountAmount);

  if (!isOpen) return null;

  const handleQuickFillDemo = () => {
    setFullName('Julian Bennett');
    setDateOfBirth('1989-08-14');
    setPhone('077 982 9931');
    setEmail('j.bennett@example.com');
    setHomeAddress('412 Pinecrest Ave, Colombo 07');
    setEmergencyContactName('Claire Bennett (Spouse)');
    setEmergencyContactPhone('077 982 9932');
    setLicenseNumber('B-984210');
    setLicenseExpiry('2028-09-20');
    setLicenseCountryState('LK, Sri Lanka');
    setVerificationStatus('Verified');
    setCustomerType('Walk-In Customer');
    if (availableVehicles.length > 0) {
      setSelectedVehicleId(availableVehicles[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Please enter customer full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter customer contact phone.');
      return;
    }
    if (!licenseNumber.trim()) {
      setErrorMsg("Please enter driver's license number.");
      return;
    }
    if (!selectedVehicleId) {
      setErrorMsg('Please select an available vehicle.');
      return;
    }

    try {
      const result = registerWalkIn({
        customer: {
          fullName,
          dateOfBirth,
          phone,
          email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}+guest@walkin-client.com`,
          homeAddress: homeAddress || 'Recorded at counter',
          emergencyContactName: emergencyContactName || 'Self',
          emergencyContactPhone: emergencyContactPhone || phone,
          licenseNumber,
          licenseExpiry,
          licenseCountryState,
          verificationStatus,
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
      setConfirmedRental(result.rental);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error registering rental');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-750 text-zinc-100 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Physical Walk-In Customer Registration</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Staff POS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Front desk counter check-in & instant vehicle assignment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BusinessHoursBadge variant="compact" />
            {step === 1 && (
              <button
                type="button"
                onClick={handleQuickFillDemo}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors min-h-[36px]"
              >
                Autofill Demo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: FORM */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 touch-scroll">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SECTION 1 */}
              <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>1. Customer Information</span>
                  </h3>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as CustomerType)}
                    className="text-xs bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1 min-h-[36px]"
                  >
                    <option value="Walk-In Customer">Walk-In Customer</option>
                    <option value="Online Customer">Online Customer</option>
                    <option value="Returning Customer">Returning Customer</option>
                    <option value="Corporate Customer">Corporate Customer</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-medium">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Sterling"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-zinc-100 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="07X XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-zinc-100 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-zinc-100 min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Shield className="w-4 h-4" />
                  <span>2. Driver Verification</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-medium">Driver's License Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="DL-XXXX-XXXX"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-zinc-100 font-mono uppercase min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">License Expiry Date</label>
                    <input
                      type="date"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-zinc-100 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Issuing Jurisdiction</label>
                    <input
                      type="text"
                      placeholder="LK, Sri Lanka"
                      value={licenseCountryState}
                      onChange={(e) => setLicenseCountryState(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-zinc-100 min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3 */}
              <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Car className="w-4 h-4" />
                  <span>3. Vehicle & Dates</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Select Available Vehicle *</label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2.5 text-zinc-100 min-h-[44px]"
                    >
                      {availableVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.make} {v.model} ({v.year}) – {formatLKR(v.dailyRate)}/day | Plate: {v.licensePlate}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Pickup Date
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-2.5 py-2 text-zinc-100 min-h-[40px]"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Return Date
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-2.5 py-2 text-zinc-100 min-h-[40px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4 */}
              <div className="bg-zinc-950/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <CreditCard className="w-4 h-4" />
                  <span>4. POS Payment & Charges</span>
                </h3>
                <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Base Vehicle Rate ({rentalDurationDays} days @ {formatLKR(dailyRate)}/d):</span>
                    <span className="font-mono text-zinc-200">{formatLKR(baseRentalCost)}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-2 flex justify-between items-center font-bold text-sm">
                    <span className="text-white">Total Rental Amount:</span>
                    <span className="text-emerald-400 font-mono text-base">{formatLKR(totalAmount, { showCode: true })}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-1">
                    <span>Refundable Deposit:</span>
                    <span className="font-mono text-zinc-300">{formatLKR(securityDeposit)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-2.5 py-2 text-zinc-100 min-h-[44px]"
                    >
                      <option value="Paid">Paid (Full)</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-2.5 py-2 text-zinc-100 min-h-[44px]"
                    >
                      <option value="Card">Card (POS Terminal)</option>
                      <option value="Cash">Cash (Physical Register)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Genie / FriMi / LankaPay">Genie / FriMi / LankaPay</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer min-h-[44px] active:scale-[0.98]"
              >
                <span>Confirm Walk-In Rental</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: CONFIRMATION */
          <div className="p-8 sm:p-12 overflow-y-auto space-y-8 flex-1 text-center touch-scroll">
            <div className="max-w-xl mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Rental Successfully Registered
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm">
                The walk-in booking has been recorded in the central fleet database and keys dispatched.
              </p>
            </div>

            {confirmedRental && (
              <div className="max-w-2xl mx-auto bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 text-left space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                      Rental Confirmation ID
                    </span>
                    <span className="text-xl font-mono font-black text-white">
                      {confirmedRental.id}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {confirmedRental.rentalStatus} · {confirmedRental.bookingType}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Customer</span>
                    <span className="font-semibold text-white">{confirmedRental.customerName}</span>
                    <span className="text-[11px] text-zinc-400 block">{confirmedRental.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Assigned Vehicle</span>
                    <span className="font-semibold text-white">{confirmedRental.vehicleName}</span>
                    <span className="text-[11px] text-zinc-400 font-mono block">Plate: {confirmedRental.vehiclePlate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Total Amount (LKR)</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">
                      {formatLKR(confirmedRental.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirmedRental) setSelectedRentalForAgreement(confirmedRental);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-bold border border-zinc-700 transition-all cursor-pointer min-h-[44px]"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Print Agreement</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmedRental) setSelectedRentalForReceipt(confirmedRental);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-bold border border-zinc-700 transition-all cursor-pointer min-h-[44px]"
              >
                <Receipt className="w-4 h-4 text-blue-400" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/40 cursor-pointer min-h-[44px]"
              >
                <span>Back to Operations</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
