'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { PublicAnalytics } from '@/lib/types';
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  FileText,
  PieChart,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';

export default function PublicAnalyticsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<PublicAnalytics | null>(null);
  const [includeDemo, setIncludeDemo] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [includeDemo]);

  async function fetchStats() {
    try {
      const res = await fetch(`/api/stats?includeDemo=${includeDemo}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-500 space-y-3">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
        <p className="text-xs font-semibold">Computing live civic verification metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> Transparency & Verification Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t?.publicDashboard || 'Public Civic Verification Analytics'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Empirical measurements of reported municipal defects, repair claims, and independent AI/human audits.
          </p>
        </div>

        {/* Demo vs Live filter toggle (Section 16 requirement) */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 text-xs">
          <button
            onClick={() => setIncludeDemo(true)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              includeDemo ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Evidence (Including Demo)
          </button>
          <button
            onClick={() => setIncludeDemo(false)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              !includeDemo ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Citizen Reports Only
          </button>
        </div>
      </div>

      {/* Primary Verification Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reports</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalReports}</div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Complaints logged with photographic evidence and geocoordinates.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{stats.reportsVerifiedResolved}</div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Repair confirmed through photo comparison and surface continuity.
          </p>
        </div>

        {/* Metric 3: THE CRITICAL FIXPROOF METRIC */}
        <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-sm space-y-2 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">Unresolved Closure Rate</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">
            {stats.unresolvedRateAfterClosureClaim}%
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Cases marked "Closed" by authorities where visual defect visibly remains.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Disputes Upheld</span>
            <Scale className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700">{stats.disputedClosures}</div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Citizen challenges validated with on-site reinspection proof.
          </p>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-slate-500 font-medium">Assessed by AI</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.reportsAssessedByAi} cases</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Computer-vision model run</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-slate-500 font-medium">Reviewed by Humans</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.reportsReviewedByHumans} cases</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Independent board rulings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-slate-500 font-medium">Median Time to Verification</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.medianVerificationHours} hrs</div>
          <div className="text-[10px] text-slate-400 mt-0.5">From claim to audit complete</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-slate-500 font-medium">Reopened Cases</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.reopenedCases} cases</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Returned to contractor</div>
        </div>
      </div>

      {/* Category Breakdown & Breakdown Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" /> Category Breakdown
          </h3>

          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => {
              const percent = stats.totalReports > 0 ? Math.round((count / stats.totalReports) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 capitalize">
                    <span>{cat}</span>
                    <span className="font-mono text-slate-500">{count} cases ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Status Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Evidence Audit Status Distribution
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 font-semibold text-emerald-950">
              <span>Appears Resolved / Human Verified Resolved</span>
              <span className="font-mono font-bold">{stats.reportsVerifiedResolved}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-red-50/70 border border-red-200 font-semibold text-red-950">
              <span>Appears Unresolved / Human Verified Unresolved</span>
              <span className="font-mono font-bold">{stats.reportsVerifiedUnresolved}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 font-semibold text-amber-950">
              <span>Partially Resolved (Provisional / Incomplete)</span>
              <span className="font-mono font-bold">{stats.verificationBreakdown.partially_resolved}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
              <span>Insufficient Evidence / Wrong Scene / Blur</span>
              <span className="font-mono font-bold">{stats.verificationBreakdown.insufficient_evidence}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

