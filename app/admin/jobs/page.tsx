'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './jobs.css';

interface Job {
  id: string;
  job_address: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  access_code_type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin');
        return;
      }

      const data = await res.json();
      setJobs(data.projects || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const handleAddJob = () => {
    // TODO: Navigate to add job page
    alert('Add job functionality coming soon');
  };

  const handleViewJob = (jobId: string) => {
    // TODO: Navigate to job detail page
    alert(`View job ${jobId} - Coming soon`);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'active') return job.is_active;
    if (filter === 'inactive') return !job.is_active;
    return true;
  });

  if (loading) {
    return <div className="jobs-loading">Loading jobs...</div>;
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="header-actions">
          <button onClick={handleAddJob} className="btn-add">
            + Add Job
          </button>
        </div>
      </div>

      <div className="jobs-content">
        <div className="jobs-title-section">
          <h1>All Jobs</h1>
          <p className="jobs-subtitle">
            Manage all customer jobs and project files
          </p>
        </div>

        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({jobs.filter(j => j.is_active).length})
          </button>
          <button
            className={filter === 'inactive' ? 'active' : ''}
            onClick={() => setFilter('inactive')}
          >
            Inactive ({jobs.filter(j => !j.is_active).length})
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No jobs found</h3>
            <p>Get started by adding your first job</p>
            <button onClick={handleAddJob} className="btn-add">
              + Add Job
            </button>
          </div>
        ) : (
          <div className="jobs-table">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Job Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id}>
                    <td className="customer-name">{job.customer_name}</td>
                    <td>{job.job_address}</td>
                    <td>{job.customer_phone || '—'}</td>
                    <td>{job.customer_email || '—'}</td>
                    <td>
                      <span className={`status-badge ${job.is_active ? 'active' : 'inactive'}`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(job.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className="btn-view"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
