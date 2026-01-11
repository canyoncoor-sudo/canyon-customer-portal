'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminMenu } from '../AdminMenuContext';
import './customers.css';

interface Customer {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  job_address: string;
  city: string;
  state: string;
  zip_code: string;
  project_type: string;
  status: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [showViewSection, setShowViewSection] = useState(false);
  const [showFiltersSection, setShowFiltersSection] = useState(false);
  const [showActionsSection, setShowActionsSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setShowMenu, setMenuSections, setSectionName } = useAdminMenu();

  useEffect(() => {
    fetchCustomers();
    setSectionName('Customers');
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, filterStatus, filterCity, customers]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch('/api/admin/customers', {
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
      setCustomers(data.customers || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // City filter
    if (filterCity !== 'all') {
      filtered = filtered.filter(c => c.city === filterCity);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.customer_name?.toLowerCase().includes(query) ||
        customer.job_address?.toLowerCase().includes(query) ||
        customer.city?.toLowerCase().includes(query) ||
        customer.customer_email?.toLowerCase().includes(query) ||
        customer.customer_phone?.includes(query)
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleCustomerClick = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`);
  };

  // Get unique cities and statuses for filters
  const uniqueCities = Array.from(new Set(customers.map(c => c.city).filter(Boolean))).sort();
  const uniqueStatuses = Array.from(new Set(customers.map(c => c.status).filter(Boolean))).sort();

  // Menu sections configuration
  const menuSections = [
    {
      title: 'View',
      isOpen: showViewSection,
      onToggle: () => setShowViewSection(!showViewSection),
      content: (
        <div className="control-group">
          <div className="radio-group">
            <label className={viewMode === 'grid' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="grid"
                checked={viewMode === 'grid'}
                onChange={() => setViewMode('grid')}
              />
              <span>📱 Grid Cards</span>
            </label>
            <label className={viewMode === 'list' ? 'active' : ''}>
              <input 
                type="radio" 
                name="viewMode" 
                value="list"
                checked={viewMode === 'list'}
                onChange={() => setViewMode('list')}
              />
              <span>📋 List View</span>
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
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>City</label>
            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
              <option value="all">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Search Customers</label>
            <input
              type="text"
              placeholder="Name, address, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {(filterStatus !== 'all' || filterCity !== 'all' || searchQuery) && (
            <div className="control-group">
              <button 
                className="btn-menu-action tertiary"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCity('all');
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

  // Update menu sections whenever dependencies change
  useEffect(() => {
    setMenuSections(menuSections);
  }, [viewMode, filterStatus, filterCity, searchQuery, showViewSection, showFiltersSection, showActionsSection]);


  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="customers-page">

      {(filterStatus !== 'all' || filterCity !== 'all' || searchQuery) && (
        <div className="active-filters-banner">
          <span>🔍 Filters Active: </span>
          {filterStatus !== 'all' && <span className="filter-tag">Status: {filterStatus}</span>}
          {filterCity !== 'all' && <span className="filter-tag">City: {filterCity}</span>}
          {searchQuery && <span className="filter-tag">Search: "{searchQuery}"</span>}
          <span className="results-count">({filteredCustomers.length} result{filteredCustomers.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      <main className="customers-main">
        {filteredCustomers.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">👥</div>
            <h2>No customers found</h2>
            <p>
              {searchQuery 
                ? `No customers match "${searchQuery}"`
                : 'No customers in the system yet'
              }
            </p>
          </div>
        ) : (
          <div className="customers-grid">
            {filteredCustomers.map((customer) => (
              <div 
                key={customer.id} 
                className="customer-card"
                onClick={() => handleCustomerClick(customer.id)}
              >
                <div className="customer-card-header">
                  <div className="customer-avatar">
                    {customer.customer_name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div className="customer-info">
                    <h3 className="customer-name">{customer.customer_name || 'Unknown'}</h3>
                    <p className="customer-email">{customer.customer_email || 'No email'}</p>
                  </div>
                </div>

                <div className="customer-card-details">
                  <div className="detail-row">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">
                      {customer.job_address || 'No address'}
                      {customer.city && `, ${customer.city}`}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{customer.customer_phone || 'No phone'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Project</span>
                    <span className="detail-value">{customer.project_type || 'Not specified'}</span>
                  </div>
                </div>

                <div className="customer-card-footer">
                  <span className={`status-badge status-${customer.status?.toLowerCase() || 'active'}`}>
                    {customer.status || 'Active'}
                  </span>
                  <button className="view-portal-btn">
                    View Portal →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
