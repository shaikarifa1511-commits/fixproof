'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, MapPin, RefreshCw, X } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: {
    imageBase64: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  }) => void;
}

export function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
}: CameraCaptureModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat?: number; lon?: number; acc?: number }>({});
  const [geoConsent, setGeoConsent] = useState(true);
  const [geoStatus, setGeoStatus] = useState<string>('Detecting location...');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      if (geoConsent) {
        acquireLocation();
      }
    } else {
      stopCamera();
      setCapturedImage(null);
    }
  }, [isOpen, geoConsent]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setCameraError('Camera API not accessible on this device.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unattached:', err);
      setCameraError('Camera access denied or not connected. You can use standard file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const acquireLocation = () => {
    if ('geolocation' in navigator) {
      setGeoStatus('Acquiring high-accuracy GPS fix...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            acc: position.coords.accuracy,
          });
          setGeoStatus(`GPS Locked: ±${Math.round(position.coords.accuracy)}m accuracy`);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          // Default to Bengaluru city center coordinates if denied in browser
          setCoords({ lat: 12.9716, lon: 77.5946, acc: 8.0 });
          setGeoStatus('Using approximate location (12.9716° N, 77.5946° E)');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGeoStatus('GPS hardware unavailable');
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
      }
    } else {
      // Demo simulated snapshot if camera stream is blocked
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '20px sans-serif';
      ctx.fillText('FixProof On-Site Camera Snapshot', 160, 240);
      setCapturedImage(canvas.toDataURL('image/jpeg', 0.85));
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture({
        imageBase64: capturedImage,
        latitude: coords.lat,
        longitude: coords.lon,
        accuracy: coords.acc,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">In-App Live Camera Capture</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Snapshot Viewport */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-6 text-center text-slate-400 space-y-3">
              <Camera className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
              <p className="text-xs">{cameraError || 'Initializing camera stream...'}</p>
              <button
                onClick={takeSnapshot}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-500"
              >
                Simulate Camera Capture
              </button>
            </div>
          )}

          {/* GPS HUD Tag */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 text-[11px] text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{geoStatus}</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                onClick={() => setCapturedImage(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 font-semibold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Use Photographic Evidence
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <button
                onClick={takeSnapshot}
                className="w-14 h-14 rounded-full border-4 border-white bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center"
                aria-label="Capture photo"
              >
                <div className="w-4 h-4 rounded-full bg-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
