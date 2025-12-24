'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  // Don't show header on the admin landing page
  if (!mounted || pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <button onClick={() => router.back()} className="admin-back-btn" title="Go back">
              ← Back
            </button>
            <div className="admin-header-text">
              <h1 className="admin-header-title">Canyon Admin Portal</h1>
              <p className="admin-header-subtitle">Manage business from one place</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
        <nav className="admin-nav">
          <button
            className={`admin-nav-btn ${isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={() => router.push('/admin/dashboard')}
          >
            Operations
          </button>
          <button
            className={`admin-nav-btn ${isActive('/admin/calendar') ? 'active' : ''}`}
            onClick={() => router.push('/admin/calendar')}
          >
            Schedule
          </button>
          <button
            className={`admin-nav-btn ${isActive('/admin/jobs') ? 'active' : ''}`}
            onClick={() => router.push('/admin/jobs')}
          >
            Projects
          </button>
          <button
            className={`admin-nav-btn ${isActive('/admin/customers') ? 'active' : ''}`}
            onClick={() => router.push('/admin/customers')}
          >
            Customers
          </button>
          <button
            className={`admin-nav-btn ${isActive('/admin/documents') ? 'active' : ''}`}
            onClick={() => router.push('/admin/documents')}
          >
            Documents
          </button>
          <button
            className={`admin-nav-btn ${isActive('/admin/professionals') ? 'active' : ''}`}
            onClick={() => router.push('/admin/professionals')}
          >
            Licensed Professionals
          </button>
        </nav>
      </header>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
