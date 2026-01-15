'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    loadEvents();
  }, [filter]);

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
      
      console.log('Schedule API response:', data);
      console.log('Events count:', data.events?.length || 0);
      
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
      <div className="schedule-header">
        <div>
          <h1>Schedule Events</h1>
          <p className="subtitle">Manage site visits, meetings, and project events</p>
        </div>
        <button className="btn-back" onClick={() => router.push('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="schedule-controls">
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({events.filter(e => e.status === 'pending').length})
          </button>
          <button 
            className={filter === 'accepted' ? 'active' : ''}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

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
