'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './send-proposal.css';

interface Job {
  id: string;
  job_address: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  access_code_plain: string | null;
  intake: {
    job_city?: string;
    job_state?: string;
  } | null;
}

export default function SendProposalEmail() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [portalLink, setPortalLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch job');

      const data = await res.json();
      setJob(data.job);
      
      // Generate default email content
      generateEmailContent(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load job details');
      router.push('/admin/jobs');
    }
  };

  const generateEmailContent = (jobData: Job) => {
    const firstName = jobData.customer_name.split(' ')[0];
    const accessCode = jobData.access_code_plain || 'CANYON-XXXX';
    const city = jobData.intake?.job_city || 'your area';
    
    // Generate portal link (update with your actual domain when deployed)
    const link = `${window.location.origin}`;
    setPortalLink(link);

    // Default subject
    setEmailSubject(`Your Project Proposal from Canyon Construction`);

    // Default body
    const body = `Hi ${firstName},

It was wonderful meeting with you! We're excited about the opportunity to work on your beautiful home in ${city}.

We've prepared a detailed proposal for your project. You can view it anytime through your personal client portal.

🔐 Your Portal Access Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Portal Link: ${link}
Project Address: ${jobData.job_address}
Access Code: ${accessCode}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What You'll Find in Your Portal:
✓ Detailed project proposal with pricing
✓ Timeline and scope of work
✓ Easy proposal acceptance
✓ Secure document storage
✓ Project progress tracking (once started)

To access your portal:
1. Visit the link above
2. Enter your project address: ${jobData.job_address}
3. Enter your access code: ${accessCode}

If you have any questions or would like to discuss the proposal, please don't hesitate to reach out. We're here to help!

Looking forward to working with you.

Best regards,
Canyon Construction Inc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Reply to this email
📞 Call us at: [Your Phone Number]
🌐 Visit: [Your Website]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    setEmailBody(body);
  };

  const handleCopyAll = () => {
    const fullEmail = `Subject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmailClient = () => {
    if (!job) return;
    
    const mailtoLink = `mailto:${job.customer_email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  if (loading) {
    return (
      <div className="send-proposal-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="send-proposal-container">
        <div className="error">Job not found</div>
      </div>
    );
  }

  return (
    <div className="send-proposal-container">
      <div className="send-proposal-header">
        <button onClick={() => router.push(`/admin/jobs/${jobId}`)} className="back-btn">
          ← Back to Job
        </button>
        <h1>Send Proposal Email</h1>
      </div>

      <div className="email-preview-card">
        <div className="recipient-info">
          <h3>Recipient</h3>
          <div className="info-row">
            <strong>To:</strong> {job.customer_email}
          </div>
          <div className="info-row">
            <strong>Customer:</strong> {job.customer_name}
          </div>
          <div className="info-row">
            <strong>Access Code:</strong> 
            <span className="access-code-highlight">{job.access_code_plain || 'Not generated yet'}</span>
          </div>
        </div>

        <div className="email-section">
          <label>Subject Line</label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="subject-input"
          />
        </div>

        <div className="email-section">
          <label>Email Body</label>
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className="email-body-textarea"
            rows={25}
          />
        </div>

        <div className="action-buttons">
          <button onClick={handleOpenEmailClient} className="btn-primary">
            📧 Open in Email Client
          </button>
          <button onClick={handleCopyBody} className="btn-secondary">
            {copied ? '✓ Copied!' : '📋 Copy Email Body'}
          </button>
          <button onClick={handleCopyAll} className="btn-secondary">
            📋 Copy Subject + Body
          </button>
        </div>

        <div className="helper-text">
          <p>💡 <strong>Tip:</strong> You can edit the email text above to personalize it before sending. 
          Click "Open in Email Client" to compose in your default email app, or copy the text to use in Gmail, Outlook, etc.</p>
        </div>
      </div>

      <div className="quick-access-card">
        <h3>Portal Access Quick Reference</h3>
        <div className="quick-access-grid">
          <div className="quick-item">
            <span className="label">Portal Link:</span>
            <span className="value">{portalLink}</span>
          </div>
          <div className="quick-item">
            <span className="label">Project Address:</span>
            <span className="value">{job.job_address}</span>
          </div>
          <div className="quick-item">
            <span className="label">Access Code:</span>
            <span className="value code">{job.access_code_plain || 'Generate code first'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
