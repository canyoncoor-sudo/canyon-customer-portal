"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './new-proposal.css';

function NewProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    street_address: '',
    city: '',
    state: 'OR',
    zip_code: '',
    project_description: '',
    access_code: '',
    expiration_days: '30'
  });
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  const oregonCities = [
    'Albany', 'Ashland', 'Astoria', 'Baker City', 'Bandon', 'Beaverton', 'Bend',
    'Brookings', 'Canby', 'Central Point', 'Clatskanie', 'Columbia City', 'Coos Bay',
    'Coquille', 'Corvallis', 'Cottage Grove', 'Dallas', 'Estacada', 'Eugene',
    'Florence', 'Forest Grove', 'Gladstone', 'Grants Pass', 'Gresham', 'Happy Valley',
    'Hermiston', 'Hillsboro', 'Hood River', 'Independence', 'Junction City', 'Keizer',
    'Klamath Falls', 'La Grande', 'Lake Oswego', 'Lebanon', 'Lincoln City',
    'Madras', 'McMinnville', 'Medford', 'Milwaukie', 'Molalla', 'Monmouth',
    'Newberg', 'Newport', 'Ontario', 'Oregon City', 'Pendleton', 'Portland',
    'Prineville', 'Redmond', 'Roseburg', 'Salem', 'Sandy', 'Seaside',
    'Sherwood', 'Silverton', 'Springfield', 'St. Helens', 'Stayton', 'Sutherlin',
    'Sweet Home', 'The Dalles', 'Tigard', 'Tillamook', 'Troutdale', 'Tualatin',
    'West Linn', 'Wilsonville', 'Woodburn'
  ];

  // Pre-fill form data from URL parameters (coming from job preview)
  useEffect(() => {
    const customerName = searchParams.get('customerName');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const address = searchParams.get('address');
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const zip = searchParams.get('zip');
    const description = searchParams.get('description');
    const fromJobId = searchParams.get('jobId');

    if (customerName) {
      setFormData(prev => ({
        ...prev,
        customer_name: customerName,
        street_address: address || '',
        city: city || '',
        state: state || 'OR',
        zip_code: zip || '',
        customer_email: email || '',
        customer_phone: phone || '',
        project_description: description || '',
      }));

      if (fromJobId) {
        setJobId(fromJobId);
      }
    }
  }, [searchParams]);

  const generateAccessCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `CANYON-${randomNum}`;
    setGeneratedCode(code);
    setFormData({ ...formData, access_code: code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.street_address) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.access_code) {
      alert('Please generate an access code');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/admin/proposals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          project_address: `${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}`.trim(),
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create proposal');
      }

      const data = await res.json();
      alert(`Proposal created successfully! Access code: ${formData.access_code}`);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="new-proposal-container">
      <div className="new-proposal-header">
        <button onClick={() => router.back()} className="back-btn">
          ← Back
        </button>
        <h1>Create Project Proposal</h1>
      </div>

      <form onSubmit={handleSubmit} className="proposal-form">
        {/* Customer Information */}
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
              <label>Phone Number *</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder="(503) 555-1234"
                required
              />
            </div>
          </div>
        </div>

        {/* Project Location */}
        <div className="form-section">
          <h2>Project Location</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Street Address *</label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-field">
              <label>City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
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
                name="state"
                value="Oregon"
                disabled
                className="disabled-field"
              />
            </div>

            <div className="form-field">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="97201"
                maxLength={5}
              />
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="form-section">
          <h2>Project Description</h2>
          <textarea
            name="project_description"
            value={formData.project_description}
            onChange={handleChange}
            placeholder="Describe the project scope and details..."
            rows={6}
            className="full-width-textarea"
          />
        </div>

        {/* Access Code */}
        <div className="form-section">
          <h2>Proposal Access Code</h2>
          <div className="access-code-section">
            <div className="form-field">
              <label>Access Code *</label>
              <div className="code-input-group">
                <input
                  type="text"
                  name="access_code"
                  value={formData.access_code}
                  onChange={handleChange}
                  placeholder="CANYON-XXXX"
                  required
                  readOnly
                  className="code-input"
                />
                <button
                  type="button"
                  onClick={generateAccessCode}
                  className="generate-code-btn"
                >
                  Generate Code
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Expiration (Days)</label>
              <select
                name="expiration_days"
                value={formData.expiration_days}
                onChange={handleChange}
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="90">90 Days</option>
              </select>
            </div>
          </div>

          {generatedCode && (
            <div className="code-preview">
              <strong>Generated Code:</strong> {generatedCode}
              <p className="helper-text">Share this code with the customer to access their proposal</p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewProposal() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProposalForm />
    </Suspense>
  );
}
