/**
 * AUTOSURE — Dashboard Layout
 * Sidebar + topbar app shell for authenticated pages.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto bg-surface px-6 py-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
