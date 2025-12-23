'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './jobs.css';

interface Job {
  id: number;
  customer_name: string;
  job_address: string;
  city: string;
  state: string;
  project_type: string;
  status: string;
  priority: string;
  created_at: string;
  estimated_budget?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = job.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.job_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.project_type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Lead': '#9A8C7A',
      'Active': '#567A8D',
      'On Hold': '#F4A261',
      'Completed': '#2A9D8F',
      'Cancelled': '#E76F51',
    };
    return colors[status] || '#454547';
  };

  const getPriorityBadge = (priority: string) => {
    if (!priority || priority === 'Normal') return null;
    const colors: { [key: string]: string } = {
      'High': '#E76F51',
      'Urgent': '#C1121F',
    };
    return (
      <span 
        className="priority-badge" 
        style={{ background: colors[priority] || '#454547' }}
      >
        {priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="jobs-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div className="header-left">
          <h1>Projects</h1>
          <p className="header-subtitle">Manage all jobs and project intakes</p>
        </div>
        <button 
          className="new-job-btn"
          onClick={() => router.push('/admin/jobs/new')}
        >
          + New Job Intake
        </button>
      </div>

      <div className="jobs-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by customer, address, or project type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-tabs">
          <button 
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            All ({jobs.length})
          </button>
          <button 
            className={filterStatus === 'Lead' ? 'active' : ''}
            onClick={() => setFilterStatus('Lead')}
          >
            Leads ({jobs.filter(j => j.status === 'Lead').length})
          </button>
          <button 
            className={filterStatus === 'Active' ? 'active' : ''}
            onClick={() => setFilterStatus('Active')}
          >
            Active ({jobs.filter(j => j.status === 'Active').length})
          </button>
          <button 
            className={filterStatus === 'Completed' ? 'active' : ''}
            onClick={() => setFilterStatus('Completed')}
          >
            Completed ({jobs.filter(j => j.status === 'Completed').length})
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <div className="no-jobs-icon">📋</div>
          <h3>No projects found</h3>
          <p>
            {searchQuery 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating a new job intake'}
          </p>
          {!searchQuery && (
            <button 
              className="new-job-btn"
              onClick={() => router.push('/admin/jobs/new')}
            >
              + New Job Intake
            </button>
          )}
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="job-card"
              onClick={() => router.push(`/admin/jobs/${job.id}`)}
            >
              <div className="job-card-header">
                <div className="job-card-status">
                  <span 
                    className="status-dot" 
                    style={{ background: getStatusColor(job.status) }}
                  ></span>
                  <span className="status-text">{job.status}</span>
                </div>
                {getPriorityBadge(job.priority)}
              </div>
              
              <h3 className="job-card-title">{job.customer_name}</h3>
              <p className="job-card-address">
                {job.job_address}, {job.city}, {job.state}
              </p>
              
              <div className="job-card-details">
                <div className="job-detail-item">
                  <span className="detail-label">Project Type:</span>
                  <span className="detail-value">{job.project_type || 'Not specified'}</span>
                </div>
                {job.estimated_budget && (
                  <div className="job-detail-item">
                    <span className="detail-label">Budget:</span>
                    <span className="detail-value">{job.estimated_budget}</span>
                  </div>
                )}
              </div>

              <div className="job-card-footer">
                <span className="job-date">
                  Created {new Date(job.created_at).toLocaleDateString()}
                </span>
                <span className="view-details">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
