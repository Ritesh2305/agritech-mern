import React, { useState } from 'react';
import { FlaskConical, Activity, Sparkles, CheckCircle2, AlertTriangle, Layers, ArrowRight, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { SoilHealthGauge } from '../components/SoilHealthGauge.tsx';
import { api } from '../services/api.ts';

interface SoilHealthPageProps {
  farms: any[];
  soilTests: any[];
  onRefresh: () => void;
}

export const SoilHealthPage: React.FC<SoilHealthPageProps> = ({
  farms,
  soilTests,
  onRefresh,
}) => {
  const { t } = useLanguage();

  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || 'farm_1');
  const [nitrogen, setNitrogen] = useState<number>(240);
  const [phosphorus, setPhosphorus] = useState<number>(32);
  const [potassium, setPotassium] = useState<number>(195);
  const [ph, setPh] = useState<number>(6.8);
  const [moisture, setMoisture] = useState<number>(52);
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.68);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<any>(null);

  const currentTest = activeDiagnosis || soilTests[0] || {
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
      'Maintain current drip irrigation schedule.',
    ],
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    const result = await api.analyzeSoil({
      farmId: selectedFarmId,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      moisture,
      organicCarbon,
    });
    setIsAnalyzing(false);
    if (result && result.diagnosis) {
      setActiveDiagnosis({
        ...result.data,
        ...result.diagnosis,
      });
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/soil_testing_field_1793110539096.jpg"
            alt="Soil nutrient analysis"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <span>Soil Intelligence Lab</span>
            <span aria-hidden="true">·</span>
            <span>ICAR Standard Benchmarks</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {t.soil.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {t.soil.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Soil Test Laboratory Form */}
        <div className="lg:col-span-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <span>Digital Soil Sample Input</span>
          </h3>

          <form onSubmit={handleRunAnalysis} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Select Farm Plot
              </label>
              <select
                value={selectedFarmId}
                onChange={e => setSelectedFarmId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                {farms.map(f => (
                  <option key={f.id || f._id} value={f.id || f._id}>
                    {f.name} ({f.soilType} Soil)
                  </option>
                ))}
              </select>
            </div>

            {/* Nitrogen Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-stone-700 dark:text-stone-300">{t.soil.nitrogen}</span>
                <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">{nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="550"
                step="5"
                value={nitrogen}
                onChange={e => setNitrogen(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Benchmark: 250 - 450 kg/ha</span>
            </div>

            {/* Phosphorus Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-stone-700 dark:text-stone-300">{t.soil.phosphorus}</span>
                <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">{phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={phosphorus}
                onChange={e => setPhosphorus(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Benchmark: 25 - 55 kg/ha</span>
            </div>

            {/* Potassium Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-stone-700 dark:text-stone-300">{t.soil.potassium}</span>
                <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">{potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="80"
                max="400"
                step="5"
                value={potassium}
                onChange={e => setPotassium(Number(e.target.value))}
                className="w-full accent-lime-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Benchmark: 150 - 300 kg/ha</span>
            </div>

            {/* pH Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-stone-700 dark:text-stone-300">{t.soil.phLevel}</span>
                <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">{ph.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.1"
                value={ph}
                onChange={e => setPh(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Neutral: 6.2 - 7.5 (Acidic &lt; 6.0, Alkaline &gt; 7.8)</span>
            </div>

            {/* Moisture Input */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-stone-700 dark:text-stone-300">{t.soil.moisture}</span>
                <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">{moisture}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="1"
                value={moisture}
                onChange={e => setMoisture(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-500">Optimal Range: 40% - 70%</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Running Agronomic Diagnostics...' : t.soil.runDiagnostic}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Gauges & Diagnosis Output */}
        <div className="lg:col-span-2 space-y-6">
          <SoilHealthGauge
            nitrogen={currentTest.nitrogen}
            phosphorus={currentTest.phosphorus}
            potassium={currentTest.potassium}
            ph={currentTest.ph}
            moisture={currentTest.moisture}
            organicCarbon={currentTest.organicCarbon}
            status={currentTest.status}
            recommendations={currentTest.recommendations}
          />

          {/* Organic remedies and crop suitability */}
          {currentTest.organicRemedies && currentTest.organicRemedies.length > 0 && (
            <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {t.soil.organicRemedy}
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                {currentTest.organicRemedies.map((rem: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suitable Crops Guide */}
          {currentTest.suitableCrops && (
            <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                {t.soil.suitableCrops} (Based on current pH {currentTest.ph}):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentTest.suitableCrops.map((c: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white dark:bg-stone-800 rounded-md border border-emerald-200 dark:border-emerald-800 text-xs font-medium text-emerald-900 dark:text-emerald-200"
                  >
                    🌾 {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
