'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './change-order.css';

export default function ChangeOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: '',
    projectAddress: '',
    changeOrderNumber: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    reason: '',
    originalContract: '',
    previousChanges: '',
    thisChange: '',
    newContract: '',
    timeImpact: '',
    scheduledCompletion: '',
    newCompletion: '',
    approvedBy: '',
    approvalDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateNewContract = () => {
    const original = parseFloat(formData.originalContract) || 0;
    const previous = parseFloat(formData.previousChanges) || 0;
    const current = parseFloat(formData.thisChange) || 0;
    const total = original + previous + current;
    setFormData({ ...formData, newContract: total.toFixed(2) });
  };

  const handleSave = () => {
    console.log('Change Order Data:', formData);
    alert('Change order saved! (Integration with storage pending)');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="change-order-container">
      <header className="change-order-header no-print">
        <button onClick={() => router.push('/admin/documents')} className="back-btn">
          ← Back to Documents
        </button>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={handlePrint} className="btn-print">🖨️ Print / Save as PDF</button>
        </div>
      </header>

      <div className="change-order-document">
        <div className="doc-header">
          <h1>CHANGE ORDER</h1>
          <p className="doc-subtitle">Canyon Construction Inc.</p>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-field">
              <label>Change Order No.</label>
              <input
                type="text"
                name="changeOrderNumber"
                value={formData.changeOrderNumber}
                onChange={handleChange}
                placeholder="CO-001"
              />
            </div>
            <div className="form-field">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Project Address</label>
            <input
              type="text"
              name="projectAddress"
              value={formData.projectAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Description of Change</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Detailed description of the change..."
          />
        </div>

        <div className="form-section">
          <h2>Reason for Change</h2>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            placeholder="Reason for this change order..."
          />
        </div>

        <div className="form-section">
          <h2>Cost Impact</h2>
          <div className="cost-table">
            <div className="cost-row">
              <label>Original Contract Amount:</label>
              <input
                type="number"
                name="originalContract"
                value={formData.originalContract}
                onChange={handleChange}
                onBlur={calculateNewContract}
                placeholder="0.00"
              />
            </div>
            <div className="cost-row">
              <label>Previous Change Orders:</label>
              <input
                type="number"
                name="previousChanges"
                value={formData.previousChanges}
                onChange={handleChange}
                onBlur={calculateNewContract}
                placeholder="0.00"
              />
            </div>
            <div className="cost-row highlight">
              <label>This Change Order:</label>
              <input
                type="number"
                name="thisChange"
                value={formData.thisChange}
                onChange={handleChange}
                onBlur={calculateNewContract}
                placeholder="0.00"
              />
            </div>
            <div className="cost-row total">
              <label>New Contract Amount:</label>
              <input
                type="number"
                name="newContract"
                value={formData.newContract}
                readOnly
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Schedule Impact</h2>
          <div className="form-row">
            <div className="form-field">
              <label>Time Impact (Days)</label>
              <input
                type="number"
                name="timeImpact"
                value={formData.timeImpact}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Original Scheduled Completion</label>
              <input
                type="date"
                name="scheduledCompletion"
                value={formData.scheduledCompletion}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>New Completion Date</label>
              <input
                type="date"
                name="newCompletion"
                value={formData.newCompletion}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="signatures-section">
          <h2>Approval</h2>
          <div className="signature-grid">
            <div className="signature-block">
              <label>Approved By (Print Name)</label>
              <input
                type="text"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleChange}
              />
            </div>
            <div className="signature-block">
              <label>Date</label>
              <input
                type="date"
                name="approvalDate"
                value={formData.approvalDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="signature-line">
            <label>Signature</label>
            <div className="signature-box"></div>
          </div>
        </div>

        <div className="doc-footer">
          <p>This change order becomes part of the contract documents when signed by all parties.</p>
        </div>
      </div>
    </div>
  );
}
