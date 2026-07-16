/**
 * AUTOSURE — Register Page
 */

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/utils/validators';
import { getFirebaseErrorMessage, isFirebaseError } from '@/utils/firebase-errors';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';
import { authService } from '@/services/auth.service';
import api from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Inline error specifically for the email-already-in-use case
  const [emailConflictError, setEmailConflictError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setEmailConflictError(false);

    try {
      // 1. Create user in Firebase Auth
      const fbUser = await authService.registerWithEmail(data);

      // 2. Initialize user document & role on the backend.
      //    NOTE: api.baseURL is already set to http://localhost:5001/api/v1
      //    so we only need the path relative to that base.
      await api.post('/auth/register', {
        displayName: data.displayName,
        email: data.email,
        uid: fbUser.uid,
        role: 'customer',
      });

      // 3. Force token refresh to pick up any custom claims set by the backend
      await fbUser.getIdToken(true);

      toastSuccess('Account created! Welcome to AUTOSURE.');
      // User is now signed in — navigate directly to dashboard
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error: unknown) {
      // Special case: email already has an account — show inline message
      if (isFirebaseError(error, 'auth/email-already-in-use')) {
        setEmailConflictError(true);
        return;
      }

      // All other Firebase or backend errors — show as toast
      toastError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Join AUTOSURE to streamline your claims
        </p>
      </div>

      {/* Email conflict inline error */}
      {emailConflictError && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          <p className="font-medium">An account already exists with this email.</p>
          <p className="mt-1">
            Please{' '}
            <Link
              to={ROUTES.LOGIN}
              className="font-semibold text-brand-400 underline-offset-2 transition-colors hover:text-brand-300 hover:underline"
            >
              sign in instead
            </Link>
            , or use a different email to register.
          </p>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register('displayName')}
            error={errors.displayName?.message}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            className="mt-2 w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign up
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
