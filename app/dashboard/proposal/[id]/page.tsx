'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import './proposal-customer.css';

interface LineItem {
  scope: string;
  description: string;
  cost: number;
}

interface ProposalData {
  lineItems: LineItem[];
  totalCost: number;
  createdAt: string;
}

interface Job {
  id: string;
  job_address: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  proposal_data: ProposalData | null;
  project_description?: string;
}

function ProposalContent() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params.id as string;
  const previewToken = searchParams.get('preview_token');

  useEffect(() => {
    fetchProposal();
  }, [jobId]);

  const fetchProposal = async () => {
    try {
      // Use preview token if in admin preview mode, otherwise use customer token
      const token = previewToken || localStorage.getItem('portal_token');
      
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/customer/job', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch proposal');
      }

      const data = await res.json();
      
      if (!data.job.proposal_data) {
        alert('No proposal available yet');
        router.push(previewToken ? `/dashboard?preview_token=${previewToken}` : '/dashboard');
        return;
      }

      setJob(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proposal:', error);
      alert('Failed to load proposal');
      router.push(previewToken ? `/dashboard?preview_token=${previewToken}` : '/dashboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    if (previewToken) {
      router.push(`/dashboard?preview_token=${previewToken}`);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="proposal-customer-container">
        <div className="loading">Loading proposal...</div>
      </div>
    );
  }

  if (!job || !job.proposal_data) {
    return null;
  }

  const { proposal_data } = job;
  const createdDate = new Date(proposal_data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="proposal-customer-container">
      <div className="proposal-customer-header no-print">
        <button onClick={handleBack} className="back-btn">
          ← Back to Portal
        </button>
        <div className="header-actions">
          <button onClick={handlePrint} className="btn-print">
            Print Proposal
          </button>
        </div>
      </div>

      <div className="proposal-document">
        {/* Header */}
        <div className="doc-header">
          <h1>PROJECT PROPOSAL</h1>
          <div className="company-name">Canyon Construction Inc.</div>
          <div className="proposal-date">Date: {createdDate}</div>
        </div>

        {/* Client Information */}
        <div className="proposal-section">
          <h2>Prepared For:</h2>
          <div className="client-info">
            <div className="info-row">
              <strong>{job.customer_name}</strong>
            </div>
            <div className="info-row">{job.job_address}</div>
            {job.customer_email && <div className="info-row">{job.customer_email}</div>}
            {job.customer_phone && <div className="info-row">{job.customer_phone}</div>}
          </div>
        </div>

        {/* Project Description */}
        {job.project_description && (
          <div className="proposal-section">
            <h2>Project Description</h2>
            <p className="project-description">{job.project_description}</p>
          </div>
        )}

        {/* Scope of Work */}
        <div className="proposal-section">
          <h2>Scope of Work & Pricing</h2>
          <table className="line-items-table">
            <thead>
              <tr>
                <th>Scope of Work</th>
                <th>Description</th>
                <th className="cost-column">Cost</th>
              </tr>
            </thead>
            <tbody>
              {proposal_data.lineItems.map((item, index) => (
                <tr key={index}>
                  <td className="scope-cell">{item.scope}</td>
                  <td className="description-cell">{item.description}</td>
                  <td className="cost-cell">${item.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan={2} className="total-label">Total Project Cost</td>
                <td className="total-cost">${proposal_data.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Terms & Conditions */}
        <div className="proposal-section">
          <h2>Terms & Conditions</h2>
          <div className="terms-content">
            <p><strong>Payment Terms:</strong> Payment schedule to be determined upon contract signing.</p>
            <p><strong>Timeline:</strong> Project timeline will be confirmed upon acceptance of this proposal.</p>
            <p><strong>Validity:</strong> This proposal is valid for 30 days from the date above.</p>
            <p><strong>Changes:</strong> Any changes to the scope of work may affect the total cost and timeline.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="proposal-footer">
          <p>We appreciate the opportunity to work with you on this project.</p>
          <p className="contact-info">
            For questions or to accept this proposal, please contact us at your convenience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProposalCustomerPage() {
  return (
    <Suspense fallback={
      <div className="proposal-customer-container">
        <div className="loading">Loading proposal...</div>
      </div>
    }>
      <ProposalContent />
    </Suspense>
  );
}
