/**
 * AUTOSURE — Sidebar Component
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useRole } from '@/hooks/useRole';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  to: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: '⊞' },
  { label: 'Submit Claim', to: ROUTES.CLAIM_SUBMIT, icon: '＋', roles: ['customer'] },
  { label: 'My Claims', to: ROUTES.CLAIMS, icon: '📋', roles: ['customer'] },
  { label: 'Review Queue', to: ROUTES.CLAIMS, icon: '🔍', roles: ['officer', 'admin'] },
  { label: 'Admin Panel', to: ROUTES.ADMIN_DASHBOARD, icon: '⚙', roles: ['admin'] },
];

export function Sidebar() {
  const { role } = useRole();

  const visible = navItems.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  return (
    <aside className="flex w-60 flex-col border-r border-white/10 bg-surface/50 px-3 py-6">
      <nav>
        <ul className="flex flex-col gap-1" role="list">
          {visible.map((item) => (
            <li key={item.to + item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-brand-500/20 text-brand-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
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
    </aside>
  );
}
