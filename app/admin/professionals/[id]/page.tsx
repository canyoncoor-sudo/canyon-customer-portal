'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../professionals.css';

interface Professional {
  id: string;
  company_name: string;
  trade: string;
  ccb_number: string;
  contact_name: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  status?: string;
  created_at: string;
  google_place_id?: string;
  google_business_name?: string;
  google_rating?: number;
  google_total_reviews?: number;
  google_maps_url?: string;
  google_profile_photo_url?: string;
  is_google_verified?: boolean;
}

export default function ProfessionalDetail() {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetchProfessional();
    }
  }, [id]);

  const fetchProfessional = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch(`/api/admin/professionals/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin');
        return;
      }

      const data = await res.json();
      setProfessional(data.professional);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch professional:', error);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/professionals');
  };

  const handleEdit = () => {
    router.push(`/admin/professionals/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${professional?.company_name}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/professionals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Professional deleted successfully');
        router.push('/admin/professionals');
      } else {
        alert('Failed to delete professional');
        setDeleting(false);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('An error occurred while deleting');
      setDeleting(false);
    }
  };

  const handleGenerateAgreement = () => {
    router.push(`/admin/professionals/agreement?professionalId=${id}`);
  };

  if (loading) {
    return <div className="professionals-loading">Loading...</div>;
  }

  if (!professional) {
    return (
      <div className="professionals-container">
        <div className="professionals-header">
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
        </div>
        <div className="empty-state">
          <h3>Professional not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="professionals-container">
      <div className="professionals-header">
        <button onClick={handleBack} className="back-btn">
          ← Back to Professionals
        </button>
        <div className="header-actions">
          <button onClick={handleGenerateAgreement} className="btn-agreement">
            Generate Agreement
          </button>
          <button onClick={handleEdit} className="btn-edit">
            Edit
          </button>
          <button onClick={handleDelete} className="btn-delete" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="professional-detail">
        <div className="detail-header">
          <div className="header-left">
            {professional.google_profile_photo_url && (
              <img 
                src={professional.google_profile_photo_url} 
                alt={professional.company_name}
                className="profile-photo"
              />
            )}
            <div>
              <h1>{professional.company_name}</h1>
              <div className="detail-meta">
                <span className="trade-badge">{professional.trade}</span>
                {professional.is_google_verified && (
                  <span className="google-verified">
                    ✓ Google Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          {professional.google_rating && (
            <div className="google-rating">
              <div className="rating-stars">
                ⭐ {professional.google_rating.toFixed(1)}
              </div>
              {professional.google_total_reviews && (
                <div className="rating-count">
                  ({professional.google_total_reviews} reviews)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h2>Contact Information</h2>
            <div className="info-row">
              <label>Contact Name:</label>
              <span>{professional.contact_name}</span>
            </div>
            <div className="info-row">
              <label>Phone:</label>
              <span>{professional.phone}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{professional.email}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>License Information</h2>
            <div className="info-row">
              <label>CCB Number:</label>
              <span>{professional.ccb_number}</span>
            </div>
            <div className="info-row">
              <label>Trade:</label>
              <span>{professional.trade}</span>
            </div>
            <div className="info-row">
              <label>Status:</label>
              <span className={`status-badge status-${professional.status?.toLowerCase() || 'active'}`}>
                {professional.status || 'Active'}
              </span>
            </div>
          </div>

          {(professional.address || professional.city) && (
            <div className="detail-section">
              <h2>Address</h2>
              {professional.address && (
                <div className="info-row">
                  <label>Street:</label>
                  <span>{professional.address}</span>
                </div>
              )}
              {professional.city && (
                <div className="info-row">
                  <label>City:</label>
                  <span>{professional.city}</span>
                </div>
              )}
              {professional.state && (
                <div className="info-row">
                  <label>State:</label>
                  <span>{professional.state}</span>
                </div>
              )}
              {professional.zip && (
                <div className="info-row">
                  <label>ZIP:</label>
                  <span>{professional.zip}</span>
                </div>
              )}
            </div>
          )}

          {professional.google_business_name && (
            <div className="detail-section">
              <h2>Google Business Profile</h2>
              <div className="info-row">
                <label>Business Name:</label>
                <span>{professional.google_business_name}</span>
              </div>
              {professional.google_maps_url && (
                <div className="info-row">
                  <label>Google Maps:</label>
                  <a href={professional.google_maps_url} target="_blank" rel="noopener noreferrer" className="link">
                    View on Google Maps →
                  </a>
                </div>
              )}
            </div>
          )}

          {professional.notes && (
            <div className="detail-section full-width">
              <h2>Notes</h2>
              <p className="notes-text">{professional.notes}</p>
            </div>
          )}
        </div>

        <div className="detail-footer">
          <p className="created-date">
            Added on {new Date(professional.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
