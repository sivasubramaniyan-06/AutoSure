/**
 * AUTOSURE — Submit Claim (Multi-Step Questionnaire & 6-Photo Upload)
 * Fully interactive SaaS claim questionnaire, drag-and-drop uploaders, and AI assessment stages.
 */

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { submitClaim } from '@/services/claims.service';
import { ROUTES } from '@/utils/constants';

interface PhotoCard {
  key: string;
  label: string;
  file: File | null;
  preview: string | null;
  progress: number;
}

export default function SubmitClaimPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Owner Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Step 2: Vehicle Information
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [odometer, setOdometer] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');

  // Step 3: Accident Details
  const [accidentDate, setAccidentDate] = useState('');
  const [accidentTime, setAccidentTime] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('Clear');
  const [speed, setSpeed] = useState('');
  const [collisionType, setCollisionType] = useState('Rear-end');
  const [numVehicles, setNumVehicles] = useState('2');
  const [policeInformed, setPoliceInformed] = useState('No');
  const [anyoneInjured, setAnyoneInjured] = useState('No');
  const [accidentDescription, setAccidentDescription] = useState('');

  // Step 4: Vehicle Condition
  const [condition, setCondition] = useState({
    engineStarts: false,
    airbagsDeployed: false,
    windshieldBroken: false,
    lightsWorking: true,
    vehicleDrivable: true,
    fluidLeakage: false,
    suspensionDamage: false,
    tireDamage: false,
  });

  // Step 5: Photo Upload (6 Mandatory Photos)
  const [photos, setPhotos] = useState<PhotoCard[]>([
    { key: 'front', label: '1. Front View', file: null, preview: null, progress: 0 },
    { key: 'rear', label: '2. Rear View', file: null, preview: null, progress: 0 },
    { key: 'left', label: '3. Left Side', file: null, preview: null, progress: 0 },
    { key: 'right', label: '4. Right Side', file: null, preview: null, progress: 0 },
    { key: 'front_left', label: '5. Front Left Corner', file: null, preview: null, progress: 0 },
    { key: 'damage', label: '6. Close-up of Damage', file: null, preview: null, progress: 0 },
  ]);

  // Submission/processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const stages = [
    'Analyzing vehicle...',
    'Detecting damaged panels...',
    'Estimating repair cost...',
    'Checking insurance coverage...',
    'Generating report...',
  ];

  const fileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleCheckboxChange = (key: keyof typeof condition) => {
    setCondition(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePhotoUpload = (key: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Simulate file upload progress
      setPhotos(prev =>
        prev.map(p => {
          if (p.key === key) {
            return { ...p, file, preview: reader.result as string, progress: 100 };
          }
          return p;
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (key: string) => {
    setPhotos(prev =>
      prev.map(p => {
        if (p.key === key) {
          return { ...p, file: null, preview: null, progress: 0 };
        }
        return p;
      })
    );
  };

  // Stepper controls
  const nextStep = () => {
    // Basic step validation
    if (currentStep === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        toast.error('Please fill out all owner information details');
        return;
      }
    } else if (currentStep === 2) {
      if (!manufacturer.trim() || !model.trim() || !regNumber.trim() || !insuranceProvider.trim()) {
        toast.error('Please enter manufacturer, model, registration, and insurance provider');
        return;
      }
    } else if (currentStep === 3) {
      if (!accidentDate || !location.trim() || !accidentDescription.trim()) {
        toast.error('Accident date, location, and description are required');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const allPhotosUploaded = photos.every(p => p.file !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allPhotosUploaded) {
      toast.error('All 6 vehicle photos are mandatory');
      return;
    }

    setIsProcessing(true);
    setProcessingStage(0);

    // Rotate rotating AI assessment logs
    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev < stages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1200);

    // Map questionnaire to flat backend body structure
    const mainImageFile = photos.find(p => p.key === 'damage')?.file || photos[0].file;
    if (!mainImageFile) {
      clearInterval(interval);
      setIsProcessing(false);
      toast.error('Please upload a vehicle photo before submitting');
      return;
    }

    const formData = new FormData();
    formData.append('vehicleModel', `${manufacturer} ${model} ${variant}`.trim());
    formData.append('vehicleNumber', regNumber.toUpperCase());
    // Policy Number format or insurance provider name
    formData.append('policyNumber', `POL-${regNumber.toUpperCase()}`);
    formData.append('accidentDate', new Date(accidentDate).toISOString());
    formData.append('image', mainImageFile);

    try {
      const uploadPromise = submitClaim(formData);
      const animationPromise = new Promise((resolve) => setTimeout(resolve, 6000));
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Claim submission timed out')), 45000);
      });

      // Wait for both backend creation and the built-in AI progress animation.
      const [response] = (await Promise.race([
        Promise.all([uploadPromise, animationPromise]),
        timeoutPromise,
      ])) as [Awaited<ReturnType<typeof submitClaim>>, void];

      clearInterval(interval);
      toast.success('Claim uploaded & Gemini AI assessment complete!');
      navigate(ROUTES.CLAIM_DETAIL.replace(':id', response.data.id || ''));
    } catch (err: any) {
      console.error(err);
      clearInterval(interval);
      toast.error(err?.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Rendering Helper for Questionnaire Inputs
  if (isProcessing) {
    return (
      <div className="mx-auto max-w-lg flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center animate-fade-in">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute w-full h-full rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin"></div>
          <span className="text-3xl" aria-hidden>🤖</span>
        </div>
        
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-slate-100">AutoSure AI Core</h2>
          <p className="text-xs text-blue-400 font-semibold tracking-wider uppercase">
            Assessment Stage {processingStage + 1} of 5
          </p>
          <p className="text-base text-slate-300 font-medium h-8 transition-all animate-pulse">
            {stages[processingStage]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900 border border-white/5 rounded-full h-2.5 overflow-hidden max-w-md">
          <div 
            className="bg-gradient-to-r from-blue-500 to-sky-400 h-full transition-all duration-500 ease-out" 
            style={{ width: `${((processingStage + 1) / stages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">AI Damage Assessment</h1>
          <p className="mt-1 text-sm text-slate-400">
            Submit a comprehensive incident log for automated AI claim adjudication.
          </p>
        </div>
        <Button variant="ghost" as={Link} to={ROUTES.DASHBOARD}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stepper Progress Timeline */}
      <div className="grid grid-cols-5 border border-white/5 bg-slate-950/20 rounded-xl overflow-hidden text-center text-xs font-semibold select-none">
        {[
          { num: 1, label: 'Owner' },
          { num: 2, label: 'Vehicle' },
          { num: 3, label: 'Incident' },
          { num: 4, label: 'Condition' },
          { num: 5, label: 'Uploads' },
        ].map(step => (
          <div 
            key={step.num}
            className={`py-3.5 transition-colors border-r last:border-none border-white/5 ${
              currentStep === step.num 
                ? 'bg-blue-500/10 text-blue-400 border-b-2 border-b-blue-500' 
                : currentStep > step.num 
                  ? 'text-slate-400 bg-white/[0.01]' 
                  : 'text-slate-600'
            }`}
          >
            {step.num}. {step.label}
          </div>
        ))}
      </div>

      {/* Steps Content */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* STEP 1: Owner Information */}
        {currentStep === 1 && (
          <Card>
            <Card.Header>
              <Card.Title>Step 1 — Owner Information</Card.Title>
            </Card.Header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <Input
                label="Mailing Address"
                placeholder="House No, Street, Landmark, City"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* STEP 2: Vehicle Information */}
        {currentStep === 2 && (
          <Card>
            <Card.Header>
              <Card.Title>Step 2 — Vehicle Information</Card.Title>
            </Card.Header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Manufacturer / Make"
                placeholder="e.g. Hyundai"
                required
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
              />
              <Input
                label="Model"
                placeholder="e.g. Sonata"
                required
                value={model}
                onChange={e => setModel(e.target.value)}
              />
              <Input
                label="Variant"
                placeholder="e.g. 2.4L GDI Automatic"
                value={variant}
                onChange={e => setVariant(e.target.value)}
              />
              <Input
                label="Manufacturing Year"
                type="number"
                placeholder="e.g. 2018"
                value={year}
                onChange={e => setYear(e.target.value)}
              />
              <Input
                label="Registration Number (License Plate)"
                placeholder="e.g. MH-12-AB-1234"
                required
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
              />
              <Input
                label="VIN / Chassis Number"
                placeholder="17-character alpha-numeric"
                maxLength={17}
                value={vinNumber}
                onChange={e => setVinNumber(e.target.value)}
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Fuel Type</label>
                <select 
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fuelType}
                  onChange={e => setFuelType(e.target.value)}
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Transmission</label>
                <select 
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={transmission}
                  onChange={e => setTransmission(e.target.value)}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <Input
                label="Odometer Reading (km)"
                type="number"
                placeholder="e.g. 45000"
                value={odometer}
                onChange={e => setOdometer(e.target.value)}
              />
              <Input
                label="Insurance Provider"
                placeholder="e.g. ICICI Lombard"
                required
                value={insuranceProvider}
                onChange={e => setInsuranceProvider(e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* STEP 3: Accident Details */}
        {currentStep === 3 && (
          <Card>
            <Card.Header>
              <Card.Title>Step 3 — Accident Details</Card.Title>
            </Card.Header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Date of Accident"
                type="date"
                required
                value={accidentDate}
                onChange={e => setAccidentDate(e.target.value)}
              />
              <Input
                label="Time of Accident"
                type="time"
                value={accidentTime}
                onChange={e => setAccidentTime(e.target.value)}
              />
              <Input
                label="Accident Location"
                placeholder="City, Highway, Intersection"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              <Input
                label="Weather Condition"
                placeholder="e.g. Clear, Heavy Rain, Fog"
                value={weather}
                onChange={e => setWeather(e.target.value)}
              />
              <Input
                label="Approximate Speed (km/h)"
                type="number"
                placeholder="e.g. 40"
                value={speed}
                onChange={e => setSpeed(e.target.value)}
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Collision Type</label>
                <select 
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={collisionType}
                  onChange={e => setCollisionType(e.target.value)}
                >
                  <option value="Rear-end">Rear-end</option>
                  <option value="Head-on">Head-on</option>
                  <option value="Side-impact / T-bone">Side-impact / T-bone</option>
                  <option value="Single Vehicle Hit">Single Vehicle Hit</option>
                  <option value="Rollover">Rollover</option>
                </select>
              </div>

              <Input
                label="Number of Vehicles Involved"
                type="number"
                value={numVehicles}
                onChange={e => setNumVehicles(e.target.value)}
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">Was Police Informed?</label>
                <select 
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={policeInformed}
                  onChange={e => setPoliceInformed(e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-slate-300">Was Anyone Injured?</label>
                <select 
                  className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={anyoneInjured}
                  onChange={e => setAnyoneInjured(e.target.value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-slate-300">Accident Description</label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-white/10 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe how the crash happened, specific impact zones, and road conditions..."
                  required
                  value={accidentDescription}
                  onChange={e => setAccidentDescription(e.target.value)}
                />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 4: Vehicle Condition */}
        {currentStep === 4 && (
          <Card>
            <Card.Header>
              <Card.Title>Step 4 — Vehicle Condition</Card.Title>
            </Card.Header>
            <p className="text-xs text-slate-400 mb-4">Select all visual alerts observed immediately following the collision:</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { key: 'engineStarts', label: 'Engine Starts / Runs' },
                { key: 'airbagsDeployed', label: 'Airbags Deployed' },
                { key: 'windshieldBroken', label: 'Windshield / Windows Broken' },
                { key: 'lightsWorking', label: 'External Lights / Indicators Working' },
                { key: 'vehicleDrivable', label: 'Vehicle Drivable (Moves under own power)' },
                { key: 'fluidLeakage', label: 'Active Fluid Leakage (Oil, Coolant, Fuel)' },
                { key: 'suspensionDamage', label: 'Visible Suspension Misalignment' },
                { key: 'tireDamage', label: 'Tire / Rim Deformation' },
              ].map(item => (
                <label 
                  key={item.key}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] p-4 cursor-pointer select-none transition-colors"
                >
                  <input
                    type="checkbox"
                    className="h-4.5 w-4.5 rounded border-white/10 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                    checked={condition[item.key as keyof typeof condition]}
                    onChange={() => handleCheckboxChange(item.key as keyof typeof condition)}
                  />
                  <span className="text-sm font-medium text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
          </Card>
        )}

        {/* STEP 5: Photo Upload */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-6">
            <Card>
              <Card.Header>
                <Card.Title>Step 5 — Capture 6 Mandatory Angles</Card.Title>
              </Card.Header>
              <p className="text-xs text-slate-400 mb-6">
                AutoSure requires photographs from all 6 directions to calculate dimensions and run fraud checks. Uploading all 6 is required.
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {photos.map((photo) => (
                  <div key={photo.key} className="flex flex-col gap-2">
                    <input
                      type="file"
                      ref={el => (fileRefs.current[photo.key] = el)}
                      className="hidden"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(photo.key, file);
                      }}
                    />

                    {photo.preview ? (
                      <div className="relative border border-white/10 rounded-xl bg-slate-950 overflow-hidden group min-h-[160px] flex items-center justify-center">
                        <img 
                          src={photo.preview} 
                          alt={photo.label} 
                          className="max-w-full max-h-[160px] object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm"
                            onClick={() => fileRefs.current[photo.key]?.click()}
                          >
                            Replace
                          </Button>
                          <Button 
                            type="button" 
                            variant="danger" 
                            size="sm"
                            onClick={() => removePhoto(photo.key)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileRefs.current[photo.key]?.click()}
                        className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer min-h-[160px] group text-center"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-200" aria-hidden>📸</span>
                        <p className="mt-2 text-xs font-semibold text-slate-300">{photo.label}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">Click to upload photo</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          {currentStep > 1 ? (
            <Button type="button" variant="secondary" onClick={prevStep}>
              ← Previous Step
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button type="button" onClick={nextStep}>
              Next Step →
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 font-semibold px-8 border-none"
              disabled={!allPhotosUploaded}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
