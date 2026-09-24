'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  MessageSquare,
  Upload,
  Check,
} from 'lucide-react';
import { Card, Badge, Button, Avatar, ProgressBar, Textarea } from '@/components/ui';
import { mockTasks, mockActivityLogs, mockDocuments } from '@/lib/mock-data';
import { TaskStatus, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatDate, formatDateTime, formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

export default function WorkerTaskDetailPage() {
  const params = useParams();
  const task = mockTasks.find((t) => t.id === params.id);
  const [newNote, setNewNote] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (!task) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Task not found</p>
        <Link href="/worker" className="text-primary text-sm mt-2 inline-block">
          ← Back to Workspace
        </Link>
      </div>
    );
  }

  const taskLogs = mockActivityLogs.filter((l) => l.taskId === task.id);
  const taskDocs = mockDocuments.filter((d) => d.taskId === task.id);
  const checklist = task.checklist || [];
  const completed =
    checklist.filter((c) => c.isCompleted || checkedItems.has(c.id)).length;
  const total = checklist.length;

  const toggleCheckItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/worker"
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors mt-1"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-ink">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="status" status={task.status}>
              {taskStatusLabels[task.status]}
            </Badge>
            <Badge variant="priority" priority={task.priority}>
              {priorityLabels[task.priority]}
            </Badge>
            <span className="text-xs text-muted-foreground">FY {task.financialYear}</span>
          </div>
        </div>
        {task.status !== TaskStatus.COMPLETED && (
          <Button
            variant="outline"
            leftIcon={<Check className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            Submit for Review
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {task.description && (
            <Card>
              <h3 className="font-semibold text-ink mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </Card>
          )}

          {/* Checklist */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">Checklist</h3>
              <span className="text-sm text-muted-foreground">
                {completed}/{total} completed
              </span>
            </div>
            <ProgressBar value={completed} max={total} showLabel={false} className="mb-4" />
            <div className="space-y-2">
              {checklist.map((item) => {
                const isDone = item.isCompleted || checkedItems.has(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => !item.isCompleted && toggleCheckItem(item.id)}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-border flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        isDone ? 'text-muted-foreground line-through' : 'text-ink'
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>

          {/* Activity Log */}
          <Card>
            <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Activity & Notes
            </h3>
            <div className="space-y-4 mb-4">
              {taskLogs.map((log) => (
                <div key={log.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                  <Avatar name={log.user?.name || 'User'} size="sm" />
                  <div>
                    <p className="text-sm text-ink">{log.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {log.user?.name} • {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {taskLogs.length === 0 && (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note or update..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
            <Button size="sm" className="mt-2" disabled={!newNote.trim()}>
              Add Note
            </Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <Card>
            <h3 className="font-semibold text-ink mb-4">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-muted-foreground">Client</dt>
                <dd className="text-sm text-ink font-medium">{task.client?.entityName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Due Date</dt>
                <dd
                  className={`text-sm font-medium ${
                    getDeadlineUrgency(task.dueDate) === 'overdue'
                      ? 'text-red-600'
                      : 'text-ink'
                  }`}
                >
                  {formatDate(task.dueDate)}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {formatRelativeDate(task.dueDate)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <Badge variant="status" status={task.status}>
                    {taskStatusLabels[task.status]}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd className="mt-1">
                  <Badge variant="priority" priority={task.priority}>
                    {priorityLabels[task.priority]}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-sm text-muted-foreground">
                  {formatDate(task.createdAt)}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Documents */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">Documents</h3>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Upload className="w-3 h-3" />}
              >
                Upload
              </Button>
            </div>
            {taskDocs.length > 0 ? (
              <div className="space-y-2">
                {taskDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-ink truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents attached.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
