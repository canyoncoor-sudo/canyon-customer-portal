"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./subcontractors.css";

interface Subcontractor {
  id: string;
  company_name: string;
  ccb_number: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  trade: string | null;
  status: string;
  notes: string | null;
}

interface SubPhoto {
  id: string;
  file_url: string;
  caption: string | null;
  created_at: string;
}

export default function SubcontractorsPage() {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [subPhotos, setSubPhotos] = useState<SubPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SubPhoto | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const job = localStorage.getItem("portal_job");

    if (!token || !job) {
      router.push("/");
      return;
    }

    fetchSubcontractors(token, JSON.parse(job).id);
  }, [router]);

  const fetchSubcontractors = async (token: string, jobId: string) => {
    try {
      const res = await fetch(`/api/subcontractors?job_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubcontractors(data.subcontractors || []);
      }
    } catch (error) {
      console.error("Error fetching subcontractors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubPhotos = async (subId: string) => {
    const token = localStorage.getItem("portal_token");
    setSelectedSub(subId);
    setLoadingPhotos(true);

    try {
      const res = await fetch(`/api/subcontractors/${subId}/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubPhotos(data.photos || []);
      }
    } catch (error) {
      console.error("Error fetching sub photos:", error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="subcontractors-page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Subcontractors</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {subcontractors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👷</div>
              <h2>No Subcontractors Yet</h2>
              <p>Subcontractor information will appear here as they join the project.</p>
            </div>
          ) : (
            <div className="subcontractors-grid">
              {subcontractors.map((sub) => (
                <div key={sub.id} className="sub-card">
                  <div className="sub-header">
                    <h3>{sub.company_name}</h3>
                    {sub.trade && (
                      <span className="sub-trade">{sub.trade}</span>
                    )}
                  </div>

                  <div className="sub-details">
                    {sub.ccb_number && (
                      <div className="detail-row">
                        <span className="detail-label">CCB #:</span>
                        <span className="detail-value">{sub.ccb_number}</span>
                      </div>
                    )}
                    {sub.contact_name && (
                      <div className="detail-row">
                        <span className="detail-label">Contact:</span>
                        <span className="detail-value">{sub.contact_name}</span>
                      </div>
                    )}
                    {sub.phone && (
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{sub.phone}</span>
                      </div>
                    )}
                    {sub.email && (
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{sub.email}</span>
                      </div>
                    )}
                  </div>

                  {sub.notes && (
                    <div className="sub-notes">
                      <strong>Notes:</strong> {sub.notes}
                    </div>
                  )}

                  <div className="sub-footer">
                    <div className={`status-badge status-${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </div>
                    <button
                      onClick={() => fetchSubPhotos(sub.id)}
                      className="btn-view-photos"
                    >
                      View Their Photos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photos Section */}
          {selectedSub && (
            <div className="sub-photos-section">
              <h2>
                {subcontractors.find(s => s.id === selectedSub)?.company_name}'s Photos
              </h2>
              {loadingPhotos ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              ) : subPhotos.length === 0 ? (
                <p className="no-photos">No photos from this subcontractor yet.</p>
              ) : (
                <div className="photos-grid">
                  {subPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="photo-card"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img src={photo.file_url} alt={photo.caption || "Work photo"} />
                      {photo.caption && (
                        <div className="photo-caption">{photo.caption}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
            <img src={selectedPhoto.file_url} alt={selectedPhoto.caption || "Work photo"} />
            {selectedPhoto.caption && (
              <div className="lightbox-caption">{selectedPhoto.caption}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
