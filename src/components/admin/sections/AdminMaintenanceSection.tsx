import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  Filter,
  PlusCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';

export const AdminMaintenanceSection: React.FC = () => {
  const { maintenance, vehicles, addMaintenanceRecord, updateMaintenanceStatus } = useRental();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [vehicleId, setVehicleId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('Routine 150-Pt Service');
  const [mileage, setMileage] = useState(25000);
  const [cost, setCost] = useState(180);
  const [description, setDescription] = useState('Full multi-point inspection, oil & filter change, brake fluid top-up');
  const [nextServiceDate] = useState('2026-12-15');
  const [serviceStatus] = useState<'Scheduled' | 'In Progress'>('Scheduled');

  const filteredMaintenance = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return maintenance.filter((m) => {
      const matchSearch =
        !q ||
        m.id.toLowerCase().includes(q) ||
        m.vehicleName.toLowerCase().includes(q) ||
        m.vehiclePlate.toLowerCase().includes(q) ||
        m.maintenanceType.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      return true;
    });
  }, [maintenance, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const inService = maintenance.filter((m) => m.status === 'In Progress' || m.status === 'Scheduled').length;
    const totalSpent = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
    const completedCount = maintenance.filter((m) => m.status === 'Completed').length;
    return { inService, totalSpent, completedCount };
  }, [maintenance]);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    addMaintenanceRecord({
      vehicleId: veh.id,
      vehicleName: `${veh.year} ${veh.make} ${veh.model}`,
      vehiclePlate: veh.licensePlate,
      maintenanceType,
      date: new Date().toISOString().split('T')[0],
      mileage: Number(mileage),
      cost: Number(cost),
      description,
      nextServiceDate,
      status: serviceStatus,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white tracking-tight">Fleet Maintenance & Service Log</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Track repairs, 150-point safety certifications, oil changes, and fleet turnaround.
          </p>
        </div>
        <button
          onClick={() => {
            if (vehicles.length > 0) setVehicleId(vehicles[0].id);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Service Work</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Vehicles in Service</span>
          <div className="text-2xl font-black text-amber-400 tabular-nums">{stats.inService}</div>
          <p className="text-[11px] text-zinc-500">Currently in bay / scheduled</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Cumulative Service Cost</span>
          <div className="text-2xl font-black text-white tabular-nums">${stats.totalSpent.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500">Fleet upkeep expenses</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Completed Inspections</span>
          <div className="text-2xl font-black text-emerald-400 tabular-nums">{stats.completedCount}</div>
          <p className="text-[11px] text-zinc-500">Certified road-ready</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by vehicle, license plate, or service type..."
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
            <option value="all">All Service Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950/70 text-zinc-400 uppercase text-[11px] font-bold tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Log ID & Date</th>
                <th className="px-5 py-3.5">Vehicle & Plate</th>
                <th className="px-5 py-3.5">Service Type</th>
                <th className="px-5 py-3.5">Odometer</th>
                <th className="px-5 py-3.5">Cost</th>
                <th className="px-5 py-3.5">Next Due</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredMaintenance.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-850/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-mono font-bold text-white text-xs">{m.id}</div>
                    <div className="text-[11px] text-zinc-500">{m.date}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-white">{m.vehicleName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{m.vehiclePlate}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-zinc-200">{m.maintenanceType}</div>
                    <div className="text-[11px] text-zinc-500 max-w-xs truncate">{m.description}</div>
                  </td>
                  <td className="px-5 py-4 font-mono">{m.mileage.toLocaleString()} mi</td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400">${m.cost}</td>
                  <td className="px-5 py-4 text-zinc-400">{m.nextServiceDate || 'N/A'}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        m.status === 'Completed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : m.status === 'In Progress'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{m.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {m.status !== 'Completed' ? (
                      <button
                        onClick={() => updateMaintenanceStatus(m.id, 'Completed')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer min-h-[36px]"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Pass & Release</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500">Released to Fleet</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Work Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-zinc-100 my-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Log Vehicle Service Work</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Select Fleet Vehicle</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.year} {v.make} {v.model} ({v.licensePlate}) – Status: {v.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Maintenance Type</label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                >
                  <option value="Routine 150-Pt Service">Routine 150-Pt Service</option>
                  <option value="Oil & Filter Change">Oil & Filter Change</option>
                  <option value="Brake Pad & Rotor Replacement">Brake Pad & Rotor Replacement</option>
                  <option value="Tire Rotation / Replacement">Tire Rotation / Replacement</option>
                  <option value="Detailing & Interior Sanitization">Detailing & Interior Sanitization</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Odometer (mi)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Service Cost ($)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Service Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-zinc-100 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-semibold cursor-pointer min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-lg shadow-emerald-950/40 min-h-[40px] active:scale-[0.98]"
                >
                  Save Service Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
