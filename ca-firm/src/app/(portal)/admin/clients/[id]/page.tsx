'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Phone, Mail, FileText, Shield, Edit } from 'lucide-react';
import { Card, Badge, Tabs, Button, Avatar, ProgressBar } from '@/components/ui';
import { mockClients, mockTasks, mockDocuments } from '@/lib/mock-data';
import { taskStatusLabels, priorityLabels } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ClientDetailPage() {
  const params = useParams();
  const client = mockClients.find((c) => c.id === params.id);
  const [activeTab, setActiveTab] = useState('profile');

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Client not found</p>
        <Link href="/admin/clients" className="text-primary text-sm mt-2 inline-block">← Back to Clients</Link>
      </div>
    );
  }

  const clientTasks = mockTasks.filter((t) => t.clientId === client.id);
  const clientDocs = mockDocuments.filter((d) => d.clientId === client.id);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'compliance', label: 'Compliance Records' },
    { id: 'tasks', label: 'Tasks', count: clientTasks.length },
    { id: 'documents', label: 'Documents', count: clientDocs.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/clients" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ink">{client.entityName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{client.entityType}</Badge>
            {client.assignedWorker && <span className="text-xs text-muted-foreground">Assigned to {client.assignedWorker.name}</span>}
          </div>
        </div>
        <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>Edit</Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-ink mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Entity Details</h3>
            <dl className="space-y-3">
              {[
                ['Entity Name', client.entityName],
                ['Entity Type', client.entityType],
                ['Authorized Signatory', client.authorizedSignatory || '—'],
                ['Client Since', formatDate(client.createdAt)],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm text-ink font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <h3 className="font-semibold text-ink mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Contact</h3>
            <dl className="space-y-3">
              {[
                ['Contact Person', client.contactPerson],
                ['Email', client.contactEmail],
                ['Phone', client.contactPhone],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm text-ink font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      {activeTab === 'compliance' && (
        <Card>
          <h3 className="font-semibold text-ink mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Compliance Records</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['PAN', client.pan],
              ['GSTIN', client.gstin],
              ['TAN', client.tan],
              ['CIN', client.cin],
              ['Director DINs', client.directorDins?.join(', ')],
            ].map(([label, value]) => (
              <div key={label as string} className="bg-muted/50 rounded-lg p-3">
                <dt className="text-xs text-muted-foreground mb-1">{label}</dt>
                <dd className="text-sm text-ink font-mono font-medium">{value || '—'}</dd>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {clientTasks.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-muted-foreground">No tasks for this client yet.</p>
            </Card>
          ) : (
            clientTasks.map((task) => {
              const completed = task.checklist?.filter(c => c.isCompleted).length || 0;
              const total = task.checklist?.length || 0;
              return (
                <Link key={task.id} href={`/admin/tasks/${task.id}`}>
                  <Card hover className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-ink">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="status" status={task.status}>{taskStatusLabels[task.status]}</Badge>
                        <Badge variant="priority" priority={task.priority}>{priorityLabels[task.priority]}</Badge>
                      </div>
                      <ProgressBar value={completed} max={total} className="mt-2 max-w-xs" />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(task.dueDate)}</span>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-3">
          {clientDocs.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-muted-foreground">No documents for this client yet.</p>
            </Card>
          ) : (
            clientDocs.map((doc) => (
              <Card key={doc.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">Uploaded by {doc.uploadedBy?.name} • {formatDate(doc.createdAt)}</p>
                </div>
                {doc.isClientFacing && <Badge className="bg-green-50 text-green-700">Client Facing</Badge>}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
