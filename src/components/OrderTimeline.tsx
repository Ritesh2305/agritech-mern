import React from 'react';
import { Check, Clock, Truck, Package, XCircle } from 'lucide-react';

interface TimelineEvent {
  status: string;
  timestamp: string;
  note?: string;
}

interface OrderTimelineProps {
  currentStatus: 'pending' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  timeline: TimelineEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, timeline = [] }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'approved', label: 'Approved & Verified', icon: Package },
    { key: 'shipped', label: 'Dispatched in Transit', icon: Truck },
    { key: 'delivered', label: 'Delivered to Farm', icon: Check },
  ];

  if (currentStatus === 'rejected') {
    return (
      <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>This order was rejected or cancelled by depot administration.</span>
      </div>
    );
  }

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'delivered':
        return 3;
      case 'shipped':
        return 2;
      case 'approved':
        return 1;
      case 'pending':
      default:
        return 0;
    }
  };

  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone-200 dark:bg-stone-700 -z-0" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-emerald-600 transition-all duration-500 -z-0"
          style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isComplete = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const IconComponent = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center text-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isComplete
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] mt-1.5 font-medium max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : isComplete
                    ? 'text-stone-800 dark:text-stone-200'
                    : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {timeline.length > 0 && (
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
          {timeline.map((evt, i) => (
            <div key={i} className="text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-2">
              <span className="font-mono tabular-nums text-stone-500 shrink-0">
                {new Date(evt.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium capitalize text-stone-800 dark:text-stone-200">{evt.status}:</span>
              <span>{evt.note}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
