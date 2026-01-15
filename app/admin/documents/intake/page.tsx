'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './intake.css';

export default function CustomerIntakePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  
  // Address Information
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Oregon');
  const [zipCode, setZipCode] = useState('');
  
  // Project Information
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [timelineEstimate, setTimelineEstimate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [leadSource, setLeadSource] = useState('');
  
  // Meeting/Site Visit Information
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  
  // Internal Notes
  const [internalNotes, setInternalNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('Creating intake form...');

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setStatus('Error: Not authenticated');
        setSaving(false);
        return;
      }

      // Combine date and time for meeting
      const meetingDateTime = meetingDate && meetingTime 
        ? `${meetingDate}T${meetingTime}:00`
        : null;

      const response = await fetch('/api/admin/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer: {
            name: customerName,
            email,
            phone,
            secondary_phone: secondaryPhone,
            address: street,
            city,
            state,
            zip_code: zipCode
          },
          project: {
            project_name: projectName,
            project_type: projectType,
            description,
            budget_estimate: budgetEstimate,
            timeline_estimate: timelineEstimate,
            priority,
            lead_source: leadSource,
            meeting_date: meetingDateTime,
            meeting_notes: meetingNotes,
            internal_notes: internalNotes
          },
          scheduleMeeting: !!meetingDateTime
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create intake form');
      }

      setStatus('✓ Intake form created successfully!');
      
      setTimeout(() => {
        router.push('/admin/documents');
      }, 1500);

    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      setSaving(false);
    }
  };

  return (
    <div className="intake-container">
      <div className="intake-header">
        <button className="back-btn" onClick={() => router.back()}>
          ← Back to Documents
        </button>
        <h1>Customer Intake Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="intake-form">
        {/* Customer Information Section */}
        <section className="form-section">
          <h2>Customer Information</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Primary Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="503-555-1234"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Secondary Phone</label>
              <input
                type="tel"
                value={secondaryPhone}
                onChange={(e) => setSecondaryPhone(e.target.value)}
                placeholder="503-555-5678"
              />
            </div>
          </div>
        </section>

        {/* Address Information Section */}
        <section className="form-section">
          <h2>Project Address</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Street Address *</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Portland"
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={state}
                disabled
              />
            </div>

            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="97201"
                required
              />
            </div>
          </div>
        </section>

        {/* Project Information Section */}
        <section className="form-section">
          <h2>Project Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Kitchen Remodel"
                required
              />
            </div>

            <div className="form-group">
              <label>Project Type *</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
              >
                <option value="">Select type...</option>
                <option value="Remodel">Remodel</option>
                <option value="Addition">Addition</option>
                <option value="New Construction">New Construction</option>
                <option value="Repair">Repair</option>
                <option value="Renovation">Renovation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Project Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project scope, requirements, and any special considerations..."
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Budget Estimate</label>
              <input
                type="text"
                value={budgetEstimate}
                onChange={(e) => setBudgetEstimate(e.target.value)}
                placeholder="$50,000 - $75,000"
              />
            </div>

            <div className="form-group">
              <label>Timeline Estimate</label>
              <input
                type="text"
                value={timelineEstimate}
                onChange={(e) => setTimelineEstimate(e.target.value)}
                placeholder="6-8 weeks"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Lead Source</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
              >
                <option value="">Select source...</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Repeat Customer">Repeat Customer</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Meeting/Site Visit Section */}
        <section className="form-section highlight">
          <h2>Schedule Site Visit</h2>
          <p className="section-note">
            Setting a meeting date will automatically create a pending event in your schedule
          </p>
          <div className="form-grid">
            <div className="form-group">
              <label>Meeting Date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Meeting Time</label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Meeting Notes</label>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Add any notes about the scheduled meeting or site visit..."
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Internal Notes Section */}
        <section className="form-section">
          <h2>Internal Notes</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Private Notes (Not visible to customer)</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add any internal notes, concerns, or follow-up items..."
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create Intake Form'}
          </button>
        </div>

        {status && (
          <div className={`status-message ${status.includes('✓') ? 'success' : 'error'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
