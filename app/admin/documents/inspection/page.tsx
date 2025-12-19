'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './inspection.css';

interface InspectionItem {
  id: string;
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'na' | '';
  notes: string;
}

export default function InspectionChecklistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: '',
    projectAddress: '',
    inspectionType: '',
    inspector: '',
    date: new Date().toISOString().split('T')[0],
    weatherConditions: '',
  });

  const [inspectionItems, setInspectionItems] = useState<InspectionItem[]>([
    // Site Safety
    { id: '1', category: 'Site Safety', item: 'Proper signage and barriers in place', status: '', notes: '' },
    { id: '2', category: 'Site Safety', item: 'Fire extinguishers accessible and inspected', status: '', notes: '' },
    { id: '3', category: 'Site Safety', item: 'First aid kit available on site', status: '', notes: '' },
    { id: '4', category: 'Site Safety', item: 'PPE being worn by all workers', status: '', notes: '' },
    
    // Foundation
    { id: '5', category: 'Foundation', item: 'Excavation depth and width per plans', status: '', notes: '' },
    { id: '6', category: 'Foundation', item: 'Rebar placement and size correct', status: '', notes: '' },
    { id: '7', category: 'Foundation', item: 'Forms properly installed and braced', status: '', notes: '' },
    { id: '8', category: 'Foundation', item: 'Concrete mix and slump test passed', status: '', notes: '' },
    
    // Framing
    { id: '9', category: 'Framing', item: 'Lumber size and grade per specifications', status: '', notes: '' },
    { id: '10', category: 'Framing', item: 'Framing spacing and layout correct', status: '', notes: '' },
    { id: '11', category: 'Framing', item: 'Headers and beams properly sized', status: '', notes: '' },
    { id: '12', category: 'Framing', item: 'Shear walls and holddowns installed', status: '', notes: '' },
    
    // Electrical
    { id: '13', category: 'Electrical', item: 'Wire gauge appropriate for circuits', status: '', notes: '' },
    { id: '14', category: 'Electrical', item: 'Proper grounding throughout', status: '', notes: '' },
    { id: '15', category: 'Electrical', item: 'Junction boxes accessible', status: '', notes: '' },
    { id: '16', category: 'Electrical', item: 'GFCI/AFCI protection where required', status: '', notes: '' },
    
    // Plumbing
    { id: '17', category: 'Plumbing', item: 'Pipe sizes per code requirements', status: '', notes: '' },
    { id: '18', category: 'Plumbing', item: 'Proper slope on drain lines', status: '', notes: '' },
    { id: '19', category: 'Plumbing', item: 'Water pressure test passed', status: '', notes: '' },
    { id: '20', category: 'Plumbing', item: 'Vent pipes properly installed', status: '', notes: '' },
    
    // Exterior
    { id: '21', category: 'Exterior', item: 'Weather barrier properly installed', status: '', notes: '' },
    { id: '22', category: 'Exterior', item: 'Flashing at all penetrations', status: '', notes: '' },
    { id: '23', category: 'Exterior', item: 'Siding/cladding per specifications', status: '', notes: '' },
    { id: '24', category: 'Exterior', item: 'Roof installation complete and sealed', status: '', notes: '' },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (id: string, field: 'status' | 'notes', value: string) => {
    setInspectionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = () => {
    console.log('Inspection Data:', { formData, inspectionItems });
    alert('Inspection checklist saved! (Integration with storage pending)');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusCounts = () => {
    const pass = inspectionItems.filter(item => item.status === 'pass').length;
    const fail = inspectionItems.filter(item => item.status === 'fail').length;
    const na = inspectionItems.filter(item => item.status === 'na').length;
    const total = inspectionItems.length;
    const completed = pass + fail + na;
    return { pass, fail, na, total, completed };
  };

  const stats = getStatusCounts();

  const groupedItems = inspectionItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>);

  return (
    <div className="inspection-container">
      <header className="inspection-header no-print">
        <button onClick={() => router.push('/admin/documents')} className="back-btn">
          ← Back to Documents
        </button>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={handlePrint} className="btn-print">🖨️ Print / Save as PDF</button>
        </div>
      </header>

      <div className="inspection-document">
        <div className="doc-header">
          <h1>INSPECTION CHECKLIST</h1>
          <p className="doc-subtitle">Canyon Construction Inc.</p>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Inspection Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Project Address</label>
            <input
              type="text"
              name="projectAddress"
              value={formData.projectAddress}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Inspection Type</label>
              <select
                name="inspectionType"
                value={formData.inspectionType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="Foundation">Foundation Inspection</option>
                <option value="Framing">Framing Inspection</option>
                <option value="Rough-In">Rough-In Inspection</option>
                <option value="Final">Final Inspection</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label>Inspector Name</label>
              <input
                type="text"
                name="inspector"
                value={formData.inspector}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-field">
            <label>Weather Conditions</label>
            <input
              type="text"
              name="weatherConditions"
              value={formData.weatherConditions}
              onChange={handleChange}
              placeholder="e.g., Clear, 65°F"
            />
          </div>
        </div>

        <div className="stats-section no-print">
          <div className="stat-card pass">
            <div className="stat-number">{stats.pass}</div>
            <div className="stat-label">Pass</div>
          </div>
          <div className="stat-card fail">
            <div className="stat-number">{stats.fail}</div>
            <div className="stat-label">Fail</div>
          </div>
          <div className="stat-card na">
            <div className="stat-number">{stats.na}</div>
            <div className="stat-label">N/A</div>
          </div>
          <div className="stat-card total">
            <div className="stat-number">{stats.completed}/{stats.total}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="inspection-category">
            <h2 className="category-title">{category}</h2>
            <table className="inspection-table">
              <thead>
                <tr>
                  <th className="item-col">Item</th>
                  <th className="status-col">Status</th>
                  <th className="notes-col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className={item.status}>
                    <td className="item-col">{item.item}</td>
                    <td className="status-col">
                      <div className="status-buttons">
                        <button
                          className={`status-btn pass ${item.status === 'pass' ? 'active' : ''}`}
                          onClick={() => handleItemChange(item.id, 'status', 'pass')}
                        >
                          ✓
                        </button>
                        <button
                          className={`status-btn fail ${item.status === 'fail' ? 'active' : ''}`}
                          onClick={() => handleItemChange(item.id, 'status', 'fail')}
                        >
                          ✗
                        </button>
                        <button
                          className={`status-btn na ${item.status === 'na' ? 'active' : ''}`}
                          onClick={() => handleItemChange(item.id, 'status', 'na')}
                        >
                          N/A
                        </button>
                      </div>
                    </td>
                    <td className="notes-col">
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                        placeholder="Add notes..."
                        className="notes-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div className="doc-footer">
          <p><strong>Inspector Signature:</strong> ___________________________________ <strong>Date:</strong> _______________</p>
        </div>
      </div>
    </div>
  );
}
