'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Users, Building2, User } from 'lucide-react';
import { Card, Badge, Avatar, Button, Input, Select } from '@/components/ui';
import { mockClients } from '@/lib/mock-data';
import { EntityType } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const filtered = mockClients.filter((c) => {
    const matchesSearch = !search || c.entityName.toLowerCase().includes(search.toLowerCase()) || c.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchesEntity = !entityFilter || c.entityType === entityFilter;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{mockClients.length} total clients</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Add Client</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-input-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="h-10 px-3 text-sm rounded-lg border border-input-border bg-card focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="">All Entity Types</option>
          {Object.values(EntityType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table */}
      <Card padding="none" className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Entity Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Contact</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">PAN</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">GSTIN</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/clients/${client.id}`} className="text-sm font-medium text-ink hover:text-primary transition-colors">
                    {client.entityName}
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <Badge>{client.entityType}</Badge>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-ink">{client.contactPerson}</p>
                  <p className="text-xs text-muted-foreground">{client.contactEmail}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono">{client.pan || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono text-xs">{client.gstin || '—'}</td>
                <td className="px-5 py-3.5">
                  {client.assignedWorker ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={client.assignedWorker.name} size="sm" />
                      <span className="text-sm text-muted-foreground">{client.assignedWorker.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((client) => (
          <Link key={client.id} href={`/admin/clients/${client.id}`}>
            <Card hover className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {client.entityType === EntityType.INDIVIDUAL ? (
                  <User className="w-5 h-5 text-primary" />
                ) : (
                  <Building2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{client.entityName}</p>
                <p className="text-xs text-muted-foreground">{client.contactPerson}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge>{client.entityType}</Badge>
                  {client.gstin && <span className="text-xs text-muted-foreground font-mono">{client.gstin}</span>}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
