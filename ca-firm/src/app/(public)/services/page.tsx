import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Receipt, IndianRupee, ShieldCheck, Building2 } from 'lucide-react';
import { mockServicePages } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Comprehensive CA services: GST compliance, income tax filing, statutory audit, and company incorporation. Expert chartered accountant services for businesses across India.',
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Receipt,
  IndianRupee,
  ShieldCheck,
  Building2,
};

const colorMap: Record<string, string> = {
  Receipt: 'bg-blue-50 text-blue-600',
  IndianRupee: 'bg-emerald-50 text-emerald-600',
  ShieldCheck: 'bg-violet-50 text-violet-600',
  Building2: 'bg-amber-50 text-amber-600',
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Comprehensive accounting, tax, and compliance services tailored for businesses of every size and structure.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockServicePages.map((service) => {
              const Icon = iconMap[service.icon] || Receipt;
              const color = colorMap[service.icon] || 'bg-blue-50 text-blue-600';
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-xl border border-border p-8 card-hover"
                >
                  <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-5`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-ink mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    {service.processSteps.slice(0, 4).map((step, i) => (
                      <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                        {step.title}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-primary flex items-center gap-1 mt-5">
                    View details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
