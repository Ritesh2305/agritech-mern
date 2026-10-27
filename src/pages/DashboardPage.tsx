import React from 'react';
import { Sprout, Layers, Activity, ShoppingCart, AlertTriangle, ArrowUpRight, TrendingUp, ShieldCheck, Download, Code2, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { SoilHealthGauge } from '../components/SoilHealthGauge.tsx';
import { WeatherCard } from '../components/WeatherCard.tsx';
import { PestAlertBanner } from '../components/PestAlertBanner.tsx';
import { CropCard } from '../components/CropCard.tsx';

interface DashboardPageProps {
  farms: any[];
  crops: any[];
  soilTests: any[];
  weather: any;
  alerts: any[];
  mandiPrices: any[];
  setCurrentTab: (tab: string) => void;
  onOpenReport: () => void;
  onOpenPostman: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  farms,
  crops,
  soilTests,
  weather,
  alerts,
  mandiPrices,
  setCurrentTab,
  onOpenReport,
  onOpenPostman,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const latestSoil = soilTests[0] || {
    nitrogen: 240,
    phosphorus: 32,
    potassium: 195,
    ph: 6.8,
    moisture: 52,
    organicCarbon: 0.68,
    status: 'Optimal',
    recommendations: [
      'Nitrogen level (240 kg/ha) supports active tillering. Apply 20 kg/acre Urea before square formation.',
      'Soil pH (6.8) is ideal for cotton and pulses.',
    ],
  };

  const totalAcres = farms.reduce((sum, f) => sum + (Number(f.area) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header Section */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_smart_agriculture_1793110537714.jpg"
            alt="Smart agricultural farm"
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <span>{t.appName}</span>
            <span aria-hidden="true">·</span>
            <span>{user ? `Namaste, ${user.name}` : 'Welcome Farmer'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-300">Region: {user?.region || 'Telangana'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
            {t.dashboard.title}
          </h1>

          <p className="text-stone-300 text-sm leading-relaxed mb-6">
            {t.dashboard.subtitle}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('soil')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>{t.soil.runDiagnostic}</span>
            </button>

            <button
              onClick={() => setCurrentTab('farms')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.farms.addNewCrop}</span>
            </button>

            <button
              onClick={onOpenReport}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>{t.dashboard.downloadReport}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t.dashboard.activeFarms}</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
            {farms.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono tabular-nums">
            Total Area: {totalAcres.toFixed(1)} Acres
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t.dashboard.monitoredCrops}</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
            {crops.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Status: {crops.filter(c => c.status === 'Healthy').length} Healthy
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{t.dashboard.soilHealthScore}</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            88/100
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Status: {latestSoil.status}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Live Mandi Benchmark</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
            ₹7,450
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
            Bt Cotton (+₹180/qtl)
          </div>
        </div>
      </div>

      {/* Main Grid: Weather + Pest Outbreak Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeatherCard weather={weather} />
          <SoilHealthGauge
            nitrogen={latestSoil.nitrogen}
            phosphorus={latestSoil.phosphorus}
            potassium={latestSoil.potassium}
            ph={latestSoil.ph}
            moisture={latestSoil.moisture}
            organicCarbon={latestSoil.organicCarbon}
            status={latestSoil.status}
            recommendations={latestSoil.recommendations}
          />
        </div>

        {/* Right Sidebar: Active Pest Warnings & Mandi Bhav */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {t.dashboard.activeAlerts}
              </h3>
              <button
                onClick={() => setCurrentTab('weather')}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                View all ({alerts.length})
              </button>
            </div>
            <PestAlertBanner alerts={alerts.slice(0, 2)} />
          </div>

          {/* Mandi Price Watch Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {t.dashboard.mandiPrices}
              </h3>
              <button
                onClick={() => setCurrentTab('schemes')}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
              >
                More
              </button>
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {mandiPrices.slice(0, 4).map((m, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                      {m.crop}
                    </span>
                    <span className="text-[11px] text-stone-500">{m.market}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100 block">
                      ₹{m.currentPrice.toLocaleString('en-IN')}/qtl
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        m.trend === 'up'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : m.trend === 'down'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-stone-500'
                      }`}
                    >
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Crops Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t.farms.cropsPlanted}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Active vegetative milestones and estimated harvest yields.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('farms')}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Crops</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map(crop => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      </div>
    </div>
  );
};
