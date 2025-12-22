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

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function CalendarPage() {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showDayPanel, setShowDayPanel] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'tasks'>('events');
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const router = useRouter();

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'meeting' as CalendarEvent['type'],
    startTime: '09:00',
    endTime: '10:00',
    customer_name: '',
    status: 'scheduled' as CalendarEvent['status'],
    notes: '',
    assignedTo: ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    priority: 'medium' as Task['priority']
  });
  // Google Calendar integration
  const [googleConnected, setGoogleConnected] = useState(false);
  const [showGoogleSettings, setShowGoogleSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchTasks();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      // TODO: Fetch from API
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

  const fetchTasks = async () => {
    try {
      // TODO: Fetch from API
      setTasks([
        {
          id: '1',
          title: 'Review permits for Main St project',
          date: new Date(2025, 11, 23),
          completed: false,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Order materials for Johnson job',
          date: new Date(2025, 11, 24),
          completed: false,
          priority: 'medium'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setActiveTab('events');
    setShowDayPanel(true);
    setShowEventForm(false);
    setShowTaskForm(false);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setActiveTab('events');
    setShowDayPanel(true);
    setShowEventForm(false);
  };

  const handleAddEventClick = () => {
    setEventForm({
      title: '',
      type: 'meeting',
      startTime: '09:00',
      endTime: '10:00',
      customer_name: '',
      status: 'scheduled',
      notes: '',
      assignedTo: ''
    });
    setShowEventForm(true);
    setSelectedEvent(null);
  };

  const handleAddTaskClick = () => {
    setTaskForm({
      title: '',
      priority: 'medium'
    });
    setShowTaskForm(true);
  };

  const handleSaveEvent = () => {
    if (!selectedDate || !eventForm.title) return;

    const [startHour, startMin] = eventForm.startTime.split(':').map(Number);
    const [endHour, endMin] = eventForm.endTime.split(':').map(Number);

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventForm.title,
      type: eventForm.type,
      start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startHour, startMin),
      end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), endHour, endMin),
      customer_name: eventForm.customer_name,
      status: eventForm.status,
      notes: eventForm.notes,
      assignedTo: eventForm.assignedTo
    };

    setEvents([...events, newEvent]);
    syncEventToGoogle(newEvent, 'create');
    syncEventToGoogle(newEvent, 'create');
    setShowEventForm(false);
    setEventForm({
      title: '',
      type: 'meeting',
      startTime: '09:00',
      endTime: '10:00',
      customer_name: '',
      status: 'scheduled',
      notes: '',
      assignedTo: ''
    });
  };

  const handleSaveTask = () => {
    if (!selectedDate || !taskForm.title) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      date: selectedDate,
      completed: false,
      priority: taskForm.priority
    };

    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    setTaskForm({
      title: '',
      priority: 'medium'
    });
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents(events.filter(e => e.id !== selectedEvent.id));
    syncEventToGoogle(selectedEvent, 'delete');
    syncEventToGoogle(selectedEvent, 'delete');
    setSelectedEvent(null);
  };

  
  

  const connectGoogleCalendar = async () => {
    try {
      const res = await fetch('/api/admin/calendar/google/auth');
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      setSyncStatus('Failed to connect. Please try again.');
    }
  };

  const disconnectGoogleCalendar = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/calendar/google/status', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setGoogleConnected(false);
      setSyncStatus('Disconnected from Google Calendar');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const syncEventToGoogle = async (event: CalendarEvent, action: 'create' | 'update' | 'delete') => {
    if (!googleConnected) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch('/api/admin/calendar/google/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ event, action })
      });
    } catch (error) {
      console.error('Failed to sync to Google:', error);
    }
  };

  const checkGoogleConnection = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/calendar/google/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setGoogleConnected(data.connected || false);
    } catch (error) {
      console.error('Failed to check Google connection:', error);
    }
  };

  useEffect(() => {
    checkGoogleConnection();
  }, []);

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
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    return tasks.filter(task => {
      return task.date.getDate() === date.getDate() &&
             task.date.getMonth() === date.getMonth() &&
             task.date.getFullYear() === date.getFullYear();
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
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
            Click any day to add events or tasks • Drag events to reschedule
          </p>
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
          
        <div className="google-calendar-section">
          <button 
            className="btn-google-settings" 
            onClick={() => setShowGoogleSettings(!showGoogleSettings)}
          >
            {googleConnected ? '✓ Google Calendar Connected' : '⚙️ Connect Google Calendar'}
          </button>
        </div>
      
        <div className="google-calendar-section">
          <button 
            className="btn-google-settings" 
            onClick={() => setShowGoogleSettings(!showGoogleSettings)}
          >
            {googleConnected ? '✓ Google Calendar Connected' : '⚙️ Connect Google Calendar'}
          </button>
        </div>
      </div>
        </div>
      </header>

      
      {showGoogleSettings && (
        <div className="google-settings-panel">
          <div className="google-settings-content">
            <h3>Google Calendar Integration</h3>
            
            {googleConnected ? (
              <>
                <p className="google-status">✅ Your Google Calendar is connected and syncing</p>
                <div className="google-info">
                  <p>Events created here will automatically appear in your Google Calendar with color-coded categories.</p>
                </div>
                {syncStatus && <p className="sync-status">{syncStatus}</p>}
                <div className="google-actions">
                  <button className="btn-disconnect" onClick={disconnectGoogleCalendar}>
                    Disconnect Google Calendar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="google-status">Connect your Google Calendar to sync events automatically</p>
                <div className="google-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    <li>✓ Events automatically sync to Google Calendar</li>
                    <li>✓ Color-coded by event type</li>
                    <li>✓ Access from any device</li>
                    <li>✓ Never miss an appointment</li>
                  </ul>
                </div>
                {syncStatus && <p className="sync-status error">{syncStatus}</p>}
                <div className="google-actions">
                  <button className="btn-connect-google" onClick={connectGoogleCalendar}>
                    🔗 Connect Google Calendar
                  </button>
                </div>
                <p className="google-note">
                  <small>You'll be redirected to Google to authorize access. We only read and write calendar events.</small>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      
      {showGoogleSettings && (
        <div className="google-settings-panel">
          <div className="google-settings-content">
            <h3>Google Calendar Integration</h3>
            
            {googleConnected ? (
              <>
                <p className="google-status">✅ Your Google Calendar is connected and syncing</p>
                <div className="google-info">
                  <p>Events created here will automatically appear in your Google Calendar with color-coded categories.</p>
                </div>
                {syncStatus && <p className="sync-status">{syncStatus}</p>}
                <div className="google-actions">
                  <button className="btn-disconnect" onClick={disconnectGoogleCalendar}>
                    Disconnect Google Calendar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="google-status">Connect your Google Calendar to sync events automatically</p>
                <div className="google-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    <li>✓ Events automatically sync to Google Calendar</li>
                    <li>✓ Color-coded by event type</li>
                    <li>✓ Access from any device</li>
                    <li>✓ Never miss an appointment</li>
                  </ul>
                </div>
                {syncStatus && <p className="sync-status error">{syncStatus}</p>}
                <div className="google-actions">
                  <button className="btn-connect-google" onClick={connectGoogleCalendar}>
                    🔗 Connect Google Calendar
                  </button>
                </div>
                <p className="google-note">
                  <small>You'll be redirected to Google to authorize access. We only read and write calendar events.</small>
                </p>
              </>
            )}
          </div>
        </div>
      )}

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
                    const dayTasks = getTasksForDate(date);
                    const today = new Date();
                    const isToday = date && 
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();

                    return (
                      <div
                        key={index}
                        className={`calendar-day ${!date ? 'empty' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => date && handleDayClick(date)}
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
                                  onClick={(e) => handleEventClick(event, e)}
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
                              {dayTasks.length > 0 && (
                                <div className="task-indicator">
                                  {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                                </div>
                              )}
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

      {showDayPanel && selectedDate && (
        <div className="day-panel">
          <div className="day-panel-header">
            <div className="day-panel-title">
              <h3>{formatDateFull(selectedDate)}</h3>
            </div>
            <button onClick={() => setShowDayPanel(false)} className="close-panel">✕</button>
          </div>

          <div className="day-panel-tabs">
            <button 
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => { setActiveTab('events'); setShowEventForm(false); setShowTaskForm(false); }}
            >
              Events ({getEventsForDate(selectedDate).length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => { setActiveTab('tasks'); setShowEventForm(false); setShowTaskForm(false); }}
            >
              Tasks & To-Do ({getTasksForDate(selectedDate).length})
            </button>
          </div>

          <div className="day-panel-content">
            {activeTab === 'events' && (
              <div className="events-tab">
                {!showEventForm && !selectedEvent && (
                  <button className="btn-add-item" onClick={handleAddEventClick}>+ Add Event</button>
                )}
                
                {showEventForm ? (
                  <div className="event-form">
                    <h4>New Event</h4>
                    
                    <div className="form-field">
                      <label>Event Title *</label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        placeholder="e.g., Site Visit - Smith Project"
                      />
                    </div>

                    <div className="form-field">
                      <label>Event Type *</label>
                      <select
                        value={eventForm.type}
                        onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as CalendarEvent['type'] })}
                      >
                        <option value="meeting">Meeting</option>
                        <option value="crew">Crew Scheduling</option>
                        <option value="site_visit">Site Visit</option>
                        <option value="appointment">Appointment</option>
                        <option value="task">Task</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label>Start Time *</label>
                        <input
                          type="time"
                          value={eventForm.startTime}
                          onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                        />
                      </div>
                      <div className="form-field">
                        <label>End Time *</label>
                        <input
                          type="time"
                          value={eventForm.endTime}
                          onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Customer Name</label>
                      <input
                        type="text"
                        value={eventForm.customer_name}
                        onChange={(e) => setEventForm({ ...eventForm, customer_name: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="form-field">
                      <label>Status</label>
                      <select
                        value={eventForm.status}
                        onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as CalendarEvent['status'] })}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Assigned To</label>
                      <input
                        type="text"
                        value={eventForm.assignedTo}
                        onChange={(e) => setEventForm({ ...eventForm, assignedTo: e.target.value })}
                        placeholder="e.g., Crew A, John Smith"
                      />
                    </div>

                    <div className="form-field">
                      <label>Notes</label>
                      <textarea
                        value={eventForm.notes}
                        onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })}
                        placeholder="Additional details..."
                        rows={3}
                      />
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={handleSaveEvent}>Save Event</button>
                      <button className="btn-cancel" onClick={() => setShowEventForm(false)}>Cancel</button>
                    </div>
                  </div>
                ) : selectedEvent ? (
                  <div className="event-detail">
                    <h4>Event Details</h4>
                    <div className="detail-field">
                      <label>Title</label>
                      <p>{selectedEvent.title}</p>
                    </div>
                    <div className="detail-field">
                      <label>Type</label>
                      <p style={{ color: getEventTypeColor(selectedEvent.type) }}>
                        {selectedEvent.type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="detail-field">
                      <label>Time</label>
                      <p>
                        {selectedEvent.start.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })} - {selectedEvent.end.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {selectedEvent.customer_name && (
                      <div className="detail-field">
                        <label>Customer</label>
                        <p>{selectedEvent.customer_name}</p>
                      </div>
                    )}
                    <div className="detail-field">
                      <label>Status</label>
                      <p>
                        <span className={`event-status ${getStatusBadgeClass(selectedEvent.status)}`}>
                          {selectedEvent.status}
                        </span>
                      </p>
                    </div>
                    {selectedEvent.assignedTo && (
                      <div className="detail-field">
                        <label>Assigned To</label>
                        <p>{selectedEvent.assignedTo}</p>
                      </div>
                    )}
                    {selectedEvent.notes && (
                      <div className="detail-field">
                        <label>Notes</label>
                        <p>{selectedEvent.notes}</p>
                      </div>
                    )}
                    <div className="detail-actions">
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete" onClick={handleDeleteEvent}>Delete</button>
                      <button className="btn-back" onClick={() => setSelectedEvent(null)}>Back to List</button>
                    </div>
                  </div>
                ) : (
                  <div className="event-list">
                    {getEventsForDate(selectedDate).length === 0 ? (
                      <div className="empty-state">
                        <p>No events scheduled for this day.</p>
                        <p className="hint">Click "+ Add Event" to create one.</p>
                      </div>
                    ) : (
                      getEventsForDate(selectedDate).map(event => (
                        <div 
                          key={event.id} 
                          className="list-event-item"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div 
                            className="list-event-indicator" 
                            style={{ background: getEventTypeColor(event.type) }}
                          />
                          <div className="list-event-content">
                            <div className="list-event-title">{event.title}</div>
                            <div className="list-event-meta">
                              {event.start.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })} • {event.type.replace('_', ' ')}
                            </div>
                          </div>
                          <span className={`event-status ${getStatusBadgeClass(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tasks-tab">
                {!showTaskForm && (
                  <button className="btn-add-item" onClick={handleAddTaskClick}>+ Add Task</button>
                )}
                
                {showTaskForm ? (
                  <div className="task-form">
                    <h4>New Task</h4>
                    
                    <div className="form-field">
                      <label>Task Description *</label>
                      <input
                        type="text"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="What needs to be done?"
                      />
                    </div>

                    <div className="form-field">
                      <label>Priority</label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={handleSaveTask}>Save Task</button>
                      <button className="btn-cancel" onClick={() => setShowTaskForm(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="task-list">
                    {getTasksForDate(selectedDate).length === 0 ? (
                      <div className="empty-state">
                        <p>No tasks for this day.</p>
                        <p className="hint">Click "+ Add Task" to create one.</p>
                      </div>
                    ) : (
                      getTasksForDate(selectedDate).map(task => (
                        <div key={task.id} className="task-item">
                          <input 
                            type="checkbox" 
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                          />
                          <div className="task-content">
                            <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                              {task.title}
                            </div>
                            <div className={`task-priority priority-${task.priority}`}>
                              {task.priority}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
