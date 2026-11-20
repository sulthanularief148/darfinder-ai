'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Mail, Zap, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';

// Wrapper with Suspense — useSearchParams requires this for static builds
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <Skeleton className="w-full max-w-md h-96 rounded-2xl" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const redirect = searchParams.get('redirect') || '/agent/dashboard';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_DEMO_AGENT_EMAIL || 'demo@darfinder.ai',
      password: process.env.NEXT_PUBLIC_DEMO_AGENT_PASSWORD || 'demo-agent-2024',
    });

    if (authError) {
      setError('Demo login failed. Make sure the seed data has been loaded.');
      setDemoLoading(false);
    } else {
      router.push(redirect);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 hero-mesh">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-dark to-gold">
              <Building2 className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Agent Login</h1>
              <p className="text-xs text-muted-foreground">DarFinder AI</p>
            </div>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a magic link to <strong>{email}</strong>.
                Click the link in the email to sign in.
              </p>
              <Button
                variant="ghost"
                className="mt-4 text-sm"
                onClick={() => { setSent(false); setEmail(''); }}
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Button
                  onClick={handleDemoLogin}
                  disabled={demoLoading}
                  className="w-full btn-cyan rounded-xl h-12 text-sm font-semibold"
                >
                  {demoLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Try Agent Demo — No Sign Up Needed
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Instant access with a pre-loaded demo account
                </p>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">
                    or sign in with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="agent@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-11 rounded-xl"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold rounded-xl h-11"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Magic Link
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                No password needed — we&apos;ll email you a secure sign-in link.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
