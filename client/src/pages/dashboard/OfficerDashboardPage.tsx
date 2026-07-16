/**
 * AUTOSURE — Officer Dashboard
 * Renders all claims in review status queues, analytics metrics, and access routes.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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

export default function OfficerDashboardPage() {
  const [claims, setClaims] = useState<BackendClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOfficerData() {
      try {
        const response = await getClaims();
        setClaims((response.data as unknown as BackendClaim[]) || []);
      } catch (err) {
        console.error('Failed to load officer data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOfficerData();
  }, []);

  // Stats
  const pendingReview = claims.filter(c => c.status === 'Pending' || c.status === 'Under Review').length;
  const approvedCount = claims.filter(c => c.status === 'Approved').length;
  const rejectedCount = claims.filter(c => c.status === 'Rejected').length;
  const totalClaims = claims.length;

  const reviewQueue = claims
    .filter(c => c.status === 'Pending' || c.status === 'Under Review')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Officer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review AI-analyzed claims, inspect fraud parameters, and issue approvals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: 'Pending Review', value: isLoading ? '—' : pendingReview, variant: 'warning' as const },
          { label: 'Total Audited', value: isLoading ? '—' : totalClaims, variant: 'purple' as const },
          { label: 'Approved Claims', value: isLoading ? '—' : approvedCount, variant: 'success' as const },
          { label: 'Rejected Claims', value: isLoading ? '—' : rejectedCount, variant: 'danger' as const },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{stat.value}</p>
            <Badge variant={stat.variant} className="mt-2" dot={typeof stat.value === 'number' && stat.value > 0}>
              {isLoading ? 'Loading...' : `${stat.label.split(' ')[0]} Metrics`}
            </Badge>
          </Card>
        ))}
      </div>

      {/* Review Queue */}
      <Card padding="none">
        <Card.Header className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <Card.Title>Claims Review Queue ({reviewQueue.length})</Card.Title>
          <Button variant="ghost" size="sm" as={Link} to={ROUTES.CLAIMS}>
            View All History
          </Button>
        </Card.Header>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading review queue...</div>
        ) : reviewQueue.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
            <span className="text-4xl" aria-hidden>🎉</span>
            <p className="font-semibold text-slate-300">All claims caught up!</p>
            <p className="text-xs text-slate-500">There are no pending insurance claims awaiting review.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reviewQueue.map((claim) => (
              <div 
                key={claim.id} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-200">{claim.vehicleModel}</p>
                    <Badge variant={getStatusBadgeVariant(claim.status)}>{claim.status}</Badge>
                    <Badge variant={getRiskBadgeVariant(claim.riskLevel)} className="text-[10px]">
                      {claim.riskLevel} RISK
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ID: <span className="font-mono">#{claim.id.slice(0, 8)}</span> · 
                    License: <span className="font-mono">{claim.vehicleNumber}</span> · 
                    Policy: <span className="font-mono">{claim.policyNumber}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Accident occurred on {formatDate(claim.accidentDate)}
                  </p>
                </div>
                <div className="flex items-center gap-6 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500">Estimated Cost</p>
                    <p className="text-base font-bold text-slate-200 font-mono">
                      {formatCurrency(claim.estimatedRepairCost, 'INR', 'en-IN')}
                    </p>
                  </div>
                  <Button 
                    as={Link} 
                    to={ROUTES.CLAIM_DETAIL.replace(':id', claim.id)}
                    size="sm"
                  >
                    Audits & Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
