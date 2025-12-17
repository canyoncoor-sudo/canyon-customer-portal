'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './professionals.css';

interface Professional {
  id: string;
  company_name: string;
  trade: string;
  ccb_number: string;
  contact_name: string;
  phone: string;
  email: string;
  created_at: string;
}

interface ProfessionalGroup {
  trade: string;
  count: number;
  professionals: Professional[];
}

export default function AdminProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'groups' | 'list'>('groups');
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch('/api/admin/professionals', {
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
      console.log('Professionals data:', data);
      setProfessionals(data.professionals || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
      setProfessionals([]);
      setLoading(false);
    }
  };

  const groupByTrade = (): ProfessionalGroup[] => {
    const groups: { [key: string]: Professional[] } = {};
    
    professionals.forEach(pro => {
      const trade = pro.trade || 'Other';
      if (!groups[trade]) {
        groups[trade] = [];
      }
      groups[trade].push(pro);
    });

    return Object.keys(groups).map(trade => ({
      trade,
      count: groups[trade].length,
      professionals: groups[trade]
    })).sort((a, b) => a.trade.localeCompare(b.trade));
  };

  const handleGroupClick = (trade: string) => {
    setSelectedTrade(trade);
    setView('list');
  };

  const handleBack = () => {
    if (selectedTrade) {
      setSelectedTrade(null);
      setView('groups');
    } else {
      router.push('/admin/dashboard');
    }
  };

  const handleDelete = async (id: string, companyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete ${companyName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/professionals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Professional deleted successfully!');
        fetchProfessionals();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete professional');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting professional');
    }
  };

  const displayedProfessionals = selectedTrade
    ? professionals.filter(p => p.trade === selectedTrade)
    : professionals;

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading licensed professionals...</div>
      </div>
    );
  }

  return (
    <div className="admin-professionals">
      <header className="professionals-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
          <h1>Licensed Professionals</h1>
          <button 
            onClick={() => router.push('/admin/professionals/new')}
            className="btn-primary"
          >
            + Add Professional
          </button>
        </div>
      </header>

      <div className="professionals-content">
        <div className="view-tabs">
          <button 
            className={view === 'groups' && !selectedTrade ? 'active' : ''}
            onClick={() => { setView('groups'); setSelectedTrade(null); }}
          >
            By Trade
          </button>
          <button 
            className={view === 'list' && !selectedTrade ? 'active' : ''}
            onClick={() => { setView('list'); setSelectedTrade(null); }}
          >
            All Professionals
          </button>
        </div>

        {view === 'groups' && !selectedTrade ? (
          <div className="trade-groups">
            {groupByTrade().map(group => (
              <div 
                key={group.trade} 
                className="trade-card"
                onClick={() => handleGroupClick(group.trade)}
              >
                <div className="trade-icon">
                  {group.trade.charAt(0).toUpperCase()}
                </div>
                <h3>{group.trade}</h3>
                <p className="trade-count">{group.count} professional{group.count !== 1 ? 's' : ''}</p>
              </div>
            ))}
            {groupByTrade().length === 0 && (
              <div className="empty-state">
                <p>No licensed professionals added yet.</p>
                <button 
                  onClick={() => router.push('/admin/professionals/new')}
                  className="btn-primary"
                >
                  Add Your First Professional
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {selectedTrade && (
              <div className="list-header">
                <h2>{selectedTrade}</h2>
                <p>{displayedProfessionals.length} professional{displayedProfessionals.length !== 1 ? 's' : ''}</p>
              </div>
            )}
            <div className="professionals-list">
              {displayedProfessionals.map(pro => (
                <div 
                  key={pro.id} 
                  className="professional-card"
                >
                  <div className="card-header">
                    <h3>{pro.company_name}</h3>
                    <span className="trade-badge">{pro.trade}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>CCB:</strong> {pro.ccb_number}</p>
                    <p><strong>Contact:</strong> {pro.contact_name}</p>
                    <p><strong>Phone:</strong> {pro.phone}</p>
                    <p><strong>Email:</strong> {pro.email}</p>
                  </div>
                  <div className="card-footer">
                    <button 
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/professionals/edit/${pro.id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={(e) => handleDelete(pro.id, pro.company_name, e)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {displayedProfessionals.length === 0 && (
                <div className="empty-state">
                  <p>No professionals found{selectedTrade ? ` for ${selectedTrade}` : ''}.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
