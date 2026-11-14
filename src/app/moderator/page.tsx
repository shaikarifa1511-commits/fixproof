'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Report } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  Fingerprint,
  Gavel,
  RefreshCw,
  Scale,
  Shield,
  ShieldAlert,
  User,
  XCircle,
} from 'lucide-react';

export default function ModeratorDashboardPage() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'disputed' | 'flagged' | 'all'>('disputed');

  // Inline moderation action state
  const [selectedCase, setSelectedCase] = useState<Report | null>(null);
  const [decision, setDecision] = useState<
    'human_verified_resolved' | 'human_verified_unresolved' | 'requires_more_evidence'
  >('human_verified_unresolved');
  const [notes, setNotes] = useState('');
  const [overrideAi, setOverrideAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchModeratorCases();
  }, []);

  async function fetchModeratorCases() {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Failed to load moderator cases:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRecordRuling = async () => {
    if (!selectedCase || !notes) {
      alert('Please provide moderation notes and reasoning.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${selectedCase.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          notes,
          overrideAi,
          reviewerId: currentUser.id,
          reviewerName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCase(null);
        setNotes('');
        fetchModeratorCases();
      }
    } catch (err) {
      console.error('Failed to record ruling:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disputedCases = reports.filter(
    (r) =>
      r.dispute ||
      r.workStatus === 'reopened' ||
      r.verificationStatus === 'human_verified_unresolved' ||
      r.id === 'FP-000110'
  );

  const flaggedCases = reports.filter(
    (r) =>
      r.latestAiVerification?.duplicateDetected ||
      r.latestAiVerification?.comparison.sameSceneAssessment === 'unlikely' ||
      r.verificationStatus === 'insufficient_evidence' ||
      r.id === 'FP-000108' ||
      r.id === 'FP-000106' ||
      r.id === 'FP-000107'
  );

  const displayedCases =
    activeTab === 'disputed'
      ? disputedCases
      : activeTab === 'flagged'
      ? flaggedCases
      : reports;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Independent Civic Review Board
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Civic Moderation & Dispute Arbitration Hub</h1>
          <p className="text-xs text-purple-300">
            Arbitrate contested municipal closures, evaluate fraud & duplicate alerts, and record documented human verdicts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-purple-900/60 border border-purple-700/60 px-4 py-2 rounded-2xl">
          <Gavel className="w-4 h-4 text-purple-300" />
          <span>Active Reviewer: {currentUser.name}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('disputed')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'disputed'
              ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Contested & Disputed Closures ({disputedCases.length})
        </button>

        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'flagged'
              ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Anti-Abuse & Integrity Flags ({flaggedCases.length})
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'all'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Cases ({reports.length})
        </button>
      </div>

      {/* Main Grid: Cases List & Arbitrate Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-2 space-y-4">
          {displayedCases.map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between space-y-3 ${
                selectedCase?.id === report.id
                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {report.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <WorkStatusBadge status={report.workStatus} />
                    <VerificationStatusBadge status={report.verificationStatus} />
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900">{report.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>

                {/* Dispute / Fraud Callout */}
                {report.dispute && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <span className="font-bold block">
                      Citizen Dispute Filed by {report.dispute.complainantName}:
                    </span>
                    <p className="italic">"{report.dispute.reason}"</p>
                    {report.dispute.moderatorVerdict && (
                      <p className="font-semibold text-emerald-800 pt-1">
                        Ruling: {report.dispute.moderatorVerdict}
                      </p>
                    )}
                  </div>
                )}

                {report.latestAiVerification?.duplicateDetected && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 font-bold flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-red-600 shrink-0" />
                    Exact Duplicate Photo match: After photo is identical to Before photo!
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/reports/${report.id}/compare`}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Open Comparison Slider
                </Link>

                <button
                  onClick={() => {
                    setSelectedCase(report);
                    setNotes(report.humanReview?.notes || '');
                    setDecision(report.humanReview?.decision || 'human_verified_unresolved');
                    setOverrideAi(Boolean(report.humanReview?.overrideAi));
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" /> Arbitrate Case
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Arbitration Action Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 sticky top-20">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-600" /> Arbitrate Case Ruling
            </h3>

            {selectedCase ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                  <span className="font-mono font-bold text-purple-900">{selectedCase.id}</span>
                  <p className="font-bold text-slate-800 line-clamp-1">{selectedCase.title}</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moderation Ruling</label>
                  <select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="human_verified_unresolved">
                      Human Verified Unresolved (Reject Closure)
                    </option>
                    <option value="human_verified_resolved">
                      Human Verified Resolved (Confirm Fix)
                    </option>
                    <option value="requires_more_evidence">
                      Requires More Evidence / Recapture
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Documented Justification & Legal Basis
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter formal justification for civic record and audit trail..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="override-ai-sidebar"
                    checked={overrideAi}
                    onChange={(e) => setOverrideAi(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="override-ai-sidebar" className="font-semibold text-slate-700 text-[11px]">
                    Override AI computer-vision assessment
                  </label>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={handleRecordRuling}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/30"
                  >
                    {isSubmitting ? 'Recording...' : 'Commit Verdict'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <Gavel className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Select any disputed or flagged case from the list to record an immutable ruling.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

