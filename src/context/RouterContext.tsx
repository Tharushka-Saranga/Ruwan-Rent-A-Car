import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppRoute =
  | '/'
  | '/cars'
  | '/cars/:id'
  | '/book-a-car'
  | '/book'
  | '/list-your-car'
  | '/owner-dashboard'
  | '/about'
  | '/why-choose-us'
  | '/contact'
  | '/staff/login'
  | '/staff/dashboard'
  | '/staff/customers'
  | '/staff/vehicles'
  | '/staff/bookings'
  | '/staff/rentals'
  | '/staff/walk-in'
  | '/staff/owners'
  | '/staff/payments'
  | '/staff/calendar'
  | '/staff/maintenance'
  | '/staff/reports'
  | '/staff/staff-management'
  | '/staff/settings';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  carIdParam: string | null;
  isStaffPath: boolean;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
        setCurrentPath(path);
        // Smooth scroll to top on page transition with layout stability
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Extract car id parameter: /cars/veh-001
  let carIdParam: string | null = null;
  if (currentPath.startsWith('/cars/') && currentPath !== '/cars') {
    carIdParam = currentPath.replace('/cars/', '').split('/')[0] || null;
  }

  const isStaffPath = currentPath.startsWith('/staff');

  return (
    <RouterContext.Provider value={{ currentPath, navigate, carIdParam, isStaffPath }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
