'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMenu } from '../AdminMenuContext';
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

  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showViewSection, setShowViewSection] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [showToolsSection, setShowToolsSection] = useState(false);
  const [showHelpSection, setShowHelpSection] = useState(false);
  
  // View mode state
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'pipeline'>('today');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'customer' | 'project' | 'due_date' | 'assigned'>('due_date');
  
  const router = useRouter();
  const { setShowMenu, setMenuSections, setSectionName } = useAdminMenu();

  useEffect(() => {
    fetchOperationsData();
    setSectionName('Operations');
    setShowMenu(false);
    setMenuSections([]);
  }, []);

  const fetchOperationsData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch real operations data from API
      const response = await fetch('/api/admin/operations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch operations data');
      }

      const data = await response.json();
      
      setTodaySchedule(data.todaySchedule || []);
      setTomorrowSchedule(data.tomorrowSchedule || []);
      setDocuments(data.documents || []);
      setActiveWork(data.activeWork || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch operations data:', error);
      // Set empty arrays on error instead of fake data
      setTodaySchedule([]);
      setTomorrowSchedule([]);
      setDocuments([]);
      setActiveWork([]);
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

  // Menu sections configuration
  const menuSections = [
    {
      title: 'Create',
      isOpen: showCreateSection,
      onToggle: () => setShowCreateSection(!showCreateSection),
      content: (
        <>
          <button onClick={() => router.push('/admin/documents/intake')}>
            New Lead/Intake
          </button>
          <button onClick={() => alert('New Task - Coming Soon')}>
            New Task
          </button>
          <button onClick={() => alert('New Meeting - Coming Soon')}>
            New Meeting
          </button>
          <button onClick={() => router.push('/admin/documents')}>
            New Document
          </button>
          <button onClick={() => alert('Quick Add - Coming Soon')}>
            Quick Add
          </button>
        </>
      )
    },
    {
      title: 'View',
      isOpen: showViewSection,
      onToggle: () => setShowViewSection(!showViewSection),
      content: (
        <div className="control-group">
          <div className="radio-group">
            <label className={viewMode === 'today' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="today"
                checked={viewMode === 'today'}
                onChange={() => setViewMode('today')}
              />
              <span>Today</span>
            </label>
            <label className={viewMode === 'week' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="week"
                checked={viewMode === 'week'}
                onChange={() => setViewMode('week')}
              />
              <span>This Week</span>
            </label>
            <label className={viewMode === 'pipeline' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="pipeline"
                checked={viewMode === 'pipeline'}
                onChange={() => setViewMode('pipeline')}
              />
              <span>Pipeline</span>
            </label>
          </div>
          
          {viewMode === 'pipeline' && (
            <div className="pipeline-stages" style={{ marginTop: '12px' }}>
              <div className="stage-info">Pipeline stages: Lead → Meeting → Proposal → Approval → Active → Closeout → Waiting on Customer</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Filter & Sort',
      isOpen: showFilterSection,
      onToggle: () => setShowFilterSection(!showFilterSection),
      content: (
        <>
          <div className="control-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="urgent">Urgent</option>
              <option value="waiting">Waiting</option>
              <option value="scheduled">Scheduled</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="By customer, project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="control-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="customer">Customer</option>
              <option value="project">Project</option>
              <option value="due_date">Due Date</option>
              <option value="assigned">Assigned To</option>
            </select>
          </div>
        </>
      )
    },
    {
      title: 'Tools',
      isOpen: showToolsSection,
      onToggle: () => setShowToolsSection(!showToolsSection),
      content: (
        <>
          <button onClick={() => alert('Export Operations - Coming Soon')}>
            Export Operations
          </button>
          <button onClick={() => alert('Print Report - Coming Soon')}>
            Print Report
          </button>
          <button onClick={() => alert('Send Updates - Coming Soon')}>
            Send Updates
          </button>
        </>
      )
    },
    {
      title: 'Help',
      isOpen: showHelpSection,
      onToggle: () => setShowHelpSection(!showHelpSection),
      content: (
        <>
          <button onClick={() => alert('Operations Guide - Coming Soon')}>
            Operations Guide
          </button>
          <button onClick={() => alert('Keyboard Shortcuts - Coming Soon')}>
            Keyboard Shortcuts
          </button>
          <button onClick={() => router.push('/admin/dashboard')}>
            Return to Dashboard
          </button>
        </>
      )
    }
  ];

  // Update menu sections
  useEffect(() => {
    setMenuSections(menuSections);
  }, [showCreateSection, showViewSection, showFilterSection, showToolsSection, showHelpSection, viewMode, filterStatus, sortBy]);


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
