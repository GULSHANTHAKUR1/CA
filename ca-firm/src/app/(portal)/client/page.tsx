'use client';

import React from 'react';
import Link from 'next/link';
import {
  ListTodo,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Upload,
  MessageSquare,
} from 'lucide-react';
import { Card, MetricCard, Badge, ProgressBar } from '@/components/ui';
import {
  mockTasks,
  mockClients,
  mockDocumentRequests,
  mockMessageThreads,
} from '@/lib/mock-data';
import { TaskStatus, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatDate, formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

const CLIENT_ID = 'cli_01';

export default function ClientDashboard() {
  const client = mockClients.find((c) => c.id === CLIENT_ID);
  const myTasks = mockTasks.filter((t) => t.clientId === CLIENT_ID);
  const activeTasks = myTasks.filter((t) => t.status !== TaskStatus.COMPLETED);
  const completedTasks = myTasks.filter((t) => t.status === TaskStatus.COMPLETED);
  const pendingDocs = mockDocumentRequests.filter(
    (d) => d.clientId === CLIENT_ID && !d.isUploaded
  );
  const unreadThreads = mockMessageThreads.filter((t) => t.clientId === CLIENT_ID);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Welcome back, {client?.contactPerson}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {client?.entityName} — Here&apos;s your compliance overview.
        </p>
      </div>

      {/* Pending Document Alert */}
      {pendingDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Upload className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {pendingDocs.length} document{pendingDocs.length > 1 ? 's' : ''} pending upload
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {pendingDocs.map((d) => d.title).join(' • ')}
            </p>
          </div>
          <Link
            href="/client/documents"
            className="text-amber-700 text-sm font-medium hover:underline whitespace-nowrap"
          >
            Upload Now →
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <MetricCard
          title="Active Tasks"
          value={activeTasks.length}
          icon={<ListTodo className="w-5 h-5" />}
        />
        <MetricCard
          title="Pending Docs"
          value={pendingDocs.length}
          icon={<Upload className="w-5 h-5" />}
        />
        <MetricCard
          title="Completed"
          value={completedTasks.length}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <MetricCard
          title="Messages"
          value={unreadThreads.length}
          icon={<MessageSquare className="w-5 h-5" />}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <Card padding="none" className="lg:col-span-2">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-ink">Your Active Tasks</h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {activeTasks.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-muted-foreground">All tasks are up to date!</p>
              </div>
            ) : (
              activeTasks.map((task) => {
                const completed = task.checklist?.filter((c) => c.isCompleted).length || 0;
                const total = task.checklist?.length || 0;
                const urgency = getDeadlineUrgency(task.dueDate);
                return (
                  <div key={task.id} className="p-5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-ink">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded-md ${
                          urgency === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : urgency === 'urgent'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {formatRelativeDate(task.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="status" status={task.status}>
                        {taskStatusLabels[task.status]}
                      </Badge>
                      <Badge variant="priority" priority={task.priority}>
                        {priorityLabels[task.priority]}
                      </Badge>
                    </div>
                    <ProgressBar value={completed} max={total} />
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Document Requests */}
        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-ink">Document Requests</h2>
            </div>
            <Link
              href="/client/documents"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-5 space-y-3">
            {mockDocumentRequests
              .filter((d) => d.clientId === CLIENT_ID)
              .slice(0, 5)
              .map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    doc.isUploaded
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-amber-200 bg-amber-50/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      doc.isUploaded ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}
                  >
                    {doc.isUploaded ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {doc.isUploaded
                        ? `Uploaded ${formatDate(doc.uploadedAt!)}`
                        : `Requested ${formatDate(doc.requestedAt)}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Recent Messages */}
      {unreadThreads.length > 0 && (
        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-ink">Recent Messages</h2>
            </div>
            <Link
              href="/client/queries"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {unreadThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <Link
                  key={thread.id}
                  href="/client/queries"
                  className="flex items-start gap-3 p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{thread.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {lastMsg?.sender?.name}: {lastMsg?.content}
                    </p>
                    <p className="text-xs text-ink-tertiary mt-1">{formatDate(thread.updatedAt)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
