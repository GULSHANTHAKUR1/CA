import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronDown, CheckCircle2, Phone } from 'lucide-react';
import { mockServicePages } from '@/lib/mock-data';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return mockServicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = mockServicePages.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = mockServicePages.find((s) => s.slug === slug);

  if (!service) notFound();

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/services" className="text-blue-200 text-sm hover:text-white transition-colors mb-4 inline-block">
            ← All Services
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{service.heroTitle}</h1>
          <p className="text-lg text-blue-100 max-w-2xl">{service.heroSubtitle}</p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-lg text-ink leading-relaxed">{service.description}</p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ink text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-6 relative">
                <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center text-sm font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                {i < service.processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 text-border">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ink text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-border">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-sm font-medium text-ink pr-4">{faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-2xl font-bold mb-3">Need Help with {service.title}?</h2>
            <p className="text-blue-100 mb-6">
              Get a free consultation with our CA partner. We&apos;ll assess your requirements and provide a clear roadmap.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Phone className="w-4 h-4" /> Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
