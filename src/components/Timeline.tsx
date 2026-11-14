import React from 'react';
import { TimelineEvent } from '@/lib/types';
import {
  AlertCircle,
  CheckCircle2,
  FileCheck,
  FileText,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  User,
} from 'lucide-react';

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return <p className="text-xs text-slate-500 italic">No timeline events recorded yet.</p>;
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'reported':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'status_change':
        return <RefreshCw className="w-4 h-4 text-indigo-600" />;
      case 'repair_claimed':
        return <FileCheck className="w-4 h-4 text-cyan-600" />;
      case 'ai_verified':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'human_verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((evt, idx) => (
        <div key={evt.id || idx} className="relative group">
          {/* Dot Icon */}
          <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
            {getEventIcon(evt.eventType)}
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1 hover:border-slate-300 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {evt.actorName}{' '}
                <span className="font-normal text-slate-500 text-[11px] capitalize">
                  ({evt.actorRole})
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {new Date(evt.createdAt).toLocaleString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {evt.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
