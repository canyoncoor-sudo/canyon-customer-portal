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
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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
    const accessCode = jobData.access_code_plain || 'Canyon-XXXX';
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
Your Name: ${jobData.customer_name}
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
2. Enter your name: ${jobData.customer_name}
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

  const handleSendEmail = async () => {
    if (!job) return;
    
    setSending(true);
    setSendStatus(null);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          to: job.customer_email,
          subject: emailSubject,
          body: emailBody,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSendStatus({
        type: 'success',
        message: `✅ Email sent successfully to ${job.customer_email}!`
      });

      // Optionally redirect back to job after a delay
      setTimeout(() => {
        router.push(`/admin/jobs/${jobId}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error sending email:', error);
      setSendStatus({
        type: 'error',
        message: error.message || 'Failed to send email. Try using "Open in Email Client" instead.'
      });
    } finally {
      setSending(false);
    }
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
          <button 
            onClick={handleSendEmail} 
            className="btn-send-now"
            disabled={sending || !job?.customer_email}
          >
            {sending ? '📤 Sending...' : '📧 Send Email Now'}
          </button>
          <button onClick={handleOpenEmailClient} className="btn-secondary">
            📧 Open in Email Client
          </button>
          <button onClick={handleCopyBody} className="btn-secondary">
            {copied ? '✓ Copied!' : '📋 Copy Email Body'}
          </button>
        </div>

        {sendStatus && (
          <div className={`send-status ${sendStatus.type}`}>
            {sendStatus.message}
          </div>
        )}

        <div className="helper-text">
          <p>💡 <strong>Send Email Now:</strong> Sends directly from the system to {job?.customer_email}</p>
          <p>💡 <strong>Open in Email Client:</strong> Opens your default email app (Outlook, Gmail, etc.)</p>
          <p>💡 <strong>Copy Email Body:</strong> Copy text to paste into any email service</p>
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
            <span className="label">Customer Name:</span>
            <span className="value">{job.customer_name}</span>
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
