"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./photos.css";

interface PhotoGallery {
  id: string;
  gallery_name: string;
  description: string;
  sort_order: number;
}

interface Photo {
  id: string;
  file_url: string;
  caption: string;
  created_at: string;
}

export default function PhotosPage() {
  const [galleries, setGalleries] = useState<PhotoGallery[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const job = localStorage.getItem("portal_job");

    if (!token || !job) {
      router.push("/");
      return;
    }

    setJobData(JSON.parse(job));
    fetchGalleries(token, JSON.parse(job).id);
  }, [router]);

  const fetchGalleries = async (token: string, jobId: string) => {
    try {
      const res = await fetch(`/api/galleries?job_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setGalleries(data.galleries || []);
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (galleryId: string) => {
    const token = localStorage.getItem("portal_token");
    setSelectedGallery(galleryId);
    setLoading(true);

    try {
      const res = await fetch(`/api/photos?gallery_id=${galleryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !jobData) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="photos-page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Project Photos</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {galleries.length === 0 && !loading ? (
            <div className="empty-state">
              <div className="empty-icon">📸</div>
              <h2>No Photo Galleries Yet</h2>
              <p>Your contractor will upload photos as work progresses.</p>
            </div>
          ) : (
            <div className="photos-layout">
              {/* Gallery Sidebar */}
              <aside className="gallery-sidebar">
                <h2>Photo Galleries</h2>
                <div className="gallery-list">
                  {galleries.map((gallery) => (
                    <button
                      key={gallery.id}
                      onClick={() => fetchPhotos(gallery.id)}
                      className={`gallery-item ${selectedGallery === gallery.id ? "active" : ""}`}
                    >
                      <div className="gallery-name">{gallery.gallery_name}</div>
                      {gallery.description && (
                        <div className="gallery-desc">{gallery.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Photos Grid */}
              <div className="photos-content">
                {!selectedGallery ? (
                  <div className="select-prompt">
                    <p>← Select a gallery to view photos</p>
                  </div>
                ) : loading ? (
                  <div className="loading-container">
                    <div className="spinner"></div>
                  </div>
                ) : photos.length === 0 ? (
                  <div className="empty-state">
                    <p>No photos in this gallery yet.</p>
                  </div>
                ) : (
                  <div className="photos-grid">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="photo-card"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img src={photo.file_url} alt={photo.caption || "Project photo"} />
                        {photo.caption && (
                          <div className="photo-caption">{photo.caption}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
              ✕
            </button>
            <img src={selectedPhoto.file_url} alt={selectedPhoto.caption || "Project photo"} />
            {selectedPhoto.caption && (
              <div className="lightbox-caption">{selectedPhoto.caption}</div>
            )}
            <div className="lightbox-date">
              {new Date(selectedPhoto.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
