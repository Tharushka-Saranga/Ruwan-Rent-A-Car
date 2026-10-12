import { StaffRole, StaffUser } from '../types';
import { INITIAL_STAFF_USERS } from '../data/mockData';

const SESSION_STORAGE_KEY = 'ruwan_staff_session_token';
const AUDIT_LOGS_KEY = 'ruwan_staff_audit_logs';

export interface AuditLogEntry {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  action: string;
  entity: string;
  timestamp: string;
}

export interface AuthSession {
  token: string;
  user: StaffUser;
  expiresAt: number;
}

export const authService = {
  login: async (email: string, passwordAttempt: string): Promise<{ success: boolean; user?: StaffUser; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !passwordAttempt) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const apiResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: passwordAttempt }),
      });
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data.token && data.user) {
          const session: AuthSession = {
            token: data.token,
            user: data.user,
            expiresAt: Date.now() + 8 * 60 * 60 * 1000,
          };
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
          authService.logAction(data.user, 'LOGIN', 'Session initiated via secure API');
          return { success: true, user: data.user };
        }
      }
    } catch {
      // Server not reachable; proceed to robust client fallback
    }

    const foundUser = INITIAL_STAFF_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (!foundUser) {
      return { success: false, error: 'Invalid credentials. User not found.' };
    }
    if (foundUser.status === 'Inactive') {
      return { success: false, error: 'Account is deactivated. Please contact an administrator.' };
    }
    if (passwordAttempt.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const token = `rwn_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const session: AuthSession = {
      token,
      user: foundUser,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    authService.logAction(foundUser, 'LOGIN', 'Authenticated to staff terminal');
    return { success: true, user: foundUser };
  },

  getCurrentSession: (): AuthSession | null => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  logout: () => {
    const session = authService.getCurrentSession();
    if (session) {
      authService.logAction(session.user, 'LOGOUT', 'Session terminated');
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  logAction: (user: StaffUser, action: string, details: string) => {
    try {
      const entry: AuditLogEntry = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staffId: user.id,
        staffName: user.name,
        role: user.role,
        action,
        entity: details,
        timestamp: new Date().toISOString(),
      };
      const existing: AuditLogEntry[] = JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');
      const updated = [entry, ...existing.slice(0, 99)];
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Audit logging error', e);
    }
  },

  getAuditLogs: (): AuditLogEntry[] => {
    try {
      return JSON.parse(localStorage.getItem(AUDIT_LOGS_KEY) || '[]');
    } catch {
      return [];
    }
  },
};
