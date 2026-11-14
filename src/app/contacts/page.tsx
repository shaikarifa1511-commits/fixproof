'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  OFFICIAL_CONTACTS,
  EMERGENCY_HELPLINES,
  OfficialContact,
} from '@/lib/data/officials';
import {
  Building2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
  Clock,
  Send,
  AlertTriangle,
} from 'lucide-react';

export default function ContactsPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'roads' | 'water' | 'garbage' | 'electricity' | 'traffic'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const departments = [
    { key: 'all', label: t.departmentAll || 'All Departments' },
    { key: 'roads', label: t.departmentRoads || 'Roads & Potholes' },
    { key: 'water', label: t.departmentWater || 'Water & Drainage' },
    { key: 'garbage', label: t.departmentGarbage || 'Solid Waste & Cleansing' },
    { key: 'electricity', label: t.departmentElectricity || 'Electricity & Lights' },
    { key: 'traffic', label: t.departmentTraffic || 'Traffic & Safety' },
  ];

  const cities = ['all', 'Bengaluru', 'Hyderabad', 'New Delhi'];

  const filteredOfficials = useMemo(() => {
    return OFFICIAL_CONTACTS.filter((official) => {
      const matchesSearch =
        searchQuery === '' ||
        official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        official.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        official.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        official.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        official.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === 'all' || official.departmentKey === selectedDept;
      const matchesCity = selectedCity === 'all' || official.city === selectedCity;

      return matchesSearch && matchesDept && matchesCity;
    });
  }, [searchQuery, selectedDept, selectedCity]);

  const copyToClipboard = (official: OfficialContact) => {
    const text = `${official.name}\n${official.designation}\nAgency: ${official.agency}\nPhone: ${official.mobile || official.phone}\nEmail: ${official.email}\nOffice: ${official.office}\nJurisdiction: ${official.jurisdiction}`;
    navigator.clipboard.writeText(text);
    setCopiedId(official.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const composeWhatsAppUrl = (official: OfficialContact) => {
    const defaultMsg = encodeURIComponent(
      `Hello Sir/Madam (${official.name}),\n\nI am contacting you regarding an unaddressed public infrastructure defect via FixProof Civic Platform.\n\nDesignation: ${official.designation}\nAgency: ${official.agency}\nLocation/Jurisdiction: ${official.jurisdiction}\n\nPlease inspect the photographic evidence and expedite repair.`
    );
    return `https://wa.me/${official.whatsapp}?text=${defaultMsg}`;
  };

  const composeMailto = (official: OfficialContact) => {
    const subject = encodeURIComponent(`[FixProof Civic Grievance] Infrastructure Defect Escalation - ${official.agency}`);
    const body = encodeURIComponent(
      `Respected ${official.name} (${official.designation}),\n\nI am lodging a formal civic grievance regarding public infrastructure damage in your jurisdiction (${official.jurisdiction}).\n\nFixProof case records indicate this requires inspection/repair as per statutory citizen charter timelines.\n\nPlease acknowledge receipt and assign the designated ward executive engineer.\n\nThank you,\nConcerned Citizen via FixProof Platform\nhttps://fixproof-px.vercel.app`
    );
    return `mailto:${official.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.verifiedOfficialBadge || 'Verified Civic Authorities'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.officialsDirectory || 'Official Civic Contacts Directory'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.officialsSubtitle ||
              'Direct contacts, jurisdiction maps, and escalation desks for municipal engineers, zonal commissioners, and utility boards.'}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <Wrench className="w-4 h-4" />
              {t.reportDefect || 'Report Defect & Tag Officer'}
            </Link>
            <a
              href="#escalation-matrix"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              {t.escalationMatrixTitle || 'Escalation Protocol'}
            </a>
          </div>
        </div>
      </div>

      {/* 24/7 Emergency Quick Helplines */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-sm font-extrabold tracking-wide uppercase text-slate-800">
            {t.emergencyHelplinesTitle || '24/7 Rapid Emergency Civic Helplines'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {EMERGENCY_HELPLINES.map((line) => (
            <a
              key={line.number}
              href={`tel:${line.number}`}
              className="group p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl font-extrabold text-blue-600 group-hover:scale-105 transition-transform">
                    {line.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {line.available}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {line.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {line.service}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callNow || 'Call Now'}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchOfficialsPlaceholder || 'Search official by name, designation, ward, or department...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* City Selector */}
          <div className="w-full md:w-56">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">{t.cityAll || 'All Municipalities'}</option>
              <option value="Bengaluru">Bengaluru (BBMP / BWSSB)</option>
              <option value="Hyderabad">Hyderabad (GHMC / HMWSSB)</option>
              <option value="New Delhi">New Delhi (MCD / PWD)</option>
            </select>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {departments.map((dept) => (
            <button
              key={dept.key}
              onClick={() => setSelectedDept(dept.key as any)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDept === dept.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>{filteredOfficials.length} Officials Found</span>
          <span>Showing Verified Government Personnel</span>
        </div>

        {filteredOfficials.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Officials Match Your Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms, selecting "All Departments", or browsing our 24/7 Emergency Helplines above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('all');
                setSelectedCity('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOfficials.map((official) => {
              const isCopied = copiedId === official.id;
              return (
                <div
                  key={official.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                >
                  <div className="space-y-3">
                    {/* Header with Agency & Tier */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md line-clamp-1">
                        {official.agency}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          official.tier === 3
                            ? 'bg-purple-100 text-purple-800'
                            : official.tier === 2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        Tier {official.tier} Authority
                      </span>
                    </div>

                    {/* Official Name & Designation */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {official.name}
                        </h3>
                        {official.verified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5 leading-snug">
                        {official.designation}
                      </p>
                    </div>

                    {/* Jurisdiction & Office details */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-700">{t.jurisdiction || 'Jurisdiction'}: </span>
                          <span>{official.jurisdiction}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-[11px] text-slate-500 line-clamp-1">{official.office}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-500">{official.hours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-3 gap-1.5">
                      {/* Direct Call */}
                      <a
                        href={`tel:${official.mobile || official.phone}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
                        title={official.mobile || official.phone}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{t.callNow || 'Call'}</span>
                      </a>

                      {/* Send Formal Email */}
                      <a
                        href={composeMailto(official)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                        title={official.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{t.sendNotice || 'Email'}</span>
                      </a>

                      {/* WhatsApp Desk */}
                      <a
                        href={composeWhatsAppUrl(official)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                        title="Open WhatsApp Grievance"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Copy Details & Report Link */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() => copyToClipboard(official)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{isCopied ? t.copiedNotice || 'Copied!' : t.copyContact || 'Copy Info'}</span>
                      </button>

                      <Link
                        href={`/report?official=${official.id}&agency=${encodeURIComponent(official.agency)}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <span>Tag in Report</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Citizen Statutory Escalation Protocol / Matrix */}
      <section id="escalation-matrix" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Civic Rights & Sakala Service Guarantee</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.escalationMatrixTitle || 'Citizen Escalation Protocol & Rights'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            {t.escalationMatrixSubtitle ||
              'If a defect is falsely marked closed or ignored, follow this statutory grievance escalation procedure.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tier 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm">
              1
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.tier1Title || 'Tier 1: Ward Junior Engineer'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.tier1Desc ||
                'First responder for inspection, pothole patch-up, and localized drainage maintenance (48-72 hour response standard).'}
            </p>
            <div className="text-[11px] font-bold text-blue-700 pt-2 border-t border-slate-200">
              Resolution Window: 48 – 72 Hours
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
              2
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.tier2Title || 'Tier 2: Assistant Executive Engineer'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.tier2Desc ||
                'Direct supervisor for ward tenders, contracting quality, and photographic repair sign-offs (7 day resolution window).'}
            </p>
            <div className="text-[11px] font-bold text-blue-700 pt-2 border-t border-blue-200">
              Escalation Window: 7 Days
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm">
              3
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {t.tier3Title || 'Tier 3: Zonal Commissioner & Lokayukta'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.tier3Desc ||
                'Statutory appellate authority for fraudulent closure audit, disciplinary penalties, and anti-corruption inquiry.'}
            </p>
            <div className="text-[11px] font-bold text-indigo-700 pt-2 border-t border-indigo-200">
              Statutory Audit & Legal Inquiry
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
