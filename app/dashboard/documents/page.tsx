"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./documents.css";

interface Document {
  id: string;
  document_type: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("portal_token");
    const job = localStorage.getItem("portal_job");

    if (!token || !job) {
      router.push("/");
      return;
    }

    fetchDocuments(token, JSON.parse(job).id);
  }, [router]);

  const fetchDocuments = async (token: string, jobId: string) => {
    try {
      const res = await fetch(`/api/documents?job_id=${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, title: string) => {
    window.open(url, "_blank");
  };

  const getFileExtension = (url: string): string => {
    const parts = url.split(".");
    return parts[parts.length - 1].toUpperCase();
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const documentTypes = ["All", "Contract", "Permit", "Invoice", "Other"];

  const filteredDocuments =
    filter === "All"
      ? documents
      : documents.filter((doc) => doc.document_type === filter);

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="documents-page">
      <header className="page-header">
        <div className="header-content">
          <button onClick={() => router.push("/dashboard")} className="btn-back">
            ← Back to Dashboard
          </button>
          <h1>Documents</h1>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          {documents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h2>No Documents Yet</h2>
              <p>Project documents will be uploaded here as they become available.</p>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div className="filter-tabs">
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`filter-tab ${filter === type ? "active" : ""}`}
                  >
                    {type}
                    {type === "All" && (
                      <span className="count">{documents.length}</span>
                    )}
                    {type !== "All" && (
                      <span className="count">
                        {documents.filter((d) => d.document_type === type).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Documents List */}
              <div className="documents-list">
                {filteredDocuments.length === 0 ? (
                  <div className="no-results">
                    <p>No {filter.toLowerCase()} documents found.</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <div key={doc.id} className="document-card">
                      <div className="doc-icon">
                        <div className="file-type-badge">
                          {getFileExtension(doc.file_url)}
                        </div>
                      </div>

                      <div className="doc-content">
                        <div className="doc-header">
                          <h3>{doc.title}</h3>
                          <div className="doc-type-badge">{doc.document_type}</div>
                        </div>

                        {doc.description && (
                          <p className="doc-description">{doc.description}</p>
                        )}

                        <div className="doc-meta">
                          <span className="doc-date">
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                          <span className="doc-separator">•</span>
                          <span className="doc-size">
                            {formatFileSize(doc.file_size)}
                          </span>
                        </div>
                      </div>

                      <div className="doc-actions">
                        <button
                          onClick={() => handleDownload(doc.file_url, doc.title)}
                          className="btn-download"
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
