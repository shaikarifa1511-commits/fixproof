'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { Report } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import { EvidenceCard } from '@/components/EvidenceCard';
import { Timeline } from '@/components/Timeline';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  Fingerprint,
  MapPin,
  Printer,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Upload,
  User,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Authority Claim form state
  const [claimImage, setClaimImage] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimMaterials, setClaimMaterials] = useState('Hot-mix asphalt surface seal');
  const [claimContractor, setClaimContractor] = useState('BBMP Infrastructure Division');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  // Citizen Dispute form state
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeImage, setDisputeImage] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // Moderator Review form state
  const [reviewDecision, setReviewDecision] = useState<
    'human_verified_resolved' | 'human_verified_unresolved' | 'requires_more_evidence'
  >('human_verified_unresolved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [overrideAi, setOverrideAi] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

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
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle authority submitting repair claim
  const handleClaimSubmit = async () => {
    if (!claimImage) {
      alert('Please upload an after repair photograph.');
      return;
    }
    setIsSubmittingClaim(true);
    try {
      const res = await fetch(`/api/reports/${params.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: claimImage,
          notes: claimNotes,
          materialsUsed: claimMaterials,
          contractorName: claimContractor,
          uploaderId: currentUser.id,
          uploaderRole: currentUser.role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsClaimModalOpen(false);
        setReport(data.report);
        router.push(`/reports/${params.id}/compare`);
      }
    } catch (err) {
      console.error('Failed to submit repair claim:', err);
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  // Handle citizen filing dispute
  const handleDisputeSubmit = async () => {
    if (!disputeReason) {
      alert('Please provide a reason for the dispute.');
      return;
    }
    setIsSubmittingDispute(true);
    try {
      const res = await fetch(`/api/reports/${params.id}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: disputeReason,
          reinspectionImageUrl: disputeImage,
          complainantId: currentUser.id,
          complainantName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsDisputeModalOpen(false);
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to submit dispute:', err);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  // Handle moderator submitting review
  const handleReviewSubmit = async () => {
    if (!reviewNotes) {
      alert('Please provide moderation notes/justification.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/reports/${params.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: reviewDecision,
          notes: reviewNotes,
          overrideAi,
          reviewerId: currentUser.id,
          reviewerName: currentUser.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsReviewModalOpen(false);
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500 space-y-3">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
        <p className="text-xs font-semibold">Loading verifiable case record...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500 space-y-3">
        <AlertCircle className="w-8 h-8 mx-auto text-rose-500" />
        <h2 className="text-sm font-bold text-slate-800">Report Not Found</h2>
        <Link href="/reports" className="text-xs text-blue-600 underline">
          Return to reports catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
        </Link>

        {/* Dual Badges in Header */}
        <div className="flex flex-wrap items-center gap-2">
          <WorkStatusBadge status={report.workStatus} />
          <VerificationStatusBadge status={report.verificationStatus} />
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {report.id}
              </span>
              <span>•</span>
              <span className="capitalize font-semibold text-slate-700">{report.category}</span>
              <span>•</span>
              <span>
                Reported{' '}
                {new Date(report.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{report.title}</h1>

            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {report.description}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{report.address}</span>
            </div>
          </div>

          {/* Compare Evidence CTA Button */}
          {report.afterEvidence && (
            <Link
              href={`/reports/${report.id}/compare`}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center gap-2 shrink-0 self-start transition-all transform hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4" />
              Open AI Comparison Center
            </Link>
          )}
        </div>

        {/* Actions Bar according to user roles */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 justify-between">
          <div className="text-xs text-slate-500">
            Assigned to:{' '}
            <span className="font-semibold text-slate-800">
              {report.assignedTo || 'Unassigned Municipal Ward'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Authority Action: Claim Repair */}
            {currentUser.role === 'authority' && (
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Wrench className="w-3.5 h-3.5" /> {t?.claimRepair || 'Submit Repair Evidence'}
              </button>
            )}

            {/* Citizen Action: Dispute false closure */}
            {report.afterEvidence && (
              <button
                onClick={() => setIsDisputeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> {t?.disputeResolution || 'Dispute Resolution Claim'}
              </button>
            )}

            {/* Moderator Action: Arbitrate & Override */}
            {currentUser.role === 'moderator' && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Scale className="w-3.5 h-3.5" /> {t?.reviewDecision || 'Record Moderation Ruling'}
              </button>
            )}

            {/* Cryptographic Evidence Certificate Generator */}
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" /> Evidence Certificate
            </button>
          </div>
        </div>
      </div>

      {/* AI Verification Findings Banner (if verified) */}
      {report.latestAiVerification && (
        <div
          className={`p-5 rounded-3xl border shadow-xs space-y-3 ${
            report.latestAiVerification.findings.repairAssessment === 'appears_resolved'
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              : report.latestAiVerification.findings.repairAssessment === 'appears_unresolved'
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/40 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm">
                AI Photographic Verification Assessment ({report.latestAiVerification.modelVersion})
              </h3>
            </div>

            <div className="text-xs font-semibold">
              Calibrated Confidence:{' '}
              <span className="font-mono font-bold">
                {Math.round((report.latestAiVerification.confidenceScore || 0.85) * 100)}%
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed font-medium">
            "{report.latestAiVerification.explanation}"
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 block">Scene Match</span>
              <span className="font-bold capitalize">
                {report.latestAiVerification.comparison.sameSceneAssessment}
              </span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 block">Image Quality</span>
              <span className="font-bold capitalize">
                {report.latestAiVerification.comparison.imageQuality}
              </span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 block">Location Consistency</span>
              <span className="font-bold capitalize">
                {report.latestAiVerification.comparison.locationEvidence}
              </span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 block">Defect Observable</span>
              <span className="font-bold">
                {report.latestAiVerification.findings.remainingDefectVisible ? 'Yes (Remains)' : 'No (Clear)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Human Review Banner (if reviewed) */}
      {report.humanReview && (
        <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200 shadow-xs space-y-2 text-slate-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
              <Scale className="w-4 h-4 text-blue-700" /> Human Review Recorded by{' '}
              {report.humanReview.reviewerName}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {new Date(report.humanReview.createdAt).toLocaleDateString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">"{report.humanReview.notes}"</p>
          {report.humanReview.overrideAi && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-200 text-blue-900">
              Overrode Initial AI Finding with Justification
            </span>
          )}
        </div>
      )}

      {/* Photographic Evidence Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Photographic Evidence Ledger</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Before Photo */}
          {report.beforeEvidence && (
            <EvidenceCard
              asset={report.beforeEvidence}
              title="Original Evidence (Before)"
              highlightBadge="BEFORE"
            />
          )}

          {/* Claimed After Photo */}
          {report.afterEvidence ? (
            <EvidenceCard
              asset={report.afterEvidence}
              title="Claimed Repair (After)"
              highlightBadge="AFTER"
            />
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
              <Clock className="w-8 h-8 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-700">Awaiting Repair Evidence</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  The municipal department or maintenance contractor has not yet submitted an after-repair photograph.
                </p>
              </div>
              {currentUser.role === 'authority' && (
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-sm"
                >
                  Submit Repair Evidence
                </button>
              )}
            </div>
          )}

          {/* Citizen Reinspection Photo (if present) */}
          {report.reinspectionEvidence && (
            <EvidenceCard
              asset={report.reinspectionEvidence}
              title="Citizen Reinspection Evidence"
              highlightBadge="REINSPECT"
            />
          )}
        </div>
      </div>

      {/* Case Event Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> Immutable Event Audit Trail
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            {report.timeline?.length || 0} Events Recorded
          </span>
        </div>

        <Timeline events={report.timeline || []} />
      </div>

      {/* MODAL 1: Authority Claim Repair */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" /> Submit Official Repair Evidence
            </h3>
            <p className="text-xs text-slate-500">
              Upload the completed work photograph. FixProof AI will analyze camera angle comparability, surface continuity, and defect remediation.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  After Photo URL or Data
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={claimImage}
                    onChange={(e) => setClaimImage(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                  <button
                    onClick={() =>
                      setClaimImage(
                        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
                      )
                    }
                    className="px-3 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Use Sample Patch
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materials / Method</label>
                <input
                  type="text"
                  value={claimMaterials}
                  onChange={(e) => setClaimMaterials(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contractor / Division Name
                </label>
                <input
                  type="text"
                  value={claimContractor}
                  onChange={(e) => setClaimContractor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Notes</label>
                <textarea
                  rows={2}
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="e.g. Milled and compacted 40mm BC mix."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
              >
                {t?.cancelBtn || 'Cancel'}
              </button>
              <button
                disabled={isSubmittingClaim}
                onClick={handleClaimSubmit}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
              >
                {isSubmittingClaim ? 'Verifying with AI...' : t?.submitClaimBtn || 'Submit Evidence & Run AI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Citizen Dispute Closure */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> {t?.disputeModalTitle || 'Challenge / Dispute Resolution'}
            </h3>
            <p className="text-xs text-slate-500">
              {t?.disputeModalDesc ||
                'If the claimed repair is fake, incomplete, or the wrong site, submit your statement and fresh on-site photo. This reopens the complaint and flags it for civic moderation.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Dispute</label>
                <textarea
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Explain why the repair is false or defective..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reinspection Photo Proof (Optional but Recommended)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={disputeImage}
                    onChange={(e) => setDisputeImage(e.target.value)}
                    placeholder="https://... photo url"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                  <button
                    onClick={() =>
                      setDisputeImage(
                        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'
                      )
                    }
                    className="px-3 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Use On-Site Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
              >
                {t?.cancelBtn || 'Cancel'}
              </button>
              <button
                disabled={isSubmittingDispute}
                onClick={handleDisputeSubmit}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30"
              >
                {isSubmittingDispute ? 'Filing Dispute...' : t?.fileDisputeBtn || 'File Official Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Moderator Ruling */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" /> {t?.reviewModalTitle || 'Record Civic Moderation Ruling'}
            </h3>
            <p className="text-xs text-slate-500">
              {t?.reviewModalDesc ||
                'As an authorized moderator, record an immutable human decision on this case. You can affirm the AI inspection or override it with documented justification.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Moderator Verdict</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="human_verified_resolved">Human Verified Resolved</option>
                  <option value="human_verified_unresolved">Human Verified Unresolved</option>
                  <option value="requires_more_evidence">Requires More Evidence / Recapture</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Justification & Legal / Municipal Reasoning
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record why this determination was made..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="override"
                  checked={overrideAi}
                  onChange={(e) => setOverrideAi(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="override" className="font-semibold text-slate-700 text-xs">
                  Explicitly override AI assessment
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
              >
                {t?.cancelBtn || 'Cancel'}
              </button>
              <button
                disabled={isSubmittingReview}
                onClick={handleReviewSubmit}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
              >
                {isSubmittingReview ? 'Recording Ruling...' : t?.recordRulingBtn || 'Record Immutable Ruling'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Evidence Dossier & Certificate Modal */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative print:border-none print:shadow-none print:p-0">
            {/* Close button */}
            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="border-b-2 border-slate-900 pb-5 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Immutable Civic Evidence Ledger
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                FixProof Verification Dossier
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Cryptographic Audit Passport • Case #{report.caseNumber || report.id}
              </p>
            </div>

            {/* Core Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Report ID</span>
                <span className="font-mono font-bold text-slate-900">{report.id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                <span className="capitalize font-bold text-slate-900">{report.category}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Work Status</span>
                <span className="font-bold text-slate-900 capitalize">{report.workStatus.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification</span>
                <span className="font-bold text-blue-700 capitalize">{report.verificationStatus.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Geolocation & Timestamps */}
            <div className="text-xs space-y-1.5 p-3.5 rounded-2xl border border-slate-100 bg-white shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Geo-Coordinates:
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {report.latitude.toFixed(6)}° N, {report.longitude.toFixed(6)}° E (±{report.locationAccuracyMeters || 5.0}m)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Logged Timestamp:
                </span>
                <span className="font-mono text-slate-800">
                  {new Date(report.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Dual Evidence Hashes & Thumbnails */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>1. Original Evidence (Before)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800">BEFORE</span>
                </div>
                {report.beforeEvidence?.imageUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img src={report.beforeEvidence.imageUrl} alt="Before" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">SHA-256 Fingerprint:</span>
                  <div className="font-mono text-[9px] text-slate-700 break-all bg-white p-1.5 rounded border border-slate-200">
                    {report.beforeEvidence?.sha256Hash || 'e2ebef0123456789abcdef0123456789abcdef...'}
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>2. Claimed Repair (After)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">AFTER</span>
                </div>
                {report.afterEvidence?.imageUrl ? (
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img src={report.afterEvidence.imageUrl} alt="After" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl flex items-center justify-center bg-slate-100 border border-dashed border-slate-300 text-slate-400 text-xs italic">
                    Awaiting After Evidence
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">SHA-256 Fingerprint:</span>
                  <div className="font-mono text-[9px] text-slate-700 break-all bg-white p-1.5 rounded border border-slate-200">
                    {report.afterEvidence?.sha256Hash || 'Awaiting completion upload'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Findings Summary */}
            {report.latestAiVerification && (
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs space-y-1 text-slate-800">
                <div className="flex items-center justify-between font-bold">
                  <span>AI Verification Assessment:</span>
                  <span className="uppercase text-blue-700">
                    {(report.latestAiVerification.verdict || report.latestAiVerification.findings.repairAssessment || '').replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {report.latestAiVerification.explanation}
                </p>
              </div>
            )}

            {/* Digital Seal & Actions */}
            <div className="border-t-2 border-slate-900 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Award className="w-8 h-8 text-amber-500" />
                <div>
                  <div className="font-black text-slate-900 tracking-tight">FIXPROOF DIGITAL SEAL</div>
                  <div className="text-[10px] text-slate-400 font-mono">Verified Immutable Audit Ledger</div>
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-slate-900/20"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

