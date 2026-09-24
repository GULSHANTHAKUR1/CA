// ============================================================
// Enums
// ============================================================

export enum Role {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
  CLIENT = 'CLIENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_ON_CLIENT = 'WAITING_ON_CLIENT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  COMPLETED = 'COMPLETED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum EntityType {
  INDIVIDUAL = 'Individual',
  PROPRIETORSHIP = 'Proprietorship',
  PARTNERSHIP = 'Partnership',
  LLP = 'LLP',
  PRIVATE_LIMITED = 'Pvt Ltd',
}

// ============================================================
// Core Models
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId?: string;
  user?: User;
  entityName: string;
  entityType: EntityType;
  pan?: string;
  gstin?: string;
  tan?: string;
  cin?: string;
  directorDins?: string[];
  authorizedSignatory?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  assignedWorkerId?: string;
  assignedWorker?: User;
  tasks?: Task[];
  documents?: Document[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  clientId: string;
  client?: Client;
  assignedToId?: string;
  assignedTo?: User;
  status: TaskStatus;
  priority: Priority;
  financialYear: string;
  dueDate: string;
  completedAt?: string;
  checklist?: TaskItem[];
  documents?: TaskDocument[];
  logs?: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  taskId: string;
  label: string;
  isCompleted: boolean;
}

export interface TaskDocument {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  clientId: string;
  taskId?: string;
  uploadedById: string;
  uploadedBy?: User;
  isClientFacing: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  user?: User;
  action: string;
  createdAt: string;
}

// ============================================================
// Public Site Models
// ============================================================

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceCategory: string;
  notes?: string;
  createdAt: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  processSteps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

// ============================================================
// Client Portal Models
// ============================================================

export interface DocumentRequest {
  id: string;
  clientId: string;
  title: string;
  description: string;
  isUploaded: boolean;
  uploadedFileUrl?: string;
  requestedAt: string;
  uploadedAt?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  sender?: User;
  senderRole: Role;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  clientId: string;
  subject: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardMetrics {
  totalClients: number;
  ongoingJobs: number;
  pendingReviews: number;
  unassignedTasks: number;
}

export interface ComplianceDeadline {
  id: string;
  title: string;
  dueDate: string;
  type: 'GST' | 'TDS' | 'ADVANCE_TAX' | 'ITR' | 'ROC' | 'OTHER';
  description: string;
  isRecurring: boolean;
}

// ============================================================
// Status Helpers
// ============================================================

export const taskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.WAITING_ON_CLIENT]: 'Waiting on Client',
  [TaskStatus.UNDER_REVIEW]: 'Under Review',
  [TaskStatus.COMPLETED]: 'Completed',
};

export const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: 'Low',
  [Priority.MEDIUM]: 'Medium',
  [Priority.HIGH]: 'High',
  [Priority.URGENT]: 'Urgent',
};
