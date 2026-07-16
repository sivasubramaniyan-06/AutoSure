/**
 * AUTOSURE — Navbar Component
 * Renders user profile initial avatar, notifications indicator, and visual theme toggle controls.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useToast } from '@/hooks/useToast';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/utils/constants';

export function Navbar() {
  const { user } = useAuth();
  const { role } = useRole();
  const toast = useToast();

  const handleDarkToggle = () => {
    toast.success('Dark mode is enforced for SaaS dashboard layout.');
  };

  const handleNotificationsClick = () => {
    toast.success('You are caught up! No new notifications.');
  };

  const getInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() ?? 'U';
  };

  const roleBadgeVariant = role === 'admin' ? 'danger' : role === 'officer' ? 'warning' : 'info';

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        {/* Navigation title / breadcrumbs */}
        <div className="flex items-center gap-3">
          {role && (
            <Badge variant={roleBadgeVariant} className="uppercase font-mono text-[9px] tracking-wider">
              {role} Account
            </Badge>
          )}
        </div>

        {/* Right tools (Avatar, bell notification, dark mode toggle) */}
        {user && (
          <div className="flex items-center gap-4 select-none">
            {/* Dark Mode Toggle */}
            <button 
              onClick={handleDarkToggle}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors text-lg"
              title="Toggle Dark Mode"
              type="button"
            >
              🌙
            </button>

            {/* Notifications */}
            <button 
              onClick={handleNotificationsClick}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors relative text-lg"
              title="Notifications"
              type="button"
            >
              🔔
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-400 text-xs font-black text-white shadow-md border border-white/10"
                title={user.displayName ?? user.email ?? 'User profile'}
              >
                {getInitial()}
              </div>
              <span className="hidden text-xs font-semibold text-slate-300 md:inline-block max-w-[120px] truncate">
                {user.displayName ?? user.email}
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
