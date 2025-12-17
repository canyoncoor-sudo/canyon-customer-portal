'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../professionals/professionals.css';

interface Professional {
  id: string;
  company_name: string;
  trade: string;
  ccb_number: string;
  contact_name: string;
  phone: string;
  email: string;
}

export default function AgreementsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/admin/professionals', {
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
      setProfessionals(data.professionals || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="professionals-container">
      <div className="professionals-header">
        <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Contractor Agreements</h1>
      </div>

      <div className="professionals-content">
        <p style={{ marginBottom: '30px', color: '#454547' }}>
          Select a licensed professional to create or view their contractor agreement.
        </p>

        <div className="professionals-grid">
          {professionals.map((prof) => (
            <div 
              key={prof.id} 
              className="professional-card"
              onClick={() => router.push(`/admin/professionals/agreement?id=${prof.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="prof-header">
                <h3>{prof.company_name}</h3>
                <span className="trade-badge">{prof.trade}</span>
              </div>
              <div className="prof-details">
                <div><strong>License:</strong> {prof.ccb_number}</div>
                <div><strong>Contact:</strong> {prof.contact_name}</div>
                <div><strong>Phone:</strong> {prof.phone}</div>
                <div><strong>Email:</strong> {prof.email}</div>
              </div>
              <button 
                className="btn-create-agreement"
                style={{
                  marginTop: '15px',
                  width: '100%',
                  padding: '10px',
                  background: '#A45941',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Agreement
              </button>
            </div>
          ))}
        </div>

        {professionals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', color: '#454547', marginBottom: '20px' }}>
              No licensed professionals found.
            </p>
            <button 
              onClick={() => router.push('/admin/professionals/new')}
              style={{
                background: '#567A8D',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Add Professional
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
