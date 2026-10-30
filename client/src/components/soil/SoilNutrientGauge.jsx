import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const SoilNutrientGauge = ({ name, value, unit, min, max, optimalMin, optimalMax, rating }) => {
  if (value === null || value === undefined) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{name}</span>
        <span className="text-sm font-medium text-slate-400 mt-1 block">Not Tested</span>
      </div>
    );
  }

  // Calculate percentage within bar range
  const range = max - min;
  const clampedVal = Math.max(min, Math.min(max, value));
  const percent = Math.round(((clampedVal - min) / range) * 100);

  const isOptimal = value >= optimalMin && value <= optimalMax;
  const isLow = value < optimalMin;
  const isHigh = value > optimalMax;

  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-500';
  let statusText = 'Optimal / Sufficient';

  if (isLow) {
    statusColor = 'text-amber-800 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
    statusText = 'Deficient (Low)';
  } else if (isHigh) {
    statusColor = 'text-blue-800 bg-blue-50 border-blue-200';
    barColor = 'bg-blue-500';
    statusText = 'High / Abundant';
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{name}</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-slate-900">{value}</span>
            <span className="text-xs text-slate-500 font-medium">{unit}</span>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
          {rating || statusText}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden my-2.5 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Reference markers */}
      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
        <span>Min: {min}</span>
        <span className="text-slate-600 font-semibold">Ideal: {optimalMin} - {optimalMax}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
};

