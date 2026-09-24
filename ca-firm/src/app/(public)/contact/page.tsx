'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';
import { Button, Input, Textarea, Select } from '@/components/ui';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid 10-digit phone number'),
  email: z.string().email('Enter a valid email address'),
  serviceCategory: z.string().min(1, 'Please select a service category'),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const serviceOptions = [
  { value: 'gst', label: 'GST Compliance & Returns' },
  { value: 'income-tax', label: 'Income Tax Filing & Planning' },
  { value: 'audit', label: 'Statutory Audit & Assurance' },
  { value: 'incorporation', label: 'Company Incorporation & ROC' },
  { value: 'other', label: 'Other / General Inquiry' },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { serviceCategory: '' },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Mock submit — in production, this posts to /api/leads
    console.log('Lead submitted:', data);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Schedule a free consultation or send us your inquiry. We respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-border p-6 md:p-8">
                <h2 className="text-xl font-bold text-ink mb-6">Book a Consultation</h2>

                {isSubmitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      We&apos;ve received your inquiry and will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Full Name"
                        placeholder="e.g. Vikram Singh"
                        error={errors.name?.message}
                        {...register('name')}
                      />
                      <Input
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        type="tel"
                        error={errors.phone?.message}
                        {...register('phone')}
                      />
                    </div>
                    <Input
                      label="Email Address"
                      placeholder="you@company.com"
                      type="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <Select
                      label="Service Category"
                      placeholder="Select a service..."
                      options={serviceOptions}
                      error={errors.serviceCategory?.message}
                      {...register('serviceCategory')}
                    />
                    <Textarea
                      label="Additional Notes (Optional)"
                      placeholder="Brief description of your requirements..."
                      rows={4}
                      {...register('notes')}
                    />
                    <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />} className="w-full md:w-auto">
                      Send Inquiry
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-ink mb-4">Contact Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Office Address</p>
                      <p className="text-sm text-muted-foreground">123 Commerce House, Andheri West, Mumbai, Maharashtra 400058</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Email</p>
                      <p className="text-sm text-muted-foreground">contact@sharmaassociates.in</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">Office Hours</p>
                      <p className="text-sm text-muted-foreground">Mon–Fri: 10:00 AM – 7:00 PM</p>
                      <p className="text-sm text-muted-foreground">Saturday: 10:00 AM – 2:00 PM</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Google Maps Embed */}
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.9830534665307!2d72.82730567536846!3d19.136397982088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63aceef0c69%3A0x2aa80cf2287dfa3b!2sAndheri%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1695000000000!5m2!1sen!2sin"
                  width="100%"
                  height="224"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sharma &amp; Associates Office Location"
                  className="w-full h-56"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AccountingService',
            name: 'Sharma & Associates, Chartered Accountants',
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
          }),
        }}
      />
    </>
  );
}
