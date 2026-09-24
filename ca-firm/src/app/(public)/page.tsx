import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Receipt,
  IndianRupee,
  ShieldCheck,
  Building2,
  Star,
  Award,
  Users,
  Clock,
  Phone,
} from 'lucide-react';
import { mockTestimonials } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Sharma & Associates — Chartered Accountants | GST, Tax, Audit',
  description:
    'Trusted CA firm offering GST compliance, income tax filing, statutory audit, and company incorporation. ICAI registered, 15+ years experience, 200+ clients served.',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: 'Sharma & Associates, Chartered Accountants',
  description:
    'Boutique Chartered Accountant firm offering GST compliance, income tax filing, statutory audit, and company incorporation services.',
  url: 'https://sharmaassociates.in',
  telephone: '+919876543210',
  email: 'contact@sharmaassociates.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Commerce House, Andheri West',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400058',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.1364,
    longitude: 72.8296,
  },
  openingHours: 'Mo-Fr 10:00-19:00, Sa 10:00-14:00',
  priceRange: '₹₹',
  image: '/og-image.jpg',
};

const practiceAreas = [
  {
    title: 'GST Compliance & Returns',
    description: 'End-to-end GST registration, monthly return filing, annual returns, and ITC reconciliation.',
    icon: Receipt,
    href: '/services/gst-compliance',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Income Tax Filing',
    description: 'Individual and business ITR filing, advance tax computation, and strategic tax planning.',
    icon: IndianRupee,
    href: '/services/income-tax-filing',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Statutory Audit',
    description: 'Independent statutory audits, tax audits, and assurance services for regulatory compliance.',
    icon: ShieldCheck,
    href: '/services/statutory-audit',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Company Incorporation',
    description: 'Pvt Ltd, LLP, and OPC incorporation with complete ROC compliance and annual filings.',
    icon: Building2,
    href: '/services/company-incorporation',
    color: 'bg-amber-50 text-amber-600',
  },
];

const trustBadges = [
  { icon: Award, label: 'ICAI Registered', sublabel: 'FRN: 123456W' },
  { icon: Clock, label: '15+ Years', sublabel: 'Of Excellence' },
  { icon: Users, label: '200+ Clients', sublabel: 'Across India' },
  { icon: CheckCircle2, label: '99.9% On-Time', sublabel: 'Filing Rate' },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ========== Hero Section ========== */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero text-white">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-36">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                ICAI Registered Firm — Trusted Since 2010
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Trusted Compliance Partner for{' '}
                <span className="text-blue-200">Growing Businesses</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl">
                From GST filings to statutory audits — we handle the complexities of Indian taxation
                so you can focus on what matters most: building your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
                >
                  Client Portal <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors text-base"
                >
                  <Phone className="w-4 h-4" /> Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Trust Badges ========== */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-border grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3 px-6 py-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">{badge.label}</p>
                  <p className="text-xs text-muted-foreground">{badge.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Core Practice Areas ========== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Our Expertise
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Core Practice Areas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive accounting, tax, and compliance services tailored for
              businesses of every size and structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group bg-white rounded-xl border border-border p-6 md:p-8 card-hover flex gap-5"
              >
                <div className={`w-12 h-12 rounded-xl ${area.color} flex items-center justify-center flex-shrink-0`}>
                  <area.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-primary transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {area.description}
                  </p>
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Why Choose Us ========== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                Why Choose Us
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6">
                A Partner That Understands Your Business
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Unlike large impersonal firms, we provide dedicated attention to each client.
                Our boutique approach means you work directly with experienced professionals
                who understand your industry and business goals.
              </p>
              <ul className="space-y-4">
                {[
                  'Dedicated CA partner for every client — no junior-only handling',
                  'Proactive deadline management with automated reminders',
                  'Secure client portal for document exchange and real-time status tracking',
                  'Transparent fee structure with no hidden charges',
                  'Pan-India service capability with local expertise',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-ink leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Receipt className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">5,000+</p>
                    <p className="text-sm text-muted-foreground">GST Returns Filed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <IndianRupee className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">1,200+</p>
                    <p className="text-sm text-muted-foreground">ITR Filed This Year</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-xl bg-violet-50 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">150+</p>
                    <p className="text-sm text-muted-foreground">Audits Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">80+</p>
                    <p className="text-sm text-muted-foreground">Companies Incorporated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Testimonials ========== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Client Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl border border-border p-6 md:p-8 card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm text-ink leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="gradient-primary rounded-2xl p-8 md:p-14 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Simplify Your Compliance?
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Schedule a free consultation with our CA partner. No commitment,
                just clear answers to your tax and compliance questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Book Free Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
