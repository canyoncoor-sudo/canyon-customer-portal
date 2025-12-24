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
  // Menu system fields
  assigned_professional_id?: string;
  project_id?: string;
  duration_days?: number;
  is_multi_day?: boolean;
}

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [eventColors, setEventColors] = useState({
    meeting: '#567A8D',
    crew: '#712A18',
    site_visit: '#9A8C7A',
    appointment: '#454547',
    task: '#261312',
    subcontractor: '#D97706'
  });
  
  // Menu System States
  const [showMenu, setShowMenu] = useState(false);
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [showColorRulesDropdown, setShowColorRulesDropdown] = useState(false);
  const [filterView, setFilterView] = useState<'all' | 'professionals' | 'projects' | 'open_slots'>('all');
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'timeline'>('month');
  const [displayDensity, setDisplayDensity] = useState<'compact' | 'extended'>('extended');
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [showContractorNames, setShowContractorNames] = useState(true);
  const [showJobDuration, setShowJobDuration] = useState(true);
  const [showMultiDayBars, setShowMultiDayBars] = useState(true);
  const [showConflicts, setShowConflicts] = useState(true);
  const [colorRule, setColorRule] = useState<'professional' | 'project' | 'status'>('status');
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchTasks();
    fetchProfessionals();
    fetchProjects();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch real events from calendar_events table (synced from Google Calendar)
      const response = await fetch('/api/admin/calendar/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      
      // Convert date strings back to Date objects
      const formattedEvents = data.events.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]); // Show empty calendar on error, no fake data
    }
  };

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      const response = await fetch('/api/admin/professionals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfessionals(data.professionals || []);
      }
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      const response = await fetch('/api/admin/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
    setShowMenu(false);
  };

  const jumpToNextAvailable = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    for (let i = 1; i <= 365; i++) {
      checkDate.setDate(checkDate.getDate() + 1);
      const dayEvents = events.filter(e => {
        const eventDate = new Date(e.start);
        return eventDate.toDateString() === checkDate.toDateString();
      });
      if (dayEvents.length === 0) {
        setCurrentDate(checkDate);
        setShowMenu(false);
        return;
      }
    }
  };

  const jumpToNextProject = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureEvents = events
      .filter(e => new Date(e.start) > today)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    if (futureEvents.length > 0) {
      setCurrentDate(new Date(futureEvents[0].start));
      setShowMenu(false);
    }
  };

  const exportToPDF = () => {
    alert('PDF export functionality coming soon!');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Type', 'Start', 'End', 'Customer', 'Status'].join(','),
      ...events.map(e => [
        e.title,
        e.type,
        e.start.toISOString(),
        e.end.toISOString(),
        e.customer_name || '',
        e.status || ''
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    setShowMenu(false);
  };

  const printSchedule = () => {
    window.print();
    setShowMenu(false);
  };

  const getEventColor = (event: CalendarEvent) => {
    if (colorRule === 'professional' && event.assigned_professional_id) {
      const prof = professionals.find(p => p.id === event.assigned_professional_id);
      return prof?.assigned_color || eventColors[event.type as keyof typeof eventColors] || '#567A8D';
    } else if (colorRule === 'project' && event.project_id) {
      const hash = event.project_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = hash % 360;
      return `hsl(${hue}, 60%, 50%)`;
    } else if (colorRule === 'status') {
      const statusColors = {
        'active': '#2D7A3E',
        'pending': '#D97706',
        'completed': '#808080',
        'cancelled': '#DC2626'
      };
      return statusColors[event.status as keyof typeof statusColors] || eventColors[event.type as keyof typeof eventColors] || '#567A8D';
    }
    return eventColors[event.type as keyof typeof eventColors] || '#567A8D';
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

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        alert('Please log in to delete events');
        return;
      }

      const response = await fetch(`/api/admin/calendar/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove from local state
      setEvents(events.filter(e => e.id !== eventId));
      setSelectedEvent(null);
      setShowEventForm(false);
      
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="header-top">
          <button 
            className="btn-menu-hamburger"
            onClick={() => setShowMenu(!showMenu)}
            title="Menu"
          >
            ☰
          </button>
          <h1>Schedule</h1>
        </div>

        <div className="calendar-controls">
          <button 
            className="btn-month-picker"
            onClick={() => setShowMonthPicker(!showMonthPicker)}
          >
            📅 {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {showMenu && (
        <div className="schedule-menu-panel">
          <div className="menu-header">
            <h2>Schedule Controls</h2>
            <button className="btn-close-menu" onClick={() => setShowMenu(false)}>✕</button>
          </div>

          <div className="menu-content">
            {/* 1. Display Section (Collapsible) */}
            <div className="menu-section">
              <button 
                className="menu-section-header"
                onClick={() => setShowDisplayDropdown(!showDisplayDropdown)}
              >
                <span>Display</span>
                <span className="dropdown-arrow">{showDisplayDropdown ? '▼' : '▶'}</span>
              </button>
              
              {showDisplayDropdown && (
                <div className="section-content">
                  <div className="control-group">
                    <div className="radio-group">
                      <label className={viewMode === 'month' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="viewMode" 
                          value="month" 
                          checked={viewMode === 'month'}
                          onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'timeline')}
                        />
                        <span>Month</span>
                      </label>
                      <label className={viewMode === 'week' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="viewMode" 
                          value="week" 
                          checked={viewMode === 'week'}
                          onChange={(e) => setViewMode(e.target.value as 'month' | 'week' | 'timeline')}
                        />
                        <span>Week</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Filters Section (Collapsible) */}
            <div className="menu-section">
              <button 
                className="menu-section-header"
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
              >
                <span>Filters</span>
                <span className="dropdown-arrow">{showFiltersDropdown ? '▼' : '▶'}</span>
              </button>
              
              {showFiltersDropdown && (
                <div className="section-content">
                  <div className="control-group">
                    <div className="radio-group">
                      <label className={filterView === 'all' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="filterView" 
                          value="all" 
                          checked={filterView === 'all'}
                          onChange={(e) => setFilterView(e.target.value as 'all' | 'professionals' | 'projects' | 'open_slots')}
                        />
                        <span>All Events</span>
                      </label>
                      <label className={filterView === 'professionals' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="filterView" 
                          value="professionals" 
                          checked={filterView === 'professionals'}
                          onChange={(e) => setFilterView(e.target.value as 'all' | 'professionals' | 'projects' | 'open_slots')}
                        />
                        <span>All Professionals</span>
                      </label>
                      <label className={filterView === 'projects' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="filterView" 
                          value="projects" 
                          checked={filterView === 'projects'}
                          onChange={(e) => setFilterView(e.target.value as 'all' | 'professionals' | 'projects' | 'open_slots')}
                        />
                        <span>Projects</span>
                      </label>
                      <label className={filterView === 'open_slots' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="filterView" 
                          value="open_slots" 
                          checked={filterView === 'open_slots'}
                          onChange={(e) => setFilterView(e.target.value as 'all' | 'professionals' | 'projects' | 'open_slots')}
                        />
                        <span>Open Slots</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Color Rules Section (Collapsible) */}
            <div className="menu-section">
              <button 
                className="menu-section-header"
                onClick={() => setShowColorRulesDropdown(!showColorRulesDropdown)}
              >
                <span>Color Rules</span>
                <span className="dropdown-arrow">{showColorRulesDropdown ? '▼' : '▶'}</span>
              </button>
              
              {showColorRulesDropdown && (
                <div className="section-content">
                  <div className="control-group">
                    <div className="radio-group">
                      <label className={colorRule === 'professional' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="colorRule" 
                          value="professional" 
                          checked={colorRule === 'professional'}
                          onChange={(e) => setColorRule(e.target.value as 'professional' | 'project' | 'status')}
                        />
                        <span>Color by Licensed Professional</span>
                      </label>
                      <label className={colorRule === 'project' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="colorRule" 
                          value="project" 
                          checked={colorRule === 'project'}
                          onChange={(e) => setColorRule(e.target.value as 'professional' | 'project' | 'status')}
                        />
                        <span>Color by Project</span>
                      </label>
                      <label className={colorRule === 'status' ? 'active' : ''}>
                        <input 
                          type="radio" 
                          name="colorRule" 
                          value="status" 
                          checked={colorRule === 'status'}
                          onChange={(e) => setColorRule(e.target.value as 'professional' | 'project' | 'status')}
                        />
                        <span>Color by Job Status</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Navigation Section */}
            <div className="menu-section">
              <h3>Navigation</h3>
              
              <div className="control-group">
                <button className="btn-menu-action" onClick={jumpToToday}>
                  Jump to Today
                </button>
              </div>

              <div className="control-group">
                <button className="btn-menu-action" onClick={jumpToNextAvailable}>
                  Jump to Next Available Slot
                </button>
              </div>

              <div className="control-group">
                <button className="btn-menu-action" onClick={jumpToNextProject}>
                  Jump to Next Project Start
                </button>
              </div>
            </div>

            {/* 5. Utilities Section */}
            <div className="menu-section">
              <h3>Utilities</h3>
              
              <div className="control-group">
                <button className="btn-menu-action" onClick={exportToPDF}>
                  Export PDF
                </button>
              </div>

              <div className="control-group">
                <button className="btn-menu-action" onClick={exportToCSV}>
                  Export CSV
                </button>
              </div>

              <div className="control-group">
                <button className="btn-menu-action" onClick={printSchedule}>
                  Print Schedule
                </button>
              </div>

              <div className="control-group">
                <button className="btn-menu-action" onClick={() => setShowGoogleSettings(true)}>
                  Google Calendar Sync
                </button>
              </div>
            </div>
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

      {/* Month Picker Dropdown */}
      {showMonthPicker && (
        <div className="month-picker-panel">
          <div className="month-picker-content">
            <h3>Select Month</h3>
            <div className="month-grid">
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(currentDate.getFullYear(), i, 1);
                return (
                  <button
                    key={i}
                    className="month-button"
                    onClick={() => {
                      setCurrentDate(month);
                      setShowMonthPicker(false);
                    }}
                  >
                    {month.toLocaleDateString('en-US', { month: 'long' })}
                  </button>
                );
              })}
            </div>
            <div className="year-controls">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1))}>
                ← {currentDate.getFullYear() - 1}
              </button>
              <span>{currentDate.getFullYear()}</span>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1))}>
                {currentDate.getFullYear() + 1} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Palette Dropdown */}
      {showColorPalette && (
        <div className="color-palette-panel">
          <div className="color-palette-content">
            <h3>Event Color Palette</h3>
            <p className="palette-subtitle">Customize colors for different event types</p>
            
            <div className="color-settings">
              <div className="color-setting-item">
                <label>Meetings</label>
                <input 
                  type="color" 
                  value={eventColors.meeting}
                  onChange={(e) => setEventColors({...eventColors, meeting: e.target.value})}
                />
                <span className="color-hex">{eventColors.meeting}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Crew Scheduling</label>
                <input 
                  type="color" 
                  value={eventColors.crew}
                  onChange={(e) => setEventColors({...eventColors, crew: e.target.value})}
                />
                <span className="color-hex">{eventColors.crew}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Site Visits</label>
                <input 
                  type="color" 
                  value={eventColors.site_visit}
                  onChange={(e) => setEventColors({...eventColors, site_visit: e.target.value})}
                />
                <span className="color-hex">{eventColors.site_visit}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Appointments</label>
                <input 
                  type="color" 
                  value={eventColors.appointment}
                  onChange={(e) => setEventColors({...eventColors, appointment: e.target.value})}
                />
                <span className="color-hex">{eventColors.appointment}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Tasks</label>
                <input 
                  type="color" 
                  value={eventColors.task}
                  onChange={(e) => setEventColors({...eventColors, task: e.target.value})}
                />
                <span className="color-hex">{eventColors.task}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Subcontractors</label>
                <input 
                  type="color" 
                  value={eventColors.subcontractor}
                  onChange={(e) => setEventColors({...eventColors, subcontractor: e.target.value})}
                />
                <span className="color-hex">{eventColors.subcontractor}</span>
              </div>
            </div>
            
            <button 
              className="btn-reset-colors"
              onClick={() => setEventColors({
                meeting: '#567A8D',
                crew: '#712A18',
                site_visit: '#9A8C7A',
                appointment: '#454547',
                task: '#261312',
                subcontractor: '#D97706'
              })}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Month Picker Dropdown */}
      {showMonthPicker && (
        <div className="month-picker-panel">
          <div className="month-picker-content">
            <h3>Select Month</h3>
            <div className="month-grid">
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(currentDate.getFullYear(), i, 1);
                return (
                  <button
                    key={i}
                    className="month-button"
                    onClick={() => {
                      setCurrentDate(month);
                      setShowMonthPicker(false);
                    }}
                  >
                    {month.toLocaleDateString('en-US', { month: 'long' })}
                  </button>
                );
              })}
            </div>
            <div className="year-controls">
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1))}>
                ← {currentDate.getFullYear() - 1}
              </button>
              <span>{currentDate.getFullYear()}</span>
              <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1))}>
                {currentDate.getFullYear() + 1} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Palette Dropdown */}
      {showColorPalette && (
        <div className="color-palette-panel">
          <div className="color-palette-content">
            <h3>Event Color Palette</h3>
            <p className="palette-subtitle">Customize colors for different event types</p>
            
            <div className="color-settings">
              <div className="color-setting-item">
                <label>Meetings</label>
                <input 
                  type="color" 
                  value={eventColors.meeting}
                  onChange={(e) => setEventColors({...eventColors, meeting: e.target.value})}
                />
                <span className="color-hex">{eventColors.meeting}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Crew Scheduling</label>
                <input 
                  type="color" 
                  value={eventColors.crew}
                  onChange={(e) => setEventColors({...eventColors, crew: e.target.value})}
                />
                <span className="color-hex">{eventColors.crew}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Site Visits</label>
                <input 
                  type="color" 
                  value={eventColors.site_visit}
                  onChange={(e) => setEventColors({...eventColors, site_visit: e.target.value})}
                />
                <span className="color-hex">{eventColors.site_visit}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Appointments</label>
                <input 
                  type="color" 
                  value={eventColors.appointment}
                  onChange={(e) => setEventColors({...eventColors, appointment: e.target.value})}
                />
                <span className="color-hex">{eventColors.appointment}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Tasks</label>
                <input 
                  type="color" 
                  value={eventColors.task}
                  onChange={(e) => setEventColors({...eventColors, task: e.target.value})}
                />
                <span className="color-hex">{eventColors.task}</span>
              </div>
              
              <div className="color-setting-item">
                <label>Subcontractors</label>
                <input 
                  type="color" 
                  value={eventColors.subcontractor}
                  onChange={(e) => setEventColors({...eventColors, subcontractor: e.target.value})}
                />
                <span className="color-hex">{eventColors.subcontractor}</span>
              </div>
            </div>
            
            <button 
              className="btn-reset-colors"
              onClick={() => setEventColors({
                meeting: '#567A8D',
                crew: '#712A18',
                site_visit: '#9A8C7A',
                appointment: '#454547',
                task: '#261312',
                subcontractor: '#D97706'
              })}
            >
              Reset to Defaults
            </button>
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
                                  <button 
                                    className="event-delete-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEvent(event.id);
                                    }}
                                    title="Delete event"
                                  >
                                    ×
                                  </button>
                                  <button 
                                    className="event-delete-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEvent(event.id);
                                    }}
                                    title="Delete event"
                                  >
                                    ×
                                  </button>
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
                        <option value="subcontractor">Subcontractor</option>
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
                      <button className="btn-delete" onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}>Delete</button>
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
