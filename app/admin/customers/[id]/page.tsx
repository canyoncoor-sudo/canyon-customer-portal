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
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<any>(null);
  const [saving, setSaving] = useState(false);
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
      setEditedJob(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customer portal data:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedJob({ ...portalData!.job });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedJob(portalData!.job);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/customers/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedJob),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setPortalData({ ...portalData!, job: updatedData.job });
        setIsEditing(false);
        alert('Customer information updated successfully!');
      } else {
        alert('Failed to save changes. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('An error occurred while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedJob({ ...editedJob, [field]: value });
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
  const displayJob = isEditing ? editedJob : job;

  return (
    <div className="customer-portal-admin">
      <header className="portal-admin-header">
        <div className="header-controls">
          <button onClick={() => router.back()} className="back-btn">← Back to Customers</button>
          <div className="admin-badge">ADMIN VIEW</div>
        </div>
        
        <div className="portal-header-content">
          <div className="customer-header-info">
            <h1>{displayJob.customer_name}</h1>
            <p className="job-address">{displayJob.job_address}, {displayJob.city}, {displayJob.state}</p>
          </div>
          <div className="quick-actions">
            {!isEditing ? (
              <>
                <button className="edit-btn" onClick={handleEdit}>Edit Info</button>
                <label className="upload-btn">
                  Add Photos
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <label className="upload-btn">
                  Add Document
                  <input 
                    type="file" 
                    onChange={handleDocumentUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <button className="action-btn" onClick={() => router.push(`/admin/customers/${params.id}/professionals`)}>
                  Add Licensed Professionals
                </button>
              </>
            ) : (
              <>
                <button className="save-btn" onClick={handleSaveEdit} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
              </>
            )}
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
                {!isEditing ? (
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Type</span>
                      <span className="value">{displayJob.project_type || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Status</span>
                      <span className="value">{displayJob.status || 'Active'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Budget</span>
                      <span className="value">{displayJob.estimated_budget || 'TBD'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Timeline</span>
                      <span className="value">{displayJob.estimated_timeline || 'TBD'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid-edit">
                    <div className="edit-field">
                      <label>Project Type</label>
                      <input
                        type="text"
                        value={editedJob.project_type || ''}
                        onChange={(e) => handleFieldChange('project_type', e.target.value)}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Status</label>
                      <select
                        value={editedJob.status || 'Active'}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                      >
                        <option>Proposal Sent</option>
                        <option>Active</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>On Hold</option>
                      </select>
                    </div>
                    <div className="edit-field">
                      <label>Budget</label>
                      <input
                        type="text"
                        value={editedJob.estimated_budget || ''}
                        onChange={(e) => handleFieldChange('estimated_budget', e.target.value)}
                        placeholder="$10,000 - $15,000"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Timeline</label>
                      <input
                        type="text"
                        value={editedJob.estimated_timeline || ''}
                        onChange={(e) => handleFieldChange('estimated_timeline', e.target.value)}
                        placeholder="2-3 weeks"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="info-card">
                <h3>Contact Information</h3>
                {!isEditing ? (
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Email</span>
                      <span className="value">{displayJob.customer_email || 'No email'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone</span>
                      <span className="value">{displayJob.customer_phone || 'No phone'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Alt Phone</span>
                      <span className="value">{displayJob.customer_phone_2 || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address</span>
                      <span className="value">{displayJob.job_address}, {displayJob.city}, {displayJob.state} {displayJob.zip_code}</span>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid-edit">
                    <div className="edit-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editedJob.customer_email || ''}
                        onChange={(e) => handleFieldChange('customer_email', e.target.value)}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Primary Phone</label>
                      <input
                        type="tel"
                        value={editedJob.customer_phone || ''}
                        onChange={(e) => handleFieldChange('customer_phone', e.target.value)}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Secondary Phone</label>
                      <input
                        type="tel"
                        value={editedJob.customer_phone_2 || ''}
                        onChange={(e) => handleFieldChange('customer_phone_2', e.target.value)}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={editedJob.job_address || ''}
                        onChange={(e) => handleFieldChange('job_address', e.target.value)}
                      />
                    </div>
                    <div className="edit-field">
                      <label>City</label>
                      <input
                        type="text"
                        value={editedJob.city || ''}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                      />
                    </div>
                    <div className="edit-field">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        value={editedJob.zip_code || ''}
                        onChange={(e) => handleFieldChange('zip_code', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isEditing ? (
              displayJob.project_description && (
                <div className="description-card">
                  <h3>Project Description</h3>
                  <p>{displayJob.project_description}</p>
                </div>
              )
            ) : (
              <div className="description-card">
                <h3>Project Description</h3>
                <textarea
                  value={editedJob.project_description || ''}
                  onChange={(e) => handleFieldChange('project_description', e.target.value)}
                  rows={5}
                  placeholder="Enter project description..."
                />
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
            <div className="section-header">
              <h2>Project Timeline</h2>
              <button className="add-btn">+ Add Event</button>
            </div>

            <div className="timeline-list">
              {timeline && timeline.length > 0 ? (
                timeline.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-date">{event.date}</div>
                    <div className="timeline-content">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No timeline events yet. Add milestones and updates to keep your customer informed.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="payments-section">
            <div className="section-header">
              <h2>Payment Records</h2>
              <button className="add-btn">+ Add Payment</button>
            </div>

            <div className="payments-list">
              {payments && payments.length > 0 ? (
                payments.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-info">
                      <h4>{payment.description}</h4>
                      <p className="payment-date">{payment.date}</p>
                    </div>
                    <div className="payment-amount">{payment.amount}</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No payment records yet. Add payments to track project billing.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
