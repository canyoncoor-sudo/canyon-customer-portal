"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './new-proposal.css';

function NewProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    project_address: '',
    city: '',
    state: '',
    zip_code: '',
    email: '',
    phone: '',
    project_description: '',
    access_code: '',
    expiration_days: '30'
  });
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

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
      // Split customer name into first and last
      const nameParts = customerName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData(prev => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        project_address: address || '',
        city: city || '',
        state: state || '',
        zip_code: zip || '',
        email: email || '',
        phone: phone || '',
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
        body: JSON.stringify(formData),
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
      
      // Show success message with access code
      alert(`✅ Proposal created successfully!\n\nCustomer: ${formData.first_name} ${formData.last_name}\n\nCustomer Access:\nAddress: ${formData.project_address}\nCode: ${formData.access_code}\n\nShare these credentials with your customer.`);
      
      // Store the job ID and redirect to dashboard to see the new proposal
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
    <div className="new-proposal">
      <header className="proposal-header">
        <div className="header-content">
          <button onClick={() => router.back()} className="back-btn">
            ← Back
          </button>
          <div>
            <h1>Create New Proposal</h1>
            {jobId && (
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#567A8D', fontWeight: 600 }}>
                📋 Pre-filled from Job Intake
              </p>
            )}
          </div>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      <div className="proposal-content">
        <form onSubmit={handleSubmit} className="proposal-form">
          {/* Customer Information */}
          <div className="form-section">
            <h2>Customer Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Smith"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="project_address">Street Address *</label>
                <input
                  type="text"
                  id="project_address"
                  name="project_address"
                  value={formData.project_address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  required
                />
                <small>This will be used as the customer's login username</small>
              </div>

              <div className="form-field">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Portland"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="OR"
                  maxLength={2}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="zip_code">ZIP Code *</label>
                <input
                  type="text"
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="97201"
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(503) 555-0100"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Access Code Section */}
          <div className="form-section access-code-section">
            <h2>Portal Access</h2>
            <div className="access-code-box">
              <div className="access-code-header">
                <p>Generate a secure access code for your customer to view this proposal</p>
                <button 
                  type="button" 
                  onClick={generateAccessCode}
                  className="generate-btn"
                >
                  🔐 Generate Access Code
                </button>
              </div>
              
              {generatedCode && (
                <div className="generated-code-display">
                  <div className="code-label">Customer Access Code:</div>
                  <div className="code-value">{generatedCode}</div>
                  <div className="code-instructions">
                    <strong>Share with customer:</strong>
                    <ul>
                      <li>Address: <code>{formData.project_address || '[enter project address]'}</code></li>
                      <li>Access Code: <code>{generatedCode}</code></li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="form-field" style={{ marginTop: '20px' }}>
                <label htmlFor="access_code">Access Code *</label>
                <input
                  type="text"
                  id="access_code"
                  name="access_code"
                  value={formData.access_code}
                  onChange={handleChange}
                  placeholder="CANYON-XXXX"
                  required
                  readOnly={!!generatedCode}
                />
              </div>

              <div className="form-field">
                <label htmlFor="expiration_days">Proposal Valid For (days)</label>
                <select
                  id="expiration_days"
                  name="expiration_days"
                  value={formData.expiration_days}
                  onChange={handleChange}
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days (recommended)</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="form-section">
            <h2>Project Details</h2>
            <div className="form-field full-width">
              <label htmlFor="project_description">Project Description</label>
              <textarea
                id="project_description"
                name="project_description"
                value={formData.project_description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of the project scope..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading || !formData.access_code}
            >
              {loading ? 'Creating...' : 'Create Proposal & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewProposal() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>}>
      <NewProposalForm />
    </Suspense>
  );
}
