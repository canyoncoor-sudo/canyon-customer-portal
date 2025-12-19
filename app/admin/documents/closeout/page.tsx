'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './closeout.css';

export default function ProjectCloseoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: '',
    projectAddress: '',
    contractNumber: '',
    completionDate: new Date().toISOString().split('T')[0],
    finalInspectionDate: '',
    certificateOfOccupancy: false,
    
    // Project Details
    originalContractAmount: '',
    finalContractAmount: '',
    changeOrdersTotal: '',
    
    // Completion Checklist
    finalInspectionPassed: false,
    allPermitsClosed: false,
    punchListCompleted: false,
    warrantyDocumentsProvided: false,
    ownerManualProvided: false,
    asBuiltDrawingsProvided: false,
    lienReleasesObtained: false,
    finalPaymentReceived: false,
    
    // Warranties
    roofWarranty: '',
    roofWarrantyYears: '',
    structuralWarranty: '',
    structuralWarrantyYears: '',
    hvacWarranty: '',
    hvacWarrantyYears: '',
    plumbingWarranty: '',
    plumbingWarrantyYears: '',
    electricalWarranty: '',
    electricalWarrantyYears: '',
    otherWarranties: '',
    
    // Handover Items
    keysProvided: '',
    securityCodes: '',
    utilityAccounts: '',
    maintenanceSchedule: '',
    
    // Final Notes
    outstandingIssues: '',
    clientFeedback: '',
    lessonsLearned: '',
    
    // Signatures
    contractorName: '',
    contractorSignDate: '',
    ownerName: '',
    ownerSignDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSave = () => {
    console.log('Closeout Data:', formData);
    alert('Project closeout saved! (Integration with storage pending)');
  };

  const handlePrint = () => {
    window.print();
  };

  const getCompletionPercentage = () => {
    const checklistItems = [
      formData.finalInspectionPassed,
      formData.allPermitsClosed,
      formData.punchListCompleted,
      formData.warrantyDocumentsProvided,
      formData.ownerManualProvided,
      formData.asBuiltDrawingsProvided,
      formData.lienReleasesObtained,
      formData.finalPaymentReceived
    ];
    const completed = checklistItems.filter(Boolean).length;
    return Math.round((completed / checklistItems.length) * 100);
  };

  return (
    <div className="closeout-container">
      <header className="closeout-header no-print">
        <button onClick={() => router.push('/admin/documents')} className="back-btn">
          ← Back to Documents
        </button>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={handlePrint} className="btn-print">Print</button>
        </div>
      </header>

      <div className="closeout-document">
        <div className="doc-header">
          <h1>PROJECT CLOSEOUT DOCUMENT</h1>
          <p className="doc-subtitle">Canyon Construction Inc.</p>
        </div>

        <div className="completion-badge no-print">
          <div className="completion-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="circle-bg" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                className="circle-progress"
                style={{
                  strokeDashoffset: 283 - (283 * getCompletionPercentage()) / 100
                }}
              />
            </svg>
            <div className="completion-text">
              <span className="completion-number">{getCompletionPercentage()}%</span>
              <span className="completion-label">Complete</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Project Information</h2>
          <div className="form-row">
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
              <label>Contract Number</label>
              <input
                type="text"
                name="contractNumber"
                value={formData.contractNumber}
                onChange={handleChange}
              />
            </div>
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
          <div className="form-row">
            <div className="form-field">
              <label>Completion Date</label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Final Inspection Date</label>
              <input
                type="date"
                name="finalInspectionDate"
                value={formData.finalInspectionDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="checkbox-field">
            <label>
              <input
                type="checkbox"
                name="certificateOfOccupancy"
                checked={formData.certificateOfOccupancy}
                onChange={handleChange}
              />
              <span>Certificate of Occupancy Issued</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Financial Summary</h2>
          <div className="financial-table">
            <div className="financial-row">
              <label>Original Contract Amount:</label>
              <input
                type="number"
                name="originalContractAmount"
                value={formData.originalContractAmount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="financial-row">
              <label>Total Change Orders:</label>
              <input
                type="number"
                name="changeOrdersTotal"
                value={formData.changeOrdersTotal}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div className="financial-row total">
              <label>Final Contract Amount:</label>
              <input
                type="number"
                name="finalContractAmount"
                value={formData.finalContractAmount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Completion Checklist</h2>
          <div className="checklist-grid">
            <label className="checklist-item">
              <input
                type="checkbox"
                name="finalInspectionPassed"
                checked={formData.finalInspectionPassed}
                onChange={handleChange}
              />
              <span>Final Inspection Passed</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="allPermitsClosed"
                checked={formData.allPermitsClosed}
                onChange={handleChange}
              />
              <span>All Permits Closed</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="punchListCompleted"
                checked={formData.punchListCompleted}
                onChange={handleChange}
              />
              <span>Punch List Completed</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="warrantyDocumentsProvided"
                checked={formData.warrantyDocumentsProvided}
                onChange={handleChange}
              />
              <span>Warranty Documents Provided</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="ownerManualProvided"
                checked={formData.ownerManualProvided}
                onChange={handleChange}
              />
              <span>Owner's Manual Provided</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="asBuiltDrawingsProvided"
                checked={formData.asBuiltDrawingsProvided}
                onChange={handleChange}
              />
              <span>As-Built Drawings Provided</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="lienReleasesObtained"
                checked={formData.lienReleasesObtained}
                onChange={handleChange}
              />
              <span>All Lien Releases Obtained</span>
            </label>
            <label className="checklist-item">
              <input
                type="checkbox"
                name="finalPaymentReceived"
                checked={formData.finalPaymentReceived}
                onChange={handleChange}
              />
              <span>Final Payment Received</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Warranty Information</h2>
          <div className="warranty-grid">
            <div className="warranty-item">
              <label>Roof Warranty</label>
              <div className="warranty-inputs">
                <input
                  type="text"
                  name="roofWarranty"
                  value={formData.roofWarranty}
                  onChange={handleChange}
                  placeholder="Warranty provider/type"
                />
                <input
                  type="number"
                  name="roofWarrantyYears"
                  value={formData.roofWarrantyYears}
                  onChange={handleChange}
                  placeholder="Years"
                  className="years-input"
                />
              </div>
            </div>
            <div className="warranty-item">
              <label>Structural Warranty</label>
              <div className="warranty-inputs">
                <input
                  type="text"
                  name="structuralWarranty"
                  value={formData.structuralWarranty}
                  onChange={handleChange}
                  placeholder="Warranty provider/type"
                />
                <input
                  type="number"
                  name="structuralWarrantyYears"
                  value={formData.structuralWarrantyYears}
                  onChange={handleChange}
                  placeholder="Years"
                  className="years-input"
                />
              </div>
            </div>
            <div className="warranty-item">
              <label>HVAC Warranty</label>
              <div className="warranty-inputs">
                <input
                  type="text"
                  name="hvacWarranty"
                  value={formData.hvacWarranty}
                  onChange={handleChange}
                  placeholder="Warranty provider/type"
                />
                <input
                  type="number"
                  name="hvacWarrantyYears"
                  value={formData.hvacWarrantyYears}
                  onChange={handleChange}
                  placeholder="Years"
                  className="years-input"
                />
              </div>
            </div>
            <div className="warranty-item">
              <label>Plumbing Warranty</label>
              <div className="warranty-inputs">
                <input
                  type="text"
                  name="plumbingWarranty"
                  value={formData.plumbingWarranty}
                  onChange={handleChange}
                  placeholder="Warranty provider/type"
                />
                <input
                  type="number"
                  name="plumbingWarrantyYears"
                  value={formData.plumbingWarrantyYears}
                  onChange={handleChange}
                  placeholder="Years"
                  className="years-input"
                />
              </div>
            </div>
            <div className="warranty-item">
              <label>Electrical Warranty</label>
              <div className="warranty-inputs">
                <input
                  type="text"
                  name="electricalWarranty"
                  value={formData.electricalWarranty}
                  onChange={handleChange}
                  placeholder="Warranty provider/type"
                />
                <input
                  type="number"
                  name="electricalWarrantyYears"
                  value={formData.electricalWarrantyYears}
                  onChange={handleChange}
                  placeholder="Years"
                  className="years-input"
                />
              </div>
            </div>
          </div>
          <div className="form-field">
            <label>Other Warranties</label>
            <textarea
              name="otherWarranties"
              value={formData.otherWarranties}
              onChange={handleChange}
              rows={3}
              placeholder="List any additional warranties..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Handover Items</h2>
          <div className="form-field">
            <label>Keys Provided</label>
            <input
              type="text"
              name="keysProvided"
              value={formData.keysProvided}
              onChange={handleChange}
              placeholder="e.g., 4 house keys, 2 garage remotes"
            />
          </div>
          <div className="form-field">
            <label>Security Codes & Access Information</label>
            <input
              type="text"
              name="securityCodes"
              value={formData.securityCodes}
              onChange={handleChange}
              placeholder="Location of documentation"
            />
          </div>
          <div className="form-field">
            <label>Utility Account Information</label>
            <textarea
              name="utilityAccounts"
              value={formData.utilityAccounts}
              onChange={handleChange}
              rows={3}
              placeholder="Electric, gas, water, internet account details..."
            />
          </div>
          <div className="form-field">
            <label>Maintenance Schedule</label>
            <textarea
              name="maintenanceSchedule"
              value={formData.maintenanceSchedule}
              onChange={handleChange}
              rows={4}
              placeholder="Recommended maintenance schedule for HVAC, roof, etc..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Final Notes</h2>
          <div className="form-field">
            <label>Outstanding Issues (if any)</label>
            <textarea
              name="outstandingIssues"
              value={formData.outstandingIssues}
              onChange={handleChange}
              rows={3}
              placeholder="Document any remaining items..."
            />
          </div>
          <div className="form-field">
            <label>Client Feedback</label>
            <textarea
              name="clientFeedback"
              value={formData.clientFeedback}
              onChange={handleChange}
              rows={3}
              placeholder="Client satisfaction and comments..."
            />
          </div>
          <div className="form-field">
            <label>Lessons Learned (Internal)</label>
            <textarea
              name="lessonsLearned"
              value={formData.lessonsLearned}
              onChange={handleChange}
              rows={3}
              placeholder="Notes for future projects..."
            />
          </div>
        </div>

        <div className="signatures-section">
          <h2>Project Closeout Acceptance</h2>
          <div className="signature-grid">
            <div className="signature-block">
              <label>Contractor Name</label>
              <input
                type="text"
                name="contractorName"
                value={formData.contractorName}
                onChange={handleChange}
              />
              <label className="sig-label">Signature</label>
              <div className="signature-box"></div>
              <label>Date</label>
              <input
                type="date"
                name="contractorSignDate"
                value={formData.contractorSignDate}
                onChange={handleChange}
              />
            </div>
            <div className="signature-block">
              <label>Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
              />
              <label className="sig-label">Signature</label>
              <div className="signature-box"></div>
              <label>Date</label>
              <input
                type="date"
                name="ownerSignDate"
                value={formData.ownerSignDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="doc-footer">
          <p>This document confirms the successful completion and handover of the above-referenced project.</p>
          <p>Canyon Construction Inc. • Licensed, Bonded & Insured</p>
        </div>
      </div>
    </div>
  );
}
