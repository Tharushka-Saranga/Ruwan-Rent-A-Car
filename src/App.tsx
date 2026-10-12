import React, { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { RentalProvider, useRental } from './context/RentalContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';
import { PrivacyTermsModal } from './components/common/PrivacyTermsModal';

// Public Pages
import { HomePage } from './components/pages/HomePage';
import { FindCarPage } from './components/pages/FindCarPage';
import { BookCarPage } from './components/pages/BookCarPage';
import { CarDetailsPage } from './components/pages/CarDetailsPage';
import { ListYourCarPage } from './components/pages/ListYourCarPage';
import { OwnerDashboardPage } from './components/pages/OwnerDashboardPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';

// Admin / Staff Components
import { StaffLoginPage } from './components/admin/StaffLoginPage';
import { AdminDashboardLayout } from './components/admin/AdminDashboardLayout';
import { WalkInRegistrationModal } from './components/staff/WalkInRegistrationModal';
import { RentalAgreementModal } from './components/documents/RentalAgreementModal';
import { RentalReceiptModal } from './components/documents/RentalReceiptModal';
import { VehicleInspectionModal } from './components/documents/VehicleInspectionModal';
import { CustomerProfileModal } from './components/staff/CustomerProfileModal';

import { PublicPage, Vehicle } from './types';

function AppContent() {
  const { currentPath, navigate, carIdParam, isStaffPath } = useRouter();
  const {
    vehicles,
    currentStaff,
    selectedRentalForAgreement,
    setSelectedRentalForAgreement,
    selectedRentalForReceipt,
    setSelectedRentalForReceipt,
    selectedCustomerModal,
    setSelectedCustomerModal,
  } = useRental();

  // State for public interactive modals & selected car
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [privacyModalType, setPrivacyModalType] = useState<'privacy' | 'terms' | null>(null);

  // Sync route param `/cars/:id` to selected vehicle
  useEffect(() => {
    if (carIdParam) {
      const found = vehicles.find((v) => v.id === carIdParam);
      if (found) {
        setSelectedVehicle(found);
      }
    }
  }, [carIdParam, vehicles]);

  // Map router path to PublicPage for Navbar state
  const getCurrentPublicPage = (): PublicPage => {
    if (currentPath === '/' || currentPath === '') return 'home';
    if (currentPath.startsWith('/cars/')) return 'car-details';
    if (currentPath === '/cars') return 'find-car';
    if (currentPath === '/book-a-car' || currentPath === '/book') return 'book-a-car';
    if (currentPath === '/list-your-car') return 'list-your-car';
    if (currentPath === '/owner-dashboard') return 'owner-dashboard';
    if (currentPath === '/about' || currentPath === '/why-choose-us') return 'about';
    if (currentPath === '/contact') return 'contact';
    return 'home';
  };

  const handleNavigate = (page: PublicPage) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'find-car':
        navigate('/cars');
        break;
      case 'book-a-car':
        navigate('/book-a-car');
        break;
      case 'list-your-car':
        navigate('/list-your-car');
        break;
      case 'owner-dashboard':
        navigate('/owner-dashboard');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'car-details':
        if (selectedVehicle) {
          navigate(`/cars/${selectedVehicle.id}`);
        } else {
          navigate('/cars');
        }
        break;
      default:
        navigate('/');
    }
  };

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    navigate(`/cars/${v.id}`);
  };

  const handleOpenStaffPortal = () => {
    if (currentStaff) {
      navigate('/staff/dashboard');
    } else {
      navigate('/staff/login');
    }
  };

  // If user is accessing staff/admin routes
  if (isStaffPath) {
    if (currentPath === '/staff/login') {
      return <StaffLoginPage />;
    }

    if (!currentStaff) {
      return <StaffLoginPage />;
    }

    return <AdminDashboardLayout />;
  }

  // Render Public Application with Header, Main, Footer, and Floating helpers
  const currentPage = getCurrentPublicPage();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Navbar with brand, links, hotlines, and quick actions */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenStaffPortal={handleOpenStaffPortal}
        onQuickWalkIn={() => setIsWalkInModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full" id="main-content">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
            onOpenStaffPortal={handleOpenStaffPortal}
          />
        )}
        {currentPage === 'find-car' && (
          <FindCarPage
            onSelectVehicle={handleSelectVehicle}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'book-a-car' && (
          <BookCarPage
            onSelectVehicle={handleSelectVehicle}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'car-details' && (
          <CarDetailsPage
            vehicle={selectedVehicle}
            onNavigate={handleNavigate}
            onOpenStaffPortal={handleOpenStaffPortal}
          />
        )}
        {currentPage === 'list-your-car' && (
          <ListYourCarPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'owner-dashboard' && (
          <OwnerDashboardPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Global Public Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenStaffPortal={handleOpenStaffPortal}
        onOpenPrivacyModal={() => setPrivacyModalType('privacy')}
        onOpenTermsModal={() => setPrivacyModalType('terms')}
      />

      {/* Smooth Back to Top Button */}
      <ScrollToTopButton />

      {/* Global Interactive Modals */}
      <WalkInRegistrationModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
      />

      {selectedRentalForAgreement && (
        <RentalAgreementModal
          rental={selectedRentalForAgreement}
          onClose={() => setSelectedRentalForAgreement(null)}
        />
      )}

      {selectedRentalForReceipt && (
        <RentalReceiptModal
          rental={selectedRentalForReceipt}
          onClose={() => setSelectedRentalForReceipt(null)}
        />
      )}

      {selectedCustomerModal && (
        <CustomerProfileModal
          customer={selectedCustomerModal}
          onClose={() => setSelectedCustomerModal(null)}
        />
      )}

      {privacyModalType && (
        <PrivacyTermsModal
          type={privacyModalType}
          onClose={() => setPrivacyModalType(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <RentalProvider>
        <AppContent />
      </RentalProvider>
    </RouterProvider>
  );
}
