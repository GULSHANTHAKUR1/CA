'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ListTodo, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, Badge, Tabs, ProgressBar, MetricCard } from '@/components/ui';
import { mockTasks } from '@/lib/mock-data';
import { TaskStatus, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

const WORKER_ID = 'usr_worker_01';

export default function WorkerDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');

  const myTasks = mockTasks.filter((t) => t.assignedToId === WORKER_ID);
  const activeTasks = myTasks.filter((t) => t.status !== TaskStatus.COMPLETED);

  const filtered = statusFilter === 'all'
    ? activeTasks
    : myTasks.filter((t) => t.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const statusTabs = [
    { id: 'all', label: 'Active', count: activeTasks.length },
    { id: TaskStatus.TODO, label: 'To Do', count: myTasks.filter(t => t.status === TaskStatus.TODO).length },
    { id: TaskStatus.IN_PROGRESS, label: 'In Progress', count: myTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length },
    { id: TaskStatus.WAITING_ON_CLIENT, label: 'Waiting', count: myTasks.filter(t => t.status === TaskStatus.WAITING_ON_CLIENT).length },
    { id: TaskStatus.UNDER_REVIEW, label: 'Sent for Review', count: myTasks.filter(t => t.status === TaskStatus.UNDER_REVIEW).length },
    { id: TaskStatus.COMPLETED, label: 'Done', count: myTasks.filter(t => t.status === TaskStatus.COMPLETED).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Workspace</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Priya. Here are your assigned tasks.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Active Tasks" value={activeTasks.length} icon={<ListTodo className="w-5 h-5" />} />
        <MetricCard title="Due This Week" value={activeTasks.filter(t => { const d = (new Date(t.dueDate).getTime() - Date.now()) / 86400000; return d >= 0 && d <= 7; }).length} icon={<Clock className="w-5 h-5" />} />
        <MetricCard title="Completed" value={myTasks.filter(t => t.status === TaskStatus.COMPLETED).length} icon={<CheckCircle2 className="w-5 h-5" />} />
        <MetricCard title="Overdue" value={activeTasks.filter(t => new Date(t.dueDate) < new Date()).length} icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      <Tabs tabs={statusTabs} activeTab={statusFilter} onChange={setStatusFilter} />

      <div className="space-y-3">
        {sorted.map((task) => {
          const completed = task.checklist?.filter(c => c.isCompleted).length || 0;
          const total = task.checklist?.length || 0;
          const urgency = getDeadlineUrgency(task.dueDate);
          return (
            <Link key={task.id} href={`/worker/tasks/${task.id}`}>
              <Card hover>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.client?.entityName}</p>
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded-md ${
                    urgency === 'overdue' ? 'bg-red-100 text-red-700' :
                    urgency === 'urgent' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {formatRelativeDate(task.dueDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="status" status={task.status}>{taskStatusLabels[task.status]}</Badge>
                  <Badge variant="priority" priority={task.priority}>{priorityLabels[task.priority]}</Badge>
                </div>
                <ProgressBar value={completed} max={total} />
              </Card>
            </Link>
          );
        })}
        {sorted.length === 0 && (
          <Card className="text-center py-10">
            <p className="text-muted-foreground">No tasks in this category.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
