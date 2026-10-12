import React, { useState } from 'react';
import {
  Car,
  Lock,
  Mail,
  Shield,
  AlertTriangle,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { useRental } from '../../context/RentalContext';
import { useRouter } from '../../context/RouterContext';
import { BusinessHoursBadge } from '../common/BusinessHoursBadge';

export const StaffLoginPage: React.FC = () => {
  const { loginStaff } = useRental();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('admin@ruwancarrentals.com');
  const [password, setPassword] = useState('demoAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginStaff(email, password);
      if (res.success) {
        navigate('/staff/dashboard');
      } else {
        setErrorMsg(res.error || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server authentication error');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role: 'ADMIN' | 'STAFF') => {
    if (role === 'ADMIN') {
      setEmail('admin@ruwancarrentals.com');
      setPassword('adminPass2026!');
    } else {
      setEmail('alex.desk@ruwancarrentals.com');
      setPassword('staffPass2026!');
    }
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[44px]"
        >
          <Car className="w-4 h-4 text-emerald-400" />
          <span>Return to Public Website</span>
        </button>
        <BusinessHoursBadge variant="compact" />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 mx-auto shadow-xl shadow-emerald-950/50">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Shield className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight pt-2">
            Staff & Admin Authentication
          </h1>
          <p className="text-xs text-zinc-400">
            Ruwan Car Rentals – Secure Fleet & POS Terminal
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold">Staff Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@ruwancarrentals.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-750 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-zinc-950 border border-zinc-750 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-[0.98]"
          >
            {loading ? (
              <span>Verifying session credentials...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Terminal</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Switcher */}
        <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
            <span>Quick Demo Role Profiles:</span>
            <span>Click to autofill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('ADMIN')}
              className={`p-2.5 rounded-xl border text-left transition-all min-h-[44px] active:scale-[0.98] ${
                email.includes('admin')
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
              }`}
            >
              <div className="font-bold text-xs text-white">Administrator</div>
              <div className="text-[10px] text-zinc-400">Full Access</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('STAFF')}
              className={`p-2.5 rounded-xl border text-left transition-all min-h-[44px] active:scale-[0.98] ${
                email.includes('alex')
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-850'
              }`}
            >
              <div className="font-bold text-xs text-white">Staff Counter</div>
              <div className="text-[10px] text-zinc-400">Desk Operations</div>
            </button>
          </div>
        </div>

        <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-850 text-[11px] text-zinc-500 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role-Based Security Active</span>
          </div>
          <p>
            Customer driver licenses and financial tender tokens are protected and restricted to authenticated personnel.
          </p>
        </div>
      </div>

      <div className="text-center text-[11px] text-zinc-600 py-2">
        Ruwan Car Rentals Operations Terminal · Operating Daily 7:00 AM – 9:00 PM
      </div>
    </div>
  );
};
