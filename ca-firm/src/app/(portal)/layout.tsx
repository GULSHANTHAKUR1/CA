'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  LayoutDashboard,
  Users,
  ListTodo,
  UserCog,
  FolderOpen,
  MessageSquare,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  Loader2,
} from 'lucide-react';
import { Avatar, Dropdown, DropdownItem } from '@/components/ui';
import { Role } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { WhatsAppButton } from '@/components/public/layout-components';

// ============================================================
// Navigation Configurations
// ============================================================

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/admin/staff', label: 'Staff', icon: UserCog },
];

const workerNav = [
  { href: '/worker', label: 'Workspace', icon: LayoutDashboard },
  { href: '/worker/tasks', label: 'My Tasks', icon: ListTodo },
];

const clientNav = [
  { href: '/client', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/client/documents', label: 'Documents', icon: FolderOpen },
  { href: '/client/queries', label: 'Messages', icon: MessageSquare },
];

function getNavItems(role: Role) {
  switch (role) {
    case Role.ADMIN: return adminNav;
    case Role.WORKER: return workerNav;
    case Role.CLIENT: return clientNav;
  }
}

function getRoleLabel(role: Role) {
  switch (role) {
    case Role.ADMIN: return 'Admin Panel';
    case Role.WORKER: return 'Worker Panel';
    case Role.CLIENT: return 'Client Portal';
  }
}

// ============================================================
// Portal Layout
// ============================================================

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, role, isAuthenticated, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Show loading state while auth is being verified
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading portal...</span>
          </div>
        </div>
      </div>
    );
  }

  // Don't render portal if not authenticated (redirect handled by auth context)
  if (!isAuthenticated || !profile || !role) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  const navItems = getNavItems(role);
  const userName = profile.name;
  const userEmail = profile.email;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* ===== Desktop Sidebar ===== */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-border transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className={`h-16 border-b border-border flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}>
          {isCollapsed ? (
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
          ) : (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-bold text-ink block truncate">Sharma & Associates</span>
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">{getRoleLabel(role)}</span>
              </div>
            </Link>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' + role.toLowerCase() && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 rounded-lg transition-colors min-h-[44px]
                  ${isCollapsed ? 'justify-center px-2' : 'px-3'}
                  ${isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[44px] cursor-pointer"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            {!isCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ===== Mobile Sidebar Overlay ===== */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-border flex flex-col animate-slide-in-left">
            {/* Header */}
            <div className="h-16 border-b border-border flex items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-ink">Sharma & Associates</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role indicator */}
            <div className="px-4 py-3 bg-muted/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{getRoleLabel(role)}</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' + role.toLowerCase() && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-colors min-h-[44px]
                      ${isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User info at bottom */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar name={userName} size="sm" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-ink truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer mt-1 min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===== Main Content Area ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search (desktop) */}
            <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Role Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-muted rounded-lg px-3 py-1.5 mr-2">
              <span className={`inline-block w-2 h-2 rounded-full ${
                role === Role.ADMIN ? 'bg-blue-500' : role === Role.WORKER ? 'bg-emerald-500' : 'bg-violet-500'
              }`} />
              <span className="text-xs font-medium text-muted-foreground">
                {getRoleLabel(role)}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile */}
            <Dropdown
              isOpen={isProfileOpen}
              onToggle={() => setIsProfileOpen(!isProfileOpen)}
              trigger={
                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <Avatar name={userName} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-ink">{userName}</span>
                </button>
              }
            >
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-ink">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
                <p className="text-xs text-primary font-medium mt-1">{profile.role}</p>
              </div>
              <DropdownItem
                icon={<LogOut className="w-4 h-4" />}
                onClick={logout}
                destructive
              >
                Sign Out
              </DropdownItem>
            </Dropdown>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <WhatsAppButton />
    </div>
  );
}
