import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  Eye,
  FileText,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';

export const CustomerDatabaseView: React.FC<{ onOpenWalkIn: () => void }> = ({ onOpenWalkIn }) => {
  const { customers, rentals, setSelectedCustomerModal, setSelectedRentalForReceipt } = useRental();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const customerRows = useMemo(() => {
    return customers.map((c) => {
      const custRentals = rentals.filter((r) => r.customerId === c.id || r.customerEmail === c.email);
      const activeRental = custRentals.find((r) => r.rentalStatus === 'Active');
      const latestRental = activeRental || custRentals[0] || null;
      return {
        customer: c,
        rental: latestRental,
      };
    });
  }, [customers, rentals]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return customerRows.filter(({ customer, rental }) => {
      const matchName = customer.fullName.toLowerCase().includes(q);
      const matchPhone = customer.phone.toLowerCase().includes(q);
      const matchCustId = customer.id.toLowerCase().includes(q);
      const matchRentalId = rental ? rental.id.toLowerCase().includes(q) : false;
      const matchVehicle = rental ? rental.vehicleName.toLowerCase().includes(q) : false;
      const matchesSearch = !q || matchName || matchPhone || matchCustId || matchRentalId || matchVehicle;
      if (!matchesSearch) return false;
      if (filterType === 'all') return true;
      if (filterType === 'Active Rentals') return rental?.rentalStatus === 'Active';
      if (filterType === 'Upcoming') return rental?.rentalStatus === 'Reserved';
      if (filterType === 'Completed') return rental?.rentalStatus === 'Completed';
      if (filterType === 'Cancelled') return rental?.rentalStatus === 'Cancelled';
      if (filterType === 'Unpaid') return rental?.paymentStatus === 'Unpaid';
      if (filterType === 'Paid') return rental?.paymentStatus === 'Paid';
      if (filterType === 'Walk-In') return customer.customerType === 'Walk-In Customer';
      if (filterType === 'Online') return customer.customerType === 'Online Customer';
      return true;
    });
  }, [customerRows, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>Customer Management Database</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Registered walk-in & online drivers, contact records, verification logs & rental status
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenWalkIn}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer w-full md:w-auto justify-center min-h-[44px] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Walk-In Customer</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Customer Name, Phone, ID, or Vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs touch-scroll">
          {[
            'all',
            'Active Rentals',
            'Upcoming',
            'Completed',
            'Cancelled',
            'Paid',
            'Walk-In',
            'Online',
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[36px] ${
                filterType === f
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {f === 'all' ? 'All Customers' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Current Vehicle</th>
                <th className="py-3.5 px-4">Rental Status</th>
                <th className="py-3.5 px-4">Pickup Date</th>
                <th className="py-3.5 px-4">Return Date</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-500">
                    No customers match the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredRows.map(({ customer, rental }) => (
                  <tr key={customer.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {customer.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                        <span>{customer.fullName}</span>
                        {customer.verificationStatus === 'Verified' && (
                          <span title="Verified">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[150px]">
                        {customer.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 font-mono">
                      {customer.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-800 text-zinc-300">
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {rental ? (
                        <div>
                          <span className="font-semibold text-zinc-200 block">{rental.vehicleName}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {rental.vehiclePlate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">No record</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {rental ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-zinc-300">
                          {rental.rentalStatus}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      {rental ? rental.pickupDate : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      {rental ? rental.returnDate : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {rental ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${rental.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {rental.paymentStatus}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedCustomerModal(customer)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors flex items-center gap-1 min-h-[36px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>
                        {rental && (
                          <button
                            onClick={() => setSelectedRentalForReceipt(rental)}
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title="Receipt"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
