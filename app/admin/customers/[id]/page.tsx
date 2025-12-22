'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import './customer-portal.css';

interface CustomerPortalData {
  job: any;
  documents: any[];
  photos: any[];
  timeline: any[];
  payments: any[];
}

export default function CustomerPortalAdminView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [portalData, setPortalData] = useState<CustomerPortalData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCustomerPortalData();
  }, [resolvedParams.id]);

  const fetchCustomerPortalData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`/api/admin/customers/${resolvedParams.id}/portal`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/');
        return;
      }

      const data = await res.json();
      setPortalData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customer portal data:', error);
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    // TODO: Implement photo upload logic
    setTimeout(() => {
      setUploadingPhoto(false);
      alert('Photo upload functionality coming soon!');
    }, 1000);
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocument(true);
    // TODO: Implement document upload logic
    setTimeout(() => {
      setUploadingDocument(false);
      alert('Document upload functionality coming soon!');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading customer portal...</p>
      </div>
    );
  }

  if (!portalData || !portalData.job) {
    return (
      <div className="admin-loading">
        <p>Customer not found</p>
        <button onClick={() => router.back()} className="back-btn">← Go Back</button>
      </div>
    );
  }

  const { job, documents, photos, timeline, payments } = portalData;

  return (
    <div className="customer-portal-admin">
      <header className="portal-admin-header">
        <div className="header-controls">
          <button onClick={() => router.back()} className="back-btn">← Back to Customers</button>
          <div className="admin-badge">ADMIN VIEW</div>
        </div>
        
        <div className="portal-header-content">
          <div className="customer-header-info">
            <h1>{job.customer_name}</h1>
            <p className="job-address">{job.job_address}, {job.city}, {job.state}</p>
          </div>
          <div className="quick-actions">
            <label className="upload-btn">
              📸 Add Photos
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </label>
            <label className="upload-btn">
              📄 Add Document
              <input 
                type="file" 
                onChange={handleDocumentUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <nav className="portal-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents ({documents?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos ({photos?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline ({timeline?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments ({payments?.length || 0})
          </button>
        </nav>
      </header>

      <main className="portal-admin-main">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="info-cards">
              <div className="info-card">
                <h3>Project Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Type</span>
                    <span className="value">{job.project_type || 'Not specified'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status</span>
                    <span className="value">{job.status || 'Active'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Budget</span>
                    <span className="value">{job.estimated_budget || 'TBD'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Timeline</span>
                    <span className="value">{job.estimated_timeline || 'TBD'}</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Email</span>
                    <span className="value">{job.customer_email || 'No email'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phone</span>
                    <span className="value">{job.customer_phone || 'No phone'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Alt Phone</span>
                    <span className="value">{job.customer_phone_2 || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {job.project_description && (
              <div className="description-card">
                <h3>Project Description</h3>
                <p>{job.project_description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-section">
            <div className="section-header">
              <h2>Documents</h2>
              <label className="add-btn">
                + Add Document
                <input 
                  type="file" 
                  onChange={handleDocumentUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingDocument}
                />
              </label>
            </div>
            
            {uploadingDocument && (
              <div className="upload-progress">Uploading...</div>
            )}

            <div className="documents-grid">
              {documents && documents.length > 0 ? (
                documents.map((doc, index) => (
                  <div key={index} className="document-card">
                    <div className="doc-icon">📄</div>
                    <div className="doc-info">
                      <h4>{doc.name || `Document ${index + 1}`}</h4>
                      <p>{doc.type || 'PDF'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No documents yet. Upload documents for your customer to view.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="photos-section">
            <div className="section-header">
              <h2>Project Photos</h2>
              <label className="add-btn">
                + Add Photos
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>

            {uploadingPhoto && (
              <div className="upload-progress">Uploading photos...</div>
            )}

            <div className="photos-grid">
              {photos && photos.length > 0 ? (
                photos.map((photo, index) => (
                  <div key={index} className="photo-card">
                    <img src={photo.url} alt={photo.caption || 'Project photo'} />
                    <p className="photo-caption">{photo.caption}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No photos yet. Add photos to share project progress with your customer.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-section">
            <h2>Project Timeline</h2>
            {timeline && timeline.length > 0 ? (
              <div className="timeline-items">
                {timeline.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-date">{item.date}</div>
                    <div className="timeline-content">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No timeline events yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="payments-section">
            <h2>Payment History</h2>
            {payments && payments.length > 0 ? (
              <div className="payments-list">
                {payments.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-info">
                      <h4>{payment.description}</h4>
                      <p>{payment.date}</p>
                    </div>
                    <div className="payment-amount">${payment.amount}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No payment records yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
