'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ProblemCategory, Report, VerificationStatus, WorkStatus } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import { useLanguage } from '@/lib/i18n/context';
import {
  ArrowRight,
  Eye,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" /> }
);

export default function CivicMapPage() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapReports();
  }, [selectedCategory, selectedVerification]);

  async function fetchMapReports() {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedVerification !== 'all') params.set('verificationStatus', selectedVerification);
      if (search) params.set('search', search);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Failed to load map reports:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-100">
      {/* Floating Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 max-w-4xl mx-auto flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMapReports()}
              placeholder={t?.searchPlaceholder || "Search area, street, or case ID..."}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter Pill Cluster */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: t?.filterAll || 'All' },
              { id: 'pothole', label: t?.pothole || 'Pothole' },
              { id: 'garbage', label: t?.garbage || 'Garbage' },
              { id: 'footpath', label: t?.footpath || 'Footpath' },
              { id: 'drainage', label: t?.drainage || 'Drainage' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Verification Status Filter */}
          <div className="flex items-center gap-1">
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">{t?.allVerifications || 'All Verification'}</option>
              <option value="appears_resolved">{t?.appearsResolved || 'Appears Resolved'}</option>
              <option value="appears_unresolved">{t?.appearsUnresolved || 'Appears Unresolved'}</option>
              <option value="partially_resolved">{t?.partiallyResolved || 'Partially Resolved'}</option>
              <option value="insufficient_evidence">{t?.insufficientEvidence || 'Insufficient Evidence'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full h-full relative z-0">
        <LeafletMap
          reports={reports}
          selectedReportId={selectedReport?.id}
          onMarkerClick={(report) => setSelectedReport(report)}
          initialCenter={[12.9716, 77.5946]}
          zoom={12}
        />
      </div>

      {/* Bottom Floating Report Preview Card (when a pin is clicked) */}
      {selectedReport && (
        <div className="absolute bottom-6 left-4 right-4 z-20 max-w-lg mx-auto bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl p-4 animate-fade-in flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {selectedReport.id}
              </span>
              <span className="text-xs font-semibold text-slate-500 capitalize">
                {selectedReport.category}
              </span>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3">
            {/* Thumbnail */}
            <div className="w-24 h-20 rounded-xl bg-slate-900 overflow-hidden shrink-0">
              <img
                src={selectedReport.beforeEvidence?.imageUrl}
                alt="Defect"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-bold text-xs text-slate-900 truncate">
                {selectedReport.title}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {selectedReport.description}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{selectedReport.address}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <WorkStatusBadge status={selectedReport.workStatus} />
              <VerificationStatusBadge status={selectedReport.verificationStatus} />
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/reports/${selectedReport.id}`}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Case File
              </Link>
              <Link
                href={`/reports/${selectedReport.id}/compare`}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 flex items-center gap-1 shadow-sm"
              >
                Compare <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

