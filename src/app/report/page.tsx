'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useLanguage } from '@/lib/i18n/context';
import { ProblemCategory } from '@/lib/types';
import { CameraCaptureModal } from '@/components/CameraCaptureModal';
import dynamic from 'next/dynamic';
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Fingerprint,
  MapPin,
  Sparkles,
  Upload,
} from 'lucide-react';

// Dynamic import for Leaflet map to prevent SSR issues
const LeafletMap = dynamic(
  () => import('@/components/LeafletMap').then((mod) => mod.LeafletMap),
  { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-2xl" /> }
);

export default function ReportProblemPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<ProblemCategory>('pothole');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [perceptualHash, setPerceptualHash] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('100ft Road, Indiranagar, Bengaluru, Karnataka');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 12.9719,
    lng: 77.6412,
  });
  const [accuracy, setAccuracy] = useState<number>(4.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Category selection options
  const categories: Array<{ id: ProblemCategory; title: string; desc: string; icon: string }> = [
    {
      id: 'pothole',
      title: 'Pothole & Road Hazard',
      desc: 'Craters, road depressions, exposed aggregate, sharp edges',
      icon: '🕳️',
    },
    {
      id: 'garbage',
      title: 'Garbage & Solid Waste Dump',
      desc: 'Uncollected mounds, overflow bins, sidewalk litter',
      icon: '🗑️',
    },
    {
      id: 'footpath',
      title: 'Damaged Sidewalk / Footpath',
      desc: 'Broken slabs, tripping hazards, missing curb stones',
      icon: '🚶',
    },
    {
      id: 'drainage',
      title: 'Broken Drainage / Drain Covers',
      desc: 'Missing storm drain grates, clogged culverts, deep open pits',
      icon: '🌊',
    },
    {
      id: 'infrastructure',
      title: 'Public Infrastructure Damage',
      desc: 'Damaged guardrails, leaning utility poles, street furniture',
      icon: '🏗️',
    },
  ];

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.imageUrl);
        setSha256Hash(data.sha256Hash);
        setPerceptualHash(data.perceptualHash);
        triggerAiSuggestion(category);
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  // Handle Camera Capture
  const handleCameraCapture = async (data: {
    imageBase64: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }) => {
    if (data.latitude && data.longitude) {
      setCoords({ lat: data.latitude, lng: data.longitude });
    }
    if (data.accuracy) {
      setAccuracy(data.accuracy);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: data.imageBase64, filename: 'capture.jpg' }),
      });
      const uploadData = await res.json();
      if (uploadData.success) {
        setImageUrl(uploadData.imageUrl);
        setSha256Hash(uploadData.sha256Hash);
        setPerceptualHash(uploadData.perceptualHash);
        triggerAiSuggestion(category);
      }
    } catch (err) {
      console.error('Camera upload failed:', err);
    }
  };

  // Sample quick AI draft generator
  const triggerAiSuggestion = (cat: ProblemCategory) => {
    setIsAiGenerating(true);
    setTimeout(() => {
      if (cat === 'pothole') {
        setTitle('Hazardous Pothole Crater on Traffic Lane');
        setDescription('Substantial asphalt depression causing two-wheelers to swerve abruptly. Exposed sub-base stone visible.');
      } else if (cat === 'garbage') {
        setTitle('Overflowing Solid Waste Blocking Pedestrian Walkway');
        setDescription('Decomposing garbage accumulation spilling from corner onto road verge. Needs clearance.');
      } else if (cat === 'footpath') {
        setTitle('Shattered Footpath Pavement Slabs');
        setDescription('Uneven broken concrete slabs posing trip hazard for elderly pedestrians.');
      } else if (cat === 'drainage') {
        setTitle('Missing Iron Grate on Storm Water Drain');
        setDescription('Uncovered drainage pit directly in pedestrian flow path without barrier.');
      } else {
        setTitle('Damaged Public Infrastructure Asset');
        setDescription('Visible physical defect requiring municipal inspection.');
      }
      setIsAiGenerating(false);
    }, 600);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Report
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || `${category.toUpperCase()} Issue Reported`,
          description,
          category,
          address,
          latitude: coords.lat,
          longitude: coords.lng,
          locationAccuracyMeters: accuracy,
          citizenId: currentUser.id,
          citizenName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const reportId = data.report.id;

        // 2. Attach Evidence Asset
        await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportId,
            stage: 'before',
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
            sha256Hash,
            perceptualHash,
            latitude: coords.lat,
            longitude: coords.lng,
          }),
        });

        router.push(`/reports/${reportId}`);
      }
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Report Public Infrastructure Defect
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit verifiable photographic evidence with tamper-proof SHA-256 and GPS coordinates.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs font-semibold">
        {[
          { num: 1, label: 'Category' },
          { num: 2, label: 'Evidence Photo' },
          { num: 3, label: 'Location' },
          { num: 4, label: 'AI Review & Submit' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            className={`flex items-center gap-2 cursor-pointer ${
              step === s.num
                ? 'text-blue-600 font-bold'
                : step > s.num
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === s.num
                  ? 'bg-blue-600 text-white'
                  : step > s.num
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Step 1 — Choose Problem Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCategory(c.id);
                  triggerAiSuggestion(c.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                  category === c.id
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{c.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              Next: Capture Evidence <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PHOTOGRAPHIC EVIDENCE */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-sm font-bold text-slate-800">
            Step 2 — Capture Photographic Evidence
          </h2>
          <p className="text-xs text-slate-500">
            Clear, well-lit photos allow AI comparison to register background landmarks (curbs, poles, buildings).
          </p>

          {imageUrl ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
                <img src={imageUrl} alt="Uploaded evidence" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" /> Captured & Hashed
                </span>
              </div>

              {/* Hashes Info Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Fingerprint className="w-4 h-4 text-blue-600" /> Evidence Cryptographic Passport
                </div>
                <div className="font-mono text-[11px] text-slate-600 break-all bg-white p-2 rounded-lg border border-slate-200">
                  SHA-256: {sha256Hash || 'Generated on commit'}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsCameraOpen(true)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50"
                >
                  Retake Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* In-app camera button */}
              <button
                onClick={() => setIsCameraOpen(true)}
                className="p-8 rounded-2xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/30 hover:bg-blue-50/60 transition-all flex flex-col items-center justify-center gap-3 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Open In-App Camera</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Live capture with consented GPS lock
                  </p>
                </div>
              </button>

              {/* Standard File Upload */}
              <label className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Upload Image File</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">JPEG, PNG or WebP up to 15MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Quick synthetic photo fill button for fast review */}
          {!imageUrl && (
            <div className="text-center">
              <button
                onClick={() => {
                  setImageUrl(
                    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'
                  );
                  setSha256Hash(
                    'a8b79e13b823e201c9a1d489b1425b03e04f056291a1482b8a74e5021f19f201'
                  );
                  setPerceptualHash('c4e09871ab9011f0');
                  triggerAiSuggestion(category);
                }}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                ⚡ Use sample high-resolution road evidence photo for test
              </button>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              disabled={!imageUrl}
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              Next: Tag Location <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LOCATION SELECTION */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Step 3 — Geotag Location</h2>
          <p className="text-xs text-slate-500">
            Click anywhere on the map or drag the pin to pin-point the civic issue location.
          </p>

          <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <LeafletMap
              clickable={true}
              onLocationSelect={({ lat, lng }) => {
                setCoords({ lat, lng });
              }}
              initialCenter={[coords.lat, coords.lng]}
              zoom={13}
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Selected Coordinates:
              </span>
              <span className="font-mono text-slate-800 font-bold">
                {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Street Address / Landmark
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              Next: Review & Confirm <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI REVIEW & SUBMIT */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Step 4 — AI Description & Confirmation</h2>
            {isAiGenerating && (
              <span className="text-[11px] text-blue-600 flex items-center gap-1 font-semibold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> AI Drafting Description...
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Complaint Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary of problem"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Observation
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe physical dimensions, traffic hazards, or duration"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary preview card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Reporter:</span>
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Category:</span>
                <span className="font-semibold text-slate-800 capitalize">{category}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-semibold text-slate-800 truncate max-w-xs">{address}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tamper SHA-256:</span>
                <span className="font-mono text-[10px] text-slate-700">{sha256Hash.substring(0, 20)}...</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              {isSubmitting ? (
                <>Submitting Case...</>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" /> Submit Report to FixProof
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}

