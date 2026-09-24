'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, Badge, Avatar, Button, Tabs, ProgressBar, Modal, Input, Select, Textarea } from '@/components/ui';
import { mockTasks, mockClients, mockUsers } from '@/lib/mock-data';
import { TaskStatus, Priority, Role, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = mockTasks.filter((t) => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.client?.entityName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusTabs = [
    { id: 'all', label: 'All', count: mockTasks.length },
    { id: TaskStatus.TODO, label: 'To Do', count: mockTasks.filter(t => t.status === TaskStatus.TODO).length },
    { id: TaskStatus.IN_PROGRESS, label: 'In Progress', count: mockTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length },
    { id: TaskStatus.WAITING_ON_CLIENT, label: 'Waiting', count: mockTasks.filter(t => t.status === TaskStatus.WAITING_ON_CLIENT).length },
    { id: TaskStatus.UNDER_REVIEW, label: 'Review', count: mockTasks.filter(t => t.status === TaskStatus.UNDER_REVIEW).length },
    { id: TaskStatus.COMPLETED, label: 'Done', count: mockTasks.filter(t => t.status === TaskStatus.COMPLETED).length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Task Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Create, assign, and track compliance tasks</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>Create Task</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-input-border bg-card focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <Tabs tabs={statusTabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task) => {
          const completed = task.checklist?.filter(c => c.isCompleted).length || 0;
          const total = task.checklist?.length || 0;
          const urgency = getDeadlineUrgency(task.dueDate);
          return (
            <Link key={task.id} href={`/admin/tasks/${task.id}`}>
              <Card hover className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.client?.entityName} • FY {task.financialYear}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="status" status={task.status}>{taskStatusLabels[task.status]}</Badge>
                    <Badge variant="priority" priority={task.priority}>{priorityLabels[task.priority]}</Badge>
                    <span className={`text-xs ${urgency === 'overdue' ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                      {formatRelativeDate(task.dueDate)}
                    </span>
                  </div>
                  <ProgressBar value={completed} max={total} className="mt-2 max-w-xs" />
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  {task.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={task.assignedTo.name} size="sm" />
                      <span className="text-xs text-muted-foreground sm:hidden">{task.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">Unassigned</span>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Task" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
          <Select label="Client" placeholder="Select client..." options={mockClients.map(c => ({ value: c.id, label: c.entityName }))} />
          <Input label="Task Title" placeholder="e.g., Q3 GSTR-3B Filing" />
          <Textarea label="Description" placeholder="Brief description of the task..." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Assignee" placeholder="Select worker..." options={mockUsers.filter(u => u.role === Role.WORKER && u.isActive).map(u => ({ value: u.id, label: u.name }))} />
            <Select label="Priority" options={Object.values(Priority).map(p => ({ value: p, label: priorityLabels[p] }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Due Date" type="date" />
            <Input label="Financial Year" placeholder="e.g., 2025-2026" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
