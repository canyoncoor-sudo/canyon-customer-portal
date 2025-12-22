'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

interface DashboardStats {
  totalCustomers: number;
  activeJobs: number;
  todayEvents: number;
  pendingDocuments: number;
  activeProfessionals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeJobs: 0,
    todayEvents: 0,
    pendingDocuments: 0,
    activeProfessionals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/');
        return;
      }

      const data = await res.json();
      const projects = data.projects || [];
      
      setStats({
        totalCustomers: projects.length,
        activeJobs: projects.filter((p: any) => p.is_active).length,
        todayEvents: 0,
        pendingDocuments: 0,
        activeProfessionals: 0,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="header-left">
            <h1>Canyon Admin Portal</h1>
            <p className="header-subtitle">Manage your business from one place</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="admin-nav-tabs">
        <button 
          className={`nav-tab ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-tab ${activeView === 'branding' ? 'active' : ''}`}
          onClick={() => setActiveView('branding')}
        >
          Branding
        </button>
        <button 
          className={`nav-tab ${activeView === 'clientdata' ? 'active' : ''}`}
          onClick={() => setActiveView('clientdata')}
        >
          Client Data
        </button>
        <button 
          className={`nav-tab ${activeView === 'access' ? 'active' : ''}`}
          onClick={() => setActiveView('access')}
        >
          Access Verification Center
        </button>
        <button 
          className={`nav-tab ${activeView === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveView('settings')}
        >
          Settings
        </button>
      </nav>

      <main className="admin-main">
        {/* OVERVIEW VIEW */}
        {activeView === 'overview' && (
          <>
            <div className="view-header">
              <h2>Business Overview</h2>
              <p>Key metrics and quick actions for your construction business</p>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card" onClick={() => router.push('/admin/customers')}>
                <div className="card-icon-block" style={{ background: '#567A8D' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Customers</h2>
                  <p className="card-subtitle">Manage customer portals & files</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.totalCustomers}</div>
                    <p className="card-label">Total Customers</p>
                  </div>
                </div>
                <button className="card-action">View All Customers →</button>
              </div>

              <div className="dashboard-card" onClick={() => router.push('/admin/jobs')}>
                <div className="card-icon-block" style={{ background: '#712A18' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Jobs & Projects</h2>
                  <p className="card-subtitle">Daily work & job tracking</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.activeJobs}</div>
                    <p className="card-label">Active Jobs</p>
                  </div>
                </div>
                <button className="card-action">View All Jobs →</button>
              </div>

              <div className="dashboard-card" onClick={() => router.push('/admin/calendar')}>
                <div className="card-icon-block" style={{ background: '#261312' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Calendar & Schedule</h2>
                  <p className="card-subtitle">Site visits, crews & tasks</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.todayEvents}</div>
                    <p className="card-label">Today's Events</p>
                  </div>
                </div>
                <button className="card-action">View Calendar →</button>
              </div>

              <div className="dashboard-card" onClick={() => router.push('/admin/documents')}>
                <div className="card-icon-block" style={{ background: '#454547' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Documents & Proposals</h2>
                  <p className="card-subtitle">Contracts, invoices & permits</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.pendingDocuments}</div>
                    <p className="card-label">Pending Documents</p>
                  </div>
                </div>
                <button className="card-action">View Documents →</button>
              </div>

              <div className="dashboard-card" onClick={() => router.push('/admin/professionals')}>
                <div className="card-icon-block" style={{ background: '#9A8C7A' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Licensed Professionals</h2>
                  <p className="card-subtitle">Subcontractors by trade</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.activeProfessionals}</div>
                    <p className="card-label">Active Professionals</p>
                  </div>
                </div>
                <button className="card-action">View Professionals →</button>
              </div>
            </div>

            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn" onClick={() => router.push('/admin/jobs/new')}>
                  <div className="qa-icon-block" style={{ background: '#567A8D' }}></div>
                  <span>New Job Intake</span>
                </button>
                <button className="quick-action-btn" onClick={() => router.push('/admin/projects/new')}>
                  <div className="qa-icon-block" style={{ background: '#712A18' }}></div>
                  <span>Create Proposal</span>
                </button>
                <button className="quick-action-btn" onClick={() => router.push('/admin/calendar')}>
                  <div className="qa-icon-block" style={{ background: '#261312' }}></div>
                  <span>Schedule Visit</span>
                </button>
                <button className="quick-action-btn" onClick={() => router.push('/admin/professionals/new')}>
                  <div className="qa-icon-block" style={{ background: '#9A8C7A' }}></div>
                  <span>Add Professional</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* BRANDING VIEW */}
        {activeView === 'branding' && (
          <>
            <div className="view-header">
              <h2>Branding & Marketing</h2>
              <p>Manage your brand assets, logos, and marketing materials</p>
            </div>
            <div className="content-placeholder">
              <div className="placeholder-icon">🎨</div>
              <h3>Branding Center Coming Soon</h3>
              <p>Upload and manage logos, brand colors, letterheads, and marketing templates</p>
            </div>
          </>
        )}

        {/* CLIENT DATA VIEW */}
        {activeView === 'clientdata' && (
          <>
            <div className="view-header">
              <h2>Client Data & Projects</h2>
              <p>Manage all client project data, jobs, and documents</p>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card" onClick={() => router.push('/admin/jobs')}>
                <div className="card-icon-block" style={{ background: '#712A18' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Jobs & Projects</h2>
                  <p className="card-subtitle">All active and completed projects</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.activeJobs}</div>
                    <p className="card-label">Active Jobs</p>
                  </div>
                </div>
                <button className="card-action">View Jobs →</button>
              </div>
              <div className="dashboard-card" onClick={() => router.push('/admin/documents')}>
                <div className="card-icon-block" style={{ background: '#454547' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Documents</h2>
                  <p className="card-subtitle">Contracts, proposals, invoices</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.pendingDocuments}</div>
                    <p className="card-label">Total Documents</p>
                  </div>
                </div>
                <button className="card-action">View Documents →</button>
              </div>
              <div className="dashboard-card" onClick={() => router.push('/admin/professionals')}>
                <div className="card-icon-block" style={{ background: '#9A8C7A' }}></div>
                <div className="card-content">
                  <h2 className="card-title">Professionals Network</h2>
                  <p className="card-subtitle">Licensed subcontractors</p>
                  <div className="card-stats">
                    <div className="card-count">{stats.activeProfessionals}</div>
                    <p className="card-label">Active Pros</p>
                  </div>
                </div>
                <button className="card-action">Manage Professionals →</button>
              </div>
            </div>
          </>
        )}

        {/* ACCESS VERIFICATION CENTER VIEW */}
        {activeView === 'access' && (
          <>
            <div className="view-header">
              <h2>Access Verification Center</h2>
              <p>Manage customer portal access codes and security</p>
            </div>
            <div className="content-placeholder">
              <div className="placeholder-icon">🔐</div>
              <h3>Access Code Management</h3>
              <p>Generate, update, and revoke customer portal access codes</p>
              <p className="placeholder-detail">View login history and manage access permissions</p>
            </div>
          </>
        )}

        {/* SETTINGS VIEW */}
        {activeView === 'settings' && (
          <>
            <div className="view-header">
              <h2>Settings</h2>
              <p>Configure your admin portal and business preferences</p>
            </div>
            <div className="content-placeholder">
              <div className="placeholder-icon">⚙️</div>
              <h3>Admin Settings</h3>
              <p>Configure notifications, integrations, and system preferences</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
