import React from 'react';
import { AlertOctagon, Bug, ShieldAlert, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  pestOrDisease: string;
  affectedCrops: string[];
  region: string;
  recommendedAction: string;
  organicRemedy: string;
  issuedAt?: string;
}

interface PestAlertBannerProps {
  alerts: AlertItem[];
}

export const PestAlertBanner: React.FC<PestAlertBannerProps> = ({ alerts }) => {
  const { t } = useLanguage();

  if (!alerts || alerts.length === 0) return null;

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
      case 'high':
        return {
          card: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
          badge: 'text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60',
          icon: 'text-rose-600',
        };
      case 'medium':
        return {
          card: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
          badge: 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60',
          icon: 'text-amber-600',
        };
      default:
        return {
          card: 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700',
          badge: 'text-stone-800 dark:text-stone-300 bg-stone-200 dark:bg-stone-700',
          icon: 'text-stone-600',
        };
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map(a => {
        const style = getSeverityStyle(a.severity);
        return (
          <div
            key={a.id}
            className={`p-4 rounded-xl border ${style.card} shadow-sm transition-all`}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${style.icon} shrink-0`} />
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {a.title}
                </h4>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${style.badge}`}
              >
                {a.severity} Threat
              </span>
            </div>

            <p className="text-xs text-stone-700 dark:text-stone-300 mb-3 leading-relaxed">
              {a.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-stone-200/50 dark:border-stone-700/50">
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-0.5">
                  Affected Crops & Region:
                </span>
                <span className="text-stone-600 dark:text-stone-300">
                  {a.affectedCrops?.join(', ')} · <span className="text-stone-500">{a.region}</span>
                </span>
              </div>

              <div>
                <span className="font-semibold text-emerald-800 dark:text-emerald-400 block mb-0.5">
                  Organic Remedy:
                </span>
                <span className="text-stone-700 dark:text-stone-300">
                  {a.organicRemedy}
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 bg-white/70 dark:bg-stone-900/60 p-2.5 rounded-lg border border-stone-200/40 dark:border-stone-800/60">
              <span className="font-medium text-stone-800 dark:text-stone-200">Recommended Action: </span>
              {a.recommendedAction}
            </div>
          </div>
        );
      })}
    </div>
  );
};
