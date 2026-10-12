import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Phone, Car, Compass, Calendar, Home, PhoneCall } from 'lucide-react';
import { PublicPage } from '../../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onOpenStaffPortal: () => void;
  onQuickWalkIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenStaffPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'find-car', label: 'Our Fleet' },
    { id: 'book-a-car', label: 'Book Online' },
    { id: 'about', label: 'Why Choose Us' },
    { id: 'list-your-car', label: 'List Your Car' },
    { id: 'contact', label: 'Contact & Office' },
  ];

  const handleLinkClick = (linkId: PublicPage) => {
    onNavigate(linkId);
    setMobileMenuOpen(false);
  };

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold"
      >
        Skip to main content
      </a>

      {/* Main Top Header */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 transition-all font-sans"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
            {/* Zone 1: Brand Wordmark & Emblem */}
            <div
              onClick={() => onNavigate('home')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Ruwan Car Rentals - Go to homepage"
              className="cursor-pointer group flex items-center shrink-0 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
            >
              <BrandLogo size="md" />
            </div>

            {/* Zone 2: Navigation Links for Desktop */}
            <nav
              role="navigation"
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-1 bg-zinc-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg"
            >
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 tracking-wide transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isActive
                        ? 'text-white bg-emerald-600/90 shadow-sm font-bold'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Direct Actions & Hotline */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <a
                href="tel:0705828190"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px]"
                title="Call Counter Hotline"
                aria-label="Call Hotline at 070 582 8190"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="font-mono text-xs">070 582 8190</span>
              </a>

              <button
                onClick={() => onNavigate('book-a-car')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 min-h-[44px] active:scale-[0.98]"
              >
                <Car className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Book a Car</span>
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:0705828190"
                className="sm:hidden p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Call Hotline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>

              <button
                onClick={() => onNavigate('book-a-car')}
                className="sm:hidden px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm whitespace-nowrap min-h-[44px] flex items-center justify-center active:scale-[0.98]"
                aria-label="Book a Car Online"
              >
                Book Car
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-white hover:bg-zinc-900 border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-zinc-300" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5 text-zinc-300" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className="lg:hidden border-t border-zinc-800 bg-zinc-950/98 backdrop-blur-2xl px-4 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <nav className="space-y-1" aria-label="Mobile Menu Links">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between min-h-[48px] active:scale-[0.98] ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-zinc-200 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" aria-hidden="true" />
                  </button>
                );
              })}
            </nav>

            {/* Direct Hotlines for Mobile Users */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <div className="bg-black/60 rounded-2xl p-3.5 border border-zinc-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Showroom Hotlines & Support
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <a
                    href="tel:0705828190"
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center font-bold text-white hover:text-emerald-400 min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>070 582 8190</span>
                  </a>
                  <a
                    href="tel:0759888895"
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center font-bold text-white hover:text-emerald-400 min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>075 988 8895</span>
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  onOpenStaffPortal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Staff Portal Terminal</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Ergonomic Mobile Sticky Bottom Thumb Navigation Bar (Only on public mobile views) */}
      <nav
        aria-label="Mobile Bottom Quick Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1.5 shadow-2xl safe-bottom"
      >
        <div className="grid grid-cols-4 items-center max-w-md mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] cursor-pointer transition-colors ${
              currentPage === 'home' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>
          <button
            onClick={() => onNavigate('find-car')}
            className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] cursor-pointer transition-colors ${
              currentPage === 'find-car' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Fleet</span>
          </button>
          <button
            onClick={() => onNavigate('book-a-car')}
            className={`flex flex-col items-center justify-center py-1.5 min-h-[48px] cursor-pointer transition-colors ${
              currentPage === 'book-a-car' ? 'text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Book</span>
          </button>
          <a
            href="tel:0705828190"
            className="flex flex-col items-center justify-center py-1.5 min-h-[48px] cursor-pointer text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <Phone className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] mt-0.5">Call</span>
          </a>
        </div>
      </nav>
    </>
  );
};
