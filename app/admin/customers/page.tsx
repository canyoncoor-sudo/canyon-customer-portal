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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [documentFilter, setDocumentFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setShowMenu, setMenuSections, setSectionName } = useAdminMenu();

  const [showFiltersSection, setShowFiltersSection] = useState(false);
  const [showActionsSection, setShowActionsSection] = useState(false);

  useEffect(() => {
    fetchCustomers();
    setupMenu();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, customers, statusFilter, documentFilter]);

  const setupMenu = () => {
    setSectionName('Customers');
    setShowMenu(true);

    const menuSections = [
      {
        title: 'Filters',
        isOpen: showFiltersSection,
        onToggle: () => setShowFiltersSection(!showFiltersSection),
        content: (
          <>
            <div className="control-group">
              <label>Project Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="lead">Lead</option>
                <option value="quoted">Quoted</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="control-group">
              <label>Document Type</label>
              <select value={documentFilter} onChange={(e) => setDocumentFilter(e.target.value)}>
                <option value="all">All Documents</option>
                <option value="has_intake">Has Intake Form</option>
                <option value="has_proposal">Has Proposal</option>
                <option value="has_contract">Has Contract</option>
                <option value="has_invoice">Has Invoice</option>
                <option value="has_permit">Has Permit</option>
                <option value="needs_documents">Needs Documents</option>
              </select>
            </div>

            <div className="control-group">
              <label>Search Customer</label>
              <input
                type="text"
                placeholder="Name, address, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </>
        )
      },
      {
        title: 'Actions',
        isOpen: showActionsSection,
        onToggle: () => setShowActionsSection(!showActionsSection),
        content: (
          <>
            <button onClick={() => router.push('/admin/documents/intake')}>
              📝 New Customer Intake
            </button>
            <button onClick={() => router.push('/admin/schedule')}>
              📅 View Schedule
            </button>
            <button onClick={() => router.push('/admin/documents')}>
              📄 Create Document
            </button>
            <button onClick={() => exportCustomers()}>
              💾 Export Customer List
            </button>
            <button onClick={() => router.push('/admin/dashboard')}>
              ← Return to Dashboard
            </button>
          </>
        )
      }
    ];

    setMenuSections(menuSections);
  };

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
    let filtered = [...customers];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Apply document filter (this would need backend support, for now just placeholder)
    // You would need to fetch document info from the backend
    if (documentFilter !== 'all') {
      // Placeholder - in reality you'd check against customer's documents
      // filtered = filtered.filter(c => hasDocument(c.id, documentFilter));
    }

    // Apply search query
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

  const exportCustomers = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Address', 'City', 'State', 'ZIP', 'Project Type', 'Status', 'Created'];
    const rows = filteredCustomers.map(c => [
      c.customer_name || '',
      c.customer_email || '',
      c.customer_phone || '',
      c.job_address || '',
      c.city || '',
      c.state || '',
      c.zip_code || '',
      c.project_type || '',
      c.status || '',
      new Date(c.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      <div className="page-header">
        <h1>Customer Profiles</h1>
        <p>{filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} found</p>
      </div>

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
