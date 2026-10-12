import React from 'react';
import {
  MapPin,
  ExternalLink,
  MessageCircle,
  KeyRound,
  Clock,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { BUSINESS_INFO } from '../../data/mockData';
import { PublicPage } from '../../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: PublicPage) => void;
  onOpenStaffPortal: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenStaffPortal,
  onOpenPrivacyModal,
  onOpenTermsModal,
}) => {
  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className="relative z-10 bg-black/95 border-t border-zinc-800 text-white font-sans backdrop-blur-2xl pb-16 lg:pb-0"
    >
      {/* Subtle top neon emerald gradient highlight line */}
      <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.5)]" />

      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* COLUMN 1: BRAND LOGO & OPERATING LICENSE (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-xs text-zinc-300 leading-relaxed max-w-sm">
              Ruwan Car Rentals provides reliable vehicle rentals in Sri Lanka with flexible self-drive options, professional drivers, and 24/7 customer assistance. Experience seamless journeys with complete peace of mind.
            </p>
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>
                  Operating License: <strong className="text-white font-semibold">{BUSINESS_INFO.licenseNumberPlaceholder}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: PHYSICAL RENTAL OFFICE (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>PHYSICAL RENTAL OFFICE</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Showroom Address & Google Maps link */}
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  ADDRESS:
                </span>
                <a
                  href="https://goo.gl/maps/yz3jrh4wQmJaijjn6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-xs leading-relaxed inline-flex items-center gap-1.5 break-all hover:underline group"
                  title="View Showroom on Google Maps"
                >
                  <span className="break-all">https://goo.gl/maps/yz3jrh4wQmJaijjn6</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                </a>
              </div>

              {/* Hotlines with WhatsApp Badges */}
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider mb-1.5">
                  HOTLINES:
                </span>
                <div className="space-y-2 font-mono text-xs">
                  {/* Line 1 */}
                  <div className="flex items-center flex-wrap gap-2 text-zinc-300">
                    <span className="text-zinc-400 text-[11px]">Line 1:</span>
                    <a
                      href="tel:0705828190"
                      className="text-white hover:text-emerald-400 font-bold transition-colors"
                    >
                      070 582 8190
                    </a>
                    <a
                      href="https://wa.me/94705828190"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-[11px] font-sans font-semibold transition-all ml-auto"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Line 2 */}
                  <div className="flex items-center flex-wrap gap-2 text-zinc-300">
                    <span className="text-zinc-400 text-[11px]">Line 2:</span>
                    <a
                      href="tel:0759888895"
                      className="text-white hover:text-emerald-400 font-bold transition-colors"
                    >
                      075 988 8895
                    </a>
                    <a
                      href="https://wa.me/94759888895"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-[11px] font-sans font-semibold transition-all ml-auto"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Desk Email */}
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  DESK EMAIL:
                </span>
                <a
                  href="mailto:tharushkasaranga123@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300 hover:underline font-mono text-xs block truncate font-medium"
                >
                  tharushkasaranga123@gmail.com
                </a>
              </div>

              {/* Business Hours */}
              <div className="pt-1 flex items-center justify-between gap-2 text-zinc-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="text-xs">Open Daily: 7:00 AM – 9:00 PM</span>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase tracking-wider shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span>LIVE</span>
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: QUICK LINKS (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              QUICK LINKS
            </h3>
            <ul className="space-y-2.5 text-xs text-zinc-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left block"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-car')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left block"
                >
                  Available Fleet Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left block"
                >
                  Why Choose Us & Inspection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left block"
                >
                  Physical Office & Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('list-your-car')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left block"
                >
                  List Your Car (Partner Fleet)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('owner-dashboard')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left block"
                >
                  Owner Portal
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: STAFF PORTAL CARD (lg:col-span-3) */}
          <div className="lg:col-span-3 bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-2xl transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>STAFF PORTAL</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Authorized front-counter dispatch officers and fleet administrators can sign in here to manage reservations, vehicle fleet, and returns.
              </p>
            </div>
            <button
              onClick={onOpenStaffPortal}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/80 hover:shadow-emerald-900 min-h-[44px] group"
            >
              <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
              <span>Staff Login</span>
            </button>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            &copy; 2026 {BUSINESS_INFO.name}. All rights reserved. Sri Lanka.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={onOpenPrivacyModal}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <button
              onClick={onOpenTermsModal}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Rental Terms & Late Return Policy
            </button>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <button
              onClick={onOpenStaffPortal}
              className="hover:text-emerald-300 text-emerald-400 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
