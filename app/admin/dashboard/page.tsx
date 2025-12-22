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
      
      // Calculate stats from projects
      setStats({
        totalCustomers: projects.length,
        activeJobs: projects.filter((p: any) => p.is_active).length,
        todayEvents: 0, // TODO: Implement calendar events
        pendingDocuments: 0, // TODO: Implement documents count
        activeProfessionals: 0, // TODO: Implement professionals count
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
            <h1>🏗️ Canyon Admin Portal</h1>
            <p className="header-subtitle">Welcome back! Here's your business overview.</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="admin-main">
        {/* Dashboard Cards Grid */}
        <div className="dashboard-grid">
          
          {/* CUSTOMERS CARD */}
          <div className="dashboard-card" onClick={() => router.push('/admin/customers')}>
            <div className="card-icon">👥</div>
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

          {/* JOBS & PROJECTS CARD */}
          <div className="dashboard-card" onClick={() => router.push('/admin/jobs')}>
            <div className="card-icon">🏗️</div>
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

          {/* CALENDAR & SCHEDULE CARD */}
          <div className="dashboard-card" onClick={() => router.push('/admin/calendar')}>
            <div className="card-icon">📅</div>
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

          {/* DOCUMENTS & PROPOSALS CARD */}
          <div className="dashboard-card" onClick={() => router.push('/admin/documents')}>
            <div className="card-icon">📄</div>
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

          {/* LICENSED PROFESSIONALS CARD */}
          <div className="dashboard-card" onClick={() => router.push('/admin/professionals')}>
            <div className="card-icon">🔧</div>
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

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => router.push('/admin/jobs/new')}>
              <span className="qa-icon">➕</span>
              <span>New Job Intake</span>
            </button>
            <button className="quick-action-btn" onClick={() => router.push('/admin/projects/new')}>
              <span className="qa-icon">📝</span>
              <span>Create Proposal</span>
            </button>
            <button className="quick-action-btn" onClick={() => router.push('/admin/calendar')}>
              <span className="qa-icon">🗓️</span>
              <span>Schedule Visit</span>
            </button>
            <button className="quick-action-btn" onClick={() => router.push('/admin/professionals/new')}>
              <span className="qa-icon">👷</span>
              <span>Add Professional</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
