import React from 'react';
import type { Metadata } from 'next';
import { Award, Users, Target, Heart, GraduationCap, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sharma & Associates — an ICAI registered CA firm with 15+ years of experience serving 200+ clients across India.',
};

const values = [
  { icon: Target, title: 'Precision', description: 'Every number matters. We ensure meticulous accuracy in all filings and computations.' },
  { icon: Heart, title: 'Client-First', description: 'Your success is our priority. We provide proactive advice, not just compliance.' },
  { icon: Award, title: 'Integrity', description: 'We maintain the highest ethical standards as mandated by ICAI and our professional conscience.' },
  { icon: Users, title: 'Accessibility', description: 'Direct access to experienced professionals. No layers of juniors between you and your CA.' },
];

const team = [
  {
    name: 'CA Rajesh Sharma',
    role: 'Managing Partner',
    bio: 'FCA with 18+ years of experience in taxation, audit, and corporate advisory. Former audit manager at a Big 4 firm. Specializes in corporate tax planning and statutory audits for mid-market companies.',
    credentials: 'FCA, B.Com (H), DISA (ICAI)',
  },
  {
    name: 'CA Meenakshi Sharma',
    role: 'Partner — Tax Practice',
    bio: 'ACA with 12+ years specializing in indirect taxation and GST compliance. Has handled GST migration for 100+ businesses during the 2017 transition. Expert in GST litigation and advance rulings.',
    credentials: 'ACA, M.Com, Cert. GST Professional',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">About Sharma & Associates</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            A boutique Chartered Accountant firm committed to precision, integrity, and client success since 2010.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-ink">Our Story</h2>
          </div>
          <div className="prose prose-slate max-w-none space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Sharma & Associates was founded in 2010 by CA Rajesh Sharma with a clear mission: to provide
              large-firm quality accounting and tax services with the personalized attention of a boutique practice.
            </p>
            <p>
              Over 15 years, we have grown from a solo practice to a team of experienced professionals serving
              200+ clients across India — from individual taxpayers to private limited companies with multi-crore turnovers.
            </p>
            <p>
              Our firm is registered with the Institute of Chartered Accountants of India (ICAI) under
              Firm Registration Number 123456W. We are empaneled with the Comptroller and Auditor General
              of India (C&AG) for government audits.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ink text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl border border-border p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-ink text-center mb-12">Meet Our Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-border p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary mb-5">
                  {member.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-ink">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> {member.credentials}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
