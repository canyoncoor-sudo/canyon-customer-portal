'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './agreement.css';

export default function SubcontractorAgreement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const professionalId = searchParams.get('id');

  const [agreementDate, setAgreementDate] = useState(new Date().toISOString().split('T')[0]);
  const [professional, setProfessional] = useState({
    company_name: '',
    contact_name: '',
    trade: '',
    ccb_number: '',
    phone: '',
    email: '',
    address: ''
  });

  const [subcontractorSignature, setSubcontractorSignature] = useState('');
  const [subcontractorSignatureDate, setSubcontractorSignatureDate] = useState(new Date().toISOString().split('T')[0]);
  const [canyonSignature, setCanyonSignature] = useState('');
  const [canyonSignatureDate, setCanyonSignatureDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (professionalId) {
      fetchProfessional();
    }
  }, [professionalId]);

  const fetchProfessional = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/professionals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const prof = data.professionals?.find((p: any) => p.id === professionalId);
      if (prof) {
        setProfessional({
          company_name: prof.company_name || '',
          contact_name: prof.contact_name || '',
          trade: prof.trade || '',
          ccb_number: prof.ccb_number || '',
          phone: prof.phone || '',
          email: prof.email || '',
          address: prof.address || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch professional:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    // TODO: Implement save to database
    alert('Agreement saved! (Backend endpoint needed)');
  };

  return (
    <div className="agreement-container">
      <div className="agreement-header no-print">
        <button onClick={() => router.back()} className="back-btn">← Back</button>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">Save Agreement</button>
          <button onClick={handlePrint} className="btn-print">Print / PDF</button>
        </div>
      </div>

      <div className="agreement-document">
        {/* Header */}
        <div className="doc-header">
          <h1>SUBCONTRACTOR WORK AGREEMENT</h1>
          <p className="doc-subtitle">Independent Contractor Collaboration Agreement</p>
          <div className="agreement-date">
            <label>Agreement Date:</label>
            <input 
              type="date" 
              value={agreementDate} 
              onChange={(e) => setAgreementDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        {/* Parties Section */}
        <section className="agreement-section">
          <h2>PARTIES TO THIS AGREEMENT</h2>
          
          <div className="party-info">
            <h3>General Contractor</h3>
            <div className="info-grid">
              <div><strong>Company:</strong> Canyon Construction Inc</div>
              <div><strong>CCB #:</strong> 256596</div>
              <div><strong>Email:</strong> spencer@canyonconstructioninc.com</div>
            </div>
          </div>

          <div className="party-info">
            <h3>Subcontractor</h3>
            <div className="info-grid editable">
              <div>
                <label>Company Name:</label>
                <input 
                  type="text" 
                  value={professional.company_name}
                  onChange={(e) => setProfessional({...professional, company_name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label>Contact Person:</label>
                <input 
                  type="text" 
                  value={professional.contact_name}
                  onChange={(e) => setProfessional({...professional, contact_name: e.target.value})}
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <label>Trade/Specialty:</label>
                <input 
                  type="text" 
                  value={professional.trade}
                  onChange={(e) => setProfessional({...professional, trade: e.target.value})}
                  placeholder="Enter trade"
                />
              </div>
              <div>
                <label>License Number:</label>
                <input 
                  type="text" 
                  value={professional.ccb_number}
                  onChange={(e) => setProfessional({...professional, ccb_number: e.target.value})}
                  placeholder="CCB/LCB Number"
                />
              </div>
              <div>
                <label>Phone:</label>
                <input 
                  type="tel" 
                  value={professional.phone}
                  onChange={(e) => setProfessional({...professional, phone: e.target.value})}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label>Email:</label>
                <input 
                  type="email" 
                  value={professional.email}
                  onChange={(e) => setProfessional({...professional, email: e.target.value})}
                  placeholder="Email address"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Terms Section */}
        <section className="agreement-section">
          <h2>TERMS OF COLLABORATION</h2>
          
          <div className="terms-content">
            <h3>1. Scope of Work & Professional Responsibility</h3>
            <p>Subcontractor agrees to perform all work within their designated trade and specialty in a professional, workmanlike manner, adhering to all applicable building codes, industry standards, and best practices. Subcontractor maintains full responsibility for the quality, safety, and completion of their scope of work.</p>

            <h3>2. Permits & Regulatory Compliance</h3>
            <p>Subcontractor is solely responsible for obtaining, paying for, and maintaining all permits, licenses, and inspections required for their specific trade and scope of work. This includes, but is not limited to, trade-specific permits, specialty licenses, and any regulatory approvals necessary to perform the contracted services.</p>

            <h3>3. Professional Conduct & Customer Relations</h3>
            <p>Subcontractor agrees to:</p>
            <ul>
              <li>Treat the customer's property with respect and care at all times</li>
              <li>Maintain a clean and organized work area, removing debris daily</li>
              <li>Communicate professionally and courteously with the property owner</li>
              <li>Arrive punctually for scheduled work and provide advance notice of any delays</li>
              <li>Dress appropriately and maintain professional appearance on job sites</li>
              <li>Respect the customer's privacy and property boundaries</li>
            </ul>

            <h3>4. Insurance & Licensing Requirements</h3>
            <p>Subcontractor shall provide Canyon Construction Inc with current documentation of:</p>
            <ul>
              <li><strong>Valid contractor's license</strong> (CCB, LCB, or applicable state license)</li>
              <li><strong>General liability insurance</strong> with minimum coverage as required by Oregon state law</li>
              <li><strong>Workers' compensation insurance</strong> (if employing others)</li>
              <li><strong>Performance bond</strong> (when applicable for project size/scope)</li>
            </ul>
            <p>These documents must be provided before commencing work and kept current throughout the project duration.</p>

            <h3>5. Independent Contractor Relationship</h3>
            <p>Both parties acknowledge and agree that this is an independent contractor relationship. Subcontractor is not an employee, partner, or joint venture with Canyon Construction Inc. Each party maintains their own business operations, insurance, taxes, and legal obligations.</p>

            <h3>6. Quality Standards & Warranty</h3>
            <p>Subcontractor warrants that all work will be performed in accordance with industry standards and will be free from defects in workmanship and materials. Subcontractor agrees to correct any deficiencies in their work at no additional cost to Canyon Construction Inc or the property owner.</p>

            <h3>7. Communication & Coordination</h3>
            <p>Subcontractor agrees to maintain open communication with Canyon Construction Inc regarding:</p>
            <ul>
              <li>Project schedule and timeline updates</li>
              <li>Material needs and procurement</li>
              <li>Any job site issues or concerns</li>
              <li>Changes to scope or unforeseen conditions</li>
              <li>Completion status and final inspection readiness</li>
            </ul>

            <h3>8. Safety & Job Site Requirements</h3>
            <p>Subcontractor shall comply with all OSHA safety requirements and maintain a safe working environment. This includes proper use of personal protective equipment, safe operation of tools and equipment, and adherence to Canyon Construction Inc's job site safety protocols.</p>

            <h3>9. Mutual Success & Partnership</h3>
            <p>This agreement represents a collaborative partnership where both parties work together toward successful project completion. By maintaining high standards of professionalism, quality workmanship, and customer service, we build lasting business relationships and positive reputations in our community.</p>
          </div>
        </section>

        {/* Signatures Section */}
        <section className="agreement-section signatures-section">
          <h2>AGREEMENT & SIGNATURES</h2>
          <p className="signature-intro">By signing below, both parties acknowledge they have read, understood, and agree to abide by the terms outlined in this Subcontractor Work Agreement.</p>

          <div className="signature-grid">
            <div className="signature-block">
              <h4>Subcontractor Signature</h4>
              <div className="signature-field">
                <input
                  type="text"
                  value={subcontractorSignature}
                  onChange={(e) => setSubcontractorSignature(e.target.value)}
                  placeholder="Type or sign here"
                  className="signature-input"
                />
              </div>
              <div className="signature-details">
                <div>
                  <label>Printed Name:</label>
                  <input 
                    type="text" 
                    value={professional.contact_name}
                    onChange={(e) => setProfessional({...professional, contact_name: e.target.value})}
                  />
                </div>
                <div>
                  <label>Date:</label>
                  <input 
                    type="date" 
                    value={subcontractorSignatureDate}
                    onChange={(e) => setSubcontractorSignatureDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="signature-block">
              <h4>Canyon Construction Inc</h4>
              <div className="signature-field">
                <input
                  type="text"
                  value={canyonSignature}
                  onChange={(e) => setCanyonSignature(e.target.value)}
                  placeholder="Type or sign here"
                  className="signature-input"
                />
              </div>
              <div className="signature-details">
                <div>
                  <label>Printed Name:</label>
                  <input type="text" placeholder="Authorized Representative" />
                </div>
                <div>
                  <label>Date:</label>
                  <input 
                    type="date" 
                    value={canyonSignatureDate}
                    onChange={(e) => setCanyonSignatureDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="doc-footer">
          <p>This agreement is executed between independent contractors for the purpose of establishing professional standards and mutual expectations for collaborative construction projects.</p>
        </div>
      </div>
    </div>
  );
}
