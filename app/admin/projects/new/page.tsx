'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './new-proposal.css';

interface LineItem {
  id: string;
  scope: string;
  description: string;
  cost: number;
}

const SCOPE_OPTIONS = [
  'Asphalt',
  'Concrete',
  'Curb',
  'Curb and Sidewalk',
  'Demolition',
  'Doors',
  'Driveway',
  'Electrical',
  'Excavation',
  'Finish Carpentry',
  'Fire System',
  'Foundation',
  'Framing',
  'Garage Door',
  'Gutter',
  'Hardscape',
  'Hardwood Flooring',
  'Landscape',
  'Lighting',
  'Masonry',
  'Pavers',
  'Plumbing',
  'Retaining Wall',
  'Roofing',
  'Sheet Rock',
  'Sheeting',
  'Sidewalk',
  'Siding',
  'Site Work',
  'Stucco',
  'Tile',
  'Windows'
];

export default function NewProposal() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [proposalDate, setProposalDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerSignature, setCustomerSignature] = useState('');
  const [contractorSignature, setContractorSignature] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', scope: '', description: '', cost: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), scope: '', description: '', cost: 0 }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalCost = lineItems.reduce((sum, item) => sum + (item.cost || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      
      const res = await fetch('/api/admin/proposals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          customerAddress,
          customerPhone,
          customerEmail,
          lineItems: lineItems.filter(item => item.scope && item.cost > 0),
          totalCost,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/projects/${data.projectId}`);
      } else {
        alert('Failed to create proposal');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="proposal-builder">
      <div className="proposal-header">
        <button onClick={() => router.back()} className="back-btn">← Back</button>
        <h1>Create New Proposal</h1>
      </div>

      <div className="proposal-container">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="proposal-doc-header">
            <div className="company-logo">
              <div className="company-name">CANYON</div>
              <div className="company-suffix">CONSTRUCTION INC</div>
            </div>
          </div>

          {/* Customer Information */}
          <section className="proposal-section">
            <h3>Customer Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="John Smith"
                />
              </div>
              <div className="form-field">
                <label>Address *</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                  placeholder="123 Main St, Salem, OR 97301"
                />
              </div>
              <div className="form-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  placeholder="(503) 555-0123"
                />
              </div>
              <div className="form-field">
                <label>Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </section>

          {/* Scope of Work */}
          <section className="proposal-section">
            <div className="section-header">
              <h3>Project Scope & Investment</h3>
              <button type="button" onClick={addLineItem} className="add-item-btn">
                + Add Line Item
              </button>
            </div>
            <div className="line-items-table">
              <div className="table-header">
                <div className="col-scope">Item</div>
                <div className="col-description">Description</div>
                <div className="col-cost">Investment</div>
                <div className="col-actions"></div>
              </div>

              {lineItems.map((item) => (
                <div key={item.id} className="line-item-row">
                  <div className="col-scope">
                    <input
                      list={`scope-options-${item.id}`}
                      value={item.scope}
                      onChange={(e) => updateLineItem(item.id, 'scope', e.target.value)}
                      placeholder="Select or type..."
                      className="scope-input"
                    />
                    <datalist id={`scope-options-${item.id}`}>
                      {SCOPE_OPTIONS.map(option => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </div>
                  <div className="col-description">
                    <textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Brief description of work..."
                      rows={2}
                    />
                  </div>
                  <div className="col-cost">
                    <input
                      type="number"
                      value={item.cost || ''}
                      onChange={(e) => updateLineItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="col-actions">
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="total-row">
              <span className="total-label">Total Project Investment:</span>
              <span className="total-amount">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </section>

          {/* Company Info & Signatures */}
          <section className="proposal-section company-signature-section">
            <div className="company-signature-grid">
              <div className="company-details">
                <h4>Canyon Construction Inc</h4>
                <p>CCB #256596</p>
                <p>Email: spencer@canyonconstructioninc.com</p>
              </div>
              
              <div className="signature-boxes">
                <div className="signature-box">
                  <label className="signature-label">Customer Signature</label>
                  <input
                    type="text"
                    value={customerSignature}
                    onChange={(e) => setCustomerSignature(e.target.value)}
                    placeholder="Type or sign here"
                    className="signature-input"
                  />
                  <div className="signature-date-field">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={proposalDate}
                      onChange={(e) => setProposalDate(e.target.value)}
                      className="date-input-small"
                    />
                  </div>
                </div>
                
                <div className="signature-box">
                  <label className="signature-label">Canyon Construction Inc</label>
                  <input
                    type="text"
                    value={contractorSignature}
                    onChange={(e) => setContractorSignature(e.target.value)}
                    placeholder="Type or sign here"
                    className="signature-input"
                  />
                  <div className="signature-date-field">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={proposalDate}
                      onChange={(e) => setProposalDate(e.target.value)}
                      className="date-input-small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lien Notice */}
          <section className="proposal-section lien-notice">
            <h4>NOTICE OF POTENTIAL LIEN RIGHTS</h4>
            <p className="notice-subtitle">(Required Under Oregon Law — ORS 87.021 & 87.023)</p>
            
            <p><strong>Please read carefully:</strong></p>
            <p>Any contractor, subcontractor, material supplier, equipment provider, or laborer who works on your project and is not paid may have the right to file a construction lien against your property. A construction lien is a legal claim that may affect your title and could lead to foreclosure if unpaid.</p>
            
            <p>Even if you, the property owner, pay Canyon Construction Inc. in full, other parties who supplied labor or materials to your project may still have lien rights if they are not paid by the contractor or subcontractor who hired them.</p>
            
            <p><strong>Your rights and protections as the property owner:</strong></p>
            <ol>
              <li>You may request written lien waivers or proof of payment from Canyon Construction Inc. before issuing payment.</li>
              <li>You may also request a list of all subcontractors, suppliers, and equipment rental companies who may have lien rights.</li>
              <li>You may withhold payment if you believe lien claimants have not been paid.</li>
              <li>You may protect yourself by making checks jointly payable to Canyon Construction Inc. and listed subcontractors/suppliers.</li>
              <li>Oregon law allows you to demand a Notice of Right to Lien from any party who intends to claim a lien. If they fail to provide this notice when required, they may lose their lien rights.</li>
            </ol>
            
            <p><strong>What Canyon Construction Inc. will do:</strong></p>
            <p>Canyon Construction Inc. will only use licensed contractors (when required), will pay subcontractors and suppliers in accordance with Oregon law, and will provide lien waivers or proof of payment upon reasonable request from the homeowner.</p>
            
            <p><strong>IMPORTANT:</strong></p>
            <p>If a lien is filed against your property because someone who worked on your project was not paid, Oregon law gives you certain legal rights. For more information, you may contact an attorney or the Oregon Construction Contractors Board.</p>
          </section>

          <div className="form-actions">
            <button type="button" onClick={() => router.back()} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Creating...' : 'Create Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
