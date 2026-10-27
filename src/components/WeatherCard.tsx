import React from 'react';
import { CloudRain, Wind, Droplets, Sun, AlertCircle, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface WeatherCardProps {
  weather: any;
  onRefresh?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const { t } = useLanguage();

  if (!weather) return null;

  const sprayColor =
    weather.sprayCondition === 'Excellent'
      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
      : weather.sprayCondition === 'Moderate'
      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
      : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
            <span>{weather.location}</span>
            <span aria-hidden="true">·</span>
            <span>Agro-Meteorological Radar</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {t.weather.title}
          </h3>
        </div>

        {/* Spray Feasibility Tag */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${sprayColor}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Foliar Spray: {weather.sprayCondition}</span>
        </div>
      </div>

      {/* Primary Weather Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 mb-5">
        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            {t.weather.currentTemp}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {weather.temperature}°C
            </span>
            <span className="text-xs text-stone-500">feels {weather.feelsLike}°</span>
          </div>
          <span className="text-[11px] text-stone-500">{weather.condition}</span>
        </div>

        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            {t.weather.humidity}
          </span>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {weather.humidity}%
            </span>
          </div>
          <span className="text-[11px] text-stone-500">Soil moisture: ~{weather.soilMoistureEst}%</span>
        </div>

        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            {t.weather.windSpeed}
          </span>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-stone-500" />
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {weather.windSpeed}
            </span>
            <span className="text-xs text-stone-500">km/h</span>
          </div>
          <span className="text-[11px] text-stone-500">Dir: {weather.windDirection}</span>
        </div>

        <div>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            {t.weather.rainfall}
          </span>
          <div className="flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {weather.rainfall}
            </span>
            <span className="text-xs text-stone-500">mm</span>
          </div>
          <span className="text-[11px] text-stone-500">UV Index: {weather.uvIndex}</span>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 mb-5">
        <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
          🌱 <span className="font-semibold">Agricultural Advisory:</span> {weather.advisory}
        </p>
      </div>

      {/* 5-Day Forecast Strip */}
      <div>
        <h4 className="text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-3">
          {t.weather.fiveDayForecast}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {weather.forecast?.map((day: any, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/50 text-center"
            >
              <span className="block text-xs font-semibold text-stone-800 dark:text-stone-200">
                {day.day}
              </span>
              <span className="block text-[11px] text-stone-500 mb-2">{day.date}</span>
              <div className="text-xs font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {day.tempMax}° / <span className="text-stone-500 font-normal">{day.tempMin}°</span>
              </div>
              <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                🌧 {day.rainfallChance}%
              </div>
              <span className="block text-[10px] text-stone-500 mt-1 truncate" title={day.advisory}>
                {day.condition}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
