import React, { useState } from 'react';
import {
  Car,
  UserPlus,
  LayoutDashboard,
  Calendar,
  Users,
  ExternalLink,
  Shield,
  Key,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { StaffTab } from '../../types';
import { StaffDashboard } from './StaffDashboard';
import { VehicleManagementView } from './VehicleManagementView';
import { RentalManagementView } from './RentalManagementView';
import { CustomerDatabaseView } from './CustomerDatabaseView';
import { WalkInRegistrationModal } from './WalkInRegistrationModal';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';

interface StaffLayoutProps {
  onBackToPublicSite: () => void;
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ onBackToPublicSite }) => {
  const { staffUser } = useRental();
  const [activeTab, setActiveTab] = useState<StaffTab>('overview');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [preSelectedVehicleId, setPreSelectedVehicleId] = useState<string | undefined>(undefined);

  const handleOpenWalkIn = (vehicleId?: string) => {
    setPreSelectedVehicleId(vehicleId);
    setIsWalkInModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white tracking-tight text-base">Ruwan Car Rentals</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Staff Management
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Physical Showroom POS & Central Fleet Administration
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <BusinessHoursBadge variant="compact" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenWalkIn()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer min-h-[40px] active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Walk-In Customer</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-750 text-xs text-zinc-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{staffUser?.name || 'Desk Staff'}</span>
            </div>
            <button
              onClick={onBackToPublicSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors cursor-pointer min-h-[40px]"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="border-t border-zinc-800/80 bg-zinc-950/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1 touch-scroll">
            {[
              { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
              { id: 'availability-board', label: 'Vehicle Availability Board', icon: Calendar },
              { id: 'rentals', label: 'Rental Management', icon: Key },
              { id: 'customers', label: 'Customer Database', icon: Users },
              { id: 'vehicles', label: 'Fleet Vehicles', icon: Car },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as StaffTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[40px] ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <StaffDashboard
            onOpenWalkIn={() => handleOpenWalkIn()}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenWalkInWithVehicle={(vId) => handleOpenWalkIn(vId)}
          />
        )}
        {activeTab === 'availability-board' && (
          <VehicleManagementView
            onOpenWalkInWithVehicle={(vId) => handleOpenWalkIn(vId)}
          />
        )}
        {activeTab === 'rentals' && (
          <RentalManagementView onOpenWalkIn={() => handleOpenWalkIn()} />
        )}
        {activeTab === 'customers' && (
          <CustomerDatabaseView onOpenWalkIn={() => handleOpenWalkIn()} />
        )}
        {activeTab === 'vehicles' && (
          <VehicleManagementView
            onOpenWalkInWithVehicle={(vId) => handleOpenWalkIn(vId)}
          />
        )}
      </main>

      <WalkInRegistrationModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        preSelectedVehicleId={preSelectedVehicleId}
      />
    </div>
  );
};
