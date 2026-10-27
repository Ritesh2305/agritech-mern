import React from 'react';
import { Leaf, Sun, Moon, ShoppingBag, User as UserIcon, Globe, FileText, Code2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Language } from '../i18n/translations.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenReport: () => void;
  onOpenPostman: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenReport,
  onOpenPostman,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard },
    { id: 'farms', label: t.nav.farms },
    { id: 'soil', label: t.nav.soil },
    { id: 'weather', label: t.nav.weather },
    { id: 'market', label: t.nav.market },
    { id: 'community', label: t.nav.community },
    { id: 'schemes', label: t.nav.schemes },
    ...(isAdmin ? [{ id: 'admin', label: t.nav.admin }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100 font-bold text-xl tracking-tight whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Leaf className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span>AgriTech</span>
          </button>

          {/* Zone 2: 4-6 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  currentTab === item.id
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {currentTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary actions & Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Export Tools */}
            <button
              onClick={onOpenReport}
              title={t.dashboard.downloadReport}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPostman}
              title={t.dashboard.apiCollection}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Code2 className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                aria-label="Select Language"
                className="pl-7 pr-3 py-1.5 text-xs font-medium rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-0 focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCurrentTab('market')}
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={t.market.cart}
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-stone-800 dark:text-stone-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-stone-500 capitalize">({user.role})</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 px-1 py-1"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.login}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div className="lg:hidden flex overflow-x-auto gap-2 px-4 py-2 border-t border-stone-100 dark:border-stone-800 scrollbar-none">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
              currentTab === item.id
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
