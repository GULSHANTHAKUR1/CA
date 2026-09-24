'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Card, Button, Avatar } from '@/components/ui';
import { mockMessageThreads, mockUsers } from '@/lib/mock-data';
import { Role } from '@/lib/types';
import { formatDate, formatDateTime } from '@/lib/utils';

const CLIENT_ID = 'cli_01';
const clientUser = mockUsers.find((u) => u.id === 'usr_client_01')!;

export default function ClientQueriesPage() {
  const threads = mockMessageThreads.filter((t) => t.clientId === CLIENT_ID);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<
    { threadId: string; content: string; createdAt: string }[]
  >([]);

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThreadId) return;
    setSentMessages((prev) => [
      ...prev,
      {
        threadId: selectedThreadId,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewMessage('');
  };

  // Thread list view
  if (!selectedThread) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-ink">Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Communicate with your CA team about queries and updates.
          </p>
        </div>

        {threads.length === 0 ? (
          <Card className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-ink mb-1">No Messages Yet</p>
            <p className="text-sm text-muted-foreground">
              Your CA team will reach out to you here when needed.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const threadSentMsgs = sentMessages.filter((m) => m.threadId === thread.id);
              const displayLastMsg = threadSentMsgs.length > 0
                ? { sender: clientUser, content: threadSentMsgs[threadSentMsgs.length - 1].content, createdAt: threadSentMsgs[threadSentMsgs.length - 1].createdAt }
                : lastMsg;
              return (
                <Card
                  key={thread.id}
                  hover
                  onClick={() => setSelectedThreadId(thread.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-ink truncate pr-4">
                          {thread.subject}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(displayLastMsg?.createdAt || thread.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {displayLastMsg?.sender?.name || 'You'}: {displayLastMsg?.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {thread.messages.length + threadSentMsgs.length} messages
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Thread detail view
  const threadSentMsgs = sentMessages.filter((m) => m.threadId === selectedThread.id);

  return (
    <div className="space-y-0 animate-fade-in h-full flex flex-col">
      {/* Thread Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-0">
        <button
          onClick={() => setSelectedThreadId(null)}
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-ink truncate">{selectedThread.subject}</h1>
          <p className="text-xs text-muted-foreground">
            Started {formatDate(selectedThread.createdAt)} • {selectedThread.messages.length + threadSentMsgs.length} messages
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {selectedThread.messages.map((msg) => {
          const isClient = msg.senderRole === Role.CLIENT;
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isClient ? 'flex-row-reverse' : ''}`}
            >
              <Avatar name={msg.sender?.name || 'User'} size="sm" />
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  isClient
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-muted text-ink rounded-tl-sm'
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isClient ? 'text-blue-100' : 'text-primary'}`}>
                  {msg.sender?.name}
                </p>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`text-[10px] mt-2 ${
                    isClient ? 'text-blue-200' : 'text-muted-foreground'
                  }`}
                >
                  {formatDateTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Sent messages (demo) */}
        {threadSentMsgs.map((msg, i) => (
          <div key={`sent-${i}`} className="flex gap-3 flex-row-reverse">
            <Avatar name={clientUser.name} size="sm" />
            <div className="max-w-[75%] rounded-xl px-4 py-3 bg-primary text-white rounded-tr-sm">
              <p className="text-xs font-medium mb-1 text-blue-100">{clientUser.name}</p>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className="text-[10px] mt-2 text-blue-200">
                {formatDateTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compose */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 h-11 px-4 text-sm rounded-lg border border-input-border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            leftIcon={<Send className="w-4 h-4" />}
            disabled={!newMessage.trim()}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
