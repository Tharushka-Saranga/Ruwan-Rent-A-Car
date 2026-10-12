import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Car,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { formatLKR } from '../../../utils/currency';

export const AdminOwnersSection: React.FC = () => {
  const { owners, vehicles, addOwner, updateOwner } = useRental();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [commission, setCommission] = useState(80);
  const [verification] = useState<'Verified' | 'Pending Review'>('Verified');

  const filteredOwners = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return owners.filter((o) => {
      const matchesSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (statusFilter !== 'all' && o.verificationStatus !== statusFilter) return false;
      return true;
    });
  }, [owners, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalOwners = owners.length;
    const totalVehiclesConsigned = vehicles.filter((v) => v.ownerId).length;
    const totalEarningsPaid = owners.reduce((acc, o) => acc + (o.totalEarnings || 0), 0);
    const avgCommission =
      totalOwners > 0
        ? Math.round(owners.reduce((acc, o) => acc + (o.commissionRatePercent || 80), 0) / totalOwners)
        : 80;

    return {
      totalOwners,
      totalVehiclesConsigned,
      totalEarningsPaid,
      avgCommission,
    };
  }, [owners, vehicles]);

  const handleCreateOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    addOwner({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Physical Residence on File',
      verificationStatus: verification,
      registeredVehicles: 0,
      totalEarnings: 0,
      monthlyRevenue: 0,
      commissionRatePercent: Number(commission),
      payoutStatus: 'Scheduled',
    });
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Vehicle Owner Consignors</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage partner vehicle owners, revenue share agreements, and consignor payouts.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Consignor Partner</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Registered Owners</span>
          <div className="text-2xl font-black text-white tabular-nums">{stats.totalOwners}</div>
          <p className="text-[11px] text-zinc-500">Fleet consignors</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Consigned Fleet</span>
          <div className="text-2xl font-black text-emerald-400 tabular-nums">{stats.totalVehiclesConsigned}</div>
          <p className="text-[11px] text-zinc-500">Active client cars</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Consignor Payouts</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">{formatLKR(stats.totalEarningsPaid)}</div>
          <p className="text-[11px] text-zinc-500">Cumulative revenue</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Avg Commission</span>
          <div className="text-2xl font-black text-amber-400 tabular-nums">{stats.avgCommission}%</div>
          <p className="text-[11px] text-zinc-500">Standard owner cut</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by owner name, email, phone, or ID..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 min-h-[40px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 min-h-[40px]"
          >
            <option value="all">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Owners Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/70 text-zinc-400 uppercase text-[11px] font-bold tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Owner ID & Name</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Consigned Cars</th>
                <th className="px-5 py-3.5">Commission Split</th>
                <th className="px-5 py-3.5">Total Earnings</th>
                <th className="px-5 py-3.5">Payout Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredOwners.map((owner) => {
                const ownerCars = vehicles.filter((v) => v.ownerId === owner.id);
                return (
                  <tr key={owner.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{owner.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{owner.id}</div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          owner.verificationStatus === 'Verified'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {owner.verificationStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{owner.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{owner.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <Car className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{ownerCars.length || owner.registeredVehicles || 0} vehicle(s)</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-xs">
                        {ownerCars.map((c) => `${c.year} ${c.make} ${c.model}`).join(', ') || 'No cars assigned'}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono">
                      <span className="font-bold text-emerald-400">{owner.commissionRatePercent}%</span>
                      <span className="text-zinc-500 text-[11px]"> owner / {100 - owner.commissionRatePercent}% Ruwan</span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400 tabular-nums">
                      {formatLKR(owner.totalEarnings || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          owner.payoutStatus === 'Paid'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : owner.payoutStatus === 'Processing'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{owner.payoutStatus}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          const nextStatus =
                            owner.payoutStatus === 'Scheduled'
                              ? 'Processing'
                              : owner.payoutStatus === 'Processing'
                              ? 'Paid'
                              : 'Scheduled';
                          updateOwner(owner.id, { payoutStatus: nextStatus });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer min-h-[36px]"
                      >
                        <span>Toggle Status</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Consignor Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-zinc-100 my-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Add Consignor Vehicle Owner</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOwner} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kasun Fernando"
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kasun@example.com"
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07X XXX XXXX"
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Commission Split (% to Owner)</label>
                  <input
                    type="number"
                    min={50}
                    max={90}
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-semibold cursor-pointer min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-lg shadow-emerald-950/40 min-h-[40px] active:scale-[0.98]"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
