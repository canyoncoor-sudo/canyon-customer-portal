'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAdminMenu } from '../AdminMenuContext';
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
  const { setShowMenu, setMenuSections, setSectionName } = useAdminMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [showFiltersSection, setShowFiltersSection] = useState(false);
  const [showActionsSection, setShowActionsSection] = useState(false);

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'intake-form',
      name: 'Customer Intake Form',
      description: 'Create new customer intake with project details and automatic site visit scheduling',
      color: '#567A8D',
      path: '/admin/documents/intake'
    },
    {
      id: 'lien-law',
      name: 'Lien Law Document',
      description: 'Oregon construction lien law notices and documentation',
      color: '#261312',
      path: '/admin/documents/lien-law'
    },
    {
      id: 'change-order',
      name: 'Change Order Form',
      description: 'Document for tracking project changes, additional work, and cost adjustments',
      color: '#567A8D',
      path: '/admin/documents/change-order'
    },
    {
      id: 'professional-agreement',
      name: 'Licensed Professional Agreement',
      description: 'Subcontractor and professional services agreement template',
      color: '#712A18',
      path: '/admin/professionals/agreement'
    },
    {
      id: 'proposal',
      name: 'Project Proposal',
      description: 'Professional proposal template with scope, timeline, and pricing',
      color: '#261312',
      path: '/admin/proposals/new'
    },
    {
      id: 'safety-plan',
      name: 'Safety Plan',
      description: 'Job site safety plan and requirements documentation',
      color: '#567A8D',
      path: '/admin/documents/safety-plan'
    },
    {
      id: 'inspection-checklist',
      name: 'Inspection Checklist',
      description: 'Quality control and inspection documentation',
      color: '#712A18',
      path: '/admin/documents/inspection'
    },
    {
      id: 'closeout',
      name: 'Project Closeout',
      description: 'Final project documentation, warranties, and completion forms',
      color: '#261312',
      path: '/admin/documents/closeout'
    }
  ];

  // Document categories
  const categories = {
    'all': 'All Documents',
    'project': 'Project Management',
    'legal': 'Legal & Compliance',
    'safety': 'Safety & Quality'
  };

  // Categorize documents
  const getCategory = (id: string) => {
    if (['intake-form', 'proposal', 'change-order', 'closeout'].includes(id)) return 'project';
    if (['lien-law', 'professional-agreement'].includes(id)) return 'legal';
    if (['safety-plan', 'inspection-checklist'].includes(id)) return 'safety';
    return 'project';
  };

  const filteredDocuments = documentTemplates
    .filter(doc => {
      // Category filter
      if (filterCategory !== 'all' && getCategory(doc.id) !== filterCategory) return false;
      // Search filter
      return doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const menuSections = [
    {
      title: 'Filters',
      isOpen: showFiltersSection,
      onToggle: () => setShowFiltersSection(!showFiltersSection),
      content: (
        <>
          <div className="control-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Search Documents</label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(filterCategory !== 'all' || searchQuery) && (
            <div className="control-group">
              <button 
                className="btn-menu-action tertiary"
                onClick={() => {
                  setFilterCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )
    },
    {
      title: 'Actions',
      isOpen: showActionsSection,
      onToggle: () => setShowActionsSection(!showActionsSection),
      content: (
        <div className="control-group">
          <button 
            className="btn-menu-action tertiary"
            onClick={() => {
              setShowMenu(false);
              router.push('/admin/dashboard');
            }}
          >
            ← Return to Dashboard
          </button>
        </div>
      )
    }
  ];

  // Update menu sections
  useEffect(() => {
    setMenuSections(menuSections);
  }, [filterCategory, searchQuery, showFiltersSection, showActionsSection]);


  const handleDocumentClick = (doc: DocumentTemplate) => {
    router.push(doc.path);
  };

  return (
    <div className="documents-container">

      {(filterCategory !== 'all' || searchQuery) && (
        <div className="active-filters-banner">
          <span>🔍 Filters Active: </span>
          {filterCategory !== 'all' && <span className="filter-tag">Category: {categories[filterCategory as keyof typeof categories]}</span>}
          {searchQuery && <span className="filter-tag">Search: "{searchQuery}"</span>}
          <span className="results-count">({filteredDocuments.length} result{filteredDocuments.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      <div className="documents-content">
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
