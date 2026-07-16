/**
 * AUTOSURE — Claims List Page
 * Displays claims history for customer or all claims for officer/admin.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useRole } from '@/hooks/useRole';
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

export default function ClaimsListPage() {
  const { isCustomer } = useRole();
  const [claims, setClaims] = useState<BackendClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClaims() {
      try {
        setIsLoading(true);
        const response = await getClaims();
        // Since getClaims returns ApiResponse<BackendClaim[]>:
        setClaims((response.data as unknown as BackendClaim[]) || []);
      } catch (err: any) {
        console.error('Failed to fetch claims:', err);
        setError('Failed to load claims history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    loadClaims();
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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Claims History</h1>
          <p className="mt-1 text-sm text-slate-400">
            {isCustomer ? 'Your submitted insurance claims and assessments' : 'All claims submitted on the platform'}
          </p>
        </div>
        {isCustomer && (
          <Button as={Link} to={ROUTES.CLAIM_SUBMIT}>
            + Submit New Claim
          </Button>
        )}
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-slate-400">Loading claims list...</p>
          </div>
        </Card>
      ) : error ? (
        <Card className="border-danger-500/20 bg-danger-500/5">
          <p className="text-sm text-danger-400 text-center font-medium">{error}</p>
        </Card>
      ) : claims.length === 0 ? (
        <Card padding="none">
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-5xl" aria-hidden>📋</span>
            <div>
              <p className="font-semibold text-slate-200">No claims found</p>
              <p className="mt-1 text-sm text-slate-500">
                {isCustomer
                  ? 'Submit your first vehicle damage claim to start an AI audit.'
                  : 'No insurance claims are currently registered in the database.'}
              </p>
            </div>
            {isCustomer && (
              <Button as={Link} to={ROUTES.CLAIM_SUBMIT} variant="secondary">
                Submit a Claim
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card padding="none" className="overflow-hidden border border-white/5 bg-slate-900/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Claim ID</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">License Plate</th>
                  <th className="px-6 py-4">Accident Date</th>
                  <th className="px-6 py-4">Est. Repair Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{claim.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {claim.vehicleModel}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {claim.vehicleNumber}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(claim.accidentDate)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-400">
                      {formatCurrency(claim.estimatedRepairCost, 'INR', 'en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(claim.status)}>
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        as={Link}
                        to={ROUTES.CLAIM_DETAIL.replace(':id', claim.id)}
                        variant="secondary"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
