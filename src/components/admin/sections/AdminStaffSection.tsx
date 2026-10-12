import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  UserPlus,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { authService } from '../../../services/authService';

export const AdminStaffSection: React.FC = () => {
  const { staffList, currentStaff } = useRental();
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'audit'>('members');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const isAdmin = currentStaff?.role === 'ADMIN';
  const auditLogs = authService.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Staff & Access Control</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Role-based permissions, POS operator credentials, and operational audit trails.
          </p>
        </div>
        {isAdmin ? (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Account</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Staff Role Active: Read-Only Staff Directory</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
            activeTab === 'members'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Staff Directory ({staffList.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
            activeTab === 'roles'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Role Permission Matrix
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[36px] ${
            activeTab === 'audit'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'members' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto touch-scroll">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950/70 text-zinc-400 uppercase text-[11px] font-bold tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3.5">Staff Name & Badge</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Contact Email & Phone</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last Authenticated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{st.name}</span>
                        {st.id === currentStaff?.id && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">Badge: {st.badgeId}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          st.role === 'ADMIN'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
                            : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>{st.role}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 space-y-0.5">
                      <div className="text-zinc-200">{st.email}</div>
                      <div className="text-[11px] text-zinc-500">{st.phone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          st.status === 'Active'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-zinc-400 bg-zinc-800'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{st.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">
                      {st.lastLogin || '2026-10-07 18:30'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-purple-800/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">ADMIN Role</h3>
                <span className="text-[11px] text-purple-400 font-semibold">Full Unrestricted Authorization</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              Administrators have complete management rights over the physical rental business, financial ledgers, staff access, and consignor commissions.
            </p>
          </div>

          <div className="bg-zinc-900 border border-blue-800/40 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">STAFF Role</h3>
                <span className="text-[11px] text-blue-400 font-semibold">Front-Desk & Fleet Operations</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">
              Desk staff handle daily office walk-ins, vehicle handovers, customer registration, POS payments, returns, and inspection sign-offs.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="font-bold text-white text-sm">Desk Security Audit Logs</h3>
            <span className="text-xs text-zinc-500 font-mono">Recorded in real-time</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto touch-scroll">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.staffName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                        {log.role}
                      </span>
                      <span className="text-emerald-400 font-semibold">{log.action}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">{log.entity}</p>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-500 text-xs">
                Active session audit logging enabled.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-zinc-100 my-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-base">Add Staff Account</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-zinc-400 mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 rounded-xl text-zinc-300 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl min-h-[40px]"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
