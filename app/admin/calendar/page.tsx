'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './calendar.css';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'crew' | 'site_visit' | 'appointment' | 'task';
  start: Date;
  end: Date;
  customer_name?: string;
  job_id?: string;
  status: 'scheduled' | 'pending' | 'confirmed' | 'completed';
  notes?: string;
  assignedTo?: string;
}

export default function CalendarPage() {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      // TODO: Fetch from API
      // Mock data for now
      setEvents([
        {
          id: '1',
          title: 'Site Visit - Smith Residence',
          type: 'site_visit',
          start: new Date(2025, 11, 23, 10, 0),
          end: new Date(2025, 11, 23, 11, 30),
          customer_name: 'John Smith',
          status: 'confirmed',
          notes: 'Initial consultation for kitchen remodel'
        },
        {
          id: '2',
          title: 'Crew - Johnson Project',
          type: 'crew',
          start: new Date(2025, 11, 24, 8, 0),
          end: new Date(2025, 11, 28, 17, 0),
          customer_name: 'Jane Johnson',
          status: 'scheduled',
          assignedTo: 'Crew A'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date) => {
    if (!draggedEvent) return;

    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const updatedEvent = {
      ...draggedEvent,
      start: date,
      end: new Date(date.getTime() + duration)
    };

    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setDraggedEvent(null);
  };

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return '#567A8D';
      case 'crew': return '#712A18';
      case 'site_visit': return '#9A8C7A';
      case 'appointment': return '#454547';
      case 'task': return '#261312';
      default: return '#567A8D';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  // Generate array of 6 months starting from current month
  const getNextSixMonths = () => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push(date);
    }
    return months;
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="header-top">
          <h1>Calendar & Schedule</h1>
          <p className="header-subtitle">
            Scheduling • Site Visits • Crew Management • Tasks & To-Do • Appointment Reminders
          </p>
        </div>

        <div className="calendar-controls">
          <div className="view-controls">
            <h2 className="current-period">6-Month View • {formatMonthYear(currentDate)}</h2>
          </div>

          <div className="action-buttons">
            <button onClick={handleAddEvent} className="btn-add-event">+ Add Event</button>
            <button onClick={() => setShowTaskPanel(!showTaskPanel)} className="btn-tasks">
              Tasks & To-Do
            </button>
          </div>
        </div>

        <div className="event-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#567A8D' }}></span>
            Meetings
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#712A18' }}></span>
            Crew Scheduling
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#9A8C7A' }}></span>
            Site Visits
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#454547' }}></span>
            Appointments
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#261312' }}></span>
            Tasks
          </div>
        </div>
      </header>

      <div className="calendar-scroll-container">
        {getNextSixMonths().map((monthDate, monthIndex) => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          const isCurrentMonth = month === currentDate.getMonth() && year === currentDate.getFullYear();

          return (
            <div key={`${year}-${month}`} className="month-section">
              <div className="month-header">
                <h3>{formatMonthYear(monthDate)}</h3>
                {isCurrentMonth && <span className="current-month-badge">Current Month</span>}
              </div>

              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <div key={day} className="weekday-header">{day}</div>
                  ))}
                </div>

                <div className="calendar-days">
                  {getDaysInMonth(year, month).map((date, index) => {
                    const dayEvents = getEventsForDate(date);
                    const today = new Date();
                    const isToday = date && 
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();

                    return (
                      <div
                        key={index}
                        className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={() => date && handleDrop(date)}
                      >
                        {date && (
                          <>
                            <div className="day-number">{date.getDate()}</div>
                            <div className="day-events">
                              {dayEvents.map(event => (
                                <div
                                  key={event.id}
                                  className="event-item"
                                  style={{ borderLeftColor: getEventTypeColor(event.type) }}
                                  draggable
                                  onDragStart={() => handleDragStart(event)}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="event-time">
                                    {event.start.toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit' 
                                    })}
                                  </div>
                                  <div className="event-title">{event.title}</div>
                                  <span className={`event-status ${getStatusBadgeClass(event.status)}`}>
                                    {event.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showTaskPanel && (
        <div className="task-panel">
          <div className="task-panel-header">
            <h3>Tasks & To-Do List</h3>
            <button onClick={() => setShowTaskPanel(false)} className="close-panel">✕</button>
          </div>
          <div className="task-panel-content">
            <button className="btn-add-task">+ Add Task</button>
            <div className="task-list">
              <div className="empty-state">
                <p>No tasks yet. Add a task to get started.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvent ? 'Event Details' : 'Add New Event'}</h3>
              <button onClick={() => setShowEventModal(false)} className="close-modal">✕</button>
            </div>
            <div className="modal-content">
              <p>Event form coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
