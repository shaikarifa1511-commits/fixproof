'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProblemCategory, Report } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/lib/i18n/context';
import {
  ArrowRight,
  ChevronRight,
  Eye,
  Filter,
  MapPin,
  PlusCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function ReportsCatalogPage() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [workStatus, setWorkStatus] = useState<string>('all');
  const [verificationStatus, setVerificationStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReports();
  }, [category, workStatus, verificationStatus]);

  async function fetchReports() {
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (workStatus !== 'all') params.set('workStatus', workStatus);
      if (verificationStatus !== 'all') params.set('verificationStatus', verificationStatus);
      if (search) params.set('search', search);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports || data.data?.reports || []);
      }
    } catch (err) {
      console.error('Failed to load reports catalog:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t?.catalogTitle || 'Civic Evidence Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t?.catalogSubtitle ||
              'Browse public infrastructure complaints, claimed repairs, and independent verification audits.'}
          </p>
        </div>

        <Link
          href="/report"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 self-start sm:self-auto flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> {t?.reportNewProblem || t?.reportProblem || 'Report New Problem'}
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchReports()}
              placeholder={t?.searchPlaceholder || 'Search by case ID, title, street, or landmark...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shrink-0"
          >
            {t?.searchBtn || 'Search'}
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" /> {t?.filtersLabel || 'Filters:'}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">{t?.filterAll || 'All Categories'}</option>
            <option value="pothole">{t?.pothole || 'Potholes'}</option>
            <option value="garbage">{t?.garbage || 'Garbage'}</option>
            <option value="footpath">{t?.footpath || 'Footpaths'}</option>
            <option value="drainage">{t?.drainage || 'Drainage'}</option>
            <option value="infrastructure">{t?.infrastructure || 'Infrastructure'}</option>
          </select>

          <select
            value={workStatus}
            onChange={(e) => setWorkStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">{t?.allWorkStatuses || 'All Work Statuses'}</option>
            <option value="submitted">{t?.submittedStatus || 'Submitted'}</option>
            <option value="in_progress">{t?.inProgressStatus || 'In Progress'}</option>
            <option value="repair_claimed">{t?.repairClaimedStatus || 'Repair Claimed'}</option>
            <option value="closed">{t?.closedStatus || 'Closed (Authority)'}</option>
            <option value="reopened">{t?.disputedStatus || 'Reopened (Disputed)'}</option>
          </select>

          <select
            value={verificationStatus}
            onChange={(e) => setVerificationStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">{t?.allVerifications || 'All Verifications'}</option>
            <option value="appears_resolved">{t?.appearsResolved || 'Appears Resolved'}</option>
            <option value="appears_unresolved">{t?.appearsUnresolved || 'Appears Unresolved'}</option>
            <option value="partially_resolved">{t?.partiallyResolved || 'Partially Resolved'}</option>
            <option value="insufficient_evidence">{t?.insufficientEvidence || 'Insufficient Evidence'}</option>
            <option value="human_verified_resolved">{t?.humanVerifiedResolved || 'Human Verified Resolved'}</option>
            <option value="human_verified_unresolved">{t?.humanVerifiedUnresolved || 'Human Verified Unresolved'}</option>
          </select>
        </div>
      </div>

      {/* Grid of Report Cards */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
          <p className="text-xs font-semibold">Loading verifiable complaints catalog...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-bold text-slate-700">{t?.noReportsFound || 'No matching reports found'}</p>
          <p className="text-xs text-slate-400">Try loosening your filter parameters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Dual image preview header */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden flex">
                <div className="w-1/2 h-full relative border-r border-slate-700">
                  <img
                    src={report.beforeEvidence?.imageUrl}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    BEFORE
                  </span>
                </div>

                <div className="w-1/2 h-full relative">
                  {report.afterEvidence ? (
                    <img
                      src={report.afterEvidence.imageUrl}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
                      Awaiting After
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-slate-900/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    AFTER
                  </span>
                </div>

                {report.isSynthetic && (
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                    {t?.demoDataLabel || 'Synthetic Demo'}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-700">
                      {report.caseNumber || report.id}
                    </span>
                    <span className="capitalize font-medium">{report.category}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{report.address}</span>
                  </div>
                </div>

                {/* Dual State Badges */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <WorkStatusBadge status={report.workStatus} />
                    <VerificationStatusBadge status={report.verificationStatus} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/reports/${report.id}`}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                    >
                      {t?.viewDetails || 'Case'}
                    </Link>
                    {report.afterEvidence && (
                      <Link
                        href={`/reports/${report.id}/compare`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold inline-flex items-center gap-1"
                        title={t?.compareEvidence || 'Open AI Comparison Slider'}
                      >
                        {t?.compareEvidence || 'Compare'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
