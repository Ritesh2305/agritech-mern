import React from 'react';
import { Activity, Droplet, FlaskConical, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface SoilHealthGaugeProps {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  organicCarbon?: number;
  status: string;
  recommendations?: string[];
}

export const SoilHealthGauge: React.FC<SoilHealthGaugeProps> = ({
  nitrogen,
  phosphorus,
  potassium,
  ph,
  moisture,
  organicCarbon = 0.68,
  status,
  recommendations = [],
}) => {
  const { t } = useLanguage();

  const getStatusColor = (valStatus: string) => {
    switch (valStatus.toLowerCase()) {
      case 'optimal':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'deficient':
      case 'critical':
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      default:
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    }
  };

  const metrics = [
    {
      label: t.soil.nitrogen,
      value: nitrogen,
      unit: 'kg/ha',
      ideal: '250 - 450',
      status: nitrogen < 250 ? 'Low' : nitrogen > 450 ? 'High' : 'Optimal',
      pct: Math.min(100, Math.round((nitrogen / 500) * 100)),
      color: 'bg-emerald-600',
    },
    {
      label: t.soil.phosphorus,
      value: phosphorus,
      unit: 'kg/ha',
      ideal: '25 - 55',
      status: phosphorus < 25 ? 'Low' : phosphorus > 65 ? 'High' : 'Optimal',
      pct: Math.min(100, Math.round((phosphorus / 70) * 100)),
      color: 'bg-teal-600',
    },
    {
      label: t.soil.potassium,
      value: potassium,
      unit: 'kg/ha',
      ideal: '150 - 300',
      status: potassium < 150 ? 'Low' : potassium > 320 ? 'High' : 'Optimal',
      pct: Math.min(100, Math.round((potassium / 350) * 100)),
      color: 'bg-lime-600',
    },
    {
      label: t.soil.phLevel,
      value: ph.toFixed(1),
      unit: 'pH',
      ideal: '6.2 - 7.5',
      status: ph < 6.0 ? 'Acidic' : ph > 7.8 ? 'Alkaline' : 'Neutral (Optimal)',
      pct: Math.min(100, Math.round((ph / 14) * 100)),
      color: 'bg-amber-600',
    },
    {
      label: t.soil.moisture,
      value: moisture,
      unit: '%',
      ideal: '40 - 70',
      status: moisture < 40 ? 'Low' : moisture > 75 ? 'Waterlogged' : 'Optimal',
      pct: Math.min(100, moisture),
      color: 'bg-cyan-600',
    },
    {
      label: t.soil.organicCarbon,
      value: organicCarbon.toFixed(2),
      unit: '%',
      ideal: '> 0.75',
      status: organicCarbon < 0.5 ? 'Low' : 'Adequate',
      pct: Math.min(100, Math.round((organicCarbon / 1.2) * 100)),
      color: 'bg-amber-700',
    },
  ];

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
            <span>Soil Diagnostic Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>ICAR-Approved Calibration</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {t.soil.title}
          </h3>
        </div>
        <div
          className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(
            status
          )}`}
        >
          {status}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map(m => (
          <div
            key={m.label}
            className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span>{m.label}</span>
              <span className="font-medium text-stone-700 dark:text-stone-300">
                {m.status}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {m.value}
              </span>
              <span className="text-xs text-stone-500">{m.unit}</span>
            </div>

            <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${m.color} transition-all duration-500 rounded-full`}
                style={{ width: `${m.pct}%` }}
              />
            </div>

            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              Benchmark: <span className="font-mono tabular-nums">{m.ideal} {m.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.soil.recommendations}</span>
          </div>
          <ul className="space-y-1.5">
            {recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="text-xs text-stone-600 dark:text-stone-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
