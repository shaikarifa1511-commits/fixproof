'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { Report, WorkStatus } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileCheck2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Wrench,
} from 'lucide-react';

export default function AuthorityDashboardPage() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAuthorityCases();
  }, [filterStatus]);

  async function fetchAuthorityCases() {
    try {
      const url = filterStatus !== 'all' ? `/api/reports?workStatus=${filterStatus}` : '/api/reports';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Failed to load authority queue:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleQuickStatusChange = async (reportId: string, newStatus: WorkStatus) => {
    try {
      await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workStatus: newStatus,
          actorName: currentUser.name,
          notes: `Authority crew updated work state to ${newStatus}.`,
        }),
      });
      fetchAuthorityCases();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const exportCsv = () => {
    const headers = ['ID', 'Title', 'Category', 'Address', 'Work Status', 'Verification Status', 'Created At'];
    const rows = reports.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      `"${r.address.replace(/"/g, '""')}"`,
      r.workStatus,
      r.verificationStatus,
      r.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fixproof_authority_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Authorized Municipal Maintenance Operations
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">{t?.authorityPortal || 'Authority Repair Dispatch & Evidence Hub'}</h1>
          <p className="text-xs text-slate-400">
            Log dispatch status, upload post-repair verification photos, and inspect AI comparability scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export Case Ledger (CSV)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'submitted', 'in_progress', 'repair_claimed', 'closed', 'reopened'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {reports.length} Cases in Jurisdiction
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Report Details</th>
                <th className="p-4">Work Status</th>
                <th className="p-4">Verification Audit</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap align-top">
                    <Link href={`/reports/${report.id}`} className="text-blue-600 hover:underline">
                      {report.id}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-normal mt-1">
                      {new Date(report.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </td>

                  <td className="p-4 align-top max-w-sm">
                    <div className="font-bold text-slate-900 text-xs">{report.title}</div>
                    <div className="text-slate-500 text-[11px] truncate mt-0.5">{report.address}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                        {report.category}
                      </span>
                      {report.isSynthetic && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Synthetic Case
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 align-top whitespace-nowrap">
                    <div className="space-y-1.5">
                      <WorkStatusBadge status={report.workStatus} />
                      <div className="flex gap-1 pt-1">
                        {report.workStatus !== 'in_progress' && (
                          <button
                            onClick={() => handleQuickStatusChange(report.id, 'in_progress')}
                            className="text-[10px] text-indigo-600 hover:underline font-semibold"
                          >
                            Mark In Progress
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 align-top whitespace-nowrap">
                    <VerificationStatusBadge status={report.verificationStatus} />
                  </td>

                  <td className="p-4 align-top whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/reports/${report.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                      >
                        Inspect
                      </Link>
                      {report.afterEvidence ? (
                        <Link
                          href={`/reports/${report.id}/compare`}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold text-xs shadow-2xs"
                        >
                          Compare
                        </Link>
                      ) : (
                        <Link
                          href={`/reports/${report.id}`}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-xs shadow-2xs"
                        >
                          + Upload After Photo
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

