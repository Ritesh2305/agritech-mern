import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, register, switchDemoUser, logout, isLoading } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [region, setRegion] = useState('Warangal, Telangana');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Successfully logged in!');
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } else {
      const res = await register({ name, email, password, phone, role, region });
      if (res.success) {
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMsg(res.message || 'Registration failed');
      }
    }
  };

  const handleDemoSelect = async (type: 'admin' | 'ramesh' | 'lakshmi') => {
    await switchDemoUser(type);
    setSuccessMsg(`Switched to demo ${type}!`);
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 shadow-xl relative animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Current status if logged in */}
        {user ? (
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>Current Session</span>
              <span aria-hidden="true">·</span>
              <span>Active</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Signed in as {user.name}
            </h3>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-stone-500">Email:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Role:</span>
                <span className="font-semibold uppercase text-emerald-700 dark:text-emerald-400">{user.role}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="text-stone-800 dark:text-stone-200">{user.phone}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Switch Demo Persona:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDemoSelect('admin')}
                  className="px-2.5 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-medium text-stone-800 dark:text-stone-200 text-center"
                >
                  Admin Dr. Rao
                </button>
                <button
                  onClick={() => handleDemoSelect('ramesh')}
                  className="px-2.5 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-medium text-stone-800 dark:text-stone-200 text-center"
                >
                  Ramesh (Farmer)
                </button>
                <button
                  onClick={() => handleDemoSelect('lakshmi')}
                  className="px-2.5 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-xs font-medium text-stone-800 dark:text-stone-200 text-center"
                >
                  Lakshmi (Farmer)
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  setSuccessMsg('Logged out');
                }}
                className="w-full mt-4 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>Authentication</span>
              <span aria-hidden="true">·</span>
              <span>Role-Based Access</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              {mode === 'login' ? 'Sign In to AgriTech' : 'Register Farmer Account'}
            </h3>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mb-5 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                ⚡ 1-Click Instant Demo Login:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDemoSelect('admin')}
                  className="px-2 py-1.5 rounded-md bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-medium text-stone-800 dark:text-stone-200 text-center"
                >
                  Admin Dr. Rao
                </button>
                <button
                  onClick={() => handleDemoSelect('ramesh')}
                  className="px-2 py-1.5 rounded-md bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-medium text-stone-800 dark:text-stone-200 text-center"
                >
                  Farmer Ramesh
                </button>
                <button
                  onClick={() => handleDemoSelect('lakshmi')}
                  className="px-2 py-1.5 rounded-md bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-medium text-stone-800 dark:text-stone-200 text-center"
                >
                  Farmer Lakshmi
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ramesh@farmer.in"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Region / Agricultural District
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      placeholder="e.g. Warangal, Telangana"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors mt-2"
              >
                {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrorMsg('');
                }}
                className="text-xs text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {mode === 'login'
                  ? "Don't have an account? Register here"
                  : 'Already registered? Sign in'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
