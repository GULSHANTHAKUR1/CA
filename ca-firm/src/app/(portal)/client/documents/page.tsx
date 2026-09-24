'use client';

import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { mockDocumentRequests, mockDocuments } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const CLIENT_ID = 'cli_01';

export default function ClientDocumentsPage() {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadedIds, setUploadedIds] = useState<Set<string>>(new Set());

  const docRequests = mockDocumentRequests.filter((d) => d.clientId === CLIENT_ID);
  const pendingDocs = docRequests.filter((d) => !d.isUploaded && !uploadedIds.has(d.id));
  const uploadedDocs = [
    ...docRequests.filter((d) => d.isUploaded || uploadedIds.has(d.id)),
  ];

  const clientFacingDocs = mockDocuments.filter(
    (d) => d.clientId === CLIENT_ID && d.isClientFacing
  );

  const handleMockUpload = (docId: string) => {
    setUploadingId(docId);
    setTimeout(() => {
      setUploadedIds((prev) => new Set(prev).add(docId));
      setUploadingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Document Vault</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload requested documents and access your compliance records.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{pendingDocs.length}</p>
            <p className="text-xs text-muted-foreground">Pending Uploads</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{uploadedDocs.length}</p>
            <p className="text-xs text-muted-foreground">Uploaded</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{clientFacingDocs.length}</p>
            <p className="text-xs text-muted-foreground">From CA Firm</p>
          </div>
        </Card>
      </div>

      {/* Pending Document Requests */}
      {pendingDocs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Pending Document Requests
          </h2>
          <div className="space-y-3">
            {pendingDocs.map((doc) => (
              <Card key={doc.id} className="border-amber-200 bg-amber-50/30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Upload className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{doc.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Requested {formatDate(doc.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    leftIcon={<Upload className="w-3.5 h-3.5" />}
                    isLoading={uploadingId === doc.id}
                    onClick={() => handleMockUpload(doc.id)}
                    className="flex-shrink-0"
                  >
                    Upload File
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Documents */}
      {uploadedDocs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Uploaded Documents
          </h2>
          <div className="space-y-3">
            {uploadedDocs.map((doc) => (
              <Card key={doc.id} className="border-emerald-200 bg-emerald-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {uploadedIds.has(doc.id)
                        ? 'Just uploaded'
                        : `Uploaded ${formatDate(doc.uploadedAt!)}`}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">Uploaded ✓</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents from CA Firm */}
      {clientFacingDocs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            Documents from Your CA
          </h2>
          <div className="space-y-3">
            {clientFacingDocs.map((doc) => (
              <Card key={doc.id} hover>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Shared by {doc.uploadedBy?.name} • {formatDate(doc.createdAt)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pendingDocs.length === 0 && uploadedDocs.length === 0 && clientFacingDocs.length === 0 && (
        <Card className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-ink mb-1">No Documents Yet</p>
          <p className="text-sm text-muted-foreground">
            Documents shared by your CA firm will appear here.
          </p>
        </Card>
      )}
    </div>
  );
}
