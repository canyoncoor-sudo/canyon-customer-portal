'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMenu } from '../AdminMenuContext';
import './schedule.css';

interface ScheduleEvent {
  id: string;
  title: string;
  type: string;
  start: string;
  end: string;
  location: string;
  attendees: string[];
  notes: string;
  status: string;
  project_id: string;
  project_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

export default function SchedulePage() {
  const router = useRouter();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Menu state
  const { setShowMenu, setMenuSections, setSectionName } = useAdminMenu();
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showViewSection, setShowViewSection] = useState(false);
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [showToolsSection, setShowToolsSection] = useState(false);
  const [showHelpSection, setShowHelpSection] = useState(false);
  
  // View mode state
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'list' | 'map'>('day');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'type' | 'customer' | 'project' | 'confirmed' | 'payment'>('type');

  useEffect(() => {
    loadEvents();
    setSectionName('Schedule');
    setShowMenu(false);
    setupMenu();
  }, []);

  useEffect(() => {
    setupMenu();
  }, [showCreateSection, showViewSection, showFilterSection, showToolsSection, showHelpSection, viewMode, filterStatus, sortBy, filter]);

  const setupMenu = () => {
    const menuSections = [
      {
        title: 'Create',
        isOpen: showCreateSection,
        onToggle: () => setShowCreateSection(!showCreateSection),
        content: (
          <>
            <button onClick={() => alert('Client Meeting - Coming Soon')}>
              Client Meeting
            </button>
            <button onClick={() => alert('Site Visit - Coming Soon')}>
              Site Visit
            </button>
            <button onClick={() => alert('Subcontractor Meeting - Coming Soon')}>
              Subcontractor Meeting
            </button>
            <button onClick={() => alert('New Customer Meeting - Coming Soon')}>
              New Customer Meeting
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
              <label className={viewMode === 'day' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="viewMode" 
                  value="day"
                  checked={viewMode === 'day'}
                  onChange={() => setViewMode('day')}
                />
                <span>One Day</span>
              </label>
              <label className={viewMode === 'week' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="viewMode" 
                  value="week"
                  checked={viewMode === 'week'}
                  onChange={() => setViewMode('week')}
                />
                <span>One Week</span>
              </label>
              <label className={viewMode === 'month' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="viewMode" 
                  value="month"
                  checked={viewMode === 'month'}
                  onChange={() => setViewMode('month')}
                />
                <span>One Month</span>
              </label>
              <label className={viewMode === 'list' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="viewMode" 
                  value="list"
                  checked={viewMode === 'list'}
                  onChange={() => setViewMode('list')}
                />
                <span>List View</span>
              </label>
              <label className={viewMode === 'map' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="viewMode" 
                  value="map"
                  checked={viewMode === 'map'}
                  onChange={() => setViewMode('map')}
                />
                <span>Map View</span>
              </label>
            </div>
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
              <label>Search</label>
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="control-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="type">Type</option>
                <option value="customer">Customer/Project</option>
                <option value="confirmed">Confirmed/Pending</option>
                <option value="payment">Paid/Unpaid</option>
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
            <button onClick={() => alert('Find Next Available Slot - Coming Soon')}>
              Find Next Available Slot
            </button>
            <button onClick={() => alert('Add Travel Buffer - Coming Soon')}>
              Add Travel Buffer
            </button>
            <button onClick={() => alert('Google Calendar Sync Settings - Coming Soon')}>
              Sync with Google
              Sync Calendar
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
            <button onClick={() => alert('Schedule Guide - Coming Soon')}>
              Schedule Guide
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

    setMenuSections(menuSections);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = filter === 'all' 
        ? '/api/admin/schedule'
        : `/api/admin/schedule?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setEvents(data.events || []);
      } else {
        console.error('Failed to load events:', data.error);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/schedule', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: eventId,
          status: newStatus
        })
      });

      if (response.ok) {
        // Reload events to show updated status
        await loadEvents();
        setSelectedEvent(null);
      } else {
        const data = await response.json();
        alert(`Failed to update status: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'accepted': return '#567A8D';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'site_visit': return '🏗️';
      case 'meeting': return '📋';
      case 'crew': return '👷';
      case 'inspection': return '🔍';
      case 'deadline': return '⏰';
      default: return '📅';
    }
  };

  return (
    <div className="schedule-container">
      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <h3>No events found</h3>
          <p>
            {filter === 'pending' 
              ? 'No pending events. Create a customer intake form with a meeting date to schedule a site visit.'
              : `No ${filter} events found.`}
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-header">
                <div className="event-icon">{getEventTypeIcon(event.type)}</div>
                <div className="event-title-section">
                  <h3>{event.title}</h3>
                  <p className="event-customer">{event.customer_name}</p>
                </div>
                <div 
                  className="event-status-badge"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {event.status}
                </div>
              </div>

              <div className="event-details">
                <div className="detail-row">
                  <span className="label">📅 Date:</span>
                  <span>{formatDate(event.start)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">🕐 Time:</span>
                  <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                </div>
                {event.location && (
                  <div className="detail-row">
                    <span className="label">📍 Location:</span>
                    <span>{event.location}</span>
                  </div>
                )}
                {event.project_name && (
                  <div className="detail-row">
                    <span className="label">🏗️ Project:</span>
                    <span>{event.project_name}</span>
                  </div>
                )}
              </div>

              {event.status === 'pending' && (
                <div className="event-actions">
                  <button 
                    className="btn-accept"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateEventStatus(event.id, 'accepted');
                    }}
                    disabled={updating}
                  >
                    ✓ Accept
                  </button>
                  <button 
                    className="btn-decline"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateEventStatus(event.id, 'cancelled');
                    }}
                    disabled={updating}
                  >
                    ✗ Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button className="btn-close" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div>
                    <strong>Name:</strong> {selectedEvent.customer_name}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedEvent.customer_email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedEvent.customer_phone}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Event Details</h3>
                <div className="info-grid">
                  <div>
                    <strong>Type:</strong> {selectedEvent.type.replace('_', ' ')}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span 
                      className="status-pill"
                      style={{ backgroundColor: getStatusColor(selectedEvent.status) }}
                    >
                      {selectedEvent.status}
                    </span>
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(selectedEvent.start)}
                  </div>
                  <div>
                    <strong>Time:</strong> {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                  </div>
                  {selectedEvent.location && (
                    <div className="full-width">
                      <strong>Location:</strong> {selectedEvent.location}
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.notes && (
                <div className="info-section">
                  <h3>Notes</h3>
                  <p>{selectedEvent.notes}</p>
                </div>
              )}

              <div className="modal-actions">
                {selectedEvent.status === 'pending' && (
                  <>
                    <button 
                      className="btn-modal-accept"
                      onClick={() => updateEventStatus(selectedEvent.id, 'accepted')}
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : '✓ Accept Event'}
                    </button>
                    <button 
                      className="btn-modal-decline"
                      onClick={() => updateEventStatus(selectedEvent.id, 'cancelled')}
                      disabled={updating}
                    >
                      ✗ Cancel Event
                    </button>
                  </>
                )}
                {selectedEvent.status === 'accepted' && (
                  <button 
                    className="btn-modal-complete"
                    onClick={() => updateEventStatus(selectedEvent.id, 'completed')}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : '✓ Mark as Completed'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
