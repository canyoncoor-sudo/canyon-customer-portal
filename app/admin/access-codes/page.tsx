'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './access-codes.css';

interface Customer {
  id: string;
  customer_name: string;
  job_address: string;
  access_code_hash: string;
}

export default function AccessCodesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [newCode, setNewCode] = useState<{ address: string; code: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch('/api/admin/customers', {
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
      setCustomers(data.customers || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setLoading(false);
    }
  };

  const generateAccessCode = async (customerId: string, address: string) => {
    setGenerating(customerId);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/generate-access-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ customerId }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setNewCode({ address, code: data.accessCode });
        fetchCustomers();
      } else {
        alert(data.error || 'Failed to generate access code');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setGenerating(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="access-codes-page">
      <header className="page-header">
        <button onClick={() => router.push('/admin/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Customer Access Codes</h1>
      </header>

      {newCode && (
        <div className="new-code-alert">
          <div className="alert-content">
            <h3>✅ New Access Code Generated!</h3>
            <div className="code-details">
              <div>
                <strong>Address:</strong> {newCode.address}
              </div>
              <div>
                <strong>Access Code:</strong> 
                <code>{newCode.code}</code>
                <button onClick={() => copyToClipboard(newCode.code)} className="copy-btn">
                  Copy
                </button>
              </div>
            </div>
            <p className="warning">⚠️ Save this code! It won't be shown again.</p>
            <button onClick={() => setNewCode(null)} className="close-alert">Close</button>
          </div>
        </div>
      )}

      <div className="customers-grid">
        {customers.map(customer => (
          <div key={customer.id} className="customer-card">
            <h3>{customer.customer_name}</h3>
            <div className="customer-address">{customer.job_address}</div>
            
            <div className="code-status">
              {customer.access_code_hash ? (
                <>
                  <span className="status-indicator active">●</span>
                  <span>Access Code Active</span>
                </>
              ) : (
                <>
                  <span className="status-indicator inactive">●</span>
                  <span>No Access Code</span>
                </>
              )}
            </div>

            <button
              onClick={() => generateAccessCode(customer.id, customer.job_address)}
              disabled={generating === customer.id}
              className="generate-btn"
            >
              {generating === customer.id ? 'Generating...' : 
               customer.access_code_hash ? 'Regenerate Code' : 'Generate Code'}
            </button>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="empty-state">
          <p>No customers found. Create a project first to generate access codes.</p>
          <button onClick={() => router.push('/admin/projects/new')} className="btn-primary">
            Create New Project
          </button>
        </div>
      )}
    </div>
  );
}
