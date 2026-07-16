/**
 * AUTOSURE — Customer Dashboard
 * Displays real-time status counts, quick actions, and a table of recent claims.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getClaims } from '@/services/claims.service';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

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

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<BackendClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const response = await getClaims();
        setClaims((response.data as unknown as BackendClaim[]) || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const totalClaims = claims.length;
  const underReview = claims.filter(c => c.status === 'Under Review' || c.status === 'Pending').length;
  const approved = claims.filter(c => c.status === 'Approved').length;

  const recentClaims = [...claims]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Welcome back, {user?.displayName?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Track your insurance claims or submit new vehicle incidents below.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Claims', value: isLoading ? '—' : totalClaims, variant: 'info' as const },
          { label: 'Under Review', value: isLoading ? '—' : underReview, variant: 'warning' as const },
          { label: 'Approved Claims', value: isLoading ? '—' : approved, variant: 'success' as const },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{stat.value}</p>
            <Badge variant={stat.variant} className="mt-2">
              {isLoading ? 'Loading...' : 'Live Synced'}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
        </Card.Header>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to={ROUTES.CLAIM_SUBMIT}>
            + Submit New Claim
          </Button>
          <Button variant="secondary" as={Link} to={ROUTES.CLAIMS}>
            View Claims History
          </Button>
        </div>
      </Card>

      {/* Recent Claims */}
      <Card padding="none">
        <Card.Header className="px-6 py-4 border-b border-white/5">
          <Card.Title>Recent Claims</Card.Title>
          <Link to={ROUTES.CLAIMS} className="text-sm text-brand-400 hover:text-brand-300">
            View all →
          </Link>
        </Card.Header>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading recent claims...</div>
        ) : recentClaims.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            Your recent claims will appear here. Submit your first claim to get started.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentClaims.map((claim) => (
              <Link
                key={claim.id}
                to={ROUTES.CLAIM_DETAIL.replace(':id', claim.id)}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/5"
              >
                <div>
                  <p className="font-semibold text-slate-200">{claim.vehicleModel}</p>
                  <p className="text-xs text-slate-500">
                    License: <span className="font-mono">{claim.vehicleNumber}</span> · Acc. Date: {formatDate(claim.accidentDate)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-brand-400">
                    {formatCurrency(claim.estimatedRepairCost, 'INR', 'en-IN')}
                  </span>
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
  );
}
