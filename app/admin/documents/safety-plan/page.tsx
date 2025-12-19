'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './safety-plan.css';

export default function SafetyPlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: '',
    projectAddress: '',
    projectManager: '',
    safetyOfficer: '',
    date: new Date().toISOString().split('T')[0],
    emergencyContact: '',
    emergencyPhone: '',
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    
    // Hazard Identification
    fallHazards: false,
    electricalHazards: false,
    excavationHazards: false,
    confinedSpaces: false,
    heavyEquipment: false,
    chemicalHazards: false,
    otherHazards: '',
    
    // PPE Requirements
    hardHats: false,
    safetyGlasses: false,
    steelToeBoots: false,
    gloves: false,
    hearingProtection: false,
    fallProtection: false,
    respirators: false,
    otherPPE: '',
    
    // Site-Specific Procedures
    accessControl: '',
    toolboxTalks: '',
    incidentReporting: '',
    firstAidLocation: '',
    additionalNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSave = () => {
    console.log('Safety Plan Data:', formData);
    alert('Safety plan saved! (Integration with storage pending)');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="safety-plan-container">
      <header className="safety-plan-header no-print">
        <button onClick={() => router.push('/admin/documents')} className="back-btn">
          ← Back to Documents
        </button>
        <div className="header-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={handlePrint} className="btn-print">Print</button>
        </div>
      </header>

      <div className="safety-plan-document">
        <div className="doc-header">
          <h1>SITE SAFETY PLAN</h1>
          <p className="doc-subtitle">Canyon Construction Inc.</p>
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
              <label>Project Manager</label>
              <input
                type="text"
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label>Safety Officer</label>
              <input
                type="text"
                name="safetyOfficer"
                value={formData.safetyOfficer}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Emergency Contacts</h2>
          <div className="emergency-box">
            <div className="emergency-item">
              <strong>Emergency Services: 911</strong>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Site Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-field">
              <label>Nearest Hospital</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Hospital Name"
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Hospital Address</label>
                <input
                  type="text"
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>Hospital Phone</label>
                <input
                  type="tel"
                  name="hospitalPhone"
                  value={formData.hospitalPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Hazard Identification</h2>
          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="fallHazards"
                checked={formData.fallHazards}
                onChange={handleChange}
              />
              <span>Fall Hazards</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="electricalHazards"
                checked={formData.electricalHazards}
                onChange={handleChange}
              />
              <span>Electrical Hazards</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="excavationHazards"
                checked={formData.excavationHazards}
                onChange={handleChange}
              />
              <span>Excavation/Trenching</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="confinedSpaces"
                checked={formData.confinedSpaces}
                onChange={handleChange}
              />
              <span>Confined Spaces</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="heavyEquipment"
                checked={formData.heavyEquipment}
                onChange={handleChange}
              />
              <span>Heavy Equipment</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="chemicalHazards"
                checked={formData.chemicalHazards}
                onChange={handleChange}
              />
              <span>Chemical Hazards</span>
            </label>
          </div>
          <div className="form-field">
            <label>Other Hazards</label>
            <textarea
              name="otherHazards"
              value={formData.otherHazards}
              onChange={handleChange}
              rows={3}
              placeholder="List any additional hazards..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Required Personal Protective Equipment (PPE)</h2>
          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="hardHats"
                checked={formData.hardHats}
                onChange={handleChange}
              />
              <span>Hard Hats</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="safetyGlasses"
                checked={formData.safetyGlasses}
                onChange={handleChange}
              />
              <span>Safety Glasses</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="steelToeBoots"
                checked={formData.steelToeBoots}
                onChange={handleChange}
              />
              <span>Steel-Toe Boots</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="gloves"
                checked={formData.gloves}
                onChange={handleChange}
              />
              <span>Work Gloves</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="hearingProtection"
                checked={formData.hearingProtection}
                onChange={handleChange}
              />
              <span>Hearing Protection</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="fallProtection"
                checked={formData.fallProtection}
                onChange={handleChange}
              />
              <span>Fall Protection</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="respirators"
                checked={formData.respirators}
                onChange={handleChange}
              />
              <span>Respirators</span>
            </label>
          </div>
          <div className="form-field">
            <label>Other PPE</label>
            <input
              type="text"
              name="otherPPE"
              value={formData.otherPPE}
              onChange={handleChange}
              placeholder="List any additional PPE requirements..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Site-Specific Safety Procedures</h2>
          <div className="form-field">
            <label>Access Control & Site Security</label>
            <textarea
              name="accessControl"
              value={formData.accessControl}
              onChange={handleChange}
              rows={3}
              placeholder="Describe access control measures..."
            />
          </div>
          <div className="form-field">
            <label>Daily Toolbox Talks Schedule</label>
            <textarea
              name="toolboxTalks"
              value={formData.toolboxTalks}
              onChange={handleChange}
              rows={3}
              placeholder="When and where toolbox talks will be conducted..."
            />
          </div>
          <div className="form-field">
            <label>Incident Reporting Procedures</label>
            <textarea
              name="incidentReporting"
              value={formData.incidentReporting}
              onChange={handleChange}
              rows={3}
              placeholder="Describe how incidents should be reported..."
            />
          </div>
          <div className="form-field">
            <label>First Aid Kit Location</label>
            <input
              type="text"
              name="firstAidLocation"
              value={formData.firstAidLocation}
              onChange={handleChange}
              placeholder="Location of first aid supplies..."
            />
          </div>
          <div className="form-field">
            <label>Additional Safety Notes</label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={4}
              placeholder="Any additional safety considerations..."
            />
          </div>
        </div>

        <div className="doc-footer">
          <p><strong>All personnel must read and acknowledge this safety plan before beginning work on site.</strong></p>
          <p>Safety is everyone's responsibility. Report all hazards and near-misses immediately.</p>
        </div>
      </div>
    </div>
  );
}
