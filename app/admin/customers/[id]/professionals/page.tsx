'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import './professionals.css';

interface Professional {
  id: number;
  company_name: string;
  trade: string;
  contact_name: string;
  phone: string;
  email: string;
  ccb_number: string;
}

interface Assignment {
  professional_id: number;
  description: string;
  start_date: string;
  status: string;
}

export default function CustomerProfessionalsPage() {
  const params = useParams();
  const router = useRouter();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedProfessionals, setSelectedProfessionals] = useState<Set<number>>(new Set());
  const [descriptions, setDescriptions] = useState<{ [key: number]: string }>({});
  const [startDates, setStartDates] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Fetch customer info
      const customerRes = await fetch(`/api/admin/customers/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const customerData = await customerRes.json();
      setCustomerName(customerData.customer?.customer_name || '');

      // Fetch all professionals
      const profRes = await fetch('/api/admin/professionals', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const profData = await profRes.json();
      setProfessionals(profData.professionals || []);

      // Fetch existing assignments for this customer (if endpoint exists)
      // TODO: Create API endpoint to fetch customer-professional assignments
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProfessional = (id: number) => {
    const newSelected = new Set(selectedProfessionals);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      const newDescriptions = { ...descriptions };
      const newDates = { ...startDates };
      delete newDescriptions[id];
      delete newDates[id];
      setDescriptions(newDescriptions);
      setStartDates(newDates);
    } else {
      newSelected.add(id);
    }
    setSelectedProfessionals(newSelected);
  };

  const handleSave = async () => {
    if (selectedProfessionals.size === 0) {
      alert('Please select at least one licensed professional');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const assignmentsToSave = Array.from(selectedProfessionals).map(profId => ({
        job_id: parseInt(params.id as string),
        professional_id: profId,
        description: descriptions[profId] || '',
        start_date: startDates[profId] || new Date().toISOString().split('T')[0],
        status: 'Assigned',
      }));

      // TODO: Create API endpoint to save professional assignments
      // For now, we'll just show success
      console.log('Assignments to save:', assignmentsToSave);
      
      alert('Licensed professionals assigned successfully!');
      router.push(`/admin/customers/${params.id}`);
    } catch (error) {
      console.error('Error saving assignments:', error);
      alert('Failed to assign professionals');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="professionals-loading">
        <div className="loading-spinner"></div>
        <p>Loading professionals...</p>
      </div>
    );
  }

  return (
    <div className="customer-professionals-page">
      <div className="page-header">
        <div className="header-left">
          <button onClick={() => router.back()} className="back-btn">
            ← Back to Customer
          </button>
          <h1>Add Licensed Professionals</h1>
          <p className="header-subtitle">
            Assign subcontractors to {customerName}'s project
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => router.back()} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || selectedProfessionals.size === 0} className="save-btn">
            {saving ? 'Saving...' : `Assign ${selectedProfessionals.size} Professional${selectedProfessionals.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      <div className="professionals-content">
        <div className="selection-info">
          <p>
            Select the licensed professionals working on this project. Customers will see these
            subcontractors in their portal along with start dates and descriptions.
          </p>
        </div>

        {professionals.length === 0 ? (
          <div className="no-professionals">
            <div className="no-professionals-icon">👷</div>
            <h3>No Licensed Professionals Found</h3>
            <p>Add professionals to your database first</p>
            <button 
              className="add-professional-btn"
              onClick={() => router.push('/admin/professionals/new')}
            >
              + Add New Professional
            </button>
          </div>
        ) : (
          <div className="professionals-list">
            {professionals.map((prof) => (
              <div 
                key={prof.id} 
                className={`professional-card ${selectedProfessionals.has(prof.id) ? 'selected' : ''}`}
              >
                <div className="professional-header">
                  <label className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedProfessionals.has(prof.id)}
                      onChange={() => toggleProfessional(prof.id)}
                    />
                    <div className="professional-info">
                      <h3>{prof.company_name}</h3>
                      <span className="trade-badge">{prof.trade}</span>
                    </div>
                  </label>
                </div>

                <div className="professional-details">
                  <div className="detail-row">
                    <span className="label">Contact:</span>
                    <span>{prof.contact_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <span>{prof.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">CCB#:</span>
                    <span>{prof.ccb_number}</span>
                  </div>
                </div>

                {selectedProfessionals.has(prof.id) && (
                  <div className="assignment-details">
                    <div className="form-group">
                      <label>Work Description (shown to customer)</label>
                      <textarea
                        value={descriptions[prof.id] || ''}
                        onChange={(e) => setDescriptions({ ...descriptions, [prof.id]: e.target.value })}
                        placeholder="e.g., Installing electrical wiring and fixtures"
                        rows={2}
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={startDates[prof.id] || ''}
                        onChange={(e) => setStartDates({ ...startDates, [prof.id]: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
