/**
 * AUTOSURE — Auth Layout
 * Centered card layout used for Login, Register, ForgotPassword.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/5 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 shadow-glow">
          <span className="text-xl font-black text-white">A</span>
        </div>
        <span className="gradient-text text-3xl font-black tracking-tight">AUTOSURE</span>
        <p className="text-sm text-slate-500">AI-Powered Insurance Claims</p>
      </div>

      {/* Page content */}
      <div className="relative w-full max-w-md animate-slide-up">
        <Outlet />
      </div>

      <footer className="mt-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} AUTOSURE · All rights reserved
      </footer>
    </div>
  );
}
