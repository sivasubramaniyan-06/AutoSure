/**
 * AUTOSURE — Navbar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/utils/constants';

export function Navbar() {
  const { user } = useAuth();
  const { role } = useRole();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      success('Signed out successfully');
      navigate(ROUTES.LOGIN);
    } catch {
      error('Failed to sign out');
    }
  };

  const roleBadgeVariant = role === 'admin' ? 'danger' : role === 'officer' ? 'warning' : 'info';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/80 backdrop-blur-glass">
      <nav className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 shadow-glow/50 group-hover:shadow-glow transition-shadow">
            <span className="text-sm font-black text-white">A</span>
          </div>
          <span className="gradient-text text-xl font-black tracking-tight">AUTOSURE</span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-3">
            <Badge variant={roleBadgeVariant} dot>
              {role?.toUpperCase()}
            </Badge>
            <span className="hidden text-sm text-slate-400 sm:block">
              {user.displayName ?? user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
