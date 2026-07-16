/**
 * AUTOSURE — Submit Claim Page
 * Fully interactive claim submission form with image preview and AI processing animation.
 */

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { submitClaim } from '@/services/claims.service';
import { ROUTES } from '@/utils/constants';

export default function SubmitClaimPage() {
  const navigate = useNavigate();
  const toast = useToast();

  // Form states
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [accidentDate, setAccidentDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission/processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'uploading' | 'gemini' | 'fraud' | 'saving' | 'done'>('uploading');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 10MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!vehicleModel.trim()) tempErrors.vehicleModel = 'Vehicle model is required';
    if (!vehicleNumber.trim()) tempErrors.vehicleNumber = 'Vehicle license plate number is required';
    if (!policyNumber.trim()) tempErrors.policyNumber = 'Policy number is required';
    if (!accidentDate) {
      tempErrors.accidentDate = 'Accident date is required';
    } else {
      const parsedDate = new Date(accidentDate);
      if (isNaN(parsedDate.getTime())) {
        tempErrors.accidentDate = 'Invalid date';
      } else if (parsedDate > new Date()) {
        tempErrors.accidentDate = 'Accident date cannot be in the future';
      }
    }
    if (!selectedFile) tempErrors.image = 'Vehicle damage image is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedFile) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsProcessing(true);
    setProcessingStage('uploading');

    // Simulate multi-stage processing logs for beautiful UX
    const runProcessingUX = async () => {
      await new Promise((r) => setTimeout(r, 1200));
      setProcessingStage('gemini');
      await new Promise((r) => setTimeout(r, 1500));
      setProcessingStage('fraud');
      await new Promise((r) => setTimeout(r, 1200));
      setProcessingStage('saving');
    };

    const formData = new FormData();
    formData.append('vehicleModel', vehicleModel);
    formData.append('vehicleNumber', vehicleNumber);
    formData.append('policyNumber', policyNumber);
    formData.append('accidentDate', new Date(accidentDate).toISOString());
    formData.append('image', selectedFile);

    try {
      const uploadPromise = submitClaim(formData);
      // Wait for both the backend request and the UX stages
      const [response] = await Promise.all([uploadPromise, runProcessingUX()]);
      setProcessingStage('done');
      toast.success('Claim submitted and analyzed successfully!');
      
      // Delay navigation slightly so they see the completed state
      setTimeout(() => {
        navigate(ROUTES.CLAIM_DETAIL.replace(':id', response.data.id || ''));
      }, 800);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to submit claim. Please try again.');
      setIsProcessing(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getStageMessage = () => {
    switch (processingStage) {
      case 'uploading':
        return 'Uploading vehicle image to secure storage...';
      case 'gemini':
        return 'Analyzing damage severity with Gemini Vision AI...';
      case 'fraud':
        return 'Evaluating claim risk and matching policy details...';
      case 'saving':
        return 'Recording claim data and finalizing estimates...';
      case 'done':
        return 'Successfully completed claim processing!';
      default:
        return 'Processing claim...';
    }
  };

  const getStageProgress = () => {
    switch (processingStage) {
      case 'uploading':
        return '25%';
      case 'gemini':
        return '55%';
      case 'fraud':
        return '80%';
      case 'saving':
        return '95%';
      case 'done':
        return '100%';
    }
  };

  if (isProcessing) {
    return (
      <div className="mx-auto max-w-lg flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-fade-in">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute w-full h-full rounded-full border-4 border-brand-500/10 border-t-brand-500 animate-spin"></div>
          <span className="text-2xl" aria-hidden>🤖</span>
        </div>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-100">Processing Your Claim</h2>
          <p className="text-sm text-brand-400 font-semibold">{getStageProgress()} Complete</p>
          <p className="text-sm text-slate-400 animate-pulse">{getStageMessage()}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5 max-w-md">
          <div 
            className="bg-brand-500 h-full transition-all duration-500 ease-out" 
            style={{ width: getStageProgress() }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Submit a New Claim</h1>
          <p className="mt-1 text-sm text-slate-400">
            Provide accident photos and policy details for instant AI assessment.
          </p>
        </div>
        <Button variant="ghost" as={Link} to={ROUTES.DASHBOARD}>
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <Card.Header>
            <Card.Title>1. Incident Information</Card.Title>
          </Card.Header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Vehicle Model"
              placeholder="e.g. Honda Civic 2021"
              required
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              error={errors.vehicleModel}
            />

            <Input
              label="License Plate Number"
              placeholder="e.g. MH-12-AB-1234"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              error={errors.vehicleNumber}
            />

            <Input
              label="Insurance Policy Number"
              placeholder="e.g. POL-98765432"
              required
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              error={errors.policyNumber}
            />

            <Input
              label="Accident Date"
              type="date"
              required
              value={accidentDate}
              onChange={(e) => setAccidentDate(e.target.value)}
              error={errors.accidentDate}
            />
          </div>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>2. Upload Damaged Vehicle Photo</Card.Title>
          </Card.Header>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {imagePreview ? (
            <div className="flex flex-col gap-4 items-center">
              <div className="relative w-full max-h-[300px] overflow-hidden rounded-lg border border-white/10 bg-slate-900/50 flex items-center justify-center">
                <img 
                  src={imagePreview} 
                  alt="Vehicle damage preview" 
                  className="max-w-full max-h-[300px] object-contain rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" size="sm" onClick={triggerFileSelect}>
                  Change Photo
                </Button>
                <Button type="button" variant="danger" size="sm" onClick={() => {
                  setSelectedFile(null);
                  setImagePreview(null);
                }}>
                  Remove Photo
                </Button>
              </div>
            </div>
          ) : (
            <div 
              onClick={triggerFileSelect}
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-12 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-200" aria-hidden>📸</span>
              <p className="mt-4 font-semibold text-slate-300">Click to upload image</p>
              <p className="mt-1 text-xs text-slate-500">Supports JPG, PNG, WEBP up to 10MB</p>
              {errors.image && (
                <p className="mt-3 text-sm text-danger-400 font-medium" role="alert">
                  {errors.image}
                </p>
              )}
            </div>
          )}
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" as={Link} to={ROUTES.DASHBOARD}>
            Cancel
          </Button>
          <Button type="submit" size="lg" className="px-8">
            Submit Claim
          </Button>
        </div>
      </form>
    </div>
  );
}
