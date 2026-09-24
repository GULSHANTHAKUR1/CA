import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Phone, LogIn, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-200 via-blue-100 to-slate-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-subtle shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium text-ink hover:bg-muted hover:border-border-hover transition-all card-hover"
          >
            <Home className="w-4 h-4 text-primary" />
            Home
          </Link>
          <Link
            href="/services"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium text-ink hover:bg-muted hover:border-border-hover transition-all card-hover"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            Services
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium text-ink hover:bg-muted hover:border-border-hover transition-all card-hover"
          >
            <Phone className="w-4 h-4 text-primary" />
            Contact
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            <LogIn className="w-3.5 h-3.5" />
            Client Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
