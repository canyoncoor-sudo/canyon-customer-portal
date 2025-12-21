"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./dashboard.css";

interface JobData {
  id: string;
  customer_name: string;
  job_address: string;
  status: string;
  home_photo_url?: string;
  customer_phone?: string;
  customer_email?: string;
  project_description?: string;
  proposal_data?: any;
  has_proposal?: boolean;
}

function DashboardContent() {
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const previewToken = searchParams.get('preview_token');

    if (previewToken) {
      // Admin is viewing as customer - fetch job data using the preview token
      setIsPreviewMode(true);
      fetchJobWithPreviewToken(previewToken);
    } else {
      // Normal customer login flow
      const jobData = localStorage.getItem("portal_job");
      const token = localStorage.getItem("portal_token");

      if (!jobData || !token) {
        router.push("/");
        return;
      }

      try {
        const parsedJob = JSON.parse(jobData);
        setJob(parsedJob);
      } catch (e) {
        console.error("Error parsing job data:", e);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }
  }, [router, searchParams]);

  const fetchJobWithPreviewToken = async (token: string) => {
    try {
      const res = await fetch('/api/customer/job', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch job data');
      }

      const data = await res.json();
      setJob(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching preview job:', error);
      alert('Failed to load customer preview');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (isPreviewMode) {
      // Navigate back to the job preview page
      router.push(`/admin/jobs/${job?.id}`);
    } else {
      localStorage.removeItem("portal_job");
      localStorage.removeItem("portal_token");
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your portal...</p>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="dashboard">
      {/* Admin Preview Banner */}
      {isPreviewMode && (
        <div className="preview-banner">
          <div className="preview-banner-content">
            <span>Admin Preview Mode - Viewing Client Portal: {job.customer_name}</span>
            <button onClick={() => router.push(`/admin/jobs/${job.id}`)} className="preview-close">
              Back to Admin
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">Canyon Construction Inc.</div>
          <button onClick={handleLogout} className="btn-logout">
            {isPreviewMode ? 'Back to Admin' : 'Logout'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Job Overview Card */}
          <div className="job-overview-card">
            <div className="job-photo">
              {job.home_photo_url ? (
                <img src={job.home_photo_url} alt="Project home" />
              ) : (
                <div className="photo-placeholder">
                  <span></span>
                  <p>Project Photo</p>
                </div>
              )}
            </div>
            <div className="job-info">
              <h1>{job.customer_name}</h1>
              <p className="job-address">{job.job_address}</p>
              <div className="status-badge status-active">{job.status}</div>
              {job.project_description && (
                <p className="job-description">{job.project_description}</p>
              )}
              {job.customer_phone && (
                <p className="contact-info">Phone: {job.customer_phone}</p>
              )}
              {job.customer_email && (
                <p className="contact-info">Email: {job.customer_email}</p>
              )}
            </div>
          </div>

          {/* Proposal Section - Show if proposal exists */}
          {job.has_proposal && job.proposal_data && (
            <div className="proposal-preview-section">
              <h2>Your Project Proposal</h2>
              <div className="proposal-card">
                <div className="proposal-header">
                  <h3>Proposal Details</h3>
                  <span className="proposal-status">Ready for Review</span>
                </div>
                <div className="proposal-content">
                  <div className="proposal-info-grid">
                    <div>
                      <strong>Total Amount:</strong>
                      <span className="proposal-amount">${job.proposal_data.total || 'TBD'}</span>
                    </div>
                    <div>
                      <strong>Scope:</strong>
                      <p>{job.proposal_data.scope || 'Detailed scope provided in proposal document'}</p>
                    </div>
                  </div>
                  {job.proposal_data.notes && (
                    <div className="proposal-notes">
                      <strong>Notes:</strong>
                      <p>{job.proposal_data.notes}</p>
                    </div>
                  )}
                  <div className="proposal-actions">
                    <button className="btn-view-proposal" onClick={() => window.open(`/dashboard/proposal/${job.id}`, '_blank')}>
                      View Full Proposal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Grid */}
          <div className="portal-navigation">
            <h2>Your Project Portal</h2>
            <div className="nav-grid">
              <a href="/dashboard/photos" className="nav-card">
                <div className="nav-icon" style={{backgroundColor: '#567A8D'}}></div>
                <h3>Project Photos</h3>
                <p>View your project</p>
              </a>

              <a href="/dashboard/quotes" className="nav-card">
                <div className="nav-icon" style={{backgroundColor: '#A45941'}}></div>
                <h3>Proposals</h3>
                <p>View your project's proposal</p>
              </a>

              <a href="/dashboard/subcontractors" className="nav-card">
                <div className="nav-icon" style={{backgroundColor: '#712A18'}}></div>
                <h3>Licensed Professionals</h3>
                <p>View your qualified trades</p>
              </a>

              <a href="/dashboard/payments" className="nav-card">
                <div className="nav-icon" style={{backgroundColor: '#454547'}}></div>
                <h3>Account Overview</h3>
                <p>Manage payments and view payment schedule</p>
              </a>

              <a href="/dashboard/documents" className="nav-card">
                <div className="nav-icon" style={{backgroundColor: '#567A8D'}}></div>
                <h3>Documents</h3>
                <p>Access transactions and project records</p>
              </a>

              <a href="/dashboard/timeline" className="nav-card">
                <div className="nav-icon" style={{backgroundColor: '#A45941'}}></div>
                <h3>Project Timeline</h3>
                <p>View project milestones and schedule</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your portal...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
