import React from 'react';
import { Calendar, Sprout, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface CropItem {
  id: string;
  name: string;
  variety: string;
  sowingDate: string;
  expectedHarvest: string;
  stage: string;
  status: string;
  plantedArea: number;
  expectedYield: number;
  healthScore: number;
  notes?: string;
}

interface CropCardProps {
  crop: CropItem;
  onUpdateStatus?: (cropId: string, newStage: string) => void;
}

export const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  const { t } = useLanguage();

  const stages = ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'];
  const currentStageIdx = stages.indexOf(crop.stage) !== -1 ? stages.indexOf(crop.stage) : 2;
  const progressPct = Math.round(((currentStageIdx + 1) / stages.length) * 100);

  // Calculate days left to harvest
  const today = new Date();
  const harvestDate = new Date(crop.expectedHarvest);
  const diffTime = harvestDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const getStatusBadge = (st: string) => {
    switch (st.toLowerCase()) {
      case 'healthy':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'needs attention':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      default:
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:border-emerald-500/50 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span>{crop.variety}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{crop.plantedArea} Acres</span>
          </div>
          <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            {crop.name}
          </h4>
        </div>

        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(crop.status)}`}>
          {crop.status}
        </span>
      </div>

      {/* Stage Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-stone-500 dark:text-stone-400">
            Growth Stage: <span className="font-semibold text-stone-800 dark:text-stone-200">{crop.stage}</span>
          </span>
          <span className="font-mono tabular-nums font-semibold text-emerald-700 dark:text-emerald-400">
            {progressPct}%
          </span>
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/50 mb-3 text-xs">
        <div>
          <span className="text-stone-500 dark:text-stone-400 block mb-0.5">Est. Harvest In</span>
          <span className="font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100 text-sm">
            {daysLeft} Days
          </span>
          <span className="text-[11px] text-stone-500 block">
            {new Date(crop.expectedHarvest).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div>
          <span className="text-stone-500 dark:text-stone-400 block mb-0.5">Expected Yield</span>
          <span className="font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100 text-sm">
            {crop.expectedYield} Quintals
          </span>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-medium">
            Health: {crop.healthScore}/100
          </span>
        </div>
      </div>

      {crop.notes && (
        <p className="text-xs text-stone-600 dark:text-stone-400 italic line-clamp-2">
          "{crop.notes}"
        </p>
      )}
    </div>
  );
};
