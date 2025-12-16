"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./timeline.css";

interface TimelineEvent {
  id: string;
  event_date: string;
  title: string;
  description: string | null;
  event_type: string;
  is_completed: boolean;
}

interface Job {
  id: string;
  job_address: string;
  customer_name: string;
  status: string;
  start_date: string | null;
  estimated_completion: string | null;
}

export default function TimelinePage() {
  const [job, setJob] = useState<Job | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const jobData = localStorage.getItem("portal_job");

    if (!token || !jobData) {
      router.push("/");
      return;
    }

    const parsedJob = JSON.parse(jobData);
    setJob(parsedJob);
    fetchTimeline(token, parsedJob.id);
  }, [router]);

  const fetchTimeline = async (token: string, jobId: string) => {
    try {
      const res = await fetch(`/api/timeline?job_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case "milestone": return "🎯";
      case "inspection": return "🔍";
      case "delivery": return "🚚";
      case "payment": return "💳";
      case "meeting": return "📅";
      default: return "📌";
    }
  };

  const calculateProgress = (): number => {
    if (events.length === 0) return 0;
    const completed = events.filter((e) => e.is_completed).length;
    return (completed / events.length) * 100;
  };

  const getDaysUntilCompletion = (): number | null => {
    if (!job?.estimated_completion) return null;
    const today = new Date();
    const completion = new Date(job.estimated_completion);
    const diff = completion.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  const progress = calculateProgress();
  const daysRemaining = getDaysUntilCompletion();

  return (
    <div className="timeline-page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Project Timeline</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {/* Project Info */}
          {job && (
            <div className="project-overview">
              <div className="overview-card">
                <div className="overview-label">Project Status</div>
                <div className="overview-value status">
                  <span className={`status-badge status-${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </div>
              </div>

              {job.start_date && (
                <div className="overview-card">
                  <div className="overview-label">Start Date</div>
                  <div className="overview-value">
                    {new Date(job.start_date).toLocaleDateString()}
                  </div>
                </div>
              )}

              {job.estimated_completion && (
                <div className="overview-card">
                  <div className="overview-label">Estimated Completion</div>
                  <div className="overview-value">
                    {new Date(job.estimated_completion).toLocaleDateString()}
                    {daysRemaining !== null && daysRemaining > 0 && (
                      <div className="days-remaining">
                        {daysRemaining} days remaining
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="overview-card">
                <div className="overview-label">Overall Progress</div>
                <div className="overview-value">
                  {progress.toFixed(0)}% Complete
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {events.length > 0 && (
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-stats">
                <span>{events.filter((e) => e.is_completed).length} completed</span>
                <span>•</span>
                <span>{events.length - events.filter((e) => e.is_completed).length} remaining</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h2>No Timeline Events Yet</h2>
              <p>Project milestones and events will appear here as they are scheduled.</p>
            </div>
          ) : (
            <div className="timeline">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`timeline-item ${event.is_completed ? "completed" : "pending"}`}
                >
                  <div className="timeline-marker">
                    <div className="marker-icon">{getEventIcon(event.event_type)}</div>
                    {index < events.length - 1 && <div className="marker-line"></div>}
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-date">
                      {new Date(event.event_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="timeline-card">
                      <div className="card-header">
                        <h3>{event.title}</h3>
                        <div className="event-type-badge">{event.event_type}</div>
                      </div>
                      {event.description && (
                        <p className="card-description">{event.description}</p>
                      )}
                      {event.is_completed && (
                        <div className="completion-badge">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
