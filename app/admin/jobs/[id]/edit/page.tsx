'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './edit-job.css';

// Oregon cities with ZIP codes
const OREGON_CITIES_ZIP: { [key: string]: string[] } = {
  'Portland': ['97201', '97202', '97203', '97204', '97205', '97206', '97209', '97210', '97211', '97212', '97213', '97214', '97215', '97216', '97217', '97218', '97219', '97220', '97221', '97222', '97223', '97224', '97225', '97227', '97229', '97230', '97231', '97232', '97233', '97236', '97239'],
  'Salem': ['97301', '97302', '97303', '97304', '97305', '97306', '97310'],
  'Eugene': ['97401', '97402', '97403', '97404', '97405', '97408'],
  'Gresham': ['97030', '97080'],
  'Hillsboro': ['97123', '97124'],
  'Beaverton': ['97005', '97006', '97007', '97008', '97078'],
  'Bend': ['97701', '97702', '97703', '97707', '97708', '97709'],
  'Medford': ['97501', '97502', '97504'],
  'Springfield': ['97477', '97478'],
  'Corvallis': ['97330', '97331', '97333', '97339'],
  'Albany': ['97321', '97322'],
  'Tigard': ['97223', '97224'],
  'Lake Oswego': ['97034', '97035'],
  'Keizer': ['97303', '97307'],
  'Grants Pass': ['97526', '97527', '97528'],
  'Oregon City': ['97045'],
  'McMinnville': ['97128'],
  'Redmond': ['97756'],
  'Tualatin': ['97062'],
  'West Linn': ['97068'],
  'Woodburn': ['97071'],
  'Forest Grove': ['97116'],
  'Newberg': ['97132'],
  'Wilsonville': ['97070'],
  'Roseburg': ['97470', '97471'],
  'Klamath Falls': ['97601', '97603'],
  'Ashland': ['97520'],
  'Milwaukie': ['97222', '97267'],
  'Sherwood': ['97140'],
  'Happy Valley': ['97086'],
  'Canby': ['97013'],
  'Hermiston': ['97838'],
  'Pendleton': ['97801'],
  'Central Point': ['97502'],
  'The Dalles': ['97058'],
  'Coos Bay': ['97420'],
  'Lebanon': ['97355'],
  'Dallas': ['97338'],
  'Troutdale': ['97060'],
  'Monmouth': ['97361'],
  'Gladstone': ['97027'],
  'Newport': ['97365', '97366'],
  'Astoria': ['97103'],
  'Hood River': ['97031'],
  'La Grande': ['97850'],
  'Lincoln City': ['97367', '97368'],
  'Cottage Grove': ['97424'],
  'Sandy': ['97055'],
  'Ontario': ['97914'],
  'St. Helens': ['97051'],
  'Florence': ['97439'],
  'Seaside': ['97138'],
  'Sweet Home': ['97386'],
  'Baker City': ['97814'],
  'Prineville': ['97754'],
  'Stayton': ['97383'],
  'Sutherlin': ['97479'],
  'Brookings': ['97415'],
  'Molalla': ['97038'],
  'Independence': ['97351'],
  'Silverton': ['97381'],
  'Madras': ['97741'],
  'Coquille': ['97423'],
  'Junction City': ['97448'],
  'Estacada': ['97023'],
  'Columbia City': ['97018'],
  'Bandon': ['97411']
};

export default function EditJob() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  // Portal Jobs fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [jobAddress, setJobAddress] = useState('');
  const [status, setStatus] = useState('active');

  // Job Intakes fields
  const [customerSecondaryPhone, setCustomerSecondaryPhone] = useState('');
  const [jobCity, setJobCity] = useState('');
  const [jobState, setJobState] = useState('Oregon');
  const [jobZip, setJobZip] = useState('');
  const [projectType, setProjectType] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [firstMeetingDatetime, setFirstMeetingDatetime] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [priority, setPriority] = useState('medium');
  const [internalNotes, setInternalNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableZips, setAvailableZips] = useState<string[]>([]);

  const oregonCities = Object.keys(OREGON_CITIES_ZIP).sort();

  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  useEffect(() => {
    // Update available ZIP codes when city changes
    if (jobCity && OREGON_CITIES_ZIP[jobCity]) {
      setAvailableZips(OREGON_CITIES_ZIP[jobCity]);
      // If current ZIP doesn't match city, clear it
      if (jobZip && !OREGON_CITIES_ZIP[jobCity].includes(jobZip)) {
        setJobZip('');
      }
    } else {
      setAvailableZips([]);
    }
  }, [jobCity]);

  const fetchJobData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch job');

      const data = await res.json();
      const job = data.job;

      // Set portal_jobs fields
      setCustomerName(job.customer_name || '');
      setCustomerEmail(job.customer_email || '');
      setCustomerPhone(job.customer_phone || '');
      setJobAddress(job.job_address || '');
      setStatus(job.status || 'active');

      // Set job_intakes fields if they exist
      if (job.intake) {
        setCustomerSecondaryPhone(job.intake.customer_secondary_phone || '');
        setJobCity(job.intake.job_city || '');
        setJobState(job.intake.job_state || 'Oregon');
        setJobZip(job.intake.job_zip || '');
        setProjectType(job.intake.project_type || '');
        setWorkDescription(job.intake.work_description || '');
        setEstimatedBudget(job.intake.estimated_budget || '');
        setTimeline(job.intake.timeline || '');
        setFirstMeetingDatetime(job.intake.first_meeting_datetime || '');
        setMeetingNotes(job.intake.meeting_notes || '');
        setLeadSource(job.intake.lead_source || '');
        setPriority(job.intake.priority || 'medium');
        setInternalNotes(job.intake.internal_notes || '');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load job data');
      router.push('/admin/jobs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch(`/api/admin/jobs/${jobId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          // Portal jobs fields
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          job_address: jobAddress,
          status: status,
          
          // Job intakes fields
          intake: {
            customer_secondary_phone: customerSecondaryPhone,
            job_city: jobCity,
            job_state: jobState,
            job_zip: jobZip,
            project_type: projectType,
            work_description: workDescription,
            estimated_budget: estimatedBudget,
            timeline: timeline,
            first_meeting_datetime: firstMeetingDatetime || null,
            meeting_notes: meetingNotes,
            lead_source: leadSource,
            priority: priority,
            internal_notes: internalNotes,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update job');
      }

      alert('Job updated successfully!');
      router.push(`/admin/jobs/${jobId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-job-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="edit-job-container">
      <div className="edit-job-header">
        <button onClick={() => router.push(`/admin/jobs/${jobId}`)} className="back-btn">
          ← Back to Job
        </button>
        <h1>Edit Job Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="edit-job-form">
        {/* Customer Information */}
        <section className="form-section">
          <h2>Customer Information</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Email *</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Primary Phone *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label>Secondary Phone</label>
              <input
                type="tel"
                value={customerSecondaryPhone}
                onChange={(e) => setCustomerSecondaryPhone(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Location Information */}
        <section className="form-section">
          <h2>Job Location</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Street Address *</label>
              <input
                type="text"
                value={jobAddress}
                onChange={(e) => setJobAddress(e.target.value)}
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="form-field">
              <label>City *</label>
              <select
                value={jobCity}
                onChange={(e) => setJobCity(e.target.value)}
                required
              >
                <option value="">Select City</option>
                {oregonCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>State</label>
              <input
                type="text"
                value={jobState}
                readOnly
                className="readonly-field"
              />
            </div>

            <div className="form-field">
              <label>ZIP Code *</label>
              <select
                value={jobZip}
                onChange={(e) => setJobZip(e.target.value)}
                required
                disabled={!jobCity}
              >
                <option value="">Select ZIP</option>
                {availableZips.map(zip => (
                  <option key={zip} value={zip}>{zip}</option>
                ))}
              </select>
              {!jobCity && <small className="field-hint">Select a city first</small>}
            </div>
          </div>
        </section>

        {/* Project Information */}
        <section className="form-section">
          <h2>Project Details</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Residential - New Construction">Residential - New Construction</option>
                <option value="Residential - Remodel">Residential - Remodel</option>
                <option value="Residential - Addition">Residential - Addition</option>
                <option value="Residential - Repair">Residential - Repair</option>
                <option value="Commercial - New Construction">Commercial - New Construction</option>
                <option value="Commercial - Remodel">Commercial - Remodel</option>
                <option value="Commercial - Tenant Improvement">Commercial - Tenant Improvement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Estimated Budget</label>
              <select
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
              >
                <option value="">Select Budget Range</option>
                <option value="Under $10,000">Under $10,000</option>
                <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                <option value="$500,000+">$500,000+</option>
              </select>
            </div>

            <div className="form-field">
              <label>Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="">Select Timeline</option>
                <option value="ASAP">ASAP</option>
                <option value="Within 1 Month">Within 1 Month</option>
                <option value="1-3 Months">1-3 Months</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="6+ Months">6+ Months</option>
                <option value="Planning Phase">Planning Phase</option>
              </select>
            </div>

            <div className="form-field">
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

            <div className="form-field full-width">
              <label>Work Description</label>
              <textarea
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                rows={4}
                placeholder="Describe the work to be done..."
              />
            </div>
          </div>
        </section>

        {/* Meeting Information */}
        <section className="form-section">
          <h2>First Meeting</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Meeting Date & Time</label>
              <input
                type="datetime-local"
                value={firstMeetingDatetime}
                onChange={(e) => setFirstMeetingDatetime(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Lead Source</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Google">Google</option>
                <option value="Social Media">Social Media</option>
                <option value="Repeat Customer">Repeat Customer</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Direct Mail">Direct Mail</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field full-width">
              <label>Meeting Notes</label>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={3}
                placeholder="Notes from the initial meeting..."
              />
            </div>
          </div>
        </section>

        {/* Internal Information */}
        <section className="form-section">
          <h2>Internal Information</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Job Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="proposal_created">Proposal Created</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-field full-width">
              <label>Internal Notes</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
                placeholder="Internal notes (not visible to customer)..."
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.push(`/admin/jobs/${jobId}`)}
            className="btn-cancel"
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
