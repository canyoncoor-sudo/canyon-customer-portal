'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

interface ScheduleEvent {
  id: string;
  jobId: string;
  title: string;
  time: string;
  type: string;
  customer?: string;
}

interface DocumentItem {
  id: string;
  jobId: string;
  jobName: string;
  documentType: string;
  status: string;
  daysWaiting?: number;
}

interface ActiveWorkItem {
  id: string;
  jobId: string;
  jobName: string;
  customer: string;
  status: 'awaiting_schedule' | 'awaiting_response' | 'setup_required' | 'invoice_pending' | 'blocked';
  blockReason?: string;
  daysInStatus?: number;
  nextAction: string;
}

export default function AdminDashboard() {
  const [todaySchedule, setTodaySchedule] = useState<ScheduleEvent[]>([]);
  const [tomorrowSchedule, setTomorrowSchedule] = useState<ScheduleEvent[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeWork, setActiveWork] = useState<ActiveWorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOperationsData();
  }, []);

  const fetchOperationsData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      // TODO: Replace with actual API calls to /api/admin/operations
      // Mock data for now - will be replaced with real data from your database
      setTodaySchedule([
        { id: '1', jobId: 'job1', title: 'Kitchen Remodel', time: '9:00 AM', type: 'Site Visit', customer: 'John Smith' },
        { id: '2', jobId: 'job2', title: 'Roofing Installation', time: '1:00 PM', type: 'Work', customer: 'Jane Doe' },
      ]);

      setTomorrowSchedule([
        { id: '3', jobId: 'job3', title: 'Deck Addition', time: '10:00 AM', type: 'Inspection', customer: 'Bob Johnson' },
      ]);

      setDocuments([
        { id: '1', jobId: 'job4', jobName: 'Bathroom Remodel', documentType: 'Permit', status: 'Awaiting City Approval', daysWaiting: 8 },
        { id: '2', jobId: 'job5', jobName: 'Fence Installation', documentType: 'Insurance Certificate', status: 'Needed from Subcontractor', daysWaiting: 3 },
      ]);

      setActiveWork([
        { 
          id: '1', 
          jobId: 'job6', 
          jobName: 'Garage Slab', 
          customer: 'Sarah Williams', 
          status: 'invoice_pending',
          daysInStatus: 2,
          nextAction: 'Send Invoice'
        },
        { 
          id: '2', 
          jobId: 'job7', 
          jobName: 'Kitchen Remodel', 
          customer: 'Mike Brown', 
          status: 'awaiting_schedule',
          daysInStatus: 5,
          nextAction: 'Schedule Job'
        },
        { 
          id: '3', 
          jobId: 'job8', 
          jobName: 'Deck Addition', 
          customer: 'Lisa Anderson', 
          status: 'awaiting_response',
          daysInStatus: 3,
          nextAction: 'Follow Up'
        },
        { 
          id: '4', 
          jobId: 'job9', 
          jobName: 'Bathroom Remodel', 
          customer: 'Tom Wilson', 
          status: 'blocked',
          blockReason: 'Permit Pending',
          daysInStatus: 8,
          nextAction: 'Check Permit Status'
        },
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch operations data:', error);
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'awaiting_schedule': return 'Approved – Needs Scheduling';
      case 'awaiting_response': return 'Awaiting Customer Response';
      case 'setup_required': return 'Approved – Setup Required';
      case 'invoice_pending': return 'Completed – Invoice Pending';
      case 'blocked': return 'Blocked';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awaiting_schedule': return '#567A8D'; // Blue - needs action
      case 'awaiting_response': return '#D97706'; // Orange - waiting
      case 'setup_required': return '#059669'; // Green - approved
      case 'invoice_pending': return '#712A18'; // Red - money pending
      case 'blocked': return '#712A18'; // Red - urgent
      default: return '#454547';
    }
  };

  const handleAction = (jobId: string, action: string) => {
    // Navigate to appropriate page based on action
    switch (action) {
      case 'Send Invoice':
        router.push(`/admin/jobs/${jobId}/invoice`);
        break;
      case 'Schedule Job':
        router.push(`/admin/schedule?jobId=${jobId}`);
        break;
      case 'Follow Up':
        router.push(`/admin/jobs/${jobId}`);
        break;
      case 'Check Permit Status':
        router.push(`/admin/jobs/${jobId}/documents`);
        break;
      default:
        router.push(`/admin/jobs/${jobId}`);
    }
  };

  const handleScheduleClick = (jobId: string) => {
    router.push(`/admin/schedule?jobId=${jobId}`);
  };

  const handleDocumentClick = (jobId: string) => {
    router.push(`/admin/jobs/${jobId}/documents`);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading operations...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="view-header">
        <h2>Operations</h2>
        <p>Items requiring action or awareness today</p>
      </div>

      {/* Today's Schedule - Where do I need to be / what's booked? */}
      <div className="operations-section">
        <h3 className="section-title">
          Today's Schedule
          <span className="section-subtitle">Where do I need to be / what's booked?</span>
        </h3>
        <div className="schedule-grid">
          {todaySchedule.length > 0 ? (
            todaySchedule.map(event => (
              <div 
                key={event.id} 
                className="schedule-item clickable"
                onClick={() => handleScheduleClick(event.jobId)}
              >
                <div className="schedule-time">{event.time}</div>
                <div className="schedule-details">
                  <h4>{event.title}</h4>
                  {event.customer && <p className="schedule-customer">{event.customer}</p>}
                  <span className="schedule-type">{event.type}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No events scheduled for today</div>
          )}
        </div>
      </div>

      {/* Tomorrow's Schedule */}
      {tomorrowSchedule.length > 0 && (
        <div className="operations-section">
          <h3 className="section-title">Tomorrow's Schedule</h3>
          <div className="schedule-grid">
            {tomorrowSchedule.map(event => (
              <div 
                key={event.id} 
                className="schedule-item clickable"
                onClick={() => handleScheduleClick(event.jobId)}
              >
                <div className="schedule-time">{event.time}</div>
                <div className="schedule-details">
                  <h4>{event.title}</h4>
                  {event.customer && <p className="schedule-customer">{event.customer}</p>}
                  <span className="schedule-type">{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents - What paperwork is blocking progress or money? */}
      <div className="operations-section">
        <h3 className="section-title">
          Documents
          <span className="section-subtitle">What paperwork is blocking progress or money?</span>
        </h3>
        <div className="documents-list">
          {documents.length > 0 ? (
            documents.map(doc => (
              <div 
                key={doc.id} 
                className="document-item clickable"
                onClick={() => handleDocumentClick(doc.jobId)}
              >
                <div className="document-header">
                  <h4>{doc.jobName}</h4>
                  {doc.daysWaiting && (
                    <span className="document-days">{doc.daysWaiting} days</span>
                  )}
                </div>
                <p className="document-status">{doc.status}</p>
                <span className="document-type">{doc.documentType}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">No documents requiring attention</div>
          )}
        </div>
      </div>

      {/* Active Work - What jobs need a next step? */}
      <div className="operations-section">
        <h3 className="section-title">
          Active Work
          <span className="section-subtitle">What jobs need a next step?</span>
        </h3>
        <div className="active-work-grid">
          {activeWork.length > 0 ? (
            activeWork.map(item => (
              <div key={item.id} className="active-work-item">
                <div className="work-header">
                  <div>
                    <h4>{item.jobName}</h4>
                    <p className="work-customer">{item.customer}</p>
                  </div>
                  {item.daysInStatus && (
                    <span className="work-days">{item.daysInStatus}d</span>
                  )}
                </div>
                <div className="work-status-row">
                  <span 
                    className="work-status" 
                    style={{ background: getStatusColor(item.status) }}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                  {item.blockReason && (
                    <span className="work-block-reason">{item.blockReason}</span>
                  )}
                </div>
                <button 
                  className="action-btn"
                  onClick={() => handleAction(item.jobId, item.nextAction)}
                >
                  {item.nextAction} →
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">No active work items</div>
          )}
        </div>
      </div>

      {/* Active Work Criteria Info */}
      <div className="operations-info">
        <h4>Active Work shows jobs that are:</h4>
        <ul>
          <li>Approved but not scheduled</li>
          <li>Waiting on customer response</li>
          <li>Approved – setup required</li>
          <li>Completed – invoice pending</li>
          <li>Blocked (document/permit/material)</li>
        </ul>
        <p className="info-note">
          Excludes: Leads that haven't responded, archived jobs, fully complete + paid work, 
          and long-term future jobs with no action required.
        </p>
      </div>
    </div>
  );
}
