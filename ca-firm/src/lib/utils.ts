import { clsx, type ClassValue } from 'clsx';

// ============================================================
// Class name utility (lightweight clsx alternative if not installed)
// ============================================================
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ============================================================
// Date formatting
// ============================================================
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return formatDate(dateString);
}

// ============================================================
// Currency formatting
// ============================================================
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============================================================
// String utilities
// ============================================================
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

// ============================================================
// Deadline urgency
// ============================================================
export function getDeadlineUrgency(
  dueDate: string
): 'overdue' | 'urgent' | 'soon' | 'normal' {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 2) return 'urgent';
  if (diffDays <= 7) return 'soon';
  return 'normal';
}

// ============================================================
// PAN / GSTIN formatting validation (display only)
// ============================================================
export function maskPan(pan: string): string {
  if (!pan || pan.length !== 10) return pan || '—';
  return pan.slice(0, 4) + '****' + pan.slice(8);
}

export function formatGstin(gstin: string): string {
  if (!gstin || gstin.length !== 15) return gstin || '—';
  return `${gstin.slice(0, 2)}-${gstin.slice(2, 12)}-${gstin.slice(12)}`;
}
