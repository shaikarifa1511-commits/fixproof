'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import { PublicAnalytics, Report } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck2,
  FileText,
  MapPin,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<PublicAnalytics | null>(null);
  const [featuredReports, setFeaturedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/reports?limit=6'),
        ]);
        const statsData = await statsRes.json();
        const reportsData = await reportsRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (reportsData.success) setFeaturedReports(reportsData.reports);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic AI Verification Engine</span>
            <span className="w-1 h-1 rounded-full bg-blue-400" />
            <span className="text-blue-200">Independent Evidence Ledger</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Reported. Repaired.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Verified.
            </span>
          </h1>

          {/* Subheading / Core Principle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            A complaint being marked <span className="font-semibold text-white">"Fixed"</span> does not prove the underlying problem was actually fixed. FixProof empowers citizens and authorities to assess repair claims with before/after photographic proof and transparent computer vision.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/report"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              Report a Defect
            </Link>

            <Link
              href="/map"
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Explore Civic Map
            </Link>

            <Link
              href="/reports/FP-000102/compare"
              className="px-6 py-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4 text-rose-400" />
              Inspect AI Comparison Demo
            </Link>
          </div>
        </div>

        {/* Live Metrics Counter Bar */}
        <div className="max-w-6xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
          <div className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-md rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats?.totalReports ?? 10}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Cases Tracked</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-md rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {stats?.reportsVerifiedResolved ?? 2}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Verified Resolved</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-md rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-rose-400">
              {stats?.unresolvedRateAfterClosureClaim ?? 67}%
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Unresolved Closure Rate</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-md rounded-2xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Tamper Hashed (SHA-256)</div>
          </div>
        </div>
      </section>

      {/* The 5 Key Questions FixProof Answers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            How FixProof Solves the Civic Evidence Gap
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every case is scrutinized against five objective verification tests:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              num: '1',
              q: 'What was reported?',
              desc: 'Immutable original photograph, GPS geostamp, category & timestamp hash.',
              icon: FileText,
              color: 'text-blue-600 bg-blue-50 border-blue-200',
            },
            {
              num: '2',
              q: 'What is the repair proof?',
              desc: 'After-photo submitted with authorized agency credentials and materials used.',
              icon: FileCheck2,
              color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
            },
            {
              num: '3',
              q: 'Is it the same scene?',
              desc: 'Stationary landmark alignment, curb matching, and GPS distance threshold checks.',
              icon: Eye,
              color: 'text-purple-600 bg-purple-50 border-purple-200',
            },
            {
              num: '4',
              q: 'Is the defect resolved?',
              desc: 'AI surface texture, asphalt contour, and cavity depth analysis.',
              icon: ShieldCheck,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            },
            {
              num: '5',
              q: 'What if it fails?',
              desc: 'Citizens challenge false closures, upload reinspections, and trigger human moderation.',
              icon: AlertTriangle,
              color: 'text-rose-600 bg-rose-50 border-rose-200',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs mb-3 border ${item.color}`}>
                    {item.num}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{item.q}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Civic Cases with Dual Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Featured Civic Cases & AI Audits</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore live test cases comparing claimed municipal closures against actual visual findings.
            </p>
          </div>

          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All Reports ({stats?.totalReports ?? 10}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Dual image preview header */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden flex">
                {/* Left: Before */}
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

                {/* Right: After */}
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
                    Synthetic Demo
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-700">{report.id}</span>
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

                  <Link
                    href={`/reports/${report.id}/compare`}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold inline-flex items-center gap-1"
                    title="Open AI Comparison Slider"
                  >
                    Compare <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reset / Demo Data Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-800">Demonstration Environment Active:</span> Preloaded with 10 synthetic test cases spanning verified repairs, false closures, partial work, optical blur, and photographic duplicate fraud detection.
          </div>
          <button
            onClick={async () => {
              await fetch('/api/seed', { method: 'POST' });
              window.location.reload();
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs whitespace-nowrap flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Cases
          </button>
        </div>
      </section>
    </div>
  );
}

