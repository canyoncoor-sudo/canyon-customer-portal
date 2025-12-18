'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './agreement.css';

function AgreementContent() {
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
          <div className="doc-subtitle">Between Canyon Construction Inc. and {professional.company_name || 'Subcontractor'}</div>
          <div className="agreement-date">
            <label>Agreement Date:</label>
            <input 
              type="date" 
              className="date-input"
              value={agreementDate}
              onChange={(e) => setAgreementDate(e.target.value)}
            />
          </div>
        </div>

        {/* Parties Section */}
        <div className="agreement-section">
          <h2>Parties to this Agreement</h2>
          
          <div className="party-info">
            <h3>General Contractor</h3>
            <div className="info-grid">
              <div><strong>Company:</strong> Canyon Construction Inc.</div>
              <div><strong>CCB#:</strong> 123456</div>
              <div><strong>Address:</strong> Portland, OR</div>
              <div><strong>Phone:</strong> (503) 555-0100</div>
              <div><strong>Email:</strong> info@canyonconstructioninc.com</div>
            </div>
          </div>

          <div className="party-info">
            <h3>Subcontractor</h3>
            <div className="info-grid editable">
              <div>
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={professional.company_name}
                  onChange={(e) => setProfessional({...professional, company_name: e.target.value})}
                />
              </div>
              <div>
                <label>Contact Name</label>
                <input 
                  type="text" 
                  value={professional.contact_name}
                  onChange={(e) => setProfessional({...professional, contact_name: e.target.value})}
                />
              </div>
              <div>
                <label>Trade</label>
                <input 
                  type="text" 
                  value={professional.trade}
                  onChange={(e) => setProfessional({...professional, trade: e.target.value})}
                />
              </div>
              <div>
                <label>CCB Number</label>
                <input 
                  type="text" 
                  value={professional.ccb_number}
                  onChange={(e) => setProfessional({...professional, ccb_number: e.target.value})}
                />
              </div>
              <div>
                <label>Phone</label>
                <input 
                  type="text" 
                  value={professional.phone}
                  onChange={(e) => setProfessional({...professional, phone: e.target.value})}
                />
              </div>
              <div>
                <label>Email</label>
                <input 
                  type="text" 
                  value={professional.email}
                  onChange={(e) => setProfessional({...professional, email: e.target.value})}
                />
              </div>
              <div>
                <label>Address</label>
                <input 
                  type="text" 
                  value={professional.address}
                  onChange={(e) => setProfessional({...professional, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="agreement-section">
          <h2>Terms and Conditions</h2>
          <div className="terms-content">
            <h3>1. Scope of Work</h3>
            <p>
              The Subcontractor agrees to furnish all labor, materials, equipment, and services necessary to complete the work 
              as described in the specifications and plans provided by Canyon Construction Inc. The work shall be performed 
              in a professional and workmanlike manner in accordance with industry standards.
            </p>

            <h3>2. Payment Terms</h3>
            <p>
              Payment shall be made according to the following schedule:
            </p>
            <ul>
              <li>Progress payments shall be made monthly based on percentage of work completed</li>
              <li>Final payment shall be made within 30 days of project completion and acceptance</li>
              <li>All invoices must include detailed breakdown of work completed</li>
              <li>Retainage of 10% may be held until final completion and approval</li>
            </ul>

            <h3>3. Insurance and Licensing</h3>
            <p>
              The Subcontractor warrants that they maintain current and valid:
            </p>
            <ul>
              <li>State contractor's license (CCB) in good standing</li>
              <li>General liability insurance with minimum coverage of $1,000,000</li>
              <li>Workers' compensation insurance as required by law</li>
              <li>Vehicle insurance for all vehicles used on project sites</li>
            </ul>

            <h3>4. Schedule and Completion</h3>
            <p>
              The Subcontractor agrees to complete the work in accordance with the project schedule provided by Canyon 
              Construction Inc. Any delays must be communicated immediately. Time is of the essence in this agreement.
            </p>

            <h3>5. Safety and Compliance</h3>
            <p>
              The Subcontractor shall comply with all applicable federal, state, and local laws, regulations, and ordinances, 
              including but not limited to OSHA safety requirements. The Subcontractor is responsible for maintaining a safe 
              work environment for their employees and others on the job site.
            </p>

            <h3>6. Warranty</h3>
            <p>
              The Subcontractor warrants that all work performed and materials provided shall be free from defects for a 
              period of one (1) year from the date of completion. The Subcontractor agrees to promptly correct any defective 
              work at no additional cost to Canyon Construction Inc.
            </p>

            <h3>7. Termination</h3>
            <p>
              Either party may terminate this agreement with written notice if the other party fails to fulfill their 
              obligations. Canyon Construction Inc. reserves the right to terminate this agreement immediately for cause, 
              including but not limited to safety violations, poor workmanship, or failure to maintain required insurance.
            </p>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="agreement-section signatures-section">
          <h2>Agreement and Signatures</h2>
          <p className="signature-intro">
            By signing below, both parties acknowledge that they have read, understood, and agree to be bound by all 
            terms and conditions of this Subcontractor Work Agreement.
          </p>

          <div className="signature-grid">
            <div className="signature-block">
              <h4>Subcontractor Signature</h4>
              <div className="signature-field">
                <input 
                  type="text" 
                  className="signature-input"
                  value={subcontractorSignature}
                  onChange={(e) => setSubcontractorSignature(e.target.value)}
                  placeholder="Sign here"
                />
              </div>
              <div className="signature-details">
                <div>
                  <label>Printed Name</label>
                  <input type="text" value={professional.contact_name} readOnly />
                </div>
                <div>
                  <label>Title</label>
                  <input type="text" placeholder="Owner / Authorized Representative" />
                </div>
                <div>
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={subcontractorSignatureDate}
                    onChange={(e) => setSubcontractorSignatureDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="signature-block">
              <h4>Canyon Construction Inc.</h4>
              <div className="signature-field">
                <input 
                  type="text" 
                  className="signature-input"
                  value={canyonSignature}
                  onChange={(e) => setCanyonSignature(e.target.value)}
                  placeholder="Sign here"
                />
              </div>
              <div className="signature-details">
                <div>
                  <label>Printed Name</label>
                  <input type="text" placeholder="Authorized Representative" />
                </div>
                <div>
                  <label>Title</label>
                  <input type="text" placeholder="Project Manager" />
                </div>
                <div>
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={canyonSignatureDate}
                    onChange={(e) => setCanyonSignatureDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="doc-footer">
          This agreement is legally binding. Both parties should retain a copy for their records.
        </div>
      </div>
    </div>
  );
}

export default function SubcontractorAgreement() {
  return (
    <Suspense fallback={<div style={{padding: '24px'}}>Loading agreement...</div>}>
      <AgreementContent />
    </Suspense>
  );
}
