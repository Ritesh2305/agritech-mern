import React, { useState } from 'react';
import { CloudRain, Wind, Droplets, Sun, ShieldAlert, Plus, Bug, Search, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { WeatherCard } from '../components/WeatherCard.tsx';
import { PestAlertBanner } from '../components/PestAlertBanner.tsx';
import { api } from '../services/api.ts';

interface WeatherAndPestsPageProps {
  weather: any;
  alerts: any[];
  onRefresh: () => void;
}

export const WeatherAndPestsPage: React.FC<WeatherAndPestsPageProps> = ({
  weather,
  alerts,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const [locationInput, setLocationInput] = useState(weather?.location || 'Hyderabad, Telangana');
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);

  // New alert form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [alertPest, setAlertPest] = useState('');
  const [alertCrops, setAlertCrops] = useState('Cotton, Chilli');
  const [alertRegion, setAlertRegion] = useState('Telangana Agricultural Belts');
  const [alertAction, setAlertAction] = useState('');
  const [alertOrganic, setAlertOrganic] = useState('Neem seed kernel extract (NSKE 5%) spray.');

  const handleBroadcastAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.broadcastAlert({
      title: alertTitle,
      description: alertDesc,
      severity: alertSeverity,
      pestOrDisease: alertPest,
      affectedCrops: alertCrops.split(',').map(c => c.trim()),
      region: alertRegion,
      recommendedAction: alertAction,
      organicRemedy: alertOrganic,
    });
    setShowBroadcastModal(false);
    onRefresh();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
            <span>Agro-Meteorology & Pest Surveillance</span>
            <span aria-hidden="true">·</span>
            <span>Early Warning System</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {t.weather.title}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            {t.weather.subtitle}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Broadcast Pest Outbreak</span>
          </button>
        )}
      </div>

      {/* Weather Forecast View */}
      <WeatherCard weather={weather} />

      {/* Pest Alerts Surveillance Directory */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Bug className="w-5 h-5 text-rose-600" />
              <span>{t.weather.pestAlerts} ({alerts.length} Active Warnings)</span>
            </h3>
            <p className="text-xs text-stone-500">
              Community and satellite-assisted bio-pest alerts for your agro-climatic region.
            </p>
          </div>
        </div>

        <PestAlertBanner alerts={alerts} />
      </div>

      {/* Broadcast Alert Modal (Admin) */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Broadcast Pest Outbreak Warning</span>
            </h3>
            <form onSubmit={handleBroadcastAlert} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  placeholder="e.g. Pink Bollworm Surge in Cotton Belts"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Pest / Disease Name
                  </label>
                  <input
                    type="text"
                    required
                    value={alertPest}
                    onChange={e => setAlertPest(e.target.value)}
                    placeholder="e.g. Pectinophora gossypiella"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Threat Severity
                  </label>
                  <select
                    value={alertSeverity}
                    onChange={e => setAlertSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="low">Low Threat</option>
                    <option value="medium">Medium Threat</option>
                    <option value="high">High Threat</option>
                    <option value="critical">Critical Outbreak</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Affected Crops (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={alertCrops}
                    onChange={e => setAlertCrops(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Target Region / Districts
                  </label>
                  <input
                    type="text"
                    required
                    value={alertRegion}
                    onChange={e => setAlertRegion(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Surveillance Details / Symptom Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={alertDesc}
                  onChange={e => setAlertDesc(e.target.value)}
                  placeholder="Reported adult moth captures exceeding economic threshold..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Recommended Action Plan
                </label>
                <input
                  type="text"
                  required
                  value={alertAction}
                  onChange={e => setAlertAction(e.target.value)}
                  placeholder="Install 8-10 pheromone traps per acre immediately..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Organic Remedy
                </label>
                <input
                  type="text"
                  required
                  value={alertOrganic}
                  onChange={e => setAlertOrganic(e.target.value)}
                  placeholder="Neem seed kernel extract (NSKE 5%) or Bt bio-spray..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
