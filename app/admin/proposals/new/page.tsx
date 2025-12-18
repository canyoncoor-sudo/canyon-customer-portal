"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './new-proposal.css';

export default function NewProposal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customer_name: '',
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
      alert(`✅ Proposal created successfully!\n\nCustomer Access:\nAddress: ${formData.project_address}\nCode: ${formData.access_code}\n\nShare these credentials with your customer.`);
      
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
          <h1>Create New Proposal</h1>
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
                <label htmlFor="customer_name">Customer Name *</label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="John Smith"
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

              <div className="form-field full-width">
                <label htmlFor="project_address">Project Address *</label>
                <input
                  type="text"
                  id="project_address"
                  name="project_address"
                  value={formData.project_address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Portland, OR 97201"
                  required
                />
                <small>This will be used as the customer's login username</small>
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
