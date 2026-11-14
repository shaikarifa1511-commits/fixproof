'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/context';
import { AIVerificationResult, Report } from '@/lib/types';
import { ImageSlider } from '@/components/ImageSlider';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Code,
  Columns,
  Cpu,
  Eye,
  FileCheck2,
  Layers,
  MapPin,
  Maximize2,
  RefreshCw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export default function EvidenceComparePage() {
  const params = useParams();
  const { t } = useLanguage();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const [showOverlays, setShowOverlays] = useState(true);
  const [showJson, setShowJson] = useState(false);
  const [isRerunningAi, setIsRerunningAi] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [params.id]);

  async function fetchReport() {
    try {
      const res = await fetch(`/api/reports/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to load report for compare:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRerunVerification = async () => {
    setIsRerunningAi(true);
    try {
      const res = await fetch(`/api/reports/${params.id}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to re-run verification:', err);
    } finally {
      setIsRerunningAi(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-500 space-y-3">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
        <p className="text-xs font-semibold">Loading AI Evidence Comparator...</p>
      </div>
    );
  }

  if (!report || !report.beforeEvidence) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 space-y-3">
        <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
        <h2 className="text-sm font-bold text-slate-800">Insufficient Evidence for Comparison</h2>
        <p className="text-xs text-slate-500">This case does not have photographic evidence attached yet.</p>
        <Link href={`/reports/${params.id}`} className="text-xs text-blue-600 underline">
          Return to case file
        </Link>
      </div>
    );
  }

  const beforeUrl = report.beforeEvidence.imageUrl;
  const afterUrl =
    report.afterEvidence?.imageUrl ||
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';

  const ai = report.latestAiVerification;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/reports/${report.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t?.backToCase || 'Back to Case File'} ({report.id})
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-blue-600" /> {t?.comparePageTitle || 'AI Evidence Comparison Center'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t?.comparePageSubtitle ||
              'Comparing original citizen complaint evidence against claimed municipal repair imagery.'}
          </p>
        </div>

        {/* View Mode & Overlay Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'slider'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> {t?.interactiveSlider || 'Interactive Slider'}
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> {t?.sideBySideView || 'Side by Side'}
            </button>
          </div>

          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showOverlays
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> {t?.overlayDefectRegion || 'Defect Highlights'}
          </button>
        </div>
      </div>

      {/* PRIMARY VIEWER: Slider OR Side-by-side */}
      <div className="space-y-4">
        {viewMode === 'slider' ? (
          <ImageSlider
            beforeUrl={beforeUrl}
            afterUrl={afterUrl}
            beforeBoxes={ai?.boundingBoxes?.before}
            afterBoxes={ai?.boundingBoxes?.after}
            showBoundingBoxes={showOverlays}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Original Evidence (Before)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {report.beforeEvidence?.uploadedAt
                    ? new Date(report.beforeEvidence.uploadedAt).toLocaleDateString('en-IN')
                    : ''}
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-slate-950">
                <img
                  src={beforeUrl}
                  alt="Original Evidence"
                  className="w-full h-full object-cover"
                />
                {showOverlays &&
                  ai?.boundingBoxes?.before?.map((box, i) => (
                    <div
                      key={i}
                      className="absolute border-2 border-rose-500 bg-rose-500/25 rounded shadow-sm"
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded">
                        {box.label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* After Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Claimed Repair Evidence (After)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {report.afterEvidence?.uploadedAt
                    ? new Date(report.afterEvidence.uploadedAt).toLocaleDateString('en-IN')
                    : 'Awaiting submission'}
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-slate-950">
                <img
                  src={afterUrl}
                  alt="Claimed Repair"
                  className="w-full h-full object-cover"
                />
                {showOverlays &&
                  ai?.boundingBoxes?.after?.map((box, i) => (
                    <div
                      key={i}
                      className="absolute border-2 border-emerald-400 bg-emerald-500/25 rounded shadow-sm"
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded">
                        {box.label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Structured Findings Panel */}
      {ai ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Structured Verification Findings & Analysis
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Engine: {ai.modelVersion} • Processed:{' '}
                  {new Date(ai.processedAt).toLocaleTimeString('en-IN')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowJson(!showJson)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5 text-slate-500" />
                {showJson ? 'Hide JSON Schema' : 'View Raw JSON'}
              </button>

              <button
                disabled={isRerunningAi}
                onClick={handleRerunVerification}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRerunningAi ? 'animate-spin' : ''}`}
                />
                {t?.rerunAiVerification || 'Re-evaluate Evidence'}
              </button>
            </div>
          </div>

          {/* AI Assessment Callout Box */}
          <div
            className={`p-5 rounded-2xl border ${
              ai.findings.repairAssessment === 'appears_resolved'
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : ai.findings.repairAssessment === 'appears_unresolved'
                ? 'bg-red-50/70 border-red-300 text-red-950'
                : 'bg-amber-50/70 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
                    {ai.findings.repairAssessment.replace(/_/g, ' ')}
                  </span>
                  {ai.duplicateDetected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white">
                      Duplicate Photo Fraud Detected
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  "{ai.explanation}"
                </p>
              </div>

              {ai.confidenceScore && (
                <div className="text-right shrink-0 bg-white/90 p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                  <div className="text-xl font-black text-slate-900">
                    {Math.round(ai.confidenceScore * 100)}%
                  </div>
                  <div className="text-[10px] font-medium text-slate-500">
                    Calibrated Match
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-600 mt-2 font-medium italic">
              Confidence Basis: {ai.confidenceExplanation}
            </p>
          </div>

          {/* 4 Step Forensic Diagnostics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Same Scene Assessment */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                1. Scene Alignment
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 capitalize">
                  {ai.comparison.sameSceneAssessment}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    ai.comparison.sameSceneAssessment === 'likely'
                      ? 'bg-emerald-500'
                      : ai.comparison.sameSceneAssessment === 'possible'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Stationary curbs & background features
              </p>
            </div>

            {/* Image Quality / Blur */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                2. Optical Quality
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 capitalize">
                  {ai.comparison.imageQuality}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    ai.comparison.imageQuality === 'sufficient'
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Laplacian sharpness & motion blur metric
              </p>
            </div>

            {/* Location Consistency */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                3. Geodetic Plausibility
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 capitalize">
                  {ai.comparison.locationEvidence}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    ai.comparison.locationEvidence === 'consistent'
                      ? 'bg-emerald-500'
                      : ai.comparison.locationEvidence === 'limited'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Haversine distance threshold verification
              </p>
            </div>

            {/* Remaining Defect */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                4. Visible Defect
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  {ai.findings.remainingDefectVisible ? 'Still Observable' : 'Remediated'}
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    !ai.findings.remainingDefectVisible ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Cavity depth & asphalt continuity
              </p>
            </div>
          </div>

          {/* JSON Schema Drawer */}
          {showJson && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Standardized JSON Output (Section 5 Schema)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  application/json
                </span>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-80 select-all border border-slate-800">
                {JSON.stringify(ai, null, 2)}
              </pre>
            </div>
          )}

          {/* Human Verification Distinction Banner (Section 7 Screen 4 requirement) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Scale className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">
                  AI Assessment vs Human-Verified Outcome
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  The AI finding provides transparent computer-vision evaluation. It does not replace authorized human oversight. Final civic case closure requires independent human review.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <VerificationStatusBadge status={report.verificationStatus} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-3">
          <Cpu className="w-8 h-8 mx-auto text-slate-400" />
          <h3 className="text-xs font-bold text-slate-700">AI Assessment Pending</h3>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Once repair evidence is uploaded by the authority, FixProof will generate a side-by-side comparison.
          </p>
        </div>
      )}
    </div>
  );
}

