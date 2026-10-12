import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  CreditCard,
  CheckCircle,
  Receipt,
  PlusCircle,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { PaymentMethod, PaymentRecord, PaymentStatus } from '../../../types';
import { formatLKR } from '../../../utils/currency';

export const AdminPaymentsSection: React.FC = () => {
  const { payments, rentals, recordPaymentEntry, setSelectedRentalForReceipt } = useRental();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [selectedRentalId, setSelectedRentalId] = useState('');
  const [amount, setAmount] = useState<number>(150);
  const [method, setMethod] = useState<PaymentMethod>('Card');
  const [paymentType, setPaymentType] = useState<PaymentRecord['paymentType']>('Rental Payment');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [notes, setNotes] = useState('');

  const filteredPayments = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return payments.filter((p) => {
      const matchSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.rentalId.toLowerCase().includes(q) ||
        p.vehicleName.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (statusFilter !== 'all' && p.paymentStatus !== statusFilter) return false;
      if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
      return true;
    });
  }, [payments, searchTerm, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    const totalCollected = payments
      .filter((p) => p.paymentStatus === 'Paid' && p.paymentType !== 'Refund')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalDeposits = payments
      .filter((p) => p.paymentType === 'Security Deposit' && p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalRefunds = payments
      .filter((p) => p.paymentType === 'Refund' || p.paymentStatus === 'Refunded')
      .reduce((sum, p) => sum + p.amount, 0);
    const cashVolume = payments
      .filter((p) => p.paymentMethod === 'Cash' && p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);

    return { totalCollected, totalDeposits, totalRefunds, cashVolume };
  }, [payments]);

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const rental = rentals.find((r) => r.id === selectedRentalId);
    if (!rental) return;

    recordPaymentEntry({
      customerId: rental.customerId,
      customerName: rental.customerName,
      rentalId: rental.id,
      vehicleId: rental.vehicleId,
      vehicleName: rental.vehicleName,
      amount: Number(amount),
      paymentMethod: method,
      paymentType,
      paymentStatus,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: notes || 'Counter settlement recorded manually',
    });

    setIsRecordModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Payments & Financial Ledger</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete transaction history for desk POS, card terminals, deposits, and bank transfers.
          </p>
        </div>
        <button
          onClick={() => {
            if (rentals.length > 0) setSelectedRentalId(rentals[0].id);
            setIsRecordModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Counter Payment</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Total Collected</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono truncate tabular-nums">{formatLKR(stats.totalCollected)}</div>
          <p className="text-[11px] text-zinc-500">Gross rental revenue</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Deposits in Escrow</span>
          <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono truncate tabular-nums">{formatLKR(stats.totalDeposits)}</div>
          <p className="text-[11px] text-zinc-500">Pending return releases</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Refunds Issued</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono truncate tabular-nums">{formatLKR(stats.totalRefunds)}</div>
          <p className="text-[11px] text-zinc-500">Deposit returns</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Cash Register Volume</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono truncate tabular-nums">{formatLKR(stats.cashVolume)}</div>
          <p className="text-[11px] text-zinc-500">Office drawer</p>
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
            placeholder="Search by payment ID, customer name, rental ID, or car..."
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
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Refunded">Refunded</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 min-h-[40px]"
          >
            <option value="all">All Tender Methods</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online Payment">Online Payment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/70 text-zinc-400 uppercase text-[11px] font-bold tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Payment ID & Date</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Rental Reference</th>
                <th className="px-5 py-3.5">Type & Method</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredPayments.map((p) => {
                const linkedRental = rentals.find((r) => r.id === p.rentalId);
                return (
                  <tr key={p.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-white text-xs">{p.id}</div>
                      <div className="text-[11px] text-zinc-500">{p.date}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{p.customerName}</div>
                      <div className="text-[11px] text-zinc-500">ID: {p.customerId}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-mono font-semibold text-emerald-400">{p.rentalId}</div>
                      <div className="text-[11px] text-zinc-400">{p.vehicleName}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-200">{p.paymentType}</div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-zinc-400" />
                        <span>{p.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-black text-sm text-emerald-400 tabular-nums">
                      {formatLKR(p.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : p.paymentStatus === 'Partially Paid'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : p.paymentStatus === 'Refunded'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                            : 'bg-red-950/80 text-red-300 border border-red-800'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{p.paymentStatus}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {linkedRental && (
                        <button
                          onClick={() => setSelectedRentalForReceipt(linkedRental)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer min-h-[36px]"
                        >
                          <Receipt className="w-3.5 h-3.5 text-blue-400" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Counter Payment Modal */}
      {isRecordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-zinc-100 my-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Record Payment Entry</h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Select Associated Rental</label>
                <select
                  value={selectedRentalId}
                  onChange={(e) => setSelectedRentalId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                >
                  {rentals.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} – {r.customerName} ({r.vehicleName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Amount to Record ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono text-base min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  >
                    <option value="Rental Payment">Rental Payment</option>
                    <option value="Security Deposit">Security Deposit</option>
                    <option value="Additional Charge">Additional Charge</option>
                    <option value="Refund">Refund</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Tender Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                  >
                    <option value="Card">Card POS Terminal</option>
                    <option value="Credit/Debit Card (Visa/Mastercard)">Card Online</option>
                    <option value="Genie / FriMi / LankaPay">Genie / FriMi / LankaPay</option>
                    <option value="Cash">Cash Register</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Crypto (USDT / BTC / ETH)">Crypto Web3</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                >
                  <option value="Paid">Paid (Settled in full)</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Staff Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Card slip #8812, counter register A"
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-semibold cursor-pointer min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-lg shadow-emerald-950/40 min-h-[40px] active:scale-[0.98]"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
