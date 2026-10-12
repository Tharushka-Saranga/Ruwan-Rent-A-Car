import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Edit,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { Customer, CustomerType, DriverVerificationStatus } from '../../../types';

export const AdminCustomersSection: React.FC = () => {
  const { customers, addCustomer, updateCustomer, setSelectedCustomerModal } = useRental();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDob, setFormDob] = useState('1990-01-01');
  const [formLicense, setFormLicense] = useState('');
  const [formLicenseExpiry, setFormLicenseExpiry] = useState('2028-12-31');
  const [formLicenseJurisdiction, setFormLicenseJurisdiction] = useState('LK, Sri Lanka');
  const [formEmergencyName, setFormEmergencyName] = useState('');
  const [formEmergencyPhone, setFormEmergencyPhone] = useState('');
  const [formType, setFormType] = useState<CustomerType>('Walk-In Customer');
  const [formVerification, setFormVerification] = useState<DriverVerificationStatus>('Verified');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormDob('1992-05-10');
    setFormLicense('');
    setFormLicenseExpiry('2028-09-30');
    setFormLicenseJurisdiction('LK, Sri Lanka');
    setFormEmergencyName('');
    setFormEmergencyPhone('');
    setFormType('Walk-In Customer');
    setFormVerification('Verified');
    setFormNotes('');
    setModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setFormName(c.fullName);
    setFormPhone(c.phone);
    setFormEmail(c.email);
    setFormAddress(c.homeAddress);
    setFormDob(c.dateOfBirth);
    setFormLicense(c.licenseNumber);
    setFormLicenseExpiry(c.licenseExpiry);
    setFormLicenseJurisdiction(c.licenseCountryState);
    setFormEmergencyName(c.emergencyContactName);
    setFormEmergencyPhone(c.emergencyContactPhone);
    setFormType(c.customerType);
    setFormVerification(c.verificationStatus);
    setFormNotes(c.notes || '');
    setModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        fullName: formName,
        phone: formPhone,
        email: formEmail,
        homeAddress: formAddress,
        dateOfBirth: formDob,
        licenseNumber: formLicense,
        licenseExpiry: formLicenseExpiry,
        licenseCountryState: formLicenseJurisdiction,
        emergencyContactName: formEmergencyName,
        emergencyContactPhone: formEmergencyPhone,
        customerType: formType,
        verificationStatus: formVerification,
        notes: formNotes,
      });
    } else {
      addCustomer({
        fullName: formName,
        phone: formPhone,
        email: formEmail,
        homeAddress: formAddress,
        dateOfBirth: formDob,
        licenseNumber: formLicense,
        licenseExpiry: formLicenseExpiry,
        licenseCountryState: formLicenseJurisdiction,
        emergencyContactName: formEmergencyName,
        emergencyContactPhone: formEmergencyPhone,
        customerType: formType,
        verificationStatus: formVerification,
        notes: formNotes,
      });
    }
    setModalOpen(false);
  };

  const filteredCustomers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return customers.filter((c) => {
      const matchSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.licenseNumber.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (typeFilter !== 'all' && c.customerType !== typeFilter) return false;
      if (verificationFilter !== 'all' && c.verificationStatus !== verificationFilter) return false;
      return true;
    });
  }, [customers, searchTerm, typeFilter, verificationFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Customer Relationship Management
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Customer Directory & Profiles
          </h1>
          <p className="text-xs text-zinc-400">
            Registered drivers, identity verification statuses, history, and internal desk flags
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, ID, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 touch-scroll">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 min-h-[44px]"
          >
            <option value="all">All Customer Types</option>
            <option value="Walk-In Customer">Walk-In Customer</option>
            <option value="Online Customer">Online Customer</option>
            <option value="Returning Customer">Returning Customer</option>
            <option value="Corporate Customer">Corporate Customer</option>
          </select>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 min-h-[44px]"
          >
            <option value="all">All Verifications</option>
            <option value="Verified">Verified</option>
            <option value="Pending Verification">Pending</option>
            <option value="Requires Review">Flagged / Review</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800 font-semibold">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Type</th>
                <th className="p-4">Driver's License</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    No customers match the search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{c.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-zinc-100">{c.fullName}</div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[150px]">{c.homeAddress}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-zinc-200 font-mono">{c.phone}</div>
                      <div className="text-[11px] text-zinc-500">{c.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {c.customerType}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-zinc-200 font-bold">{c.licenseNumber}</div>
                      <div className="text-[10px] text-zinc-500">Exp: {c.licenseExpiry}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          c.verificationStatus === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{c.verificationStatus}</span>
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomerModal(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center gap-1 min-h-[36px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors flex items-center gap-1 min-h-[36px]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 text-zinc-100 my-auto shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingCustomer ? `Edit Customer: ${editingCustomer.id}` : 'Register New Customer'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1">Home Address</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Driver's License Number</label>
                  <input
                    type="text"
                    value={formLicense}
                    onChange={(e) => setFormLicense(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white font-mono uppercase min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">License Expiry Date</label>
                  <input
                    type="date"
                    value={formLicenseExpiry}
                    onChange={(e) => setFormLicenseExpiry(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Customer Category</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CustomerType)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  >
                    <option value="Walk-In Customer">Walk-In Customer</option>
                    <option value="Online Customer">Online Customer</option>
                    <option value="Returning Customer">Returning Customer</option>
                    <option value="Corporate Customer">Corporate Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Verification Status</label>
                  <select
                    value={formVerification}
                    onChange={(e) => setFormVerification(e.target.value as DriverVerificationStatus)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Requires Review">Requires Review</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1">Internal Notes & Flags</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white cursor-pointer min-h-[40px] active:scale-[0.98]"
                >
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
