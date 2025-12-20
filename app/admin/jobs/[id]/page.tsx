'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './job-preview.css';

interface JobIntake {
  customer_secondary_phone: string | null;
  job_city: string | null;
  job_state: string | null;
  job_zip: string | null;
  project_type: string | null;
  work_description: string | null;
  estimated_budget: string | null;
  timeline: string | null;
  first_meeting_datetime: string | null;
  meeting_notes: string | null;
  lead_source: string | null;
  priority: string | null;
  internal_notes: string | null;
}

interface Job {
  id: string;
  job_address: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  access_code_type: string;
  is_active: boolean;
  status: string;
  created_at: string;
  intake: JobIntake | null;
}

export default function JobPreview() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/dashboard');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await res.json();
      setJob(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch job:', error);
      setLoading(false);
      alert('Failed to load job details');
      router.push('/admin/jobs');
    }
  };

  const handleBack = () => {
    router.push('/admin/jobs');
  };

  const handleViewProposal = () => {
    if (!job) return;
    // Navigate to view the existing proposal
    router.push(`/admin/jobs/${jobId}/proposal`);
  };

  const handleCreateProposal = () => {
    if (!job) return;
    
    // Navigate to proposal creation with pre-filled data via URL params
    const params = new URLSearchParams({
      jobId: job.id,
      customerName: job.customer_name,
      email: job.customer_email,
      phone: job.customer_phone,
      address: job.job_address,
      city: job.intake?.job_city || '',
      state: job.intake?.job_state || '',
      zip: job.intake?.job_zip || '',
      description: job.intake?.work_description || '',
    });
    
    router.push(`/admin/projects/new?${params.toString()}`);
  };

  const handleEdit = () => {
    router.push(`/admin/jobs/${jobId}/edit`);
  };

  const handleSendProposal = () => {
    router.push(`/admin/jobs/${jobId}/send-proposal`);
  };

  const handleViewAsCustomer = async () => {
    if (!job) return;

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      // Generate a customer portal token for this job
      const res = await fetch(`/api/admin/jobs/${jobId}/customer-preview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to generate customer preview');
      }

      const data = await res.json();

      // Open customer portal in new tab with the generated token
      const customerPortalUrl = `/dashboard?preview_token=${data.token}`;
      window.open(customerPortalUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate customer preview:', error);
      alert('Failed to open customer portal preview');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/dashboard');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete job');
      }

      alert('Job deleted successfully');
      router.push('/admin/jobs');
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="job-preview-container">
        <div className="loading">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-preview-container">
        <div className="error">Job not found</div>
      </div>
    );
  }

  return (
    <div className="job-preview-container">
      <div className="job-preview-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Jobs
        </button>
        <div className="header-actions">
          <button onClick={handleEdit} className="btn-edit">
            Edit Job
          </button>
          <button onClick={handleViewAsCustomer} className="btn-view-customer">
            👁️ View as Customer
          </button>
          <button onClick={handleSendProposal} className="btn-send-email">
            📧 Send Proposal Email
          </button>
          <button onClick={handleCreateProposal} className="btn-create-proposal">
            Create Proposal
          </button>
          <button onClick={handleDelete} className="btn-delete">
            🗑️ Delete Job
          </button>
        </div>
      </div>

      <div className="job-preview-content">
        <div className="preview-title-section">
          <h1>Job Details</h1>
          <div className="job-status">
            {job.status === 'proposal_created' ? (
              <button 
                onClick={handleViewProposal}
                className="status-badge-button proposal-created"
                title="Click to view proposal"
              >
                Proposal Created ✓
              </button>
            ) : (
              <span className={`status-badge ${job.is_active ? 'active' : 'inactive'}`}>
                {job.status || (job.is_active ? 'Active' : 'Inactive')}
              </span>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="info-section">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Customer Name</label>
              <div className="info-value">{job.customer_name}</div>
            </div>
            <div className="info-item">
              <label>Email</label>
              <div className="info-value">{job.customer_email}</div>
            </div>
            <div className="info-item">
              <label>Primary Phone</label>
              <div className="info-value">{job.customer_phone}</div>
            </div>
            {job.intake?.customer_secondary_phone && (
              <div className="info-item">
                <label>Secondary Phone</label>
                <div className="info-value">{job.intake.customer_secondary_phone}</div>
              </div>
            )}
          </div>
        </div>

        {/* Job Location */}
        <div className="info-section">
          <h2>Job Location</h2>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Address</label>
              <div className="info-value">{job.job_address}</div>
            </div>
            {job.intake?.job_city && (
              <div className="info-item">
                <label>City</label>
                <div className="info-value">{job.intake.job_city}</div>
              </div>
            )}
            {job.intake?.job_state && (
              <div className="info-item">
                <label>State</label>
                <div className="info-value">{job.intake.job_state}</div>
              </div>
            )}
            {job.intake?.job_zip && (
              <div className="info-item">
                <label>Zip Code</label>
                <div className="info-value">{job.intake.job_zip}</div>
              </div>
            )}
          </div>
        </div>

        {/* Project Details */}
        {job.intake && (
          <div className="info-section">
            <h2>Project Details</h2>
            <div className="info-grid">
              {job.intake.project_type && (
                <div className="info-item">
                  <label>Project Type</label>
                  <div className="info-value">{job.intake.project_type}</div>
                </div>
              )}
              {job.intake.estimated_budget && (
                <div className="info-item">
                  <label>Estimated Budget</label>
                  <div className="info-value">{job.intake.estimated_budget}</div>
                </div>
              )}
              {job.intake.timeline && (
                <div className="info-item">
                  <label>Timeline</label>
                  <div className="info-value">{job.intake.timeline}</div>
                </div>
              )}
              {job.intake.priority && (
                <div className="info-item">
                  <label>Priority</label>
                  <div className="info-value">
                    <span className={`priority-badge priority-${job.intake.priority}`}>
                      {job.intake.priority}
                    </span>
                  </div>
                </div>
              )}
              {job.intake.work_description && (
                <div className="info-item full-width">
                  <label>Work Description</label>
                  <div className="info-value description">{job.intake.work_description}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meeting Information */}
        {job.intake?.first_meeting_datetime && (
          <div className="info-section">
            <h2>First Meeting</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Date & Time</label>
                <div className="info-value">
                  {new Date(job.intake.first_meeting_datetime).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </div>
              </div>
              {job.intake.meeting_notes && (
                <div className="info-item full-width">
                  <label>Meeting Notes</label>
                  <div className="info-value description">{job.intake.meeting_notes}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lead Information */}
        {job.intake?.lead_source && (
          <div className="info-section">
            <h2>Lead Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Lead Source</label>
                <div className="info-value">{job.intake.lead_source}</div>
              </div>
              <div className="info-item">
                <label>Created Date</label>
                <div className="info-value">
                  {new Date(job.created_at).toLocaleDateString('en-US', {
                    dateStyle: 'long'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Internal Notes */}
        {job.intake?.internal_notes && (
          <div className="info-section">
            <h2>Internal Notes</h2>
            <div className="info-grid">
              <div className="info-item full-width">
                <div className="info-value description internal-notes">
                  {job.intake.internal_notes}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleCreateProposal} className="btn-create-proposal-large">
            📄 Create Proposal for this Job
          </button>
        </div>
      </div>
    </div>
  );
}
