/**
 * AUTOSURE — Forgot Password Page
 */

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';
import { authService } from '@/services/auth.service';
import { getFirebaseErrorMessage } from '@/utils/firebase-errors';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { error: toastError, success: toastSuccess } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword(data);
      setEmailSent(true);
      toastSuccess('Password reset email sent! Check your inbox.');
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
          Reset password
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {emailSent ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-slate-300">
              Check your inbox for the reset link. It may take a minute to arrive.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="mt-2 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
            >
              Back to Sign In
            </Link>
          </div>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Email address"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Send reset link
            </Button>
          </form>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        Remember your password?{' '}
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
