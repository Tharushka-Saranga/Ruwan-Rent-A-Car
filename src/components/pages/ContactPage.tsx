import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Navigation,
  Send,
  CheckCircle,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Rental Inquiry');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-12 space-y-12 font-sans">
      {/* Header & Business Hours */}
      <div className="bg-zinc-950 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Physical Showroom & Customer Service
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Visit Our Office or Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
            "Prefer to rent in person? Visit our physical office and our team will help you choose and rent a vehicle." Our counter team is available 7 days a week.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BusinessHoursBadge variant="card" />
        </div>
      </div>

      {/* Main Grid: Office Details on Left, Message Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Physical Office Location & Directions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <span>Physical Rental Office Information</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black border border-zinc-850 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Office Physical Address:</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <a
                    href="https://goo.gl/maps/yz3jrh4wQmJaijjn6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 underline break-all flex items-center gap-1.5"
                  >
                    <span>https://goo.gl/maps/yz3jrh4wQmJaijjn6</span>
                    <Navigation className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                  <a
                    href="https://goo.gl/maps/yz3jrh4wQmJaijjn6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-colors min-h-[44px]"
                  >
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Open Google Maps</span>
                  </a>
                </div>
                <div className="text-[11px] text-zinc-300">
                  Ruwan Car Rentals Main Hub · Founder & Owner: <strong className="text-white">Ruwan Thilakarathne</strong> · Sri Lanka Office
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Line 1 Card */}
                <div className="p-4 rounded-2xl bg-black border border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                      Hotline Line 1:
                    </span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                      PRIMARY
                    </span>
                  </div>
                  <div className="text-base font-mono text-white font-bold">
                    070 582 8190
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="tel:0705828190"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-700 transition-colors min-h-[44px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href="https://wa.me/94705828190"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors min-h-[44px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <div className="text-[10px] text-zinc-400">Available 7:00 AM – 9:00 PM Daily</div>
                </div>

                {/* Phone Line 2 Card */}
                <div className="p-4 rounded-2xl bg-black border border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                      Hotline Line 2:
                    </span>
                    <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-bold">
                      SECONDARY
                    </span>
                  </div>
                  <div className="text-base font-mono text-white font-bold">
                    075 988 8895
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="tel:0759888895"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-700 transition-colors min-h-[44px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href="https://wa.me/94759888895"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors min-h-[44px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <div className="text-[10px] text-zinc-400">Direct bookings & counter inquiries</div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-black border border-zinc-850 space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Official Desk Email:</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <a
                    href="mailto:tharushkasaranga123@gmail.com"
                    className="text-sm font-mono text-emerald-400 hover:underline font-semibold"
                  >
                    tharushkasaranga123@gmail.com
                  </a>
                  <a
                    href="mailto:tharushkasaranga123@gmail.com"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs border border-zinc-800 min-h-[40px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Send Email</span>
                  </a>
                </div>
                <div className="text-[10px] text-zinc-400">Online reservation confirmations & corporate quotes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Inquiry Form */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Message Our Team
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Send an Inquiry to Counter Staff
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              For corporate accounts, long-term rentals, or vehicle consignment questions.
            </p>
          </div>

          {sentSuccess ? (
            <div className="p-6 rounded-2xl bg-black border border-emerald-500/40 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" aria-hidden="true" />
              <h3 className="font-bold text-white text-sm">Message Successfully Sent!</h3>
              <p className="text-xs text-zinc-400">
                Our front desk team will contact you shortly at <strong>{email}</strong> during office hours (7:00 AM – 9:00 PM).
              </p>
              <button
                onClick={() => setSentSuccess(false)}
                className="mt-2 px-5 py-2.5 bg-zinc-900 text-zinc-200 text-xs rounded-xl hover:bg-zinc-800 min-h-[44px]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="contact-name" className="block text-zinc-400 mb-1 font-medium">Your Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-zinc-400 mb-1 font-medium">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-zinc-400 mb-1 font-medium">Inquiry Topic</label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-medium min-h-[44px]"
                >
                  <option value="Rental Inquiry">Rental Inquiry / Vehicle Reservation</option>
                  <option value="Consignment Inquiry">List My Car / Consignment Partnership</option>
                  <option value="Corporate Account">Corporate / Commercial Accounts</option>
                  <option value="Lost & Found">Lost & Found / Vehicle Return</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-zinc-400 mb-1 font-medium">Message Details *</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Tell us what dates or vehicles you're interested in..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-zinc-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 min-h-[44px] active:scale-[0.98]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Submit Message to Desk</span>
              </button>
            </form>
          )}

          <div className="p-3 bg-black rounded-xl border border-zinc-850 text-[11px] text-zinc-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Your contact info is protected and strictly used for rental service.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
