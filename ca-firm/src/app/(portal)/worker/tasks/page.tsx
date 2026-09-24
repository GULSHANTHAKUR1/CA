'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ListTodo, Search } from 'lucide-react';
import { Card, Badge, Tabs, ProgressBar } from '@/components/ui';
import { mockTasks } from '@/lib/mock-data';
import { TaskStatus, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

const WORKER_ID = 'usr_worker_01';

export default function WorkerTasksPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const myTasks = mockTasks.filter((t) => t.assignedToId === WORKER_ID);
  const activeTasks = myTasks.filter((t) => t.status !== TaskStatus.COMPLETED);

  const filtered = myTasks.filter((t) => {
    const matchStatus =
      statusFilter === 'all'
        ? t.status !== TaskStatus.COMPLETED
        : t.status === statusFilter;
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.client?.entityName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const statusTabs = [
    { id: 'all', label: 'Active', count: activeTasks.length },
    {
      id: TaskStatus.TODO,
      label: 'To Do',
      count: myTasks.filter((t) => t.status === TaskStatus.TODO).length,
    },
    {
      id: TaskStatus.IN_PROGRESS,
      label: 'In Progress',
      count: myTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    },
    {
      id: TaskStatus.WAITING_ON_CLIENT,
      label: 'Waiting',
      count: myTasks.filter((t) => t.status === TaskStatus.WAITING_ON_CLIENT).length,
    },
    {
      id: TaskStatus.UNDER_REVIEW,
      label: 'Review',
      count: myTasks.filter((t) => t.status === TaskStatus.UNDER_REVIEW).length,
    },
    {
      id: TaskStatus.COMPLETED,
      label: 'Done',
      count: myTasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">My Tasks</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all tasks assigned to you.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-input-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <Tabs tabs={statusTabs} activeTab={statusFilter} onChange={setStatusFilter} />

      <div className="space-y-3">
        {sorted.map((task) => {
          const completed =
            task.checklist?.filter((c) => c.isCompleted).length || 0;
          const total = task.checklist?.length || 0;
          const urgency = getDeadlineUrgency(task.dueDate);
          return (
            <Link key={task.id} href={`/worker/tasks/${task.id}`}>
              <Card hover>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {task.client?.entityName} • FY {task.financialYear}
                    </p>
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
              </Card>
            </Link>
          );
        })}
        {sorted.length === 0 && (
          <Card className="text-center py-10">
            <ListTodo className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No tasks in this category.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
