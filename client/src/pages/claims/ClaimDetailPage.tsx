/**
 * AUTOSURE — Claim Detail Page
 * Renders complete claim details, Gemini AI reports, Fraud score, and officer review console.
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';
import { useRole } from '@/hooks/useRole';
import { getClaimById, updateClaimStatus } from '@/services/claims.service';
import { formatDate, formatCurrency, formatPercentage } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

interface BackendClaim {
  id: string;
  userId: string;
  vehicleModel: string;
  vehicleNumber: string;
  policyNumber: string;
  accidentDate: string;
  imageUrl: string;
  damageAnalysis: {
    vehicleType: string;
    damagedPart: string;
    damageType: string;
    severity: string;
    confidence: number;
    explanation: string;
  };
  estimatedRepairCost: number;
  fraudScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  createdAt: string;
  updatedAt?: string;
}

export default function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { isOfficerOrAdmin } = useRole();

  const [claim, setClaim] = useState<BackendClaim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadClaim() {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await getClaimById(id);
      setClaim(response.data as unknown as BackendClaim);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch claim details.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClaim();
  }, [id]);

  const handleStatusUpdate = async (newStatus: 'Approved' | 'Rejected' | 'Under Review') => {
    if (!id || !claim) return;
    setIsUpdating(true);
    try {
      await updateClaimStatus(id, { status: newStatus });
      toast.success(`Claim status updated to ${newStatus}`);
      setClaim({ ...claim, status: newStatus });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update claim status.');
    } finally {
      setIsUpdating(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400">Loading claim details...</p>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="mx-auto max-w-2xl flex flex-col items-center gap-4 py-20 text-center">
        <span className="text-5xl" aria-hidden>⚠️</span>
        <h2 className="text-xl font-bold text-slate-200">Claim Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'This claim does not exist or you do not have permission to view it.'}</p>
        <Button as={Link} to={ROUTES.CLAIMS} variant="secondary">
          Back to Claims
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" as={Link} to={ROUTES.CLAIMS}>
            ← Back
          </Button>
          <div>
            <h1 className="text-xl font-mono text-slate-400">Claim #{claim.id.slice(0, 8)}</h1>
            <p className="text-sm text-slate-500">Submitted on {formatDate(claim.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Status:</span>
          <Badge variant={getStatusBadgeVariant(claim.status)} className="text-sm px-3 py-1">
            {claim.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Images & Info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Vehicle Damage Image */}
          <Card padding="none" className="overflow-hidden bg-slate-950 border border-white/5">
            <div className="bg-slate-900/40 px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Accident Damage Photo</h3>
            </div>
            <div className="p-2 bg-slate-950 flex items-center justify-center min-h-[300px]">
              <img 
                src={claim.imageUrl} 
                alt="Vehicle damage analysis" 
                className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </Card>

          {/* Details Grid */}
          <Card>
            <Card.Header>
              <Card.Title>Incident & Vehicle Details</Card.Title>
            </Card.Header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm text-slate-300">
              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Vehicle Model</span>
                <span className="font-medium text-slate-200">{claim.vehicleModel}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">License Plate</span>
                <span className="font-mono text-slate-200">{claim.vehicleNumber}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/5 pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Policy Number</span>
                <span className="font-mono text-slate-200">{claim.policyNumber}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Accident Date</span>
                <span className="font-medium text-slate-200">{formatDate(claim.accidentDate)}</span>
              </div>
            </div>
          </Card>

          {/* AI Explanation / Notes */}
          <Card>
            <Card.Header>
              <Card.Title>Gemini AI Assessment & Diagnosis</Card.Title>
            </Card.Header>
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4 text-sm text-slate-300">
                <p className="font-medium text-brand-400 mb-1">AI Recommendation Details:</p>
                <p className="leading-relaxed">{claim.damageAnalysis?.explanation || 'No details available.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <span className="text-xs text-slate-500 font-medium">Vehicle Class</span>
                  <span className="mt-1 font-semibold text-slate-200">{claim.damageAnalysis?.vehicleType || 'Unknown'}</span>
                </div>
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <span className="text-xs text-slate-500 font-medium">Damaged Part</span>
                  <span className="mt-1 font-semibold text-slate-200">{claim.damageAnalysis?.damagedPart || 'Unknown'}</span>
                </div>
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <span className="text-xs text-slate-500 font-medium">Damage Type</span>
                  <span className="mt-1 font-semibold text-slate-200">{claim.damageAnalysis?.damageType || 'Unknown'}</span>
                </div>
                <div className="flex flex-col p-3 rounded-lg bg-white/[0.01] border border-white/5">
                  <span className="text-xs text-slate-500 font-medium">AI Confidence</span>
                  <span className="mt-1 font-semibold text-slate-200">
                    {claim.damageAnalysis?.confidence ? formatPercentage(claim.damageAnalysis.confidence) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Estimates, Fraud Audit, and Officer panel */}
        <div className="flex flex-col gap-6">
          {/* Cost Estimate Card */}
          <Card className="border-l-4 border-brand-500">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Repair Cost</p>
            <p className="mt-2 text-3xl font-bold text-slate-100 font-mono">
              {formatCurrency(claim.estimatedRepairCost, 'INR', 'en-IN')}
            </p>
            <Badge variant="purple" className="mt-3 text-xs">
              AI Generated Pricing
            </Badge>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Base costs are computed matching damage severity ({claim.damageAnalysis?.severity || 'unknown'}) and typical Indian regional parts catalog.
            </p>
          </Card>

          {/* Fraud Shield Card */}
          <Card className={`border-l-4 ${claim.riskLevel === 'HIGH' ? 'border-danger-500' : claim.riskLevel === 'MEDIUM' ? 'border-amber-500' : 'border-success-500'}`}>
            <Card.Header>
              <Card.Title className="text-sm uppercase tracking-wider font-bold text-slate-400">AutoSure Fraud Shield</Card.Title>
            </Card.Header>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <p className="text-xs text-slate-500">Risk Assessment</p>
                <p className="text-lg font-bold text-slate-200 mt-0.5">{claim.riskLevel} RISK</p>
              </div>
              <Badge variant={getRiskBadgeVariant(claim.riskLevel)}>{claim.riskLevel}</Badge>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Integrity Score</p>
                <p className="text-2xl font-bold text-slate-200 font-mono mt-0.5">{100 - claim.fraudScore}/100</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Fraud Score</p>
                <p className="text-2xl font-bold text-danger-400 font-mono mt-0.5">{claim.fraudScore}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Anomalies analyzed: EXIF timestamp match, duplicate claims check, and visual integrity check.
            </p>
          </Card>

          {/* Officer Decisions Panel */}
          {isOfficerOrAdmin && (
            <Card className="border border-brand-500/20 bg-brand-500/[0.02]">
              <Card.Header>
                <Card.Title>Officer Console</Card.Title>
              </Card.Header>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                As an authorized reviewer, review the damage photographs, Gemini AI classification, and fraud integrity metrics to confirm final status.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => handleStatusUpdate('Approved')} 
                  variant="primary" 
                  className="w-full"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                >
                  ✓ Approve Claim
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('Rejected')} 
                  variant="danger" 
                  className="w-full"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                >
                  ✗ Reject Claim
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('Under Review')} 
                  variant="secondary" 
                  className="w-full text-slate-300"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                >
                  ⚠ Mark Under Review
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
