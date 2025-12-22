'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, customers]);

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
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = customers.filter(customer => 
      customer.customer_name?.toLowerCase().includes(query) ||
      customer.job_address?.toLowerCase().includes(query) ||
      customer.city?.toLowerCase().includes(query) ||
      customer.customer_email?.toLowerCase().includes(query) ||
      customer.customer_phone?.includes(query)
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerClick = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`);
  };

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
      <header className="customers-header">
        <div className="header-top">
          <button onClick={() => router.back()} className="back-btn">← Back to Dashboard</button>
          <h1>Customer Management</h1>
        </div>
        
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, address, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-results-count">
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} found
          </div>
        </div>
      </header>

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
