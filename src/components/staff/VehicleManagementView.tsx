import React, { useState } from 'react';
import {
  Car,
  CheckCircle,
  PlusCircle,
  Key,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { VehicleCategory, VehicleStatus } from '../../types';
import { formatLKR } from '../../utils/currency';

export const VehicleManagementView: React.FC<{ onOpenWalkInWithVehicle?: (vehicleId: string) => void }> = ({
  onOpenWalkInWithVehicle,
}) => {
  const { vehicles, updateVehicleStatus, addVehicle } = useRental();

  const [filterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newMake, setNewMake] = useState('Mercedes-Benz');
  const [newModel, setNewModel] = useState('C-Class Sedan');
  const [newYear, setNewYear] = useState(2024);
  const [newCategory, setNewCategory] = useState<VehicleCategory>('Luxury');
  const [newPlate, setNewPlate] = useState('MB-9022');
  const [newRate, setNewRate] = useState(139);
  const [newDeposit, setNewDeposit] = useState(600);
  const [newMileage, setNewMileage] = useState(8500);
  const [newImage] = useState(
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=75&fm=webp'
  );

  const filteredVehicles = vehicles.filter((v) => {
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    return true;
  });

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Reserved':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Rented':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Returning Today':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Pending Inspection':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
      case 'Maintenance':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-750';
    }
  };

  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle({
      make: newMake,
      model: newModel,
      year: Number(newYear),
      category: newCategory,
      transmission: 'Automatic',
      fuel: 'Gasoline',
      seats: 5,
      luggage: 4,
      dailyRate: Number(newRate),
      securityDeposit: Number(newDeposit),
      licensePlate: newPlate,
      vinPlaceholder: 'VIN-FLEET-NEW-109***',
      color: 'Obsidian Black',
      mileage: Number(newMileage),
      status: 'Available',
      imageUrl: newImage,
      features: ['Apple CarPlay', 'Leather Interior', 'Reverse Camera', 'Heated Seats'],
      ownerName: 'Ruwan Fleet',
      officeLocation: 'Central Office Terminal',
      description: 'Fleet addition registered via staff terminal.',
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <span>Vehicle Fleet Inventory & Availability Board</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time status tracking synced across online bookings and physical office walk-ins
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {[
          { status: 'Available', count: vehicles.filter((v) => v.status === 'Available').length, color: 'text-emerald-400' },
          { status: 'Reserved', count: vehicles.filter((v) => v.status === 'Reserved').length, color: 'text-purple-400' },
          { status: 'Rented', count: vehicles.filter((v) => v.status === 'Rented').length, color: 'text-blue-400' },
          { status: 'Returning Today', count: vehicles.filter((v) => v.status === 'Returning Today').length, color: 'text-amber-400' },
          { status: 'Pending Inspection', count: vehicles.filter((v) => v.status === 'Pending Inspection').length, color: 'text-orange-400' },
          { status: 'Maintenance', count: vehicles.filter((v) => v.status === 'Maintenance').length, color: 'text-red-400' },
          { status: 'Unavailable', count: vehicles.filter((v) => v.status === 'Unavailable').length, color: 'text-zinc-500' },
        ].map((item) => (
          <div
            key={item.status}
            onClick={() => setFilterStatus(filterStatus === item.status ? 'all' : item.status)}
            className={`p-3 rounded-2xl border bg-zinc-900 cursor-pointer transition-all ${
              filterStatus === item.status ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className={`text-xl font-bold font-mono tabular-nums ${item.color}`}>{item.count}</div>
            <div className="text-[11px] text-zinc-400 font-medium truncate">{item.status}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-750 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-zinc-950 overflow-hidden">
                <img
                  src={v.imageUrl}
                  alt={`${v.make} ${v.model}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusColor(
                      v.status
                    )}`}
                  >
                    {v.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-xs font-bold text-white border border-white/10">
                  {v.licensePlate}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {v.make} {v.model}
                    </h3>
                    <div className="text-xs text-zinc-400">
                      Model Year {v.year} · {v.color}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                      {formatLKR(v.dailyRate)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">/day</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-zinc-800/80 mt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-zinc-500">Change Status:</span>
                <select
                  value={v.status}
                  onChange={(e) => updateVehicleStatus(v.id, e.target.value as VehicleStatus)}
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-200 text-xs min-h-[36px]"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Rented">Rented</option>
                  <option value="Returning Today">Returning Today</option>
                  <option value="Pending Inspection">Pending Inspection</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              {v.status === 'Available' && onOpenWalkInWithVehicle && (
                <button
                  onClick={() => onOpenWalkInWithVehicle(v.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] active:scale-[0.98]"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Assign to Walk-In Customer</span>
                </button>
              )}

              {v.status === 'Pending Inspection' && (
                <button
                  onClick={() => updateVehicleStatus(v.id, 'Available')}
                  className="w-full py-2 bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 border border-orange-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] active:scale-[0.98]"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Pass Inspection & Release</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-zinc-100 my-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <span>Add Fleet Vehicle</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VehicleCategory)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white min-h-[44px]"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">License Plate</label>
                  <input
                    type="text"
                    required
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white font-mono uppercase min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Daily Rate ($)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Security Deposit ($)</label>
                  <input
                    type="number"
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white font-mono min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Current Mileage</label>
                  <input
                    type="number"
                    value={newMileage}
                    onChange={(e) => setNewMileage(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2 text-white font-mono min-h-[44px]"
                  />
                </div>
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white cursor-pointer min-h-[40px] active:scale-[0.98]"
                >
                  Save to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
