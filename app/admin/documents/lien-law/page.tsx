'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './lien-law.css';

export default function LienLawPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Notice Type
    noticeType: 'information',
    
    // Project Information
    projectName: '',
    projectAddress: '',
    propertyOwner: '',
    ownerAddress: '',
    
    // Contractor Information
    contractorName: 'Canyon Construction Inc.',
    contractorAddress: '',
    contractorPhone: '',
    contractorLicense: '',
    
    // Contract Details
    contractDate: '',
    contractAmount: '',
    workDescription: '',
    
    // Dates
    noticeDate: new Date().toISOString().split('T')[0],
    firstWorkDate: '',
    lastWorkDate: '',
    
    // Lien Information
    amountClaimed: '',
    unpaidBalance: '',
    
    // Additional Information
    generalContractor: '',
    lender: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Lien Law Data:', formData);
    alert('Lien law notice saved! (Integration with storage pending)');
  };

  const handlePrint = () => {
    window.print();
  };

  const getNoticeTitle = () => {
    switch (formData.noticeType) {
      case 'information':
        return 'INFORMATION NOTICE TO OWNER';
      case 'right-to-lien':
        return 'NOTICE OF RIGHT TO A LIEN';
      case 'claim':
        return 'CLAIM OF LIEN';
      default:
        return 'CONSTRUCTION LIEN NOTICE';
    }
  };

  return (
    <div className="lien-law-container">
      <header className="lien-law-header no-print">
        <button onClick={() => router.push('/admin/documents')} className="back-btn">
          ← Back to Documents
        </button>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={handlePrint} className="btn-print">Print</button>
        </div>
      </header>

      <div className="lien-law-document">
        <div className="legal-warning no-print">
          <strong>⚠️ Legal Document</strong>
          <p>This is a legally binding notice. Ensure all information is accurate and consult with legal counsel before filing.</p>
        </div>

        <div className="doc-header">
          <h1>{getNoticeTitle()}</h1>
          <p className="doc-subtitle">State of Oregon - Construction Lien Law</p>
          <p className="doc-reference">ORS 87.001 - 87.060</p>
        </div>

        <div className="form-section no-print">
          <h2>Notice Type</h2>
          <div className="notice-type-selector">
            <label className={`notice-option ${formData.noticeType === 'information' ? 'active' : ''}`}>
              <input
                type="radio"
                name="noticeType"
                value="information"
                checked={formData.noticeType === 'information'}
                onChange={handleChange}
              />
              <div className="option-content">
                <strong>Information Notice</strong>
                <span>Notifies owner of potential lien rights (ORS 87.021)</span>
              </div>
            </label>
            <label className={`notice-option ${formData.noticeType === 'right-to-lien' ? 'active' : ''}`}>
              <input
                type="radio"
                name="noticeType"
                value="right-to-lien"
                checked={formData.noticeType === 'right-to-lien'}
                onChange={handleChange}
              />
              <div className="option-content">
                <strong>Notice of Right to Lien</strong>
                <span>Pre-lien notice within 8 days of non-payment (ORS 87.023)</span>
              </div>
            </label>
            <label className={`notice-option ${formData.noticeType === 'claim' ? 'active' : ''}`}>
              <input
                type="radio"
                name="noticeType"
                value="claim"
                checked={formData.noticeType === 'claim'}
                onChange={handleChange}
              />
              <div className="option-content">
                <strong>Claim of Lien</strong>
                <span>Formal lien claim filed with county (ORS 87.035)</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Property Owner Information</h2>
          <div className="form-field">
            <label>Property Owner Name</label>
            <input
              type="text"
              name="propertyOwner"
              value={formData.propertyOwner}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Owner Mailing Address</label>
            <input
              type="text"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Project Information</h2>
          <div className="form-field">
            <label>Project Name/Description</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Property Address (Legal Description)</label>
            <textarea
              name="projectAddress"
              value={formData.projectAddress}
              onChange={handleChange}
              rows={3}
              placeholder="Full legal description of property"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Contractor Information</h2>
          <div className="form-field">
            <label>Contractor/Company Name</label>
            <input
              type="text"
              name="contractorName"
              value={formData.contractorName}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Business Address</label>
            <input
              type="text"
              name="contractorAddress"
              value={formData.contractorAddress}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Phone Number</label>
              <input
                type="tel"
                name="contractorPhone"
                value={formData.contractorPhone}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>CCB License Number</label>
              <input
                type="text"
                name="contractorLicense"
                value={formData.contractorLicense}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contract & Work Details</h2>
          <div className="form-row">
            <div className="form-field">
              <label>Contract Date</label>
              <input
                type="date"
                name="contractDate"
                value={formData.contractDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Contract Amount</label>
              <input
                type="number"
                name="contractAmount"
                value={formData.contractAmount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="form-field">
            <label>Description of Work Performed</label>
            <textarea
              name="workDescription"
              value={formData.workDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed description of labor and materials provided..."
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>First Date Work Performed</label>
              <input
                type="date"
                name="firstWorkDate"
                value={formData.firstWorkDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Last Date Work Performed</label>
              <input
                type="date"
                name="lastWorkDate"
                value={formData.lastWorkDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {(formData.noticeType === 'right-to-lien' || formData.noticeType === 'claim') && (
          <div className="form-section">
            <h2>Amount Information</h2>
            <div className="amount-grid">
              <div className="form-field">
                <label>Total Amount Claimed</label>
                <input
                  type="number"
                  name="amountClaimed"
                  value={formData.amountClaimed}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="form-field">
                <label>Unpaid Balance</label>
                <input
                  type="number"
                  name="unpaidBalance"
                  value={formData.unpaidBalance}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <h2>Additional Information</h2>
          <div className="form-field">
            <label>General Contractor (if applicable)</label>
            <input
              type="text"
              name="generalContractor"
              value={formData.generalContractor}
              onChange={handleChange}
              placeholder="If you are a subcontractor"
            />
          </div>
          <div className="form-field">
            <label>Lender/Mortgagee (if known)</label>
            <input
              type="text"
              name="lender"
              value={formData.lender}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label>Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        <div className="legal-text-section">
          <h2>Legal Notice</h2>
          <div className="legal-box">
            {formData.noticeType === 'information' && (
              <>
                <p><strong>TO THE PROPERTY OWNER:</strong></p>
                <p>This notice is given to inform you that {formData.contractorName || '[Contractor Name]'} has provided or will provide labor, materials, or equipment for improvements to your property located at {formData.projectAddress || '[Property Address]'}.</p>
                <p>Under Oregon law, those who work on your property or provide labor, materials or equipment and are not paid in full have a right to enforce their claim for payment against your property. This claim is known as a construction lien.</p>
                <p><strong>IF A LIEN CLAIM IS FILED AGAINST YOUR PROPERTY, YOU COULD LOSE YOUR PROPERTY THROUGH A FORECLOSURE ACTION IF THE LIEN CLAIM IS NOT PAID.</strong></p>
              </>
            )}
            {formData.noticeType === 'right-to-lien' && (
              <>
                <p><strong>NOTICE OF RIGHT TO A LIEN</strong></p>
                <p>This notice is to inform you that {formData.contractorName || '[Contractor Name]'} has not been paid in full for labor, materials, or equipment provided for improvements to your property at {formData.projectAddress || '[Property Address]'}.</p>
                <p>The amount currently due and owing is ${formData.unpaidBalance || '[Amount]'}.</p>
                <p>Under Oregon construction lien law, your property may be liened and you may lose your property through foreclosure unless the claim for payment is satisfied. This could affect your ability to sell or refinance your property until the lien is resolved.</p>
                <p><strong>THIS IS NOT A LIEN. This is notice that a lien may be filed if payment is not received.</strong></p>
              </>
            )}
            {formData.noticeType === 'claim' && (
              <>
                <p><strong>CLAIM OF LIEN</strong></p>
                <p>Notice is hereby given that {formData.contractorName || '[Contractor Name]'}, licensed contractor CCB #{formData.contractorLicense || '[License]'}, claims a lien upon the following described real property:</p>
                <p className="indent">{formData.projectAddress || '[Legal Description of Property]'}</p>
                <p>For labor, materials, and equipment furnished for the construction and improvement of said property, specifically: {formData.workDescription || '[Description of Work]'}</p>
                <p>Work commenced on {formData.firstWorkDate || '[Date]'} and was last performed on {formData.lastWorkDate || '[Date]'}.</p>
                <p><strong>The amount claimed as a lien is: ${formData.amountClaimed || '[Amount]'}</strong></p>
                <p>The name and address of the owner of record is: {formData.propertyOwner || '[Owner Name]'}, {formData.ownerAddress || '[Owner Address]'}.</p>
              </>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Notice Date</h2>
          <div className="form-field">
            <label>Date of Notice</label>
            <input
              type="date"
              name="noticeDate"
              value={formData.noticeDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="signature-section">
          <div className="signature-block">
            <p><strong>Signed by:</strong></p>
            <div className="signature-line"></div>
            <p className="signature-name">{formData.contractorName || 'Canyon Construction Inc.'}</p>
            <p className="signature-title">Authorized Representative</p>
          </div>
        </div>

        <div className="doc-footer">
          <p><strong>IMPORTANT FILING REQUIREMENTS:</strong></p>
          <ul>
            <li>Information Notice: Must be delivered within 8 business days of first providing labor/materials</li>
            <li>Notice of Right to Lien: Must be delivered at least 8 days before filing a lien claim</li>
            <li>Claim of Lien: Must be filed within 75 days of substantial completion or last work performed</li>
            <li>All notices must be sent by certified or registered mail, or personally delivered</li>
            <li>Claims of lien must be recorded with the county recorder where the property is located</li>
          </ul>
          <p className="legal-disclaimer">This form is provided for informational purposes only and does not constitute legal advice. Consult with an attorney experienced in Oregon construction lien law before filing any lien notices or claims.</p>
        </div>
      </div>
    </div>
  );
}
