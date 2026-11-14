'use client';

import React, { useState, useRef, useCallback } from 'react';
import { BoundingBox } from '@/lib/types';

interface ImageSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeBoxes?: BoundingBox[];
  afterBoxes?: BoundingBox[];
  showBoundingBoxes?: boolean;
}

export function ImageSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original Evidence (Before)',
  afterLabel = 'Claimed Repair (After)',
  beforeBoxes = [],
  afterBoxes = [],
  showBoundingBoxes = false,
}: ImageSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Slider Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Before and after image comparison slider"
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[520px] rounded-2xl overflow-hidden shadow-xl bg-slate-950 cursor-ew-resize border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* After Image (Background layer) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={afterUrl}
            alt={afterLabel}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {showBoundingBoxes &&
            afterBoxes.map((box, idx) => (
              <div
                key={`after-box-${idx}`}
                className="absolute border-2 border-emerald-400 bg-emerald-500/20 rounded shadow-md pointer-events-none transition-all"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
              >
                <span className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white rounded">
                  {box.label}
                </span>
              </div>
            ))}
          <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-emerald-500/30">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Foreground clipped layer) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="relative h-full"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            }}
          >
            <img
              src={beforeUrl}
              alt={beforeLabel}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {showBoundingBoxes &&
              beforeBoxes.map((box, idx) => (
                <div
                  key={`before-box-${idx}`}
                  className="absolute border-2 border-rose-500 bg-rose-500/25 rounded shadow-md pointer-events-none transition-all"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white rounded">
                    {box.label}
                  </span>
                </div>
              ))}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-rose-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-rose-500/30">
              {beforeLabel}
            </div>
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] cursor-ew-resize z-20 flex items-center justify-center -ml-0.5"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Circular Grab Handle */}
          <div className="w-10 h-10 rounded-full bg-white text-slate-900 shadow-2xl flex items-center justify-center border-2 border-slate-900 transition-transform hover:scale-110 active:scale-95">
            <svg
              className="w-5 h-5 text-slate-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18-6-6 6-6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Position indicator & controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span className="font-semibold text-rose-600">◀ Original ({Math.round(sliderPosition)}%)</span>
        <span className="hidden sm:inline-block text-slate-400">
          Drag slider or use arrow keys (← →) to inspect
        </span>
        <span className="font-semibold text-emerald-600">Claimed Repair ({100 - Math.round(sliderPosition)}%) ▶</span>
      </div>
    </div>
  );
}
