import React, { useState } from 'react';
import {
  Car,
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Settings,
  LogOut,
  UserPlus,
  Search,
  Bell,
  Wrench,
  UserCheck,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { useRouter } from '../../context/RouterContext';
import { StaffRoute } from '../../types';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';
import { formatLKR } from '../../utils/currency';
import { AdminOverviewSection } from './sections/AdminOverviewSection';
import { AdminCustomersSection } from './sections/AdminCustomersSection';
import { AdminVehiclesSection } from './sections/AdminVehiclesSection';
import { AdminBookingsSection } from './sections/AdminBookingsSection';
import { AdminWalkInSection } from './sections/AdminWalkInSection';
import { AdminOwnersSection } from './sections/AdminOwnersSection';
import { AdminPaymentsSection } from './sections/AdminPaymentsSection';
import { AdminCalendarSection } from './sections/AdminCalendarSection';
import { AdminMaintenanceSection } from './sections/AdminMaintenanceSection';
import { AdminReportsSection } from './sections/AdminReportsSection';
import { AdminStaffSection } from './sections/AdminStaffSection';
import { AdminSettingsSection } from './sections/AdminSettingsSection';
import { RentalAgreementModal } from '../documents/RentalAgreementModal';
import { RentalReceiptModal } from '../documents/RentalReceiptModal';
import { CustomerProfileModal } from '../staff/CustomerProfileModal';

export const AdminDashboardLayout: React.FC = () => {
  const {
    currentStaff,
    logoutStaff,
    notifications,
    markNotificationRead,
    selectedRentalForAgreement,
    setSelectedRentalForAgreement,
    selectedRentalForReceipt,
    setSelectedRentalForReceipt,
    selectedCustomerModal,
    setSelectedCustomerModal,
    vehicles,
    customers,
    rentals,
  } = useRental();
  const { currentPath, navigate } = useRouter();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getActiveRoute = (): StaffRoute => {
    if (currentPath === '/staff/customers') return 'customers';
    if (currentPath === '/staff/vehicles') return 'vehicles';
    if (currentPath === '/staff/bookings') return 'bookings';
    if (currentPath === '/staff/rentals') return 'rentals';
    if (currentPath === '/staff/walk-in') return 'walk-in';
    if (currentPath === '/staff/owners') return 'owners';
    if (currentPath === '/staff/payments') return 'payments';
    if (currentPath === '/staff/calendar') return 'calendar';
    if (currentPath === '/staff/maintenance') return 'maintenance';
    if (currentPath === '/staff/reports') return 'reports';
    if (currentPath === '/staff/staff-management' || currentPath === '/staff/staff') return 'staff-management';
    if (currentPath === '/staff/settings') return 'settings';
    return 'dashboard';
  };

  const activeRoute = getActiveRoute();

  const handleNav = (route: StaffRoute) => {
    const routeMap: Record<StaffRoute, string> = {
      dashboard: '/staff/dashboard',
      customers: '/staff/customers',
      vehicles: '/staff/vehicles',
      bookings: '/staff/bookings',
      rentals: '/staff/bookings',
      'walk-in': '/staff/walk-in',
      owners: '/staff/owners',
      payments: '/staff/payments',
      calendar: '/staff/calendar',
      maintenance: '/staff/maintenance',
      reports: '/staff/reports',
      'staff-management': '/staff/staff-management',
      staff: '/staff/staff-management',
      settings: '/staff/settings',
    };
    navigate(routeMap[route] || '/staff/dashboard');
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutStaff();
    navigate('/staff/login');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const sidebarItems: { id: StaffRoute; label: string; icon: React.ReactNode; badge?: string; adminOnly?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'vehicles', label: 'Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'walk-in', label: 'Walk-In POS', icon: <UserPlus className="w-4 h-4" />, badge: 'POS' },
    { id: 'owners', label: 'Owners', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Clock className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'staff-management', label: 'Staff', icon: <Shield className="w-4 h-4" />, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const searchMatches = searchQuery.trim()
    ? {
        matchedCustomers: customers
          .filter(
            (c) =>
              c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.phone.includes(searchQuery) ||
              c.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3),
        matchedVehicles: vehicles
          .filter(
            (v) =>
              `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
              v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3),
        matchedRentals: rentals
          .filter(
            (r) =>
              r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.customerName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3),
      }
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile trigger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div
              onClick={() => handleNav('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-950/40">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white tracking-tight text-sm group-hover:text-emerald-400 transition-colors">
                    Ruwan Car Rentals
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    Admin POS
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Showroom & Central Fleet Management
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search input & Business Hours */}
          <div className="flex items-center gap-3 flex-1 max-w-xl mx-2">
            <div className="relative w-full hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Global search (customers, plates, bookings)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setGlobalSearchOpen(true);
                }}
                onFocus={() => setGlobalSearchOpen(true)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 min-h-[40px]"
              />
            </div>
            <div className="hidden xl:block shrink-0">
              <BusinessHoursBadge variant="compact" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleNav('walk-in')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all cursor-pointer min-h-[40px] active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register Walk-In</span>
              <span className="sm:hidden">Walk-In</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-750 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="font-bold text-white text-xs">Live System Notifications</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{unreadNotifsCount} unread</span>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto text-xs touch-scroll">
                    {notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkRoute) handleNav(n.linkRoute);
                          setNotificationsOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          n.read
                            ? 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400'
                            : 'bg-zinc-950 border-emerald-500/40 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-[11px]">{n.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-750 text-xs text-zinc-200 transition-colors cursor-pointer min-h-[40px]"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-[11px]">
                  {currentStaff?.name ? currentStaff.name[0] : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="font-bold text-white text-[11px] leading-tight truncate max-w-[120px]">
                    {currentStaff?.name || 'Staff User'}
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono leading-tight">
                    {currentStaff?.role || 'STAFF'} · {currentStaff?.badgeId || 'DESK'}
                  </div>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-750 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="pb-2 border-b border-zinc-800 space-y-1">
                    <div className="font-bold text-white text-sm">{currentStaff?.name}</div>
                    <div className="text-xs text-zinc-400">{currentStaff?.email}</div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        navigate('/');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer min-h-[36px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Switch to Public Website</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNav('settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer min-h-[36px]"
                    >
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Business Settings</span>
                    </button>
                  </div>
                  <div className="pt-2 border-t border-zinc-800">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-950/60 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center gap-2 cursor-pointer border border-red-800/60 min-h-[36px]"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Sign Out from Terminal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 p-2.5 rounded-xl bg-zinc-800/80 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 border border-zinc-750 hover:border-red-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] justify-center"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* GLOBAL SEARCH RESULTS */}
      {globalSearchOpen && searchMatches && searchQuery.trim() && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-start pt-20 p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-750 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="font-bold text-white text-sm">Quick Search: "{searchQuery}"</span>
              <button
                onClick={() => setGlobalSearchOpen(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer min-h-[36px]"
              >
                Close (ESC)
              </button>
            </div>
            {searchMatches.matchedCustomers.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Customers</span>
                {searchMatches.matchedCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomerModal(c);
                      setGlobalSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-xs flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white">{c.fullName}</div>
                      <div className="text-[11px] text-zinc-400">{c.phone} · {c.email}</div>
                    </div>
                    <span className="text-emerald-400 text-[11px] font-mono">{c.id}</span>
                  </div>
                ))}
              </div>
            )}
            {searchMatches.matchedVehicles.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Fleet Vehicles</span>
                {searchMatches.matchedVehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      handleNav('vehicles');
                      setGlobalSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-xs flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white">{v.year} {v.make} {v.model}</div>
                      <div className="text-[11px] text-zinc-400">Plate: {v.licensePlate} · Status: {v.status}</div>
                    </div>
                    <span className="text-blue-400 text-[11px] font-mono">{formatLKR(v.dailyRate)}/day</span>
                  </div>
                ))}
              </div>
            )}
            {searchMatches.matchedRentals.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Rental Bookings</span>
                {searchMatches.matchedRentals.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      handleNav('bookings');
                      setGlobalSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-xs flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white">{r.id} – {r.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{r.vehicleName} ({r.pickupDate} to {r.returnDate})</div>
                    </div>
                    <span className="text-emerald-400 text-[11px] font-mono">{formatLKR(r.totalAmount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 bg-zinc-900/60 border-r border-zinc-800 p-4 space-y-6 shrink-0">
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="font-semibold">Office Hours</span>
              <span className="text-emerald-400 font-bold">7:00 AM – 9:00 PM</span>
            </div>
            <div className="pt-1">
              <BusinessHoursBadge variant="compact" />
            </div>
          </div>

          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
              Rental Operations
            </span>
            {sidebarItems.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[40px] ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-950/40'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-zinc-800/80">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/40 transition-colors cursor-pointer min-h-[40px]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Public Customer Website</span>
            </button>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/85 backdrop-blur-sm flex">
            <div className="w-72 bg-zinc-900 h-full p-4 space-y-6 overflow-y-auto border-r border-zinc-800 touch-scroll">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="font-bold text-white text-sm">Navigation Menu</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <BusinessHoursBadge variant="compact" />
              </div>

              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold min-h-[44px] ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {activeRoute === 'dashboard' && <AdminOverviewSection />}
          {activeRoute === 'customers' && <AdminCustomersSection />}
          {activeRoute === 'vehicles' && <AdminVehiclesSection />}
          {(activeRoute === 'bookings' || activeRoute === 'rentals') && <AdminBookingsSection />}
          {activeRoute === 'walk-in' && <AdminWalkInSection />}
          {activeRoute === 'owners' && <AdminOwnersSection />}
          {activeRoute === 'payments' && <AdminPaymentsSection />}
          {activeRoute === 'calendar' && <AdminCalendarSection />}
          {activeRoute === 'maintenance' && <AdminMaintenanceSection />}
          {activeRoute === 'reports' && <AdminReportsSection />}
          {activeRoute === 'staff-management' && <AdminStaffSection />}
          {activeRoute === 'settings' && <AdminSettingsSection />}
        </main>
      </div>

      <RentalAgreementModal
        rental={selectedRentalForAgreement}
        onClose={() => setSelectedRentalForAgreement(null)}
      />
      <RentalReceiptModal
        rental={selectedRentalForReceipt}
        onClose={() => setSelectedRentalForReceipt(null)}
      />
      <CustomerProfileModal
        customer={selectedCustomerModal}
        onClose={() => setSelectedCustomerModal(null)}
      />
    </div>
  );
};
