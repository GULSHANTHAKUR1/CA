'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus,
  ListTodo,
  Clock,
  AlertTriangle,
  Shield,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  User,
  X,
} from 'lucide-react';
import { Card, Badge, Avatar, Button, Modal, Input } from '@/components/ui';
import { mockTasks } from '@/lib/mock-data';
import { Role, TaskStatus } from '@/lib/types';
import {
  getAllWorkers,
  createWorkerAccount,
  toggleUserActive,
  updateUserProfile,
  type UserProfile,
} from '@/lib/firebase';

// ============================================================
// Create Worker Modal
// ============================================================

interface CreateWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateWorkerModal({ isOpen, onClose, onSuccess }: CreateWorkerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createWorkerAccount(email.trim(), password, name.trim(), phone.trim());
      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) {
          setError('An account with this email already exists.');
        } else if (err.message.includes('weak-password')) {
          setError('Password is too weak. Use at least 6 characters.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Worker Account" size="md">
      {success ? (
        <div className="flex flex-col items-center py-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-ink mb-1">Account Created!</h3>
          <p className="text-sm text-muted-foreground text-center">
            Worker account for <strong>{name}</strong> has been created successfully.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="worker-name" className="block text-sm font-medium text-ink">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <User className="w-4 h-4" />
              </div>
              <input
                id="worker-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                placeholder="Priya Mehta"
                className="w-full h-11 px-3 pl-10 text-base rounded-lg border border-input-border bg-card text-foreground placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="worker-email" className="block text-sm font-medium text-ink">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="worker-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="priya@sharmaassociates.in"
                className="w-full h-11 px-3 pl-10 text-base rounded-lg border border-input-border bg-card text-foreground placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="worker-phone" className="block text-sm font-medium text-ink">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="worker-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-11 px-3 pl-10 text-base rounded-lg border border-input-border bg-card text-foreground placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="worker-password" className="block text-sm font-medium text-ink">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="worker-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Min. 6 characters"
                className="w-full h-11 px-3 pl-10 pr-10 text-base rounded-lg border border-input-border bg-card text-foreground placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                disabled={isSubmitting}
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
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="worker-confirm-password" className="block text-sm font-medium text-ink">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="worker-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                placeholder="Re-enter password"
                className="w-full h-11 px-3 pl-10 text-base rounded-lg border border-input-border bg-card text-foreground placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Passwords do not match
              </p>
            )}
          </div>

          {/* Info note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> The worker will use this email and password to log in to the portal.
              Share these credentials securely with the team member.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
              leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

// ============================================================
// Staff Page
// ============================================================

export default function StaffPage() {
  const [workers, setWorkers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchWorkers = useCallback(() => {
    const isMounted = true;
    getAllWorkers()
      .then((result) => {
        if (isMounted) {
          setWorkers(result);
          setLoadError(null);
        }
      })
      .catch((err) => {
        console.error('Error fetching workers:', err);
        if (isMounted) {
          setLoadError('Failed to load staff members. Please refresh the page.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleToggleActive = async (worker: UserProfile) => {
    setTogglingId(worker.uid);
    try {
      await toggleUserActive(worker.uid, !worker.isActive);
      setWorkers((prev) =>
        prev.map((w) =>
          w.uid === worker.uid ? { ...w, isActive: !w.isActive } : w
        )
      );
    } catch (err) {
      console.error('Error toggling worker status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Staff Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Loading team members...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-48" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-20 bg-muted rounded-lg" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Staff Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {workers.length} team member{workers.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Worker Account
        </Button>
      </div>

      {loadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      )}

      {workers.length === 0 && !loadError ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-ink">No Staff Members Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Create your first worker account to start assigning tasks and managing your team.
            </p>
            <Button
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2"
            >
              Create First Worker
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workers.map((worker) => {
            const assignedTasks = mockTasks.filter((t) => t.assignedToId === worker.uid);
            const activeTasks = assignedTasks.filter((t) => t.status !== TaskStatus.COMPLETED);
            const overdue = activeTasks.filter((t) => new Date(t.dueDate) < new Date());
            const isToggling = togglingId === worker.uid;

            return (
              <Card key={worker.uid} className={`${!worker.isActive ? 'opacity-60' : ''} transition-opacity`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={worker.name} size="lg" />
                    <div>
                      <p className="font-semibold text-ink">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.email}</p>
                      {worker.phone && (
                        <p className="text-xs text-muted-foreground">{worker.phone}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full ${worker.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs text-muted-foreground">{worker.isActive ? 'Active' : 'Deactivated'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(worker)}
                    disabled={isToggling}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                      worker.isActive
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    } disabled:opacity-50`}
                    title={worker.isActive ? 'Deactivate account' : 'Activate account'}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : worker.isActive ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    {worker.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <ListTodo className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-700">{activeTasks.length}</p>
                    <p className="text-xs text-blue-600">Active</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-amber-700">
                      {assignedTasks.filter((t) => t.status === TaskStatus.COMPLETED).length}
                    </p>
                    <p className="text-xs text-amber-600">Done</p>
                  </div>
                  <div className={`rounded-lg p-3 text-center ${overdue.length > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
                    <AlertTriangle className={`w-4 h-4 mx-auto mb-1 ${overdue.length > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                    <p className={`text-lg font-bold ${overdue.length > 0 ? 'text-red-700' : 'text-slate-500'}`}>
                      {overdue.length}
                    </p>
                    <p className={`text-xs ${overdue.length > 0 ? 'text-red-600' : 'text-slate-400'}`}>Overdue</p>
                  </div>
                </div>

                {activeTasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Current Tasks</p>
                    <div className="space-y-1.5">
                      {activeTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-2 text-sm">
                          <Badge variant="status" status={task.status} className="text-[10px] px-1.5">
                            {task.status === TaskStatus.TODO ? '○' : task.status === TaskStatus.IN_PROGRESS ? '◔' : '◑'}
                          </Badge>
                          <span className="text-ink truncate">{task.title}</span>
                        </div>
                      ))}
                      {activeTasks.length > 3 && (
                        <p className="text-xs text-primary">+{activeTasks.length - 3} more</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Worker Modal */}
      <CreateWorkerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchWorkers}
      />
    </div>
  );
}
