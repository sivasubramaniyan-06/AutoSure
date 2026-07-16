/**
 * AUTOSURE — Sidebar Component
 * Displays SaaS metrics access links, new assessments questionnaire, settings and logout.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  isAction?: boolean;
}

export function Sidebar() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Signed out successfully');
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: '⊞' },
    { label: 'New Assessment', to: ROUTES.CLAIM_SUBMIT, icon: '＋' },
    { label: 'Assessment History', to: ROUTES.CLAIMS, icon: '📋' },
    { label: 'Saved Reports', to: '#reports', icon: '💾', isAction: true },
    { label: 'Profile', to: '#profile', icon: '👤', isAction: true },
    { label: 'Settings', to: '#settings', icon: '⚙', isAction: true },
  ];

  const handleItemClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.isAction) {
      e.preventDefault();
      toast.success(`${item.label} features will be unlocked after the hackathon!`);
    }
  };

  return (
    <aside className="flex w-60 flex-col border-r border-white/5 bg-[#0B1220] px-3 py-6 justify-between select-none">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-sky-400">
            <span className="text-xs font-black text-white">A</span>
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent font-black tracking-tight text-md">
            AUTOSURE
          </span>
        </div>

        {/* Navigation list */}
        <nav>
          <ul className="flex flex-col gap-1" role="list">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={(e) => handleItemClick(e, item)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150',
                      isActive && !item.isAction
                        ? 'bg-blue-500/10 text-blue-400 font-semibold'
                        : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200'
                    )
                  }
                >
                  <span className="w-5 text-center text-base" aria-hidden>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout / User Info */}
      <div className="flex flex-col gap-3 px-3 border-t border-white/5 pt-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
        >
          <span className="w-5 text-center text-base" aria-hidden>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
