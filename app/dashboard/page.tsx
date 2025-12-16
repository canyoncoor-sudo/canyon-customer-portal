"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
}

export default function DashboardPage() {
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get job data from localStorage (set during login)
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("portal_job");
    localStorage.removeItem("portal_token");
    router.push("/");
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
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">🏗️ Canyon Construction Inc.</div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
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
                  <span>🏠</span>
                  <p>Project Photo</p>
                </div>
              )}
            </div>
            <div className="job-info">
              <h1>{job.customer_name}</h1>
              <p className="job-address">📍 {job.job_address}</p>
              <div className="status-badge status-active">{job.status}</div>
              {job.project_description && (
                <p className="job-description">{job.project_description}</p>
              )}
              {job.customer_phone && (
                <p className="contact-info">📞 {job.customer_phone}</p>
              )}
              {job.customer_email && (
                <p className="contact-info">✉️ {job.customer_email}</p>
              )}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="portal-navigation">
            <h2>Your Project Portal</h2>
            <div className="nav-grid">
              <a href="/dashboard/photos" className="nav-card">
                <div className="nav-icon">📸</div>
                <h3>Project Photos</h3>
                <p>View your project</p>
              </a>

              <a href="/dashboard/quotes" className="nav-card">
                <div className="nav-icon">📄</div>
                <h3>Proposals</h3>
                <p>View your project's proposal</p>
              </a>

              <a href="/dashboard/subcontractors" className="nav-card">
                <div className="nav-icon">👷</div>
                <h3>Licensed Professionals</h3>
                <p>View your qualified trades</p>
              </a>

              <a href="/dashboard/payments" className="nav-card">
                <div className="nav-icon">💳</div>
                <h3>Account Overview</h3>
                <p>Manage payments and view payment schedule</p>
              </a>

              <a href="/dashboard/documents" className="nav-card">
                <div className="nav-icon">📋</div>
                <h3>Documents</h3>
                <p>Access transactions and project records</p>
              </a>

              <a href="/dashboard/timeline" className="nav-card">
                <div className="nav-icon">📅</div>
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
