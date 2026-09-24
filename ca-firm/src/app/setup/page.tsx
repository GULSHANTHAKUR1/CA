'use client';

import React, { useState } from 'react';
import { Scale, CheckCircle2, Loader2, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui';
import {
  auth,
  db,
  setupAdminProfile,
} from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

/**
 * One-time setup page to create the initial admin account.
 * Visit /setup once, then this page can be removed or disabled.
 */
export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');

  const handleSetup = async () => {
    setStatus('loading');
    setMessage('Creating admin account...');

    try {
      // Create the admin user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'cinebhaii778@gmail.com',
        'Admin@123'
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: 'CA Rajesh Sharma',
      });

      // Create the admin profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: 'CA Rajesh Sharma',
        email: 'cinebhaii778@gmail.com',
        phone: '',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Sign out so admin can login fresh from login page
      await signOut(auth);

      setStatus('success');
      setMessage('Admin account created successfully!');
      setDetails(
        'Email: cinebhaii778@gmail.com\nPassword: Admin@123\n\nYou can now go to /login and sign in.'
      );
    } catch (error: unknown) {
      setStatus('error');
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          setMessage('Admin account already exists!');
          setDetails('You can go to /login and sign in with your credentials.');
          setStatus('success');
        } else {
          setMessage('Setup failed: ' + error.message);
          setDetails('Please check your Firebase configuration and try again.');
        }
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Initial Setup</h1>
          <p className="text-muted-foreground mt-2">
            Create the admin account for Sharma & Associates portal
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          {/* Admin Details Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium text-ink">Admin Account Details</span>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="text-ink font-medium">CA Rajesh Sharma</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-ink font-medium">cinebhaii778@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password:</span>
                <span className="text-ink font-medium">Admin@123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="text-primary font-medium">ADMIN</span>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status === 'loading' && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <p className="text-sm text-blue-700">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">{message}</p>
                  {details && (
                    <pre className="text-xs text-emerald-700 mt-2 whitespace-pre-wrap">{details}</pre>
                  )}
                </div>
              </div>
              <a href="/login">
                <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Login Page
                </Button>
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{message}</p>
                {details && (
                  <p className="text-xs text-red-600 mt-1">{details}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          {status === 'idle' && (
            <Button
              onClick={handleSetup}
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Admin Account
            </Button>
          )}

          {status === 'error' && (
            <Button
              onClick={handleSetup}
              className="w-full"
              variant="outline"
            >
              Retry Setup
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a one-time setup page. Remove it after initial configuration.
        </p>
      </div>
    </div>
  );
}
