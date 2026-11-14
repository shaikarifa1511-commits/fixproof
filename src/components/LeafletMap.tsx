'use client';

import React, { useEffect, useRef } from 'react';
import { Report } from '@/lib/types';

interface LeafletMapProps {
  reports?: Report[];
  selectedReportId?: string;
  onMarkerClick?: (report: Report) => void;
  clickable?: boolean;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  initialCenter?: [number, number];
  zoom?: number;
}

export function LeafletMap({
  reports = [],
  selectedReportId,
  onMarkerClick,
  clickable = false,
  onLocationSelect,
  initialCenter = [12.9716, 77.5946],
  zoom = 12,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;

      // Ensure leaflet styles are present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current).setView(initialCenter, zoom);
      mapInstanceRef.current = map;

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Handle map click for reporting location
      if (clickable && onLocationSelect) {
        let tempMarker: any = null;
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          if (tempMarker) {
            tempMarker.setLatLng([lat, lng]);
          } else {
            tempMarker = L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'custom-pin-selected',
                html: `<div style="background-color: #2563eb; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">📍</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 24],
              }),
            }).addTo(map);
          }
          onLocationSelect({ lat, lng });
        });
      }

      // Add report markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      reports.forEach((rep) => {
        if (!rep.latitude || !rep.longitude) return;

        const isResolved =
          rep.verificationStatus === 'appears_resolved' ||
          rep.verificationStatus === 'human_verified_resolved';
        const isUnresolved =
          rep.verificationStatus === 'appears_unresolved' ||
          rep.verificationStatus === 'human_verified_unresolved';
        const isSelected = rep.id === selectedReportId;

        const pinColor = isResolved
          ? '#10b981' // Green
          : isUnresolved
          ? '#ef4444' // Red
          : rep.category === 'pothole'
          ? '#f59e0b' // Amber
          : rep.category === 'garbage'
          ? '#8b5cf6' // Purple
          : '#3b82f6'; // Blue

        const markerHtml = `
          <div style="background-color: ${pinColor}; width: ${isSelected ? 32 : 26}px; height: ${
          isSelected ? 32 : 26
        }px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; cursor: pointer;">
            ${rep.category === 'pothole' ? '🕳️' : rep.category === 'garbage' ? '🗑️' : '⚠️'}
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-pin',
          html: markerHtml,
          iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
          iconAnchor: [isSelected ? 16 : 13, isSelected ? 32 : 26],
        });

        const marker = L.marker([rep.latitude, rep.longitude], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; max-width: 220px; line-height: 1.4;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">${rep.title}</div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">${rep.address}</div>
            <div style="display: flex; gap: 4px; margin-bottom: 8px;">
              <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">${
                rep.category
              }</span>
              <span style="background: ${isResolved ? '#d1fae5' : '#fee2e2'}; color: ${
          isResolved ? '#065f46' : '#991b1b'
        }; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">
                ${rep.verificationStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <a href="/reports/${
              rep.id
            }" style="display: block; text-align: center; background: #2563eb; color: white; padding: 5px 8px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 11px;">
              Inspect Case Evidence →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(rep));
        }

        markersRef.current.push(marker);
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [reports, selectedReportId, clickable, initialCenter, zoom]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
    </div>
  );
}
