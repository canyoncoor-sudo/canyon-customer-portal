'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SectionMenu from '../components/SectionMenu';
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
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'customer' | 'priority'>('date');
  const [showMenu, setShowMenu] = useState(false);
  const [showViewSection, setShowViewSection] = useState(false);
  const [showFiltersSection, setShowFiltersSection] = useState(false);
  const [showSortSection, setShowSortSection] = useState(false);
  const [showActionsSection, setShowActionsSection] = useState(false);
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

  // Apply filters and sorting
  const filteredJobs = jobs
    .filter(job => {
      const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
      const matchesSearch = job.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.job_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.project_type?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'customer') {
        return a.customer_name.localeCompare(b.customer_name);
      } else if (sortBy === 'priority') {
        const priorityOrder: { [key: string]: number } = { 'Urgent': 0, 'High': 1, 'Normal': 2 };
        return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      }
      return 0;
    });

  // Status counts for tabs
  const statusCounts = {
    all: jobs.length,
    Lead: jobs.filter(j => j.status === 'Lead').length,
    Active: jobs.filter(j => j.status === 'Active').length,
    Completed: jobs.filter(j => j.status === 'Completed').length,
    'On Hold': jobs.filter(j => j.status === 'On Hold').length,
  };

  // Menu sections configuration
  const menuSections = [
    {
      title: 'View',
      isOpen: showViewSection,
      onToggle: () => setShowViewSection(!showViewSection),
      content: (
        <div className="control-group">
          <div className="radio-group">
            <label className={viewMode === 'grid' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="grid"
                checked={viewMode === 'grid'}
                onChange={() => setViewMode('grid')}
              />
              <span>📱 Grid Cards</span>
            </label>
            <label className={viewMode === 'list' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="list"
                checked={viewMode === 'list'}
                onChange={() => setViewMode('list')}
              />
              <span>📋 List View</span>
            </label>
          </div>
        </div>
      )
    },
    {
      title: 'Filters',
      isOpen: showFiltersSection,
      onToggle: () => setShowFiltersSection(!showFiltersSection),
      content: (
        <>
          <div className="control-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses ({statusCounts.all})</option>
              <option value="Lead">Lead ({statusCounts.Lead})</option>
              <option value="Active">Active ({statusCounts.Active})</option>
              <option value="On Hold">On Hold ({statusCounts['On Hold']})</option>
              <option value="Completed">Completed ({statusCounts.Completed})</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Priority</label>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="Urgent">🔴 Urgent</option>
              <option value="High">🟠 High</option>
              <option value="Normal">⚪ Normal</option>
            </select>
          </div>

          <div className="control-group">
            <label>Search Projects</label>
            <input
              type="text"
              placeholder="Customer, address, project type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
            <div className="control-group">
              <button 
                className="btn-menu-action tertiary"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPriority('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )
    },
    {
      title: 'Sort',
      isOpen: showSortSection,
      onToggle: () => setShowSortSection(!showSortSection),
      content: (
        <div className="control-group">
          <div className="radio-group">
            <label className={sortBy === 'date' ? 'active' : ''}>
              <input 
                type="radio" 
                name="sortBy" 
                value="date"
                checked={sortBy === 'date'}
                onChange={() => setSortBy('date')}
              />
              <span>📅 Most Recent</span>
            </label>
            <label className={sortBy === 'customer' ? 'active' : ''}>
              <input 
                type="radio" 
                name="sortBy" 
                value="customer"
                checked={sortBy === 'customer'}
                onChange={() => setSortBy('customer')}
              />
              <span>🔤 Customer Name</span>
            </label>
            <label className={sortBy === 'priority' ? 'active' : ''}>
              <input 
                type="radio" 
                name="sortBy" 
                value="priority"
                checked={sortBy === 'priority'}
                onChange={() => setSortBy('priority')}
              />
              <span>⭐ Priority</span>
            </label>
          </div>
        </div>
      )
    },
    {
      title: 'Actions',
      isOpen: showActionsSection,
      onToggle: () => setShowActionsSection(!showActionsSection),
      content: (
        <>
          <div className="control-group">
            <button 
              className="btn-menu-action"
              onClick={() => {
                setShowMenu(false);
                router.push('/admin/jobs/new');
              }}
            >
              + New Job Intake
            </button>
          </div>
          
          <div className="control-group">
            <button 
              className="btn-menu-action tertiary"
              onClick={() => {
                setShowMenu(false);
                router.push('/admin/dashboard');
              }}
            >
              ← Return to Dashboard
            </button>
          </div>
        </>
      )
    }
  ];

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
      {showMenu && <div className="menu-backdrop" onClick={() => setShowMenu(false)} />}
      
      <SectionMenu
        sectionName="Projects"
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        sections={menuSections}
      />

      <div className="jobs-header">
        <div className="header-left">
          <button 
            className="btn-menu-hamburger"
            onClick={() => setShowMenu(!showMenu)}
            title="Control Center"
          >
            ☰
          </button>
          <div>
            <h1>Projects</h1>
            <p className="header-subtitle">Manage all jobs and project intakes</p>
          </div>
        </div>
        <button 
          className="new-job-btn"
          onClick={() => router.push('/admin/jobs/new')}
        >
          + New Job Intake
        </button>
      </div>

      {(filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
        <div className="active-filters-banner">
          <span>🔍 Filters Active: </span>
          {filterStatus !== 'all' && <span className="filter-tag">Status: {filterStatus}</span>}
          {filterPriority !== 'all' && <span className="filter-tag">Priority: {filterPriority}</span>}
          {searchQuery && <span className="filter-tag">Search: "{searchQuery}"</span>}
          <span className="results-count">({filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''})</span>
        </div>
      )}

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
