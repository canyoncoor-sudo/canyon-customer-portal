'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminMenu } from '../AdminMenuContext';
import './professionals.css';

interface Professional {
  id: string;
  company_name: string;
  trade: string;
  color?: string;
  ccb_number: string;
  contact_name: string;
  phone: string;
  email: string;
  created_at: string;
  google_place_id?: string;
  google_business_name?: string;
  google_rating?: number;
  google_total_reviews?: number;
  google_maps_url?: string;
  google_profile_photo_url?: string;
  is_google_verified?: boolean;
}

interface ProfessionalGroup {
  trade: string;
  count: number;
  professionals: Professional[];
}

function AdminProfessionalsContent() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'groups' | 'list'>('groups');
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [showViewSection, setShowViewSection] = useState(false);
  const [showFiltersSection, setShowFiltersSection] = useState(false);
  const [showActionsSection, setShowActionsSection] = useState(false);
  const [filterByTrade, setFilterByTrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setShowMenu, setMenuSections, setSectionName } = useAdminMenu();

  useEffect(() => {
    const customerIdParam = searchParams.get('customerId');
    if (customerIdParam) {
      setCustomerId(customerIdParam);
      fetchCustomerName(customerIdParam);
    }
    fetchProfessionals();
    setSectionName('Licensed Professionals');
    setShowMenu(false);
    setMenuSections([]);
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

  const fetchCustomerName = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/customers/${id}/portal`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomerName(data.job?.customer_name || 'Customer');
      }
    } catch (error) {
      console.error('Failed to fetch customer name:', error);
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

  const handleAddToCustomer = async (professionalId: string, companyName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!customerId) return;
    
    const description = prompt(`Add work description for ${companyName}:`);
    if (description === null) return; // User cancelled
    
    const dateInput = prompt('Enter start date (MM/DD/YY or MM-DD-YY):\nExample: 01/10/26 or 01-10-26');
    if (!dateInput) return;
    
    // Parse the date input (MM/DD/YY or MM-DD-YY)
    const dateParts = dateInput.split(/[\/\-]/);
    if (dateParts.length !== 3) {
      alert('Invalid date format. Please use MM/DD/YY or MM-DD-YY');
      return;
    }
    
    let [month, day, year] = dateParts;
    
    // Pad with zeros if needed
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
    
    // Convert 2-digit year to 4-digit
    if (year.length === 2) {
      const currentYear = new Date().getFullYear();
      const century = Math.floor(currentYear / 100) * 100;
      year = `${century + parseInt(year)}`;
    }
    
    // Validate month and day
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    
    if (monthNum < 1 || monthNum > 12) {
      alert('Invalid month. Please enter a month between 01 and 12');
      return;
    }
    
    if (dayNum < 1 || dayNum > 31) {
      alert('Invalid day. Please enter a day between 01 and 31');
      return;
    }
    
    // Format as YYYY-MM-DD for the database
    const startDate = `${year}-${month}-${day}`;
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/customers/${customerId}/professionals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professional_id: professionalId,
          description,
          start_date: startDate,
          status: 'Active',
        }),
      });

      if (res.ok) {
        alert(`${companyName} added to customer portal!\nStart Date: ${month}/${day}/${year}`);
        router.push(`/admin/customers/${customerId}`);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add professional to customer');
      }
    } catch (error) {
      console.error('Add to customer error:', error);
      alert('Error adding professional to customer');
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

  // Get unique trades for filter
  const uniqueTrades = Array.from(new Set(professionals.map(p => p.trade))).sort();

  // Apply filters
  const filteredProfessionals = displayedProfessionals.filter(pro => {
    // Trade filter
    if (filterByTrade !== 'all' && pro.trade !== filterByTrade) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pro.company_name.toLowerCase().includes(query) ||
        pro.contact_name.toLowerCase().includes(query) ||
        pro.trade.toLowerCase().includes(query) ||
        pro.phone.includes(query) ||
        (pro.email && pro.email.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Menu sections
  const menuSections = [
    {
      title: 'View',
      isOpen: showViewSection,
      onToggle: () => setShowViewSection(!showViewSection),
      content: (
        <div className="control-group">
          <div className="radio-group">
            <label className={view === 'groups' && !selectedTrade ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="groups"
                checked={view === 'groups' && !selectedTrade}
                onChange={() => { setView('groups'); setSelectedTrade(null); }}
              />
              <span>By Trade Groups</span>
            </label>
            <label className={view === 'list' && !selectedTrade ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="list"
                checked={view === 'list' && !selectedTrade}
                onChange={() => { setView('list'); setSelectedTrade(null); }}
              />
              <span>All Professionals List</span>
            </label>
          </div>
        </div>
      )
    },
    {
      title: 'Filters',
      isOpen: showFiltersSection,
      onToggle: () => setShowFiltersSection(!showFiltersSection),
      content: (
        <>
          <div className="control-group">
            <label>Filter by Trade</label>
            <select value={filterByTrade} onChange={(e) => setFilterByTrade(e.target.value)}>
              <option value="all">All Trades ({professionals.length})</option>
              {uniqueTrades.map(trade => (
                <option key={trade} value={trade}>
                  {trade} ({professionals.filter(p => p.trade === trade).length})
                </option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>Search Professionals</label>
            <input
              type="text"
              placeholder="Search by name, company, trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(filterByTrade !== 'all' || searchQuery) && (
            <div className="control-group">
              <button 
                className="btn-menu-action tertiary"
                onClick={() => {
                  setFilterByTrade('all');
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
        <>
          <div className="control-group">
            <button 
              className="btn-menu-action"
              onClick={() => {
                setShowMenu(false);
                router.push('/admin/professionals/new');
              }}
            >
              + Add New Professional
            </button>
          </div>
          
          <div className="control-group">
            <button 
              className="btn-menu-action tertiary"
              onClick={() => {
                setShowMenu(false);
                router.push('/admin/professionals/agreement');
              }}
            >
              📄 View Agreement Template
            </button>
          </div>

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
        </>
      )
    }
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Loading licensed professionals...</div>
      </div>
    );
  }

  return (
    <div className="admin-professionals">

      {customerId && customerName && (
        <div className="customer-context-banner">
          <div className="banner-content">
            <span className="banner-icon">👤</span>
            <div>
              <strong>Adding to Customer Portal:</strong> {customerName}
            </div>
          </div>
          <button 
            onClick={() => router.push(`/admin/customers/${customerId}`)}
            className="btn-secondary"
          >
            Cancel & Return
          </button>
        </div>
      )}

      <div className="professionals-content">
        {(filterByTrade !== 'all' || searchQuery) && (
          <div className="active-filters-banner">
            <span>🔍 Filters Active: </span>
            {filterByTrade !== 'all' && <span className="filter-tag">Trade: {filterByTrade}</span>}
            {searchQuery && <span className="filter-tag">Search: "{searchQuery}"</span>}
            <span className="results-count">({filteredProfessionals.length} result{filteredProfessionals.length !== 1 ? 's' : ''})</span>
          </div>
        )}

        {view === 'groups' && !selectedTrade ? (
          <div className="trade-groups">
            {groupByTrade().filter(group => {
              // Apply filters to groups
              if (filterByTrade !== 'all') return group.trade === filterByTrade;
              return true;
            }).map(group => (
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
                <p>{filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''}</p>
              </div>
            )}
            <div className="professionals-list">
              {filteredProfessionals.map(pro => (
                <div 
                  key={pro.id} 
                  className="professional-card"
                >
                  <div className="card-header">
                    <h3>{pro.company_name}</h3>
                    <span className="trade-badge">{pro.trade}</span>
                  </div>
                  <div className="card-body">
                    {pro.is_google_verified && (
                      <div style={{
                        background: '#D4EDDA',
                        border: '1px solid #28A745',
                        borderRadius: '6px',
                        padding: '8px 10px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                      }}>
                        <span>✅</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#155724' }}>Google Verified</div>
                          {pro.google_rating && (
                            <div style={{ fontSize: '12px', color: '#155724' }}>
                              ⭐ {pro.google_rating.toFixed(1)} ({pro.google_total_reviews} reviews)
                            </div>
                          )}
                        </div>
                        {pro.google_maps_url && (
                          <a 
                            href={pro.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: '12px',
                              color: '#155724',
                              textDecoration: 'underline',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            View on Google
                          </a>
                        )}
                      </div>
                    )}
                    <p><strong>CCB:</strong> {pro.ccb_number}</p>
                    <p><strong>Contact:</strong> {pro.contact_name}</p>
                    <p><strong>Phone:</strong> {pro.phone}</p>
                    <p><strong>Email:</strong> {pro.email}</p>
                  </div>
                  <div className="card-footer">
                    {customerId && (
                      <button 
                        className="btn-add-customer"
                        onClick={(e) => handleAddToCustomer(pro.id, pro.company_name, e)}
                      >
                        Add to Customer
                      </button>
                    )}
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

export default function AdminProfessionals() {
  return (
    <Suspense fallback={<div className="admin-loading"><div>Loading professionals...</div></div>}>
      <AdminProfessionalsContent />
    </Suspense>
  );
}