'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './new-job.css';

export default function NewJob() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Customer Information
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_secondary_phone: '',
    
    // Job Location
    job_address: '',
    job_city: '',
    job_state: 'OR',
    job_zip: '',
    
    // Project Details
    project_type: '',
    work_description: '',
    estimated_budget: '',
    timeline: '',
    
    // First Meeting
    first_meeting_date: '',
    first_meeting_time: '',
    meeting_notes: '',
    
    // Source & Priority
    lead_source: 'website',
    priority: 'medium',
    
    // Internal Notes
    internal_notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customer_name || !formData.job_address || !formData.customer_email || !formData.customer_phone) {
      alert('Please fill in all required fields (Customer Name, Address, Email, and Phone)');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch('/api/admin/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin');
        return;
      }

      const data = await res.json();

      if (res.ok) {
        alert('Job intake created successfully!');
        router.push('/admin/jobs');
      } else {
        alert(data.error || 'Failed to create job');
        setSaving(false);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An error occurred while creating the job');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/admin/jobs');
    }
  };

  return (
    <div className="new-job-container">
      <div className="new-job-header">
        <button onClick={handleCancel} className="back-btn">
          ← Cancel
        </button>
        <h1>New Job Intake</h1>
      </div>

      <form onSubmit={handleSubmit} className="job-intake-form">
        {/* Customer Information Section */}
        <div className="form-section">
          <h2>Customer Information</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Customer Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="customer@example.com"
                required
              />
            </div>

            <div className="form-field">
              <label>Primary Phone *</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder="(503) 555-1234"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Secondary Phone</label>
              <input
                type="tel"
                name="customer_secondary_phone"
                value={formData.customer_secondary_phone}
                onChange={handleChange}
                placeholder="(503) 555-5678"
              />
            </div>
          </div>
        </div>

        {/* Job Location Section */}
        <div className="form-section">
          <h2>Job Location</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Street Address *</label>
              <input
                type="text"
                name="job_address"
                value={formData.job_address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-field">
              <label>City</label>
              <input
                type="text"
                name="job_city"
                value={formData.job_city}
                onChange={handleChange}
                placeholder="Portland"
              />
            </div>

            <div className="form-field">
              <label>State</label>
              <select
                name="job_state"
                value={formData.job_state}
                onChange={handleChange}
              >
                <option value="OR">Oregon</option>
                <option value="WA">Washington</option>
                <option value="CA">California</option>
                <option value="ID">Idaho</option>
              </select>
            </div>

            <div className="form-field">
              <label>ZIP Code</label>
              <input
                type="text"
                name="job_zip"
                value={formData.job_zip}
                onChange={handleChange}
                placeholder="97201"
              />
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="form-section">
          <h2>Project Details</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Project Type</label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Remodel">Remodel</option>
                <option value="New Construction">New Construction</option>
                <option value="Addition">Addition</option>
                <option value="Repair">Repair</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Deck/Patio">Deck/Patio</option>
                <option value="Siding">Siding</option>
                <option value="Roofing">Roofing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Estimated Budget</label>
              <input
                type="text"
                name="estimated_budget"
                value={formData.estimated_budget}
                onChange={handleChange}
                placeholder="$50,000 - $100,000"
              />
            </div>

            <div className="form-field full-width">
              <label>Desired Timeline</label>
              <input
                type="text"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="e.g., Start in Spring 2025, 3-4 months duration"
              />
            </div>

            <div className="form-field full-width">
              <label>Work Description</label>
              <textarea
                name="work_description"
                value={formData.work_description}
                onChange={handleChange}
                placeholder="Describe the work to be performed..."
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* First Meeting Section */}
        <div className="form-section">
          <h2>First Meeting / Site Visit</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Meeting Date</label>
              <input
                type="date"
                name="first_meeting_date"
                value={formData.first_meeting_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>Meeting Time</label>
              <input
                type="time"
                name="first_meeting_time"
                value={formData.first_meeting_time}
                onChange={handleChange}
              />
            </div>

            <div className="form-field full-width">
              <label>Meeting Notes</label>
              <textarea
                name="meeting_notes"
                value={formData.meeting_notes}
                onChange={handleChange}
                placeholder="Notes about the scheduled meeting..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Lead Source & Priority Section */}
        <div className="form-section">
          <h2>Lead Information</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Lead Source</label>
              <select
                name="lead_source"
                value={formData.lead_source}
                onChange={handleChange}
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="phone">Phone Call</option>
                <option value="email">Email</option>
                <option value="social_media">Social Media</option>
                <option value="repeat_customer">Repeat Customer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Internal Notes Section */}
        <div className="form-section">
          <h2>Internal Notes</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Notes (Internal Only)</label>
              <textarea
                name="internal_notes"
                value={formData.internal_notes}
                onChange={handleChange}
                placeholder="Any internal notes or follow-up items..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Creating Job...' : 'Create Job Intake'}
          </button>
        </div>
      </form>
    </div>
  );
}
