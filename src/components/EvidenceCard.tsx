'use client';

import React, { useState } from 'react';
import { EvidenceAsset } from '@/lib/types';
import {
  Calendar,
  Check,
  Copy,
  FileCheck2,
  Fingerprint,
  MapPin,
  Shield,
  ShieldAlert,
  User,
} from 'lucide-react';

export function EvidenceCard({
  asset,
  title,
  highlightBadge,
}: {
  asset: EvidenceAsset;
  title: string;
  highlightBadge?: string;
}) {
  const [copiedSha, setCopiedSha] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        </div>
        {highlightBadge && (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {highlightBadge}
          </span>
        )}
      </div>

      {/* Image preview */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <img
          src={asset.imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {asset.isBlurred && (
          <div className="absolute inset-0 bg-red-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <ShieldAlert className="w-8 h-8 text-rose-400 mb-1" />
            <p className="text-xs font-bold text-rose-200">Optical Blur Detected</p>
            <p className="text-[11px] text-rose-300">
              Laplacian sharpness metric below threshold. Unusable for definitive verification.
            </p>
          </div>
        )}
      </div>

      {/* Forensic Metadata Grid */}
      <div className="p-4 space-y-3 text-xs flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Submitter */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <User className="w-3.5 h-3.5" /> Submitter
            </span>
            <span className="font-semibold text-slate-800 capitalize">
              {asset.uploaderRole} ({asset.uploaderId})
            </span>
          </div>

          {/* Captured & Uploaded Timestamps */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5" /> Uploaded
            </span>
            <span className="text-slate-700">
              {new Date(asset.uploadedAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          {/* Geolocation */}
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5" /> Geotag
            </span>
            <span className="text-slate-700 font-mono">
              {asset.latitude && asset.longitude
                ? `${asset.latitude.toFixed(5)}°, ${asset.longitude.toFixed(5)}°`
                : 'No GPS metadata'}
            </span>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Fingerprint className="w-3.5 h-3.5 text-blue-600" /> SHA-256 Cryptographic Hash
              </span>
              <button
                onClick={() => copyToClipboard(asset.sha256Hash)}
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                title="Copy SHA-256 Hash"
              >
                {copiedSha ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedSha ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60 break-all select-all">
              {asset.sha256Hash}
            </p>
          </div>

          {/* Perceptual Hash */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Perceptual Hash (dHash):</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
              {asset.perceptualHash}
            </span>
          </div>
        </div>

        {asset.notes && (
          <div className="pt-2 border-t border-slate-100 text-slate-600 text-[11px] italic bg-slate-50/50 p-2 rounded">
            "{asset.notes}"
          </div>
        )}
      </div>
    </div>
  );
}

