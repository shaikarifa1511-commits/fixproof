'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { NotificationItem, Report } from '@/lib/types';
import { VerificationStatusBadge, WorkStatusBadge } from '@/components/StatusBadge';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  MapPin,
  RefreshCw,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function MyReportsPage() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [currentUser.id]);

  async function fetchUserData() {
    try {
      const [reportsRes, notifRes] = await Promise.all([
        fetch('/api/reports'),
        fetch(`/api/notifications?userId=${currentUser.id}`),
      ]);
      const reportsData = await reportsRes.json();
      const notifData = await notifRes.json();

      if (reportsData.success) {
        // Filter reports where citizenId matches or show all citizen reports for demo
        setReports(reportsData.reports);
      }
      if (notifData.success) {
        setNotifications(notifData.notifications);
      }
    } catch (err) {
      console.error('Failed to load my reports:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkNotificationRead = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Citizen Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold overflow-hidden shadow-sm">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.organization || currentUser.email}</p>
          </div>
        </div>

        <Link
          href="/report"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 self-start sm:self-auto"
        >
          + File New Complaint
        </Link>
      </div>

      {/* In-App Notifications Drawer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" /> Notifications & Alerts
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            {notifications.filter((n) => !n.read).length} Unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No notifications.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  n.read
                    ? 'bg-slate-50/50 border-slate-200/60 opacity-80'
                    : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>

                {n.reportId && (
                  <Link
                    href={`/reports/${n.reportId}`}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 shrink-0 text-xs font-semibold"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citizen Cases List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">My Tracked Reports & Evidence</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {report.id}
                  </span>
                  <span>{new Date(report.createdAt).toLocaleDateString('en-IN')}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{report.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{report.description}</p>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {report.address}
                </p>
              </div>

              {/* Status & actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <WorkStatusBadge status={report.workStatus} />
                  <VerificationStatusBadge status={report.verificationStatus} />
                </div>

                <Link
                  href={`/reports/${report.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Case Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
