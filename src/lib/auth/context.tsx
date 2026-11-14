'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  citizen: {
    id: 'user_cit_1',
    name: 'Aditi Sharma',
    email: 'aditi.citizen@fixproof.org',
    role: 'citizen',
    organization: 'Resident (Indiranagar Ward 112)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-11-01T09:00:00Z',
  },
  authority: {
    id: 'user_auth_1',
    name: 'Rajesh Gowda',
    email: 'rajesh.engineer@bbmp.gov.in',
    role: 'authority',
    organization: 'BBMP Road Infrastructure & Ward Works',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-11-01T09:00:00Z',
  },
  moderator: {
    id: 'user_mod_1',
    name: 'Suresh Menon',
    email: 'suresh.mod@fixproof.org',
    role: 'moderator',
    organization: 'Independent Civic Review Board',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-11-01T09:00:00Z',
  },
  public: {
    id: 'user_public',
    name: 'Public Visitor',
    email: 'visitor@fixproof.org',
    role: 'public',
    organization: 'Civic Observer',
    createdAt: '2026-11-01T09:00:00Z',
  },
};

interface AuthContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: DEMO_USERS.citizen,
  setRole: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(DEMO_USERS.citizen);

  useEffect(() => {
    const savedRole = localStorage.getItem('fixproof_role') as UserRole;
    if (savedRole && DEMO_USERS[savedRole]) {
      setCurrentUserState(DEMO_USERS[savedRole]);
    }
  }, []);

  const setRole = (role: UserRole) => {
    const user = DEMO_USERS[role];
    setCurrentUserState(user);
    localStorage.setItem('fixproof_role', role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

