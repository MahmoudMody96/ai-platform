// =============================================
// Admin Layout - Sidebar
// =============================================

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Wrench, 
  FileText, 
  FolderTree, 
  Users, 
  MessageSquare, 
  Key, 
  Settings, 
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const navItems = [
  { label: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
  { label: 'الأدوات', href: '/admin/tools', icon: Wrench },
  { label: 'المقالات', href: '/admin/articles', icon: FileText },
  { label: 'الفئات', href: '/admin/categories', icon: FolderTree },
  { label: 'المستخدمين', href: '/admin/users', icon: Users },
  { label: 'التعليقات', href: '/admin/comments', icon: MessageSquare },
  { label: 'API', href: '/admin/api', icon: Key },
  { label: 'الإعدادات', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 h-screen bg-card border-l border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg">AI Platform</span>
            <p className="text-xs text-muted-foreground">لوحة التحكم</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary-100 text-primary-700"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {isActive && <ChevronRight className="w-4 h-4 mr-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <LayoutDashboard className="w-5 h-5" />
          عرض الموقع
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-error hover:bg-error/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}