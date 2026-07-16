/**
 * AUTOSURE — Admin Dashboard
 * Displays overall platform stats, user counts, fraud flags, and platform-wide claim activity.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getClaims } from '@/services/claims.service';
import api from '@/services/api';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

interface AdminStats {
  totalUsers: number;
  totalClaims: number;
  fraudFlags: number;
  totalEstimatedRepairCost: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

interface BackendClaim {
  id: string;
  userId: string;
  vehicleModel: string;
  vehicleNumber: string;
  policyNumber: string;
  accidentDate: string;
  imageUrl: string;
  estimatedRepairCost: number;
  fraudScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [claims, setClaims] = useState<BackendClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setIsLoading(true);
        const [statsRes, claimsRes] = await Promise.all([
          api.get('/admin/stats'),
          getClaims()
        ]);
        setStats(statsRes.data.data as AdminStats);
        setClaims((claimsRes.data as unknown as BackendClaim[]) || []);
      } catch (err: any) {
        console.error('Failed to load admin stats:', err);
        setError('Failed to load administrative statistics.');
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Under Review':
        return 'warning';
      case 'Pending':
      default:
        return 'info';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
      default:
        return 'success';
    }
  };

  const recentClaims = [...claims]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">Admin Console</h1>
            <Badge variant="danger">PLATFORM ADMIN</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            System diagnostics, platform activity audit, and risk flags management.
          </p>
        </div>
        <Badge variant="success" dot>All systems operational</Badge>
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-slate-400">Loading platform stats...</p>
          </div>
        </Card>
      ) : error || !stats ? (
        <Card className="border-danger-500/20 bg-danger-500/5 text-center">
          <p className="text-sm text-danger-400 font-medium">{error || 'Failed to load stats.'}</p>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card padding="md">
              <p className="text-sm text-slate-400 font-medium">Total Registered Users</p>
              <p className="mt-2 text-3xl font-bold text-slate-100 font-mono">{stats.totalUsers}</p>
              <Badge variant="info" className="mt-2">Customer Profiles</Badge>
            </Card>

            <Card padding="md">
              <p className="text-sm text-slate-400 font-medium">Claims Submitted</p>
              <p className="mt-2 text-3xl font-bold text-slate-100 font-mono">{stats.totalClaims}</p>
              <Badge variant="purple" className="mt-2">AI Audited</Badge>
            </Card>

            <Card padding="md" className="border-l-4 border-danger-500">
              <p className="text-sm text-slate-400 font-medium">High Fraud Risk Flags</p>
              <p className="mt-2 text-3xl font-bold text-danger-400 font-mono">{stats.fraudFlags}</p>
              <Badge variant="danger" className="mt-2">Action Required</Badge>
            </Card>

            <Card padding="md">
              <p className="text-sm text-slate-400 font-medium">Total Claims Estimate</p>
              <p className="mt-2 text-2xl font-bold text-brand-400 font-mono">
                {formatCurrency(stats.totalEstimatedRepairCost, 'INR', 'en-IN')}
              </p>
              <Badge variant="success" className="mt-2">Sum Total (₹)</Badge>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent activity column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card padding="none">
                <Card.Header className="px-6 py-4 border-b border-white/5">
                  <Card.Title>Recent Claims Activity</Card.Title>
                  <Button variant="ghost" size="sm" as={Link} to={ROUTES.CLAIMS}>
                    View All
                  </Button>
                </Card.Header>

                {recentClaims.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">No recent platform activity.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentClaims.map((claim) => (
                      <Link
                        key={claim.id}
                        to={ROUTES.CLAIM_DETAIL.replace(':id', claim.id)}
                        className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.01] transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-slate-200">{claim.vehicleModel}</p>
                          <p className="text-xs text-slate-500">
                            ID: <span className="font-mono">#{claim.id.slice(0, 8)}</span> · Plate: <span className="font-mono">{claim.vehicleNumber}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={getRiskBadgeVariant(claim.riskLevel)} className="text-[10px]">
                            {claim.riskLevel} RISK
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Quick configuration panel */}
            <Card>
              <Card.Header>
                <Card.Title>System Control</Card.Title>
              </Card.Header>
              <div className="flex flex-col gap-4 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Gemini Model API</span>
                  <Badge variant="purple">gemini-1.5-pro</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Cloudinary CDN</span>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Database engine</span>
                  <Badge variant="success">Firestore</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Security rules audit</span>
                  <Badge variant="info">Enabled</Badge>
                </div>

                <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-slate-400 leading-relaxed">
                  Platform administration overrides are active. Ensure regular reviews of High Risk fraud items to maintain risk models.
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
