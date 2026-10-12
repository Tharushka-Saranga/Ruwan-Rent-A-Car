import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  List,
  PlusCircle,
  Edit,
  Trash2,
  Search,
} from 'lucide-react';
import { useRental } from '../../../context/RentalContext';
import { Vehicle, VehicleCategory, VehicleStatus } from '../../../types';
import { formatLKR, formatRawLKR, getVehicleExtraHourRate, formatExtraHourRate } from '../../../utils/currency';
import { CarImageUploader } from '../CarImageUploader';

export const AdminVehiclesSection: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, removeVehicle, updateVehicleStatus } = useRental();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [make, setMake] = useState('Mercedes-Benz');
  const [model, setModel] = useState('E-Class');
  const [year, setYear] = useState(2024);
  const [regNumber, setRegNumber] = useState('MB-9021');
  const [vin, setVin] = useState('1FA6P8CF9R5110***');
  const [mileage, setMileage] = useState(12000);
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [fuel, setFuel] = useState<'Gasoline' | 'Electric' | 'Hybrid' | 'Diesel'>('Gasoline');
  const [seats, setSeats] = useState(5);
  const [dailyPrice, setDailyPrice] = useState(175);
  const [extraHourPrice, setExtraHourPrice] = useState(2500);
  const [deposit, setDeposit] = useState(750);
  const [location, setLocation] = useState('Central Office Terminal');
  const [owner, setOwner] = useState('Ruwan Fleet');
  const [status, setStatus] = useState<VehicleStatus>('Available');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=75&fm=webp'
  );
  const [carImages, setCarImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=75&fm=webp',
  ]);
  const [category, setCategory] = useState<VehicleCategory>('Luxury');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingVehicle(null);
    setMake('BMW');
    setModel('530i M Sport');
    setYear(2024);
    setRegNumber('BMW-5301');
    setVin('WBA53098192***');
    setMileage(8500);
    setTransmission('Automatic');
    setFuel('Hybrid');
    setSeats(5);
    setDailyPrice(185);
    setExtraHourPrice(2800);
    setDeposit(800);
    setLocation('Central Office Terminal');
    setOwner('Ruwan Fleet');
    setStatus('Available');
    setCategory('Luxury');
    const defaultImg = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=75&fm=webp';
    setImageUrl(defaultImg);
    setCarImages([defaultImg]);
    setDescription('Executive mid-size luxury sedan.');
    setModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setMake(v.make);
    setModel(v.model);
    setYear(v.year);
    setRegNumber(v.licensePlate);
    setVin(v.vinPlaceholder);
    setMileage(v.mileage);
    setTransmission(v.transmission);
    setFuel(v.fuel);
    setSeats(v.seats);
    setDailyPrice(v.dailyRate);
    setExtraHourPrice(v.extraHourRate || getVehicleExtraHourRate(v));
    setDeposit(v.securityDeposit);
    setLocation(v.officeLocation);
    setOwner(v.ownerName || 'Ruwan Fleet');
    setStatus(v.status);
    setCategory(v.category);
    setImageUrl(v.imageUrl);
    setCarImages(v.images && v.images.length > 0 ? v.images : [v.imageUrl]);
    setDescription(v.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryImg = imageUrl || (carImages.length > 0 ? carImages[0] : '');
    const allImages = carImages.length > 0 ? carImages : primaryImg ? [primaryImg] : [];

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        make,
        model,
        year: Number(year),
        licensePlate: regNumber,
        vinPlaceholder: vin,
        mileage: Number(mileage),
        transmission,
        fuel,
        seats: Number(seats),
        dailyRate: Number(dailyPrice),
        extraHourRate: Number(extraHourPrice),
        securityDeposit: Number(deposit),
        officeLocation: location,
        ownerName: owner,
        status,
        category,
        imageUrl: primaryImg,
        images: allImages,
        description,
      });
    } else {
      addVehicle({
        make,
        model,
        year: Number(year),
        licensePlate: regNumber,
        vinPlaceholder: vin,
        color: 'Black Metallic',
        luggage: 4,
        mileage: Number(mileage),
        transmission,
        fuel,
        seats: Number(seats),
        dailyRate: Number(dailyPrice),
        extraHourRate: Number(extraHourPrice),
        securityDeposit: Number(deposit),
        officeLocation: location,
        ownerName: owner,
        status,
        category,
        imageUrl: primaryImg,
        images: allImages,
        description,
        features: ['Navigation', 'Leather Seats', 'Rear Camera', 'Bluetooth'],
      });
    }
    setModalOpen(false);
  };

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return vehicles.filter((v) => {
      const matchSearch =
        !q ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.licensePlate.toLowerCase().includes(q) ||
        v.vinPlaceholder.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q);
      if (!matchSearch) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
      return true;
    });
  }, [vehicles, searchTerm, statusFilter, categoryFilter]);

  const getStatusBadge = (st: VehicleStatus) => {
    switch (st) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Rented':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Reserved':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Returning Today':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Maintenance':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Pending Inspection':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-750';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Fleet Asset Management
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Vehicle Fleet Inventory ({vehicles.length} Total)
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time status management, maintenance control, and multi-view inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px] ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[36px] ${
                viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table View</span>
            </button>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search make, model, registration, VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 min-h-[44px]"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Rented">Rented</option>
            <option value="Returning Today">Returning Today</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Pending Inspection">Pending Inspection</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 min-h-[44px]"
          >
            <option value="all">All Categories</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
            <option value="Sports">Sports</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={v.imageUrl}
                    alt={v.model}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${getStatusBadge(
                        v.status
                      )}`}
                    >
                      {v.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-xs font-bold text-white">
                    {v.licensePlate}
                  </div>
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-zinc-300">
                    {v.category} · {v.fuel} · {v.transmission}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {v.make} {v.model} ({v.year})
                      </h3>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        VIN: {v.vinPlaceholder}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base tabular-nums">
                        {formatLKR(v.dailyRate)}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">/day (LKR)</span>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold block mt-0.5 tabular-nums">
                        +{formatExtraHourRate(v.extraHourRate || getVehicleExtraHourRate(v))} extra
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                    <div>
                      <span className="text-zinc-500 block">Mileage</span>
                      <span className="font-mono text-zinc-200">{v.mileage.toLocaleString()} mi</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Deposit</span>
                      <span className="font-mono text-zinc-200">{formatLKR(v.securityDeposit)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Owner</span>
                      <span className="text-zinc-200 truncate block">{v.ownerName || 'Ruwan Fleet'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Location</span>
                      <span className="text-zinc-200 truncate block">{v.officeLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-zinc-800/80 mt-2 flex items-center justify-between text-xs">
                <select
                  value={v.status}
                  onChange={(e) => updateVehicleStatus(v.id, e.target.value as VehicleStatus)}
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-300 text-xs min-h-[36px]"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Rented">Rented</option>
                  <option value="Returning Today">Returning Today</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Pending Inspection">Pending Inspection</option>
                  <option value="Unavailable">Unavailable</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                    title="Edit vehicle details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${v.make} ${v.model} from fleet?`)) {
                        removeVehicle(v.id);
                      }
                    }}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto touch-scroll">
            <table className="w-full text-xs text-left">
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[11px] border-b border-zinc-800 font-semibold">
                <tr>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Reg / VIN</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Mileage</th>
                  <th className="p-4">Rates (Daily / Extra Hr)</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-850/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{v.make} {v.model} ({v.year})</div>
                      <div className="text-[11px] text-zinc-500">{v.transmission} · {v.fuel}</div>
                    </td>
                    <td className="p-4 font-mono">
                      <div className="text-zinc-200 font-bold">{v.licensePlate}</div>
                      <div className="text-[10px] text-zinc-500">{v.vinPlaceholder}</div>
                    </td>
                    <td className="p-4 text-zinc-300">{v.category}</td>
                    <td className="p-4 font-mono text-zinc-300">{v.mileage.toLocaleString()} mi</td>
                    <td className="p-4 font-mono">
                      <div className="font-bold text-emerald-400 tabular-nums">{formatLKR(v.dailyRate)}/day</div>
                      <div className="text-[11px] text-amber-400 font-medium tabular-nums">+{formatExtraHourRate(v.extraHourRate || getVehicleExtraHourRate(v))}</div>
                    </td>
                    <td className="p-4 text-zinc-300">{v.ownerName || 'Ruwan Fleet'}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(v)}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors flex items-center gap-1 min-h-[36px]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-4"
        >
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 text-zinc-100 my-auto shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingVehicle ? `Edit Vehicle: ${editingVehicle.licensePlate}` : 'Add New Vehicle to Fleet'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white font-mono uppercase min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">VIN Number</label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white font-mono min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Mileage (mi)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Fuel Type</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Seats</label>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Daily Rate ($)</label>
                  <input
                    type="number"
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2 text-white font-mono min-h-[40px]"
                  />
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                    {formatLKR(dailyPrice)}/day
                  </span>
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-semibold flex items-center justify-between">
                    <span>Extra Hour (Rs.) *</span>
                    <span className="text-amber-400 font-mono text-[10px] font-bold">
                      {formatRawLKR(extraHourPrice)}/hr
                    </span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={50}
                    value={extraHourPrice}
                    onChange={(e) => setExtraHourPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-amber-600/60 focus:border-amber-400 rounded-xl p-2 text-amber-300 font-mono font-bold min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Security Deposit</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2 text-white font-mono min-h-[40px]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Fleet Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                    className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2 text-white min-h-[40px]"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Rented">Rented</option>
                    <option value="Returning Today">Returning Today</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Drag-and-Drop Image Uploader */}
              <div className="pt-2">
                <CarImageUploader
                  primaryImage={imageUrl}
                  images={carImages}
                  onChange={(primary, list) => {
                    setImageUrl(primary);
                    setCarImages(list);
                  }}
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Vehicle Description & Specifications</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-750 rounded-xl p-2 text-white"
                />
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
