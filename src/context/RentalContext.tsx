import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CUSTOMERS,
  INITIAL_MAINTENANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_OWNERS,
  INITIAL_PAYMENTS,
  INITIAL_RENTALS,
  INITIAL_SETTINGS,
  INITIAL_STAFF_USERS,
  INITIAL_VEHICLES,
} from '../data/mockData';
import {
  AdminSettings,
  Customer,
  CustomerType,
  InspectionRecord,
  MaintenanceRecord,
  NotificationItem,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  RentalBooking,
  RentalStatus,
  StaffUser,
  Vehicle,
  VehicleOwner,
  VehicleStatus,
} from '../types';
import { authService } from '../services/authService';
import { getVehicleExtraHourRate } from '../utils/currency';

interface WalkInRegistrationPayload {
  customer: {
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
    verificationStatus: 'Verified' | 'Pending Verification' | 'Requires Review';
    customerType: CustomerType;
    notes?: string;
  };
  rental: {
    vehicleId: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    rentalDurationDays: number;
    pickupLocation: string;
    returnLocation: string;
    dailyRate: number;
    extraHourRate?: number;
    securityDeposit: number;
    additionalCharges: { id: string; name: string; amount: number }[];
    discount: number;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    staffNotes?: string;
  };
}

interface OnlineBookingPayload {
  customer: {
    fullName: string;
    phone: string;
    email: string;
    licenseNumber: string;
    homeAddress?: string;
  };
  vehicleId: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  durationDays: number;
  pickupLocation: string;
  returnLocation: string;
  additionalCharges: { id: string; name: string; amount: number }[];
  paymentMethod: PaymentMethod;
}

interface ReturnVehiclePayload {
  actualReturnDateTime: string;
  returnMileage: number;
  chargeableExtraHours?: number;
  extraHourRate?: number;
  extraHourTotal?: number;
  extraChargesAmount: number;
  depositRefundStatus: 'Pending' | 'Refunded Full' | 'Partially Retained' | 'Retained';
  staffNotes?: string;
  markAvailableImmediately: boolean;
  damageNotes?: string;
}

interface RentalContextType {
  vehicles: Vehicle[];
  customers: Customer[];
  rentals: RentalBooking[];
  owners: VehicleOwner[];
  staffList: StaffUser[];
  payments: PaymentRecord[];
  maintenance: MaintenanceRecord[];
  inspections: InspectionRecord[];
  settings: AdminSettings;
  notifications: NotificationItem[];
  currentStaff: StaffUser | null;
  // Auth
  loginStaff: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutStaff: () => void;
  // Availability check
  checkVehicleAvailability: (
    vehicleId: string,
    pickupDate: string,
    returnDate: string,
    excludeRentalId?: string
  ) => { available: boolean; reason?: string };
  // Operations
  registerWalkIn: (payload: WalkInRegistrationPayload) => { rental: RentalBooking; customer: Customer };
  createOnlineBooking: (payload: OnlineBookingPayload) => RentalBooking;
  updateRentalStatus: (rentalId: string, status: RentalStatus) => void;
  extendRental: (rentalId: string, additionalDays: number) => void;
  cancelRental: (rentalId: string, reason?: string) => void;
  completeReturn: (rentalId: string, payload: ReturnVehiclePayload) => void;
  // Payments
  recordPaymentEntry: (entry: Omit<PaymentRecord, 'id'>) => PaymentRecord;
  // Vehicles
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  addConsignmentVehicle: (vehicleData: Partial<Vehicle>, ownerInfo: { name: string; email: string; phone: string }) => Vehicle;
  // Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  // Owners
  addOwner: (owner: Omit<VehicleOwner, 'id' | 'joinedDate'>) => VehicleOwner;
  updateOwner: (id: string, updates: Partial<VehicleOwner>) => void;
  // Maintenance
  addMaintenanceRecord: (m: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => MaintenanceRecord;
  updateMaintenanceStatus: (id: string, status: 'Scheduled' | 'In Progress' | 'Completed') => void;
  // Settings & Notifications
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  markNotificationRead: (id: string) => void;
  // Staff mode & authentication aliases
  isStaffMode: boolean;
  setIsStaffMode: (val: boolean) => void;
  staffUser: StaffUser | null;
  recordPayment: (rentalId: string, amount: number, paymentMethod: PaymentMethod, paymentStatus: PaymentStatus) => void;
  // Active modals
  selectedRentalForAgreement: RentalBooking | null;
  setSelectedRentalForAgreement: (rental: RentalBooking | null) => void;
  selectedRentalForReceipt: RentalBooking | null;
  setSelectedRentalForReceipt: (rental: RentalBooking | null) => void;
  selectedInspectionRental: RentalBooking | null;
  setSelectedInspectionRental: (rental: RentalBooking | null) => void;
  selectedCustomerModal: Customer | null;
  setSelectedCustomerModal: (customer: Customer | null) => void;
  resetToDemoData: () => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VEHICLES: 'ruwan_vehicles_v4',
  CUSTOMERS: 'ruwan_customers_v3',
  RENTALS: 'ruwan_rentals_v3',
  OWNERS: 'ruwan_owners_v3',
  STAFF_USERS: 'ruwan_staff_users_v3',
  PAYMENTS: 'ruwan_payments_v3',
  MAINTENANCE: 'ruwan_maintenance_v3',
  SETTINGS: 'ruwan_settings_v3',
  NOTIFICATIONS: 'ruwan_notifications_v3',
};

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES) || localStorage.getItem('ruwan_vehicles_v3');
      if (saved) {
        const parsed: Vehicle[] = JSON.parse(saved);
        return parsed.map((v) => {
          if (v.id === 'veh-001' && v.imageUrl?.includes('unsplash.com/photo-1614162692292-7ac56d7f7f1e')) {
            const updatedImgs = [
              'https://res.cloudinary.com/x0wfgiln/image/upload/v1791707856/Gemini_Generated_Image.jpg',
              ...(v.images || []).slice(1),
            ];
            return {
              ...v,
              imageUrl: 'https://res.cloudinary.com/x0wfgiln/image/upload/v1791707856/Gemini_Generated_Image.jpg',
              images: updatedImgs,
              extraHourRate: v.extraHourRate || getVehicleExtraHourRate(v),
            };
          }
          return {
            ...v,
            extraHourRate: v.extraHourRate || getVehicleExtraHourRate(v),
            images: v.images && v.images.length > 0 ? v.images : [v.imageUrl],
          };
        });
      }
      return INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [rentals, setRentals] = useState<RentalBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RENTALS);
      return saved ? JSON.parse(saved) : INITIAL_RENTALS;
    } catch {
      return INITIAL_RENTALS;
    }
  });

  const [owners, setOwners] = useState<VehicleOwner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OWNERS);
      return saved ? JSON.parse(saved) : INITIAL_OWNERS;
    } catch {
      return INITIAL_OWNERS;
    }
  });

  const [staffList, setStaffList] = useState<StaffUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF_USERS);
      return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
    } catch {
      return INITIAL_STAFF_USERS;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
    } catch {
      return INITIAL_PAYMENTS;
    }
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
    } catch {
      return INITIAL_MAINTENANCE;
    }
  });

  const [inspections] = useState<InspectionRecord[]>([]);

  const [settings, setSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_SETTINGS,
          ...parsed,
          phone1: parsed.phone1 || '0705828190',
          phone2: parsed.phone2 || '0759888895',
          email: parsed.email || 'tharushkasaranga123@gmail.com',
          phone: parsed.phone || '070 582 8190 / 075 988 8895',
          address: parsed.address || 'https://goo.gl/maps/yz3jrh4wQmJaijjn6',
        };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(() => {
    const session = authService.getCurrentSession();
    return session ? session.user : null;
  });

  const [isStaffMode, setIsStaffMode] = useState<boolean>(false);

  // Modals
  const [selectedRentalForAgreement, setSelectedRentalForAgreement] = useState<RentalBooking | null>(null);
  const [selectedRentalForReceipt, setSelectedRentalForReceipt] = useState<RentalBooking | null>(null);
  const [selectedInspectionRental, setSelectedInspectionRental] = useState<RentalBooking | null>(null);
  const [selectedCustomerModal, setSelectedCustomerModal] = useState<Customer | null>(null);

  // Persistence effects
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles)); } catch {}
  }, [vehicles]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers)); } catch {}
  }, [customers]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.RENTALS, JSON.stringify(rentals)); } catch {}
  }, [rentals]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.OWNERS, JSON.stringify(owners)); } catch {}
  }, [owners]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.STAFF_USERS, JSON.stringify(staffList)); } catch {}
  }, [staffList]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); } catch {}
  }, [payments]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenance)); } catch {}
  }, [maintenance]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  // Auth methods
  const loginStaff = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    if (res.success && res.user) {
      setCurrentStaff(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logoutStaff = () => {
    authService.logout();
    setCurrentStaff(null);
  };

  // CHECK VEHICLE AVAILABILITY & DOUBLE-BOOKING PREVENTION
  const checkVehicleAvailability = (
    vehicleId: string,
    pickupDate: string,
    returnDate: string,
    excludeRentalId?: string
  ): { available: boolean; reason?: string } => {
    const targetVeh = vehicles.find((v) => v.id === vehicleId);
    if (!targetVeh) {
      return { available: false, reason: 'Vehicle does not exist in fleet inventory.' };
    }
    if (targetVeh.status === 'Maintenance') {
      return { available: false, reason: 'Vehicle is currently scheduled for maintenance/repairs.' };
    }
    if (targetVeh.status === 'Unavailable') {
      return { available: false, reason: 'Vehicle is marked unavailable by fleet management.' };
    }

    const hasActiveMaint = maintenance.some(
      (m) => m.vehicleId === vehicleId && (m.status === 'Scheduled' || m.status === 'In Progress')
    );
    if (hasActiveMaint) {
      return { available: false, reason: 'Vehicle has active maintenance work logged.' };
    }

    const reqStart = new Date(pickupDate).getTime();
    const reqEnd = new Date(returnDate).getTime();

    const conflictingBooking = rentals.find((r) => {
      if (r.id === excludeRentalId) return false;
      if (r.vehicleId !== vehicleId) return false;
      if (r.rentalStatus === 'Cancelled' || r.rentalStatus === 'Completed') return false;
      const bookStart = new Date(r.pickupDate).getTime();
      const bookEnd = new Date(r.returnDate).getTime();
      return reqStart <= bookEnd && reqEnd >= bookStart;
    });

    if (conflictingBooking) {
      return {
        available: false,
        reason: `Reserved by Booking ${conflictingBooking.id} (${conflictingBooking.pickupDate} to ${conflictingBooking.returnDate}).`,
      };
    }

    return { available: true };
  };

  const resetToDemoData = () => {
    setVehicles(INITIAL_VEHICLES);
    setCustomers(INITIAL_CUSTOMERS);
    setRentals(INITIAL_RENTALS);
    setOwners(INITIAL_OWNERS);
    setStaffList(INITIAL_STAFF_USERS);
    setPayments(INITIAL_PAYMENTS);
    setMaintenance(INITIAL_MAINTENANCE);
    setSettings(INITIAL_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    authService.logout();
    setCurrentStaff(null);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  };

  const registerWalkIn = (payload: WalkInRegistrationPayload) => {
    const customerId = `CUST-${Math.floor(8000 + Math.random() * 1900)}`;
    const newCustomer: Customer = {
      id: customerId,
      ...payload.customer,
      createdAt: new Date().toISOString(),
    };

    const targetVehicle = vehicles.find((v) => v.id === payload.rental.vehicleId);
    const vehicleName = targetVehicle ? `${targetVehicle.make} ${targetVehicle.model}` : 'Vehicle Reserved';
    const vehiclePlate = targetVehicle?.licensePlate || 'N/A';
    const vehicleCat = targetVehicle?.category || 'Sedan';
    const rentalId = `RCR-2026-${Math.floor(2000 + Math.random() * 8000)}`;

    const newRental: RentalBooking = {
      id: rentalId,
      customerId,
      customerName: payload.customer.fullName,
      customerPhone: payload.customer.phone,
      customerEmail: payload.customer.email,
      customerType: payload.customer.customerType,
      vehicleId: payload.rental.vehicleId,
      vehicleName,
      vehiclePlate,
      vehicleCategory: vehicleCat,
      bookingType: 'Walk-In',
      pickupDate: payload.rental.pickupDate,
      pickupTime: payload.rental.pickupTime,
      returnDate: payload.rental.returnDate,
      returnTime: payload.rental.returnTime,
      rentalDurationDays: payload.rental.rentalDurationDays,
      pickupLocation: payload.rental.pickupLocation,
      returnLocation: payload.rental.returnLocation,
      dailyRate: payload.rental.dailyRate,
      extraHourRate: payload.rental.extraHourRate || targetVehicle?.extraHourRate || (targetVehicle ? getVehicleExtraHourRate(targetVehicle) : 2500),
      securityDeposit: payload.rental.securityDeposit,
      additionalCharges: payload.rental.additionalCharges,
      discount: payload.rental.discount,
      totalAmount: payload.rental.totalAmount,
      paymentStatus: payload.rental.paymentStatus,
      paymentMethod: payload.rental.paymentMethod,
      amountPaid: payload.rental.amountPaid,
      rentalStatus: 'Active',
      bookingStatus: 'Confirmed',
      staffNotes: payload.rental.staffNotes || `Walk-in customer registered at desk by ${currentStaff?.name || 'Staff'}.`,
      createdAt: new Date().toISOString(),
    };

    const paymentEntry: PaymentRecord = {
      id: `PAY-${Math.floor(9000 + Math.random() * 999)}`,
      customerId,
      customerName: payload.customer.fullName,
      rentalId,
      vehicleId: payload.rental.vehicleId,
      vehicleName,
      amount: payload.rental.amountPaid,
      paymentMethod: payload.rental.paymentMethod,
      paymentType: 'Rental Payment',
      paymentStatus: payload.rental.paymentStatus,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: 'Initial walk-in registration payment',
    };

    setVehicles((prev) =>
      prev.map((v) => (v.id === payload.rental.vehicleId ? { ...v, status: 'Rented' as VehicleStatus } : v))
    );
    setCustomers((prev) => [newCustomer, ...prev]);
    setRentals((prev) => [newRental, ...prev]);
    setPayments((prev) => [paymentEntry, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Walk-In Rental Dispatched',
        message: `${payload.customer.fullName} rented ${vehicleName} (${vehiclePlate}).`,
        type: 'booking',
        time: 'Just now',
        read: false,
        linkRoute: 'rentals',
      },
      ...prev,
    ]);

    if (currentStaff) {
      authService.logAction(currentStaff, 'CREATE_RENTAL', `Walk-in rental ${rentalId} registered for ${payload.customer.fullName}`);
    }

    return { rental: newRental, customer: newCustomer };
  };

  const createOnlineBooking = (payload: OnlineBookingPayload) => {
    const customerId = `CUST-${Math.floor(8000 + Math.random() * 1900)}`;
    const newCustomer: Customer = {
      id: customerId,
      fullName: payload.customer.fullName,
      dateOfBirth: '1990-01-01',
      phone: payload.customer.phone,
      email: payload.customer.email,
      homeAddress: payload.customer.homeAddress || 'Online Booking',
      emergencyContactName: 'Self / Contact',
      emergencyContactPhone: payload.customer.phone,
      licenseNumber: payload.customer.licenseNumber,
      licenseExpiry: '2028-12-31',
      licenseCountryState: 'LK/International',
      verificationStatus: 'Pending Verification',
      customerType: 'Online Customer',
      notes: 'Placed via online public website.',
      createdAt: new Date().toISOString(),
    };

    const targetVehicle = vehicles.find((v) => v.id === payload.vehicleId);
    const vehicleName = targetVehicle ? `${targetVehicle.make} ${targetVehicle.model}` : 'Vehicle Reserved';
    const vehiclePlate = targetVehicle?.licensePlate || 'TBD';
    const vehicleCat = targetVehicle?.category || 'Sedan';
    const dailyRate = targetVehicle?.dailyRate || 120;
    const deposit = targetVehicle?.securityDeposit || 500;
    const extrasTotal = payload.additionalCharges.reduce((acc, c) => acc + c.amount, 0);
    const baseTotal = dailyRate * payload.durationDays;
    const totalAmount = baseTotal + extrasTotal;
    const rentalId = `RCR-2026-${Math.floor(2000 + Math.random() * 8000)}`;

    const newRental: RentalBooking = {
      id: rentalId,
      customerId,
      customerName: payload.customer.fullName,
      customerPhone: payload.customer.phone,
      customerEmail: payload.customer.email,
      customerType: 'Online Customer',
      vehicleId: payload.vehicleId,
      vehicleName,
      vehiclePlate,
      vehicleCategory: vehicleCat,
      bookingType: 'Online',
      pickupDate: payload.pickupDate,
      pickupTime: payload.pickupTime,
      returnDate: payload.returnDate,
      returnTime: payload.returnTime,
      rentalDurationDays: payload.durationDays,
      pickupLocation: payload.pickupLocation,
      returnLocation: payload.returnLocation,
      dailyRate,
      extraHourRate: targetVehicle?.extraHourRate || (targetVehicle ? getVehicleExtraHourRate(targetVehicle) : 2500),
      securityDeposit: deposit,
      additionalCharges: payload.additionalCharges,
      discount: 0,
      totalAmount,
      paymentStatus: 'Paid',
      paymentMethod: payload.paymentMethod,
      amountPaid: totalAmount,
      rentalStatus: 'Reserved',
      bookingStatus: 'Confirmed',
      staffNotes: 'Online booking placed on website. Auto-reserved in fleet inventory.',
      createdAt: new Date().toISOString(),
    };

    const paymentEntry: PaymentRecord = {
      id: `PAY-${Math.floor(9000 + Math.random() * 999)}`,
      customerId,
      customerName: payload.customer.fullName,
      rentalId,
      vehicleId: payload.vehicleId,
      vehicleName,
      amount: totalAmount,
      paymentMethod: payload.paymentMethod,
      paymentType: 'Rental Payment',
      paymentStatus: 'Paid',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: 'Online checkout payment processed',
    };

    setVehicles((prev) =>
      prev.map((v) => (v.id === payload.vehicleId ? { ...v, status: 'Reserved' as VehicleStatus } : v))
    );
    setCustomers((prev) => [newCustomer, ...prev]);
    setRentals((prev) => [newRental, ...prev]);
    setPayments((prev) => [paymentEntry, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Online Reservation',
        message: `${payload.customer.fullName} reserved ${vehicleName}.`,
        type: 'booking',
        time: 'Just now',
        read: false,
        linkRoute: 'bookings',
      },
      ...prev,
    ]);

    return newRental;
  };

  const updateRentalStatus = (rentalId: string, status: RentalStatus) => {
    setRentals((prev) =>
      prev.map((r) => (r.id === rentalId ? { ...r, rentalStatus: status } : r))
    );
  };

  const extendRental = (rentalId: string, additionalDays: number) => {
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === rentalId) {
          const newDuration = r.rentalDurationDays + additionalDays;
          const currentReturn = new Date(r.returnDate);
          currentReturn.setDate(currentReturn.getDate() + additionalDays);
          const newReturnDateStr = currentReturn.toISOString().split('T')[0];
          const addedAmount = r.dailyRate * additionalDays;
          return {
            ...r,
            rentalDurationDays: newDuration,
            returnDate: newReturnDateStr,
            totalAmount: r.totalAmount + addedAmount,
            staffNotes: `${r.staffNotes} | Extended by +${additionalDays} days on ${new Date().toLocaleDateString()}.`,
          };
        }
        return r;
      })
    );
  };

  const cancelRental = (rentalId: string, reason?: string) => {
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === rentalId) {
          setVehicles((vList) =>
            vList.map((v) => (v.id === r.vehicleId ? { ...v, status: 'Available' as VehicleStatus } : v))
          );
          return {
            ...r,
            rentalStatus: 'Cancelled',
            bookingStatus: 'Cancelled',
            paymentStatus: r.paymentStatus === 'Paid' ? 'Refunded' : r.paymentStatus,
            staffNotes: `${r.staffNotes} | Cancelled: ${reason || 'Staff/Customer request'}. Vehicle released to Available.`,
          };
        }
        return r;
      })
    );
  };

  const completeReturn = (rentalId: string, payload: ReturnVehiclePayload) => {
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === rentalId) {
          const nextStatus: VehicleStatus = payload.markAvailableImmediately
            ? 'Available'
            : 'Pending Inspection';
          setVehicles((vList) =>
            vList.map((v) =>
              v.id === r.vehicleId
                ? {
                    ...v,
                    status: nextStatus,
                    mileage: payload.returnMileage > v.mileage ? payload.returnMileage : v.mileage,
                  }
                : v
            )
          );
          return {
            ...r,
            rentalStatus: 'Completed',
            actualReturnDateTime: payload.actualReturnDateTime,
            returnMileage: payload.returnMileage,
            chargeableExtraHours: payload.chargeableExtraHours,
            extraHourRate: payload.extraHourRate,
            extraHourTotal: payload.extraHourTotal,
            extraChargesAmount: payload.extraChargesAmount,
            depositRefundStatus: payload.depositRefundStatus,
            totalAmount: r.totalAmount + (payload.extraChargesAmount || 0),
            staffNotes: `${r.staffNotes} | Returned: ${payload.actualReturnDateTime}. Late Hours: ${payload.chargeableExtraHours || 0} (Fee: Rs. ${payload.extraHourTotal || 0}). Extra Charges: Rs. ${payload.extraChargesAmount}. Deposit: ${payload.depositRefundStatus}. Notes: ${payload.staffNotes || 'Passed'}.`,
          };
        }
        return r;
      })
    );
  };

  const recordPaymentEntry = (entry: Omit<PaymentRecord, 'id'>) => {
    const newRecord: PaymentRecord = {
      ...entry,
      id: `PAY-${Math.floor(9000 + Math.random() * 999)}`,
    };
    setPayments((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateVehicleStatus = (vehicleId: string, status: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status } : v))
    );
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newId = `veh-${Math.floor(100 + Math.random() * 900)}`;
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: newId,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const removeVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const addConsignmentVehicle = (
    vehicleData: Partial<Vehicle>,
    ownerInfo: { name: string; email: string; phone: string }
  ) => {
    let ownerId = owners.find((o) => o.email.toLowerCase() === ownerInfo.email.toLowerCase())?.id;
    if (!ownerId) {
      ownerId = `own-${Math.floor(100 + Math.random() * 900)}`;
      const newOwner: VehicleOwner = {
        id: ownerId,
        name: ownerInfo.name,
        email: ownerInfo.email,
        phone: ownerInfo.phone,
        verificationStatus: 'Verified',
        registeredVehicles: 1,
        totalEarnings: 0,
        monthlyRevenue: 0,
        commissionRatePercent: 20,
        payoutStatus: 'Scheduled',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setOwners((prev) => [newOwner, ...prev]);
    } else {
      setOwners((prev) =>
        prev.map((o) => (o.id === ownerId ? { ...o, registeredVehicles: o.registeredVehicles + 1 } : o))
      );
    }

    const newVehicle: Vehicle = {
      id: `veh-${Math.floor(100 + Math.random() * 900)}`,
      make: vehicleData.make || 'BMW',
      model: vehicleData.model || '3 Series M Sport',
      year: vehicleData.year || 2024,
      category: vehicleData.category || 'Sedan',
      transmission: vehicleData.transmission || 'Automatic',
      fuel: vehicleData.fuel || 'Gasoline',
      seats: vehicleData.seats || 5,
      luggage: vehicleData.luggage || 3,
      dailyRate: vehicleData.dailyRate || 135,
      securityDeposit: vehicleData.securityDeposit || 600,
      licensePlate: vehicleData.licensePlate || `OWN-${Math.floor(1000 + Math.random() * 9000)}`,
      vinPlaceholder: vehicleData.vinPlaceholder || 'VIN-VERIFY-PENDING***',
      color: vehicleData.color || 'Alpine White',
      mileage: vehicleData.mileage || 12000,
      status: 'Pending Inspection',
      imageUrl:
        vehicleData.imageUrl ||
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=75&fm=webp',
      features: vehicleData.features || ['Navigation', 'Leather Seats', 'Rear Camera', 'Apple CarPlay'],
      ownerId,
      ownerName: `${ownerInfo.name} (Consignor)`,
      officeLocation: 'Central Office Terminal',
      description: vehicleData.description || 'Privately listed vehicle under consignment management.',
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `CUST-${Math.floor(8000 + Math.random() * 1900)}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addOwner = (ownerData: Omit<VehicleOwner, 'id' | 'joinedDate'>) => {
    const newOwner: VehicleOwner = {
      ...ownerData,
      id: `own-${Math.floor(100 + Math.random() * 900)}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setOwners((prev) => [newOwner, ...prev]);
    return newOwner;
  };

  const updateOwner = (id: string, updates: Partial<VehicleOwner>) => {
    setOwners((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const addMaintenanceRecord = (m: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    const newRec: MaintenanceRecord = {
      ...m,
      id: `MAINT-${Math.floor(500 + Math.random() * 499)}`,
      createdAt: new Date().toISOString(),
    };
    setMaintenance((prev) => [newRec, ...prev]);
    if (newRec.status === 'Scheduled' || newRec.status === 'In Progress') {
      updateVehicleStatus(newRec.vehicleId, 'Maintenance');
    }
    return newRec;
  };

  const updateMaintenanceStatus = (id: string, status: 'Scheduled' | 'In Progress' | 'Completed') => {
    setMaintenance((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          if (status === 'Completed') {
            updateVehicleStatus(m.vehicleId, 'Pending Inspection');
          } else {
            updateVehicleStatus(m.vehicleId, 'Maintenance');
          }
          return { ...m, status };
        }
        return m;
      })
    );
  };

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const recordPayment = (
    rentalId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus
  ) => {
    const targetRental = rentals.find((r) => r.id === rentalId);
    if (!targetRental) return;

    const newPayment: PaymentRecord = {
      id: `PAY-${Math.floor(9000 + Math.random() * 999)}`,
      customerId: targetRental.customerId,
      customerName: targetRental.customerName,
      rentalId: targetRental.id,
      vehicleId: targetRental.vehicleId,
      vehicleName: targetRental.vehicleName,
      amount,
      paymentMethod,
      paymentType: 'Rental Payment',
      paymentStatus,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: 'Counter payment recorded via POS',
    };

    setPayments((prev) => [newPayment, ...prev]);
    setRentals((prev) =>
      prev.map((r) => {
        if (r.id === rentalId) {
          const newAmountPaid = (r.amountPaid || 0) + amount;
          return {
            ...r,
            amountPaid: newAmountPaid,
            paymentStatus,
          };
        }
        return r;
      })
    );
  };

  return (
    <RentalContext.Provider
      value={{
        vehicles,
        customers,
        rentals,
        owners,
        staffList,
        payments,
        maintenance,
        inspections,
        settings,
        notifications,
        currentStaff,
        staffUser: currentStaff,
        isStaffMode,
        setIsStaffMode,
        recordPayment,
        loginStaff,
        logoutStaff,
        checkVehicleAvailability,
        registerWalkIn,
        createOnlineBooking,
        updateRentalStatus,
        extendRental,
        cancelRental,
        completeReturn,
        recordPaymentEntry,
        updateVehicleStatus,
        addVehicle,
        updateVehicle,
        removeVehicle,
        addConsignmentVehicle,
        addCustomer,
        updateCustomer,
        addOwner,
        updateOwner,
        addMaintenanceRecord,
        updateMaintenanceStatus,
        updateSettings,
        markNotificationRead,
        selectedRentalForAgreement,
        setSelectedRentalForAgreement,
        selectedRentalForReceipt,
        setSelectedRentalForReceipt,
        selectedInspectionRental,
        setSelectedInspectionRental,
        selectedCustomerModal,
        setSelectedCustomerModal,
        resetToDemoData,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};
