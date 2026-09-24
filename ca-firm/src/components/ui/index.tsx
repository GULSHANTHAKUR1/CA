import React from 'react';
import { TaskStatus, Priority } from '@/lib/types';

// ============================================================
// Button
// ============================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm',
  outline: 'border border-border bg-card text-foreground hover:bg-muted hover:border-border-hover',
  ghost: 'text-foreground hover:bg-muted',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 focus-ring cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        min-w-[44px] min-h-[44px]
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

// ============================================================
// Badge
// ============================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status' | 'priority';
  status?: TaskStatus;
  priority?: Priority;
  className?: string;
}

const statusStyles: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-status-todo-bg text-status-todo-text',
  [TaskStatus.IN_PROGRESS]: 'bg-status-progress-bg text-status-progress-text',
  [TaskStatus.WAITING_ON_CLIENT]: 'bg-status-waiting-bg text-status-waiting-text',
  [TaskStatus.UNDER_REVIEW]: 'bg-status-review-bg text-status-review-text',
  [TaskStatus.COMPLETED]: 'bg-status-done-bg text-status-done-text',
};

const priorityStyles: Record<Priority, string> = {
  [Priority.LOW]: 'bg-priority-low-bg text-priority-low-text',
  [Priority.MEDIUM]: 'bg-priority-medium-bg text-priority-medium-text',
  [Priority.HIGH]: 'bg-priority-high-bg text-priority-high-text',
  [Priority.URGENT]: 'bg-priority-urgent-bg text-priority-urgent-text',
};

export function Badge({ children, variant = 'default', status, priority, className = '' }: BadgeProps) {
  let colorClass = 'bg-muted text-muted-foreground';
  if (variant === 'status' && status) colorClass = statusStyles[status];
  if (variant === 'priority' && priority) colorClass = priorityStyles[priority];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass} ${className}`}>
      {children}
    </span>
  );
}

// ============================================================
// Card
// ============================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', hover = false, padding = 'md', onClick }: CardProps) {
  return (
    <div
      className={`
        bg-card rounded-xl border border-border
        ${cardPadding[padding]}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ============================================================
// Input
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-11 px-3 text-base rounded-lg
              border bg-card text-foreground
              placeholder:text-ink-tertiary
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              transition-all duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-input-border'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ============================================================
// Textarea
// ============================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2.5 text-base rounded-lg
            border bg-card text-foreground
            placeholder:text-ink-tertiary
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-all duration-200 min-h-[100px] resize-y
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-input-border'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ============================================================
// Select
// ============================================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`
            w-full h-11 px-3 text-base rounded-lg
            border bg-card text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            transition-all duration-200 cursor-pointer
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-input-border'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ============================================================
// Avatar
// ============================================================

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${avatarSizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold ${avatarSizes[size]} ${getAvatarColor(name)} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}

// ============================================================
// Modal
// ============================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`relative bg-card rounded-xl border border-border shadow-lg w-full ${modalSizes[size]} max-h-[90vh] flex flex-col animate-scale-in`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Empty State
// ============================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-ink-tertiary">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

// ============================================================
// Progress Bar
// ============================================================

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, className = '', showLabel = true }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {value}/{max}
        </span>
      )}
    </div>
  );
}

// ============================================================
// Tabs
// ============================================================

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 border-b border-border overflow-x-auto ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2.5 text-sm font-medium whitespace-nowrap
            border-b-2 transition-all duration-200 cursor-pointer
            min-h-[44px]
            ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border-hover'
            }
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Metric Card (Dashboard)
// ============================================================

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function MetricCard({ title, value, icon, trend, className = '' }: MetricCardProps) {
  return (
    <Card className={`flex items-start justify-between ${className}`}>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-ink">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </p>
        )}
      </div>
      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </Card>
  );
}

// ============================================================
// Skeleton Loader
// ============================================================

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} />;
}

// ============================================================
// Dropdown
// ============================================================

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, isOpen, onToggle, align = 'right' }: DropdownProps) {
  return (
    <div className="relative">
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className={`absolute z-50 mt-2 min-w-[200px] bg-card border border-border rounded-xl shadow-lg py-1 animate-scale-in ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  icon,
  destructive = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left
        transition-colors cursor-pointer min-h-[44px]
        ${destructive ? 'text-red-600 hover:bg-red-50' : 'text-foreground hover:bg-muted'}
      `}
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {children}
    </button>
  );
}
