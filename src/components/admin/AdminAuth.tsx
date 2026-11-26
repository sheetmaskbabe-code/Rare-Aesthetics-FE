import { FormEvent, useState } from 'react';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiUrl } from '@/lib/api';

type AdminAuthProps = {
  onSuccess: (token?: string) => void;
};

export function AdminAuth({ onSuccess }: AdminAuthProps) {
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [targetEmail, setTargetEmail] = useState('aestheticsrare502@gmail.com');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Submit Password & Request OTP from Backend
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requireOtp) {
          if (data.email) setTargetEmail(data.email);
          setStep('otp');
        } else if (data.token) {
          onSuccess(data.token);
        } else {
          onSuccess();
        }
      } else {
        setError(data.error || 'Invalid admin password');
      }
    } catch (err: any) {
      setError(err?.message || 'Connection to server failed. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP via Backend
  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otp.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        onSuccess(data.token);
      } else {
        setError(data.error || 'Invalid or expired verification code');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to verify OTP with server');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP via Backend
  const handleResendOtp = async () => {
    try {
      setResending(true);
      setError('');
      setResendSuccess(false);

      const res = await fetch(apiUrl('/api/auth/resend-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to communicate with backend');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <Seo title="Admin Sign In | My Rare Aesthetics" />
      <div className="admin-portal flex min-h-screen flex-col items-center justify-center bg-[#2B1830] px-4 py-12 text-lavender">
        <div className="w-full max-w-md rounded-xl border border-[#9810FA]/30 bg-[#35213B]/95 p-8 shadow-2xl backdrop-blur-md">
          {/* Logo / Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9810FA]/20 text-[#9810FA] ring-1 ring-[#9810FA]/40 shadow-lg shadow-[#9810FA]/20">
              {step === 'password' ? (
                <ShieldCheck className="h-7 w-7" />
              ) : (
                <KeyRound className="h-7 w-7" />
              )}
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold tracking-wide text-white">
              {step === 'password' ? 'Rare Aesthetics CMS' : 'Two-Step Verification'}
            </h1>
            <p className="mt-1 text-xs text-lavender/60">
              {step === 'password'
                ? 'Backend-Connected Admin Portal & Content Management'
                : 'A 6-digit verification code has been dispatched to'}
            </p>
            {step === 'otp' && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#9810FA]/40 bg-[#9810FA]/10 px-3 py-1 text-xs font-semibold text-purple-300">
                <Mail className="h-3.5 w-3.5" />
                <span>{targetEmail}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded bg-red-950/60 border border-red-500/30 p-2.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded bg-emerald-950/60 border border-emerald-500/30 p-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>A fresh verification code has been sent to your email!</span>
            </div>
          )}

          {step === 'password' ? (
            /* STEP 1: Enter Password */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-lavender/80">
                  Administrator Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-[#9810FA]/40 bg-[#2B1830]/80 px-3.5 py-2.5 pr-10 text-sm text-lavender placeholder-lavender/30 focus:border-[#9810FA] focus:outline-none focus:ring-1 focus:ring-[#9810FA]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-lavender/50 hover:text-lavender cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#8524F9] hover:bg-[#8524F9]/90 text-white font-semibold shadow-md shadow-[#8524F9]/30 transition-all cursor-pointer"
              >
                {loading ? 'Verifying & Sending Code...' : 'Sign In to Admin Portal'}
              </Button>
            </form>
          ) : (
            /* STEP 2: Enter 6-digit OTP */
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-lavender/80">
                  6-Digit Verification Code
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[8px] font-mono text-2xl font-bold rounded-md border border-[#9810FA]/40 bg-[#2B1830]/80 py-3 text-lavender placeholder-lavender/20 focus:border-[#9810FA] focus:outline-none focus:ring-1 focus:ring-[#9810FA]"
                  />
                </div>
                <p className="mt-2 text-center text-[11px] text-lavender/50">
                  Check your inbox and spam folder for the code from My Rare Aesthetics.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[#8524F9] hover:bg-[#8524F9]/90 text-white font-semibold shadow-md shadow-[#8524F9]/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Verifying Code...' : 'Verify Code & Access CMS'}
              </Button>

              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('password');
                    setError('');
                    setOtp('');
                  }}
                  className="inline-flex items-center gap-1 text-lavender/60 hover:text-lavender cursor-pointer transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Password</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="inline-flex items-center gap-1 font-semibold text-purple-300 hover:text-white cursor-pointer transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Sending...' : 'Resend Code'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-lavender/60 hover:text-[#9810FA] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
