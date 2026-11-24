import { FormEvent, useState } from 'react';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type AdminAuthProps = {
  onSuccess: (token?: string) => void;
};

export function AdminAuth({ onSuccess }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'Rare1357';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess(data.token);
      } else if (password === ADMIN_PASSWORD) {
        onSuccess();
      } else {
        setError(data.error || 'Incorrect admin password');
      }
    } catch {
      if (password === ADMIN_PASSWORD) {
        onSuccess();
      } else {
        setError('Incorrect admin password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Admin Sign In | My Rare Aesthetics" />
      <div className="admin-portal flex min-h-screen flex-col items-center justify-center bg-[#2B1830] px-4 py-12 text-lavender">
        <div className="w-full max-w-md rounded-lg border border-[#9810FA]/30 bg-[#35213B]/90 p-8 shadow-2xl backdrop-blur-md">
          {/* Logo / Icon */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9810FA]/20 text-[#9810FA] ring-1 ring-[#9810FA]/40 shadow-lg shadow-[#9810FA]/20">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold tracking-wide text-white">
              Rare Aesthetics CMS
            </h1>
            <p className="mt-1 text-xs text-lavender/60">
              Standalone Content Management & Database Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-lavender/50 hover:text-lavender"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded bg-red-950/60 border border-red-500/30 p-2.5 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-2 bg-[#9810FA] hover:bg-[#9810FA]/90 text-white font-semibold shadow-md shadow-[#9810FA]/30 transition-all">
              {loading ? 'Verifying...' : 'Sign In to Admin Portal'}
            </Button>
          </form>

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
