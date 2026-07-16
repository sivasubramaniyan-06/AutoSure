/**
 * AUTOSURE — Login Page
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validators';
import { getFirebaseErrorMessage } from '@/utils/firebase-errors';
import type { LoginCredentials } from '@/types/auth.types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: toastError, success: toastSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to the page the user was trying to access, or dashboard
  const from = (location.state as { from?: { pathname: string } } | null)
    ?.from?.pathname ?? ROUTES.DASHBOARD;

  // Show a success message if the user just registered
  const registrationSuccess = (location.state as { registered?: boolean } | null)
    ?.registered;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true);
    try {
      await authService.loginWithEmail(data);
      toastSuccess('Signed in successfully!');
      navigate(from, { replace: true });
    } catch (error: unknown) {
      toastError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to your AUTOSURE account
        </p>
      </div>

      {/* Registration success banner */}
      {registrationSuccess && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Account created! Please sign in to continue.
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Email address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs font-medium text-brand-400 transition-colors hover:text-brand-300"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign in
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-brand-400 transition-colors hover:text-brand-300"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
