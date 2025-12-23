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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
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
            <h2 className="card-title">Projects</h2>
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
            <h2 className="card-title">Schedule</h2>
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
            <h2 className="card-title">Documents</h2>
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
    </div>
  );
}
