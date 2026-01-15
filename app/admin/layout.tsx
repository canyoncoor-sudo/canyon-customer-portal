'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminMenuProvider, useAdminMenu } from './AdminMenuContext';
import SectionMenu from './components/SectionMenu';
import './admin.css';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const navigateTo = (path: string) => {
    setShowNavMenu(false);
    router.push(path);
  };

  // Don't show header on the admin landing page
  if (!mounted || pathname === '/admin') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      {showNavMenu && <div className="menu-backdrop" onClick={() => setShowNavMenu(false)} />}
      
      {showNavMenu && (
        <div className="hamburger-menu">
          <div className="hamburger-menu-header">
            <h3>Navigation</h3>
            <button className="btn-close-menu" onClick={() => setShowNavMenu(false)}>✕</button>
          </div>
          <nav className="hamburger-menu-nav">
            <button onClick={() => navigateTo('/admin/dashboard')}>
              Operations
            </button>
            <button onClick={() => navigateTo('/admin/calendar')}>
              Schedule
            </button>
            <button onClick={() => navigateTo('/admin/jobs')}>
              Projects
            </button>
            <button onClick={() => navigateTo('/admin/customers')}>
              Customers
            </button>
            <button onClick={() => navigateTo('/admin/documents')}>
              Documents
            </button>
            <button onClick={() => navigateTo('/admin/professionals')}>
              Licensed Professionals
            </button>
            <div className="hamburger-menu-divider"></div>
            <button onClick={handleLogout} className="logout-menu-item">
              Logout
            </button>
          </nav>
        </div>
      )}

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
          <button 
            className="hamburger-btn"
            onClick={() => setShowNavMenu(!showNavMenu)}
            title="Menu"
          >
            ☰
          </button>
        </div>
      </header>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminMenuProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminMenuProvider>
  );
}
