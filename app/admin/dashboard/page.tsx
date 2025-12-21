'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

interface Project {
  id: string;
  customer_name: string;
  job_address: string;
  status: string;
  access_code_type: string;
  access_code_expires_at: string | null;
  is_active: boolean;
  created_at: string;
  proposal_accepted?: boolean;
  unread_message_count?: number;
  new_customer_photos?: number;
  last_customer_activity?: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'proposals' | 'closed'>('proposals');
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
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
      setProjects(data.projects || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'active') return p.is_active && p.access_code_type === 'active';
    if (filter === 'proposals') return p.access_code_type === 'proposal';
    if (filter === 'closed') return !p.is_active;
    return true;
  });

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getActionCount = (project: Project) => {
    let count = 0;
    if (project.proposal_accepted) count++;
    if (project.unread_message_count) count += project.unread_message_count;
    if (project.new_customer_photos) count += project.new_customer_photos;
    return count;
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/admin/jobs/${projectId}`);
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Canyon Admin Portal</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="dashboard-header">
          <h2>Customer Projects</h2>

        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'proposals' ? 'active' : ''}
            onClick={() => setFilter('proposals')}
          >
            All Proposals ({projects.filter(p => p.access_code_type === 'proposal').length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({projects.filter(p => p.is_active && p.access_code_type === 'active').length})
          </button>
          <button 
            className={filter === 'closed' ? 'active' : ''}
            onClick={() => setFilter('closed')}
          >
            Closed ({projects.filter(p => !p.is_active).length})
          </button>
          <button 
            onClick={() => router.push('/admin/intake')}
            className="nav-button btn-new-job"
          >
            + New Job
          </button>
          <button 
            onClick={() => router.push('/admin/documents')}
            className="nav-button"
          >
            Documents
          </button>
          <button 
            onClick={() => router.push('/admin/professionals')}
            className="nav-button"
          >
            Licensed Professionals
          </button>
        </div>

        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Address</th>
                <th>Status</th>
                <th>Type</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(project => {
                const actionCount = getActionCount(project);
                return (
                  <tr 
                    key={project.id}
                    onClick={() => handleRowClick(project.id)}
                    className="clickable-row"
                  >
                    <td>{project.customer_name}</td>
                    <td>{project.job_address}</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge type-${project.access_code_type}`}>
                        {project.access_code_type === 'proposal' ? 'Proposal' : 'Active Job'}
                      </span>
                    </td>
                    <td>
                      {project.access_code_expires_at ? (
                        <span className={isExpired(project.access_code_expires_at) ? 'expired' : ''}>
                          {new Date(project.access_code_expires_at).toLocaleDateString()}
                          {isExpired(project.access_code_expires_at) && ' (Expired)'}
                        </span>
                      ) : (
                        <span>Never</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-notifications">
                        {actionCount > 0 ? (
                          <>
                            <span className="notification-badge">{actionCount}</span>
                            <div className="action-details">
                              {project.proposal_accepted && (
                                <div className="action-item">✓ Proposal Accepted</div>
                              )}
                              {(project.unread_message_count ?? 0) > 0 && (
                                <div className="action-item">
                                  {project.unread_message_count} New Message{(project.unread_message_count ?? 0) > 1 ? 's' : ''}
                                </div>
                              )}
                              {(project.new_customer_photos ?? 0) > 0 && (
                                <div className="action-item">
                                  {project.new_customer_photos} New Photo{(project.new_customer_photos ?? 0) > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="no-actions">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="empty-state">
              <p>No projects found</p>
              {filter !== 'proposals' && (
                <button 
                  onClick={() => router.push('/admin/projects/new')}
                  className="btn-primary"
                >
                  Create Your First Project
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
