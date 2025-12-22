'use client';

import { useRouter } from 'next/navigation';
import '../admin.css';

export default function CalendarPage() {
  const router = useRouter();

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => router.back()} className="back-btn">← Back to Dashboard</button>
        <h1>Calendar & Schedule</h1>
      </header>
      
      <div className="coming-soon-container">
        <div className="coming-soon-icon">📅</div>
        <h2>Calendar & Task Management</h2>
        <p>Scheduling, crew assignments, and task tracking coming soon.</p>
        <div className="feature-list">
          <div className="feature-item">✓ Site Visit Scheduling</div>
          <div className="feature-item">✓ Crew Calendar</div>
          <div className="feature-item">✓ Task & To-Do Lists</div>
          <div className="feature-item">✓ Appointment Reminders</div>
        </div>
      </div>
    </div>
  );
}
