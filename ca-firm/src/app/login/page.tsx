'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, authError, clearError, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      const routes = {
        ADMIN: '/admin',
        WORKER: '/worker',
        CLIENT: '/client',
      };
      router.replace(routes[role] || '/admin');
    }
  }, [isAuthenticated, role, router]);

  // Clear errors when fields change
  useEffect(() => {
    if (authError) clearError();
    setValidationErrors({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a minimal loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/3 rounded-full" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold block">Sharma & Associates</span>
              <span className="text-xs text-blue-200 tracking-wider uppercase">Chartered Accountants</span>
            </div>
          </Link>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Secure Portal
            <br />
            <span className="text-blue-200">for Your Practice</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-lg">
            Track filings, manage clients, assign tasks, and communicate with your team — all in one secure, professional platform.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-blue-200">
              <Shield className="w-4 h-4" />
              <span className="text-sm">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Firebase Secured</span>
            </div>
          </div>
        </div>

        <p className="text-blue-200 text-sm relative">© 2025 Sharma & Associates. ICAI FRN: 123456W</p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-ink">Sharma & Associates</span>
          </div>

          <h2 className="text-2xl font-bold text-ink mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground mb-8">
            Enter your credentials to access the portal.
          </p>

          {/* Auth Error Alert */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-medium text-ink">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                  className={`
                    w-full h-11 px-3 pl-10 text-base rounded-lg
                    border bg-card text-foreground
                    placeholder:text-ink-tertiary
                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-input-border'}
                  `}
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className={`
                    w-full h-11 px-3 pl-10 pr-10 text-base rounded-lg
                    border bg-card text-foreground
                    placeholder:text-ink-tertiary
                    focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-input-border'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-input-border w-4 h-4 accent-primary" defaultChecked />
                <span className="text-muted-foreground">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              rightIcon={
                isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/" className="text-primary font-medium hover:underline">
              ← Back to website
            </Link>
          </p>

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" />
              <p className="text-xs">
                Your connection is secured with Firebase Authentication.
                Contact your administrator if you need access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
