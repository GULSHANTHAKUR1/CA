'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Receipt,
  IndianRupee,
  ShieldCheck,
  Building2,
  Scale,
  ExternalLink,
} from 'lucide-react';

// ============================================================
// Navbar
// ============================================================

const services = [
  { href: '/services/gst-compliance', label: 'GST Compliance & Returns', icon: Receipt },
  { href: '/services/income-tax-filing', label: 'Income Tax Filing', icon: IndianRupee },
  { href: '/services/statutory-audit', label: 'Statutory Audit', icon: ShieldCheck },
  { href: '/services/company-incorporation', label: 'Company Incorporation', icon: Building2 },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      {/* Top info bar */}
      <div className="hidden md:block bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> contact@sharmaassociates.in
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Mumbai, Maharashtra
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-ink leading-tight block">
                Sharma & Associates
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight block tracking-wider uppercase">
                Chartered Accountants
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink href="/" active={pathname === '/'}>Home</NavLink>

            {/* Services Dropdown */}
            <div className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                pathname.startsWith('/services') ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
                Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-card border border-border rounded-xl shadow-lg py-2 animate-scale-in">
                  <Link
                    href="/services"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    All Services Overview
                  </Link>
                  <div className="border-t border-border my-1" />
                  {services.map((svc) => (
                    <Link
                      key={svc.href}
                      href={svc.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <svc.icon className="w-4 h-4 text-primary" />
                      {svc.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/about" active={pathname === '/about'}>About</NavLink>
            <NavLink href="/contact" active={pathname === '/contact'}>Contact</NavLink>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Client Portal
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-white gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-fade-in">
            <div className="space-y-1">
              <MobileNavLink href="/" onClick={() => setIsMobileOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/services" onClick={() => setIsMobileOpen(false)}>All Services</MobileNavLink>
              {services.map((svc) => (
                <Link
                  key={svc.href}
                  href={svc.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors pl-8"
                >
                  <svc.icon className="w-4 h-4" />
                  {svc.label}
                </Link>
              ))}
              <MobileNavLink href="/about" onClick={() => setIsMobileOpen(false)}>About</MobileNavLink>
              <MobileNavLink href="/contact" onClick={() => setIsMobileOpen(false)}>Contact</MobileNavLink>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2 px-4">
              <Link
                href="/login"
                onClick={() => setIsMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-primary border border-primary/30 rounded-lg"
              >
                Client Portal
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white gradient-primary rounded-lg"
              >
                Book Consultation
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-border px-4 space-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> contact@sharmaassociates.in</p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        active ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

// ============================================================
// Footer
// ============================================================

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold block">Sharma & Associates</span>
                <span className="text-xs text-slate-400 tracking-wider uppercase">Chartered Accountants</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for GST compliance, income tax, auditing, and company incorporation services. ICAI registered firm serving businesses across India.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2.5">
              {services.map((svc) => (
                <li key={svc.href}>
                  <Link href={svc.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Client Portal</Link></li>
              <li>
                <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  Income Tax Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.gst.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  GST Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-slate-500 flex-shrink-0" />
                <span>123 Commerce House, Andheri West,<br />Mumbai, Maharashtra 400058</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-slate-500" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-slate-500" />
                contact@sharmaassociates.in
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Sharma & Associates, Chartered Accountants. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-400">ICAI Registered</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-400">FRN: 123456W</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
