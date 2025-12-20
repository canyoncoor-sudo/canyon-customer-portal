'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './access-code.css';

interface Job {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  job_address: string;
  job_city?: string;
  job_state?: string;
  job_zip?: string;
}

export default function GenerateAccessCode() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatedCode, setGeneratedCode] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [expirationDays, setExpirationDays] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin/dashboard');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch job');
      }

      const data = await res.json();
      
      // Extract job data with intake information
      const jobData: Job = {
        id: data.job.id,
        customer_name: data.job.customer_name,
        customer_email: data.job.customer_email,
        customer_phone: data.job.customer_phone,
        job_address: data.job.job_address,
        job_city: data.job.intake?.job_city,
        job_state: data.job.intake?.job_state,
        job_zip: data.job.intake?.job_zip,
      };
      
      setJob(jobData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Failed to load job details');
      router.push('/admin/jobs');
    }
  };

  const generateAccessCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `Canyon-${randomNum}`;
    setGeneratedCode(code);
    setAccessCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch(`/api/admin/jobs/${jobId}/access-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          access_code: accessCode,
          expiration_days: parseInt(expirationDays),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create access code');
      }

      const data = await res.json();
      
      alert(`✅ Access Code Created Successfully!\n\nCustomer: ${job?.customer_name}\n\nShare these credentials:\nAddress: ${job?.job_address}\nAccess Code: ${accessCode}\n\nExpires: ${expirationDays} days`);
      
      router.push(`/admin/jobs/${jobId}`);
    } catch (error) {
      console.error('Error creating access code:', error);
      alert(error instanceof Error ? error.message : 'Failed to create access code');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        Job not found
      </div>
    );
  }

  return (
    <div className="access-code-page">
      <div className="access-code-header">
        <button onClick={() => router.back()} className="back-btn">
          ← Back
        </button>
        <h1>Generate Customer Access Code</h1>
        <div style={{ width: '80px' }}></div>
      </div>

      <div className="access-code-content">
        <div className="customer-info-card">
          <h2>Customer Information</h2>
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{job.customer_name}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{job.customer_email}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone:</span>
            <span className="value">{job.customer_phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Project Address:</span>
            <span className="value">
              {job.job_address}
              {job.job_city && `, ${job.job_city}`}
              {job.job_state && `, ${job.job_state}`}
              {job.job_zip && ` ${job.job_zip}`}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="access-code-form">
          <div className="form-section">
            <h2>Portal Access Configuration</h2>
            
            <div className="generate-section">
              <p className="section-description">
                Generate a secure access code for your customer to view their proposal and project information.
              </p>
              <button 
                type="button" 
                onClick={generateAccessCode}
                className="generate-btn"
              >
                🔐 Generate Random Access Code
              </button>
            </div>

            {generatedCode && (
              <div className="generated-code-display">
                <div className="code-label">Generated Access Code:</div>
                <div className="code-value">{generatedCode}</div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="access_code">Access Code *</label>
              <input
                type="text"
                id="access_code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="CANYON-XXXX"
                required
                readOnly={!!generatedCode}
              />
              <small>Customer will use this code along with their name to login</small>
            </div>

            <div className="form-field">
              <label htmlFor="expiration_days">Access Valid For</label>
              <select
                id="expiration_days"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days (recommended)</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>

            <div className="credentials-preview">
              <h3>Customer Login Credentials</h3>
              <p>Share these credentials with your customer:</p>
              <div className="credentials-box">
                <div className="credential-item">
                  <span className="cred-label">Address:</span>
                  <code>{job.job_address || '[address]'}</code>
                </div>
                <div className="credential-item">
                  <span className="cred-label">Access Code:</span>
                  <code>{accessCode || '[code will appear here]'}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="btn-cancel"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting || !accessCode}
            >
              {submitting ? 'Creating...' : 'Create Access Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
