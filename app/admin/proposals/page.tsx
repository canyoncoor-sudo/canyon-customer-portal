'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './proposals.css';

interface Job {
  id: string;
  job_address: string;
  customer_name: string;
  customer_email: string;
  status: string;
  proposal_data: {
    totalCost: number;
    createdAt: string;
  } | null;
  created_at: string;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/dashboard');
        return;
      }

      const res = await fetch('/api/admin/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch proposals');
      }

      const data = await res.json();
      
      // Filter only jobs with proposals
      const jobsWithProposals = data.jobs.filter((job: Job) => 
        job.status === 'proposal_created' && job.proposal_data
      );

      setProposals(jobsWithProposals);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setLoading(false);
    }
  };

  const handleViewProposal = (jobId: string) => {
    router.push(`/admin/jobs/${jobId}/proposal`);
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/admin/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="proposals-container">
        <div className="loading">Loading proposals...</div>
      </div>
    );
  }

  return (
    <div className="proposals-container">
      <div className="proposals-header">
        <div>
          <h1>Proposals</h1>
          <p className="subtitle">View all created proposals</p>
        </div>
        <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      {proposals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h2>No Proposals Yet</h2>
          <p>Proposals will appear here once they are created for jobs.</p>
          <button onClick={() => router.push('/admin/jobs')} className="btn-primary">
            View All Jobs
          </button>
        </div>
      ) : (
        <div className="proposals-grid">
          {proposals.map((proposal) => {
            const proposalDate = proposal.proposal_data?.createdAt 
              ? new Date(proposal.proposal_data.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'N/A';

            return (
              <div key={proposal.id} className="proposal-card">
                <div className="proposal-card-header">
                  <div className="proposal-status">
                    <span className="status-badge active">Proposal Created</span>
                  </div>
                  <div className="proposal-date">{proposalDate}</div>
                </div>

                <div className="proposal-card-body">
                  <h3 className="customer-name">{proposal.customer_name}</h3>
                  <div className="address">{proposal.job_address}</div>
                  <div className="email">{proposal.customer_email}</div>

                  {proposal.proposal_data && (
                    <div className="proposal-total">
                      <span className="total-label">Total:</span>
                      <span className="total-amount">
                        ${proposal.proposal_data.totalCost.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="proposal-card-actions">
                  <button 
                    onClick={() => handleViewProposal(proposal.id)}
                    className="btn-view-proposal"
                  >
                    📄 View Proposal
                  </button>
                  <button 
                    onClick={() => handleViewJob(proposal.id)}
                    className="btn-view-job"
                  >
                    View Job Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
