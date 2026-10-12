export type VehicleCategory = 'Sedan' | 'SUV' | 'Luxury' | 'Sports' | 'Electric' | 'Van';
export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Gasoline' | 'Electric' | 'Hybrid' | 'Diesel';

export type VehicleStatus =
  | 'Available'
  | 'Reserved'
  | 'Rented'
  | 'Returning Today'
  | 'Maintenance'
  | 'Pending Inspection'
  | 'Unavailable';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: TransmissionType;
  fuel: FuelType;
  seats: number;
  luggage: number;
  dailyRate: number;
  extraHourRate?: number; // Extra Hour Charges in Sri Lankan Rupees (LKR / Rs.)
  securityDeposit: number;
  licensePlate: string;
  vinPlaceholder: string;
  color: string;
  mileage: number;
  status: VehicleStatus;
  imageUrl: string;
  images?: string[]; // Multiple car images support
  features: string[];
  ownerId?: string;
  ownerName?: string;
  officeLocation: string;
  description: string;
}

export type CustomerType =
  | 'Walk-In Customer'
  | 'Online Customer'
  | 'Returning Customer'
  | 'Corporate Customer';

export type DriverVerificationStatus = 'Verified' | 'Pending Verification' | 'Requires Review';

export interface Customer {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  homeAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseCountryState: string;
  verificationStatus: DriverVerificationStatus;
  customerType: CustomerType;
  notes?: string;
  createdAt: string;
}

export type BookingType = 'Online' | 'Walk-In' | 'Phone';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded';
export type PaymentMethod =
  | 'Cash'
  | 'Card'
  | 'Credit/Debit Card (Visa/Mastercard)'
  | 'Crypto (USDT / BTC / ETH)'
  | 'Bank Transfer'
  | 'Online Payment'
  | 'Genie / FriMi / LankaPay'
  | 'Other';

export type RentalStatus = 'Reserved' | 'Active' | 'Completed' | 'Cancelled';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';

export interface AdditionalCharge {
  id: string;
  name: string;
  amount: number;
}

export interface RentalBooking {
  id: string; // e.g., 'APX-2026-1042'
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerType: CustomerType;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  bookingType: BookingType;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  rentalDurationDays: number;
  pickupLocation: string;
  returnLocation: string;
  dailyRate: number;
  securityDeposit: number;
  additionalCharges: AdditionalCharge[];
  discount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  rentalStatus: RentalStatus;
  bookingStatus?: BookingStatus;
  staffNotes: string;
  // Return inspection data
  actualReturnDateTime?: string;
  returnMileage?: number;
  chargeableExtraHours?: number; // Number of chargeable extra hours
  extraHourRate?: number; // Extra hour rate applied (in LKR)
  extraHourTotal?: number; // extraHourRate * chargeableExtraHours
  extraChargesAmount?: number;
  depositRefundStatus?: 'Pending' | 'Refunded Full' | 'Partially Retained' | 'Retained';
  createdAt: string;
}

export interface VehicleOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  verificationStatus: 'Verified' | 'Pending Review' | 'Flagged';
  registeredVehicles: number;
  totalEarnings: number;
  monthlyRevenue: number;
  commissionRatePercent: number;
  payoutStatus: 'Paid' | 'Processing' | 'Scheduled';
  joinedDate: string;
}

export type StaffRole = 'ADMIN' | 'STAFF';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  phone: string;
  badgeId: string;
  avatarUrl?: string;
}

export interface PaymentRecord {
  id: string;
  customerId: string;
  customerName: string;
  rentalId: string;
  vehicleId: string;
  vehicleName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: 'Rental Payment' | 'Security Deposit' | 'Additional Charge' | 'Refund';
  paymentStatus: PaymentStatus;
  date: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  maintenanceType: string;
  date: string;
  mileage: number;
  cost: number;
  description: string;
  nextServiceDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface InspectionRecord {
  id: string;
  rentalId: string;
  vehicleId: string;
  vehicleName: string;
  vehiclePlate: string;
  customerName: string;
  inspectionType: 'Pre-Rental Departure' | 'Post-Return Check';
  date: string;
  odometer: number;
  fuelLevel: string;
  exteriorCondition: string;
  interiorCleanliness: 'Pristine' | 'Clean' | 'Moderate' | 'Excessive Soil';
  passed: boolean;
  inspectorName: string;
  notes?: string;
  createdAt: string;
}

export interface AdminSettings {
  businessName: string;
  phone: string;
  phone1?: string;
  phone2?: string;
  email: string;
  address: string;
  openingTime: string;
  closingTime: string;
  currency: string;
  timezone: string;
  defaultSecurityDeposit: number;
  lateFeePerHour: number;
  autoCancelPendingHours: number;
  notifyEmail: boolean;
  notifySms: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'return' | 'maintenance' | 'system';
  time: string;
  read: boolean;
  linkRoute?: StaffRoute;
}

export type PublicPage =
  | 'home'
  | 'find-car'
  | 'car-details'
  | 'book-a-car'
  | 'list-your-car'
  | 'owner-dashboard'
  | 'about'
  | 'contact';

export type StaffTab =
  | 'overview'
  | 'rentals'
  | 'vehicles'
  | 'availability-board'
  | 'customers'
  | 'owners'
  | StaffRoute;

export type StaffRoute =
  | 'dashboard'
  | 'customers'
  | 'vehicles'
  | 'bookings'
  | 'rentals'
  | 'walk-in'
  | 'owners'
  | 'payments'
  | 'calendar'
  | 'maintenance'
  | 'reports'
  | 'staff-management'
  | 'staff'
  | 'settings';
