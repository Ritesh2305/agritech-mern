import React, { useState } from 'react';
import { Landmark, TrendingUp, TrendingDown, ShieldCheck, CheckCircle2, PhoneCall, ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface GovtSchemesAndMandiPageProps {
  schemes: any[];
  mandiPrices: any[];
}

export const GovtSchemesAndMandiPage: React.FC<GovtSchemesAndMandiPageProps> = ({
  schemes,
  mandiPrices,
}) => {
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<any>(schemes[0]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
          <span>Agri-Economics & Public Policy</span>
          <span aria-hidden="true">·</span>
          <span>APMC Live Benchmark Rates</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {t.schemes.title}
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          {t.schemes.subtitle}
        </p>
      </div>

      {/* APMC Mandi Benchmark Prices Table */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>{t.schemes.mandiTitle}</span>
            </h3>
            <p className="text-xs text-stone-500">
              Live spot market trading prices compared with Government Minimum Support Price (MSP).
            </p>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-stone-500">
            Updated: Today 06:00 AM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 rounded-l-lg">Crop Commodity</th>
                <th className="py-3 px-4">Market Yard (APMC)</th>
                <th className="py-3 px-4 text-right">Govt MSP</th>
                <th className="py-3 px-4 text-right">Current Mandi Rate</th>
                <th className="py-3 px-4 text-right">Price Trend</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Diff vs MSP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {mandiPrices.map((item, idx) => {
                const diff = item.currentPrice - item.msp;
                const isAboveMsp = diff >= 0;
                return (
                  <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-stone-100">
                      {item.crop}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      {item.market}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-600 dark:text-stone-400">
                      ₹{item.msp.toLocaleString('en-IN')}/qtl
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">
                      ₹{item.currentPrice.toLocaleString('en-IN')}/qtl
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      <span
                        className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                          item.trend === 'up'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : item.trend === 'down'
                            ? 'text-rose-700 dark:text-rose-400'
                            : 'text-stone-500'
                        }`}
                      >
                        {item.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : item.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                        {item.change}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono tabular-nums ${
                          isAboveMsp
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isAboveMsp ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Government Schemes Catalog */}
      <div>
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-emerald-600" />
          <span>Central & State Farmer Welfare Schemes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map(sch => (
            <div
              key={sch.id}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                  <span>{sch.category}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{sch.status}</span>
                </div>

                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
                  {sch.name}
                </h4>

                <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-xs mb-3">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200 block mb-0.5">
                    {t.schemes.benefit}:
                  </span>
                  <span className="text-stone-700 dark:text-stone-300 font-medium">
                    {sch.benefit}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-0.5">
                      {t.schemes.eligibility}:
                    </span>
                    <span className="text-stone-600 dark:text-stone-400">
                      {sch.eligibility}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-0.5">
                      {t.schemes.applyNow}:
                    </span>
                    <span className="text-stone-600 dark:text-stone-400">
                      {sch.howToApply}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Helpline: {sch.helpline}</span>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  <span>Check Status</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
