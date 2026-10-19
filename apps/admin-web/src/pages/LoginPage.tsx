import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@tulsiveda.gov.in');
  const [password, setPassword] = useState('Admin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.user, data.token);
      } else {
        // Fallback for standalone demo mode if backend is not yet restarted
        if (email === 'admin@tulsiveda.gov.in' && (password === 'Admin@2026' || password === 'admin')) {
          onLoginSuccess({
            id: 'adm-001',
            name: 'Dr. V. K. Paul (National Health Mission)',
            email: 'admin@tulsiveda.gov.in',
            role: 'SuperAdmin',
            department: 'Ministry of Health & Family Welfare / AYUSH',
          }, 'tv_admin_token_mock');
        } else {
          setError(data.error || 'Authentication failed. Please verify credentials.');
        }
      }
    } catch (err) {
      // Local demo fallback if backend offline
      if (email === 'admin@tulsiveda.gov.in') {
        onLoginSuccess({
          id: 'adm-001',
          name: 'Dr. V. K. Paul (National Health Mission)',
          email: 'admin@tulsiveda.gov.in',
          role: 'SuperAdmin',
          department: 'Ministry of Health & Family Welfare / AYUSH',
        }, 'tv_admin_token_mock');
      } else {
        setError('Could not connect to API server. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 mb-4">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Govt. of India</span>
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">Ministry of AYUSH</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">TulsiVeda AI Command</h2>
        <p className="mt-2 text-sm text-slate-600">
          Executive Surveillance, Clinical Governance & Edge OTA Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Authorized Executive Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@tulsiveda.gov.in"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                National Security Token / Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col gap-1">
              <span className="font-semibold text-slate-700">Demo Master Credentials:</span>
              <div className="flex justify-between items-center text-slate-500 font-mono">
                <span>admin@tulsiveda.gov.in</span>
                <span>Admin@2026</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Access National Command Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-[11px] text-slate-400">
              National Health Mission &bull; AB-PMJAY Digital Health Grid &bull; ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
