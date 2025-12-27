'use client';

import { ReactNode } from 'react';
import './SectionMenu.css';

interface MenuSection {
  title: string;
  content: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

interface SectionMenuProps {
  sectionName: string;
  isOpen: boolean;
  onClose: () => void;
  sections: MenuSection[];
}

export default function SectionMenu({ sectionName, isOpen, onClose, sections }: SectionMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="section-menu-panel">
      <div className="menu-header">
        <h2>{sectionName} Control Center</h2>
        <button className="btn-close-menu" onClick={onClose}>✕</button>
      </div>

      <div className="menu-content">
        {sections.map((section, index) => (
          <div key={index} className="menu-section">
            <button 
              className="menu-section-header"
              onClick={section.onToggle}
            >
              <span>{section.title}</span>
              <span className="dropdown-arrow">{section.isOpen ? '▼' : '▶'}</span>
            </button>
            
            {section.isOpen && (
              <div className="section-content">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
