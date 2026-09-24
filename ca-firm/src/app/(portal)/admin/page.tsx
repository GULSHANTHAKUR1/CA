'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ListTodo,
  Clock,
  AlertCircle,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { Card, MetricCard, Badge, Avatar, ProgressBar, Tabs } from '@/components/ui';
import {
  mockDashboardMetrics,
  mockTasks,
  mockComplianceDeadlines,
  mockActivityLogs,
  mockClients,
} from '@/lib/mock-data';
import { TaskStatus, Priority, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatDate, formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

const urgencyColors = {
  overdue: 'bg-red-100 text-red-700 border-red-200',
  urgent: 'bg-amber-100 text-amber-700 border-amber-200',
  soon: 'bg-blue-100 text-blue-700 border-blue-200',
  normal: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AdminDashboard() {
  const [calendarTab, setCalendarTab] = useState('upcoming');

  const activeTasks = mockTasks.filter((t) => t.status !== TaskStatus.COMPLETED);
  const urgentTasks = activeTasks.filter(
    (t) => t.priority === Priority.URGENT || t.priority === Priority.HIGH
  );

  // Tasks due in next 3 days
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const dueSoon = activeTasks.filter(
    (t) => new Date(t.dueDate) <= threeDaysLater && new Date(t.dueDate) >= now
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, CA Rajesh Sharma. Here&apos;s your firm overview.
        </p>
      </div>

      {/* Deadline Alert Bar */}
      {dueSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {dueSoon.length} task{dueSoon.length > 1 ? 's' : ''} due within 3 days
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {dueSoon.map(t => t.title).join(' • ')}
            </p>
          </div>
          <Link href="/admin/tasks" className="text-amber-700 text-sm font-medium hover:underline whitespace-nowrap">
            View All →
          </Link>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <MetricCard
          title="Total Clients"
          value={mockDashboardMetrics.totalClients}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Ongoing Jobs"
          value={mockDashboardMetrics.ongoingJobs}
          icon={<ListTodo className="w-5 h-5" />}
        />
        <MetricCard
          title="Pending Reviews"
          value={mockDashboardMetrics.pendingReviews}
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Unassigned Tasks"
          value={mockDashboardMetrics.unassignedTasks}
          icon={<AlertCircle className="w-5 h-5" />}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Calendar */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-ink">Compliance Calendar</h2>
            </div>
            <Tabs
              tabs={[
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'past', label: 'Past' },
              ]}
              activeTab={calendarTab}
              onChange={setCalendarTab}
              className="border-b-0"
            />
          </div>
          <div className="p-5 space-y-3">
            {mockComplianceDeadlines
              .filter((d) => {
                const isPast = new Date(d.dueDate) < now;
                return calendarTab === 'past' ? isPast : !isPast;
              })
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((deadline) => {
                const urgency = getDeadlineUrgency(deadline.dueDate);
                return (
                  <div
                    key={deadline.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border ${urgencyColors[urgency]}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/80 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      <div className="text-center">
                        <p className="text-[10px] uppercase leading-none opacity-70">
                          {new Date(deadline.dueDate).toLocaleDateString('en-IN', { month: 'short' })}
                        </p>
                        <p className="text-lg leading-tight">
                          {new Date(deadline.dueDate).getDate()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{deadline.title}</p>
                      <p className="text-xs opacity-80 truncate">{deadline.description}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/50 whitespace-nowrap">
                      {deadline.type}
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-ink">Recent Activity</h2>
          </div>
          <div className="p-5 space-y-4">
            {mockActivityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex gap-3">
                <Avatar name={log.user?.name || 'User'} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink leading-snug">{log.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {log.user?.name} • {formatDate(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Tasks Overview */}
      <Card padding="none">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-ink">Active Tasks</h2>
          </div>
          <Link href="/admin/tasks" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Task</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Client</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Assigned To</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Priority</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Due Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {activeTasks.slice(0, 8).map((task) => {
                const completed = task.checklist?.filter((c) => c.isCompleted).length || 0;
                const total = task.checklist?.length || 0;
                return (
                  <tr key={task.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/tasks/${task.id}`} className="text-sm font-medium text-ink hover:text-primary transition-colors">
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {task.client?.entityName}
                    </td>
                    <td className="px-5 py-3.5">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={task.assignedTo.name} size="sm" />
                          <span className="text-sm text-muted-foreground">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="status" status={task.status}>
                        {taskStatusLabels[task.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="priority" priority={task.priority}>
                        {priorityLabels[task.priority]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm ${getDeadlineUrgency(task.dueDate) === 'overdue' ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                        {formatRelativeDate(task.dueDate)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 w-32">
                      <ProgressBar value={completed} max={total} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden p-4 space-y-3">
          {activeTasks.slice(0, 6).map((task) => {
            const completed = task.checklist?.filter((c) => c.isCompleted).length || 0;
            const total = task.checklist?.length || 0;
            return (
              <Link
                key={task.id}
                href={`/admin/tasks/${task.id}`}
                className="block bg-muted/30 rounded-xl p-4 card-hover border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-ink flex-1 pr-2">{task.title}</p>
                  <Badge variant="priority" priority={task.priority} className="flex-shrink-0">
                    {priorityLabels[task.priority]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{task.client?.entityName}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="status" status={task.status}>
                    {taskStatusLabels[task.status]}
                  </Badge>
                  <span className={`text-xs ${getDeadlineUrgency(task.dueDate) === 'overdue' ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                    {formatRelativeDate(task.dueDate)}
                  </span>
                </div>
                <ProgressBar value={completed} max={total} className="mt-3" />
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
