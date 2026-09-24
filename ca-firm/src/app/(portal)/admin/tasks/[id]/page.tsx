'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, FileText, MessageSquare, Upload, Check } from 'lucide-react';
import { Card, Badge, Button, Avatar, ProgressBar, Textarea } from '@/components/ui';
import { mockTasks, mockActivityLogs, mockDocuments } from '@/lib/mock-data';
import { TaskStatus, taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatDate, formatDateTime, formatRelativeDate, getDeadlineUrgency } from '@/lib/utils';

export default function TaskDetailPage() {
  const params = useParams();
  const task = mockTasks.find((t) => t.id === params.id);
  const [newNote, setNewNote] = useState('');

  if (!task) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Task not found</p>
        <Link href="/admin/tasks" className="text-primary text-sm mt-2 inline-block">← Back to Tasks</Link>
      </div>
    );
  }

  const taskLogs = mockActivityLogs.filter((l) => l.taskId === task.id);
  const taskDocs = mockDocuments.filter((d) => d.taskId === task.id);
  const completed = task.checklist?.filter(c => c.isCompleted).length || 0;
  const total = task.checklist?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/admin/tasks" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors mt-1">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-ink">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant="status" status={task.status}>{taskStatusLabels[task.status]}</Badge>
            <Badge variant="priority" priority={task.priority}>{priorityLabels[task.priority]}</Badge>
            <span className="text-xs text-muted-foreground">FY {task.financialYear}</span>
          </div>
        </div>
        {task.status === TaskStatus.UNDER_REVIEW && (
          <Button leftIcon={<Check className="w-4 h-4" />} className="bg-emerald-600 hover:bg-emerald-700">
            Approve & Mark Filed
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
              <span className="text-sm text-muted-foreground">{completed}/{total} completed</span>
            </div>
            <ProgressBar value={completed} max={total} showLabel={false} className="mb-4" />
            <div className="space-y-2">
              {task.checklist?.map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-border flex-shrink-0" />
                  )}
                  <span className={`text-sm ${item.isCompleted ? 'text-muted-foreground line-through' : 'text-ink'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
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
                    <p className="text-xs text-muted-foreground mt-0.5">{log.user?.name} • {formatDateTime(log.createdAt)}</p>
                  </div>
                </div>
              ))}
              {taskLogs.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
            </div>
            <div className="flex gap-2">
              <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="min-h-[60px]" />
            </div>
            <Button size="sm" className="mt-2" disabled={!newNote.trim()}>Add Note</Button>
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
                <dd className="text-sm text-ink font-medium">
                  <Link href={`/admin/clients/${task.clientId}`} className="hover:text-primary transition-colors">
                    {task.client?.entityName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Assigned To</dt>
                <dd className="flex items-center gap-2 mt-1">
                  {task.assignedTo ? (
                    <>
                      <Avatar name={task.assignedTo.name} size="sm" />
                      <span className="text-sm text-ink">{task.assignedTo.name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-red-500">Unassigned</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Due Date</dt>
                <dd className={`text-sm font-medium ${getDeadlineUrgency(task.dueDate) === 'overdue' ? 'text-red-600' : 'text-ink'}`}>
                  {formatDate(task.dueDate)}
                  <span className="block text-xs font-normal text-muted-foreground">{formatRelativeDate(task.dueDate)}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Created</dt>
                <dd className="text-sm text-muted-foreground">{formatDate(task.createdAt)}</dd>
              </div>
            </dl>
          </Card>

          {/* Documents */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">Documents</h3>
              <Button size="sm" variant="outline" leftIcon={<Upload className="w-3 h-3" />}>Upload</Button>
            </div>
            {taskDocs.length > 0 ? (
              <div className="space-y-2">
                {taskDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-ink truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(doc.createdAt)}</p>
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
