'use client';

import React from 'react';
import { VerificationStatus, WorkStatus } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/context';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

export function WorkStatusBadge({ status }: { status: WorkStatus }) {
  const { t } = useLanguage();

  switch (status) {
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {t?.submittedStatus || 'Submitted'}
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          {t?.humanReviewRequired || 'Under Review'}
        </span>
      );
    case 'work_scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          {t?.inProgressStatus || 'Work Scheduled'}
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          {t?.inProgressStatus || 'In Progress'}
        </span>
      );
    case 'repair_claimed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
          <FileCheck className="w-3.5 h-3.5 text-cyan-600" />
          {t?.repairClaimedStatus || 'Repair Claimed'}
        </span>
      );
    case 'closed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
          {t?.closedStatus || 'Closed (Authority)'}
        </span>
      );
    case 'reopened':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          {t?.disputedStatus || 'Reopened (Disputed)'}
        </span>
      );
    default:
      return null;
  }
}

export function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  const { t } = useLanguage();

  switch (status) {
    case 'not_assessed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {t?.insufficientEvidence || 'Not Yet Assessed'}
        </span>
      );
    case 'awaiting_after_evidence':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          {t?.insufficientEvidence || 'Awaiting Repair Evidence'}
        </span>
      );
    case 'ai_pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <RefreshCw className="w-3.5 h-3.5 text-purple-500 animate-spin" />
          {t?.aiVerificationFindings || 'AI Assessment Pending'}
        </span>
      );
    case 'appears_resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          AI: {t?.appearsResolved || 'Appears Resolved'}
        </span>
      );
    case 'appears_unresolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-300 shadow-sm">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          AI: {t?.appearsUnresolved || 'Appears Unresolved'}
        </span>
      );
    case 'partially_resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          AI: {t?.partiallyResolved || 'Partially Resolved'}
        </span>
      );
    case 'insufficient_evidence':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-300">
          <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
          {t?.insufficientEvidence || 'Insufficient Evidence'}
        </span>
      );
    case 'human_review_required':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-300">
          <Eye className="w-3.5 h-3.5 text-violet-600" />
          {t?.humanReviewRequired || 'Human Review Required'}
        </span>
      );
    case 'human_verified_resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          {t?.humanVerifiedResolved || 'Human Verified Resolved'}
        </span>
      );
    case 'human_verified_unresolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-400 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
          {t?.humanVerifiedUnresolved || 'Human Verified Unresolved'}
        </span>
      );
    default:
      return null;
  }
}
