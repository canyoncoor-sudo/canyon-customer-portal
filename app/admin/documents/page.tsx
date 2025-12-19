'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './documents.css';

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  path: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'intake-form',
      name: 'Job Intake Form',
      description: 'Comprehensive form for new project intake with customer details, project specifications, and meeting notes',
      color: '#567A8D',
      path: '/admin/jobs/new'
    },
    {
      id: 'lien-law',
      name: 'Lien Law Document',
      description: 'Oregon construction lien law notices and documentation',
      color: '#712A18',
      path: '/admin/documents/lien-law'
    },
    {
      id: 'change-order',
      name: 'Change Order Form',
      description: 'Document for tracking project changes, additional work, and cost adjustments',
      color: '#261312',
      path: '/admin/documents/change-order'
    },
    {
      id: 'professional-agreement',
      name: 'Licensed Professional Agreement',
      description: 'Subcontractor and professional services agreement template',
      color: '#567A8D',
      path: '/admin/professionals/agreement'
    },
    {
      id: 'proposal',
      name: 'Project Proposal',
      description: 'Professional proposal template with scope, timeline, and pricing',
      color: '#712A18',
      path: '/admin/proposals/new'
    },
    {
      id: 'safety-plan',
      name: 'Safety Plan',
      description: 'Job site safety plan and requirements documentation',
      color: '#261312',
      path: '/admin/documents/safety-plan'
    },
    {
      id: 'inspection-checklist',
      name: 'Inspection Checklist',
      description: 'Quality control and inspection documentation',
      color: '#567A8D',
      path: '/admin/documents/inspection'
    },
    {
      id: 'closeout',
      name: 'Project Closeout',
      description: 'Final project documentation, warranties, and completion forms',
      color: '#712A18',
      path: '/admin/documents/closeout'
    }
  ];

  const filteredDocuments = documentTemplates.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (doc: DocumentTemplate) => {
    router.push(doc.path);
  };

  return (
    <div className="documents-container">
      <header className="documents-header">
        <div className="header-top">
          <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Document Templates</h1>
        </div>
        <p className="header-subtitle">
          Access and create project documents, forms, and agreements
        </p>
      </header>

      <div className="documents-content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="search-results-count">
            Showing {filteredDocuments.length} of {documentTemplates.length} documents
          </div>
        </div>

        <div className="documents-grid">
          {filteredDocuments.map(doc => (
            <div
              key={doc.id}
              className="document-card"
              onClick={() => handleDocumentClick(doc)}
            >
              <div className="document-icon" style={{ backgroundColor: doc.color }}></div>
              <div className="document-info">
                <h3>{doc.name}</h3>
                <p>{doc.description}</p>
              </div>
              <div className="document-action">
                <span className="action-text">Open →</span>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="no-results">
            <h3>No documents found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
