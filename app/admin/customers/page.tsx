'use client';

import { useRouter } from 'next/navigation';
import '../admin.css';

export default function CustomersPage() {
  const router = useRouter();

  return (
    <div className="admin-page">
      <header className="page-header">
        <button onClick={() => router.back()} className="back-btn">← Back to Dashboard</button>
        <h1>Customers</h1>
      </header>
      
      <div className="coming-soon-container">
        <div className="coming-soon-icon-block" style={{ background: '#567A8D' }}></div>
        <h2>Customer Management</h2>
        <p>Customer portal access, files, and communication hub coming soon.</p>
        <div className="feature-list">
          <div className="feature-item">✓ Customer Portal Access</div>
          <div className="feature-item">✓ File Sharing</div>
          <div className="feature-item">✓ Communication History</div>
          <div className="feature-item">✓ Payment Tracking</div>
        </div>
      </div>
    </div>
  );
}
