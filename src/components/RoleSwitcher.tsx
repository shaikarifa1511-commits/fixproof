'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { UserRole } from '@/lib/types';
import { Shield, User, Wrench, Users, ChevronDown, Check } from 'lucide-react';

export function RoleSwitcher() {
  const { currentUser, setRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: Array<{ role: UserRole; label: string; desc: string; icon: any; color: string }> = [
    {
      role: 'citizen',
      label: 'Citizen',
      desc: 'Report issues, track status, dispute false closures',
      icon: User,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      role: 'authority',
      label: 'Authority Engineer',
      desc: 'Update work status, submit repair claims & after-photos',
      icon: Wrench,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      role: 'moderator',
      label: 'Civic Moderator',
      desc: 'Arbitrate disputes, review fraud flags, override AI',
      icon: Shield,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      role: 'public',
      label: 'Public Visitor',
      desc: 'Browse civic map, inspect verified cases, read analytics',
      icon: Users,
      color: 'text-slate-600 bg-slate-50',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="capitalize">{currentUser.name}</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 uppercase tracking-wider">
          {currentUser.role}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-2 z-40 animate-fade-in space-y-1">
            <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Switch User Persona (Demo & RBAC)
            </div>
            {roles.map((item) => {
              const Icon = item.icon;
              const isSelected = currentUser.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    setRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                    isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{item.label}</p>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
