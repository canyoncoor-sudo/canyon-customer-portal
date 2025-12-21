'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './new-proposal.css';

interface LineItem {
  id: string;
  scope: string;
  description: string;
  cost: number;
}

const SCOPE_OPTIONS = [
  // Site Work & Preparation
  'Site Work - Land Clearing',
  'Site Work - Tree Removal',
  'Site Work - Brush Removal',
  'Site Work - Stump Grinding',
  'Site Work - Rough Grading',
  'Site Work - Fine Grading',
  'Site Work - Excavation',
  'Site Work - Trenching',
  'Site Work - Soil Compaction',
  'Site Work - Erosion Control',
  'Site Work - Temporary Fencing',
  'Site Work - Construction Access Roads',
  'Site Work - Survey Layout',
  'Site Work - Demolition (Interior)',
  'Site Work - Demolition (Exterior)',
  'Site Work - Hauling and Disposal',
  
  // Foundations & Structural Concrete
  'Foundation - Footings',
  'Foundation - Stem Walls',
  'Foundation - Slab-on-Grade',
  'Foundation - Pier Foundations',
  'Foundation - Crawl Space',
  'Foundation - Basement',
  'Foundation - Retaining Walls',
  'Foundation - Waterproofing',
  'Foundation - Drainage Systems',
  'Concrete - Steps',
  'Concrete - Ramps',
  'Concrete - Curbs',
  'Concrete - Demolition',
  'Concrete - Structural Repair',
  
  // Framing & Structural Carpentry
  'Framing - Floor Framing',
  'Framing - Wall Framing',
  'Framing - Roof Framing',
  'Framing - Beam Installation',
  'Framing - Post Installation',
  'Framing - Structural Repairs',
  'Framing - Load-Bearing Wall Modifications',
  'Framing - Shear Wall Installation',
  'Framing - Floor Leveling',
  'Framing - Stair Framing',
  'Framing - Deck Framing',
  'Framing - Porch Framing',
  
  // Roofing
  'Roofing - Asphalt Shingle',
  'Roofing - Metal',
  'Roofing - Tile',
  'Roofing - Flat Systems',
  'Roofing - Tear-Off',
  'Roofing - Replacement',
  'Roofing - Repairs',
  'Roofing - Flashing Installation',
  'Roofing - Ridge Vents',
  'Roofing - Ventilation Systems',
  'Roofing - Skylight Installation',
  'Roofing - Skylight Repair',
  'Roofing - Insulation',
  'Roofing - Ice and Water Shield',
  
  // Exterior Finishes & Envelope
  'Siding - Fiber Cement',
  'Siding - Vinyl',
  'Siding - Wood',
  'Siding - Engineered Wood',
  'Siding - Stucco',
  'Siding - Brick Veneer',
  'Siding - Stone Veneer',
  'Exterior - Trim Installation',
  'Exterior - Soffit Installation',
  'Exterior - Fascia Installation',
  'Exterior - Caulking',
  'Exterior - Weatherproofing',
  'Exterior - House Wrap Installation',
  'Exterior - Insulation',
  'Exterior - Vapor Barriers',
  
  // Windows & Doors
  'Windows - Installation',
  'Windows - Replacement',
  'Windows - Flashing',
  'Doors - Sliding Glass',
  'Doors - Entry Door Installation',
  'Doors - Interior Door Installation',
  'Doors - Pocket Doors',
  'Doors - Bi-fold Doors',
  'Doors - French Doors',
  'Doors - Garage Doors',
  'Doors - Hardware Installation',
  'Doors - Weatherstripping',
  
  // Decks, Patios & Outdoor Structures
  'Deck - Wood Construction',
  'Deck - Composite Construction',
  'Deck - Resurfacing',
  'Deck - Repairs',
  'Patio - Covered Patios',
  'Outdoor - Pergolas',
  'Outdoor - Gazebos',
  'Outdoor - Carports',
  'Outdoor - Exterior Staircases',
  'Outdoor - Railings (Wood)',
  'Outdoor - Railings (Metal)',
  'Outdoor - Guardrail Installation',
  
  // Masonry & Hardscape
  'Hardscape - Paver Patios',
  'Hardscape - Walkways',
  'Hardscape - Driveways',
  'Hardscape - Concrete Sidewalks',
  'Masonry - Brick',
  'Masonry - Stone',
  'Masonry - Fire Pits',
  'Masonry - Outdoor Fireplaces',
  'Masonry - Chimney Repair',
  'Masonry - Chimney Rebuild',
  'Masonry - Restoration',
  
  // Plumbing
  'Plumbing - Rough Plumbing',
  'Plumbing - Repairs',
  'Plumbing - Water Line Installation',
  'Plumbing - Sewer Line Installation',
  'Plumbing - Drain Line Replacement',
  'Plumbing - Fixture Installation',
  'Plumbing - Faucet Installation',
  'Plumbing - Toilet Installation',
  'Plumbing - Shower Installation',
  'Plumbing - Bathtub Installation',
  'Plumbing - Water Heater Installation',
  'Plumbing - Tankless Water Heaters',
  'Plumbing - Sump Pumps',
  'Plumbing - Gas Line Installation',
  
  // Electrical
  'Electrical - Rough Electrical',
  'Electrical - Service Upgrades',
  'Electrical - Panel Replacement',
  'Electrical - Circuit Installation',
  'Electrical - Rewiring',
  'Electrical - Outlet Installation',
  'Electrical - Switch Installation',
  'Electrical - Lighting Installation',
  'Electrical - Recessed Lighting',
  'Electrical - Exterior Lighting',
  'Electrical - EV Charger Installation',
  'Electrical - Generator Installation',
  'Electrical - Low-Voltage Wiring',
  
  // HVAC
  'HVAC - Furnace Installation',
  'HVAC - AC Installation',
  'HVAC - Heat Pump Systems',
  'HVAC - Ductwork Installation',
  'HVAC - Ductwork Repair',
  'HVAC - Mini-Split Systems',
  'HVAC - Thermostat Installation',
  'HVAC - Ventilation Systems',
  'HVAC - Exhaust Fans',
  'HVAC - Air Filtration Systems',
  
  // Insulation
  'Insulation - Batt',
  'Insulation - Blown-In',
  'Insulation - Spray Foam',
  'Insulation - Crawl Space',
  'Insulation - Attic',
  'Insulation - Soundproofing',
  'Insulation - Radiant Barrier',
  
  // Drywall & Wall Systems
  'Drywall - Hanging',
  'Drywall - Taping',
  'Drywall - Finishing',
  'Drywall - Repair',
  'Drywall - Ceiling Texture',
  'Drywall - Wall Texture',
  'Drywall - Soundproof',
  'Drywall - Moisture-Resistant',
  
  // Interior Finishes
  'Painting - Interior',
  'Painting - Exterior',
  'Kitchen - Cabinet Installation',
  'Kitchen - Remodel',
  'Bathroom - Remodel',
  'Bathroom - Vanity Installation',
  'Countertop - Installation',
  'Tile - Installation',
  'Tile - Repair',
  'Tile - Shower Surrounds',
  'Tile - Backsplash',
  
  // Flooring
  'Flooring - Hardwood',
  'Flooring - Engineered Hardwood',
  'Flooring - Laminate',
  'Flooring - Vinyl Plank',
  'Flooring - Sheet Vinyl',
  'Flooring - Tile',
  'Flooring - Carpet Installation',
  'Flooring - Carpet Removal',
  'Flooring - Subfloor Repair',
  'Flooring - Floor Leveling',
  
  // Finish Carpentry
  'Finish Carpentry - Baseboards',
  'Finish Carpentry - Crown Molding',
  'Finish Carpentry - Door Casing',
  'Finish Carpentry - Window Casing',
  'Finish Carpentry - Wainscoting',
  'Finish Carpentry - Built-In Shelving',
  'Finish Carpentry - Closet Systems',
  'Finish Carpentry - Mantels',
  'Finish Carpentry - Stair Trim',
  'Finish Carpentry - Handrails',
  
  // Kitchens, Baths & Specialty
  'Appliance - Installation',
  'Appliance - Range Hood Installation',
  'Custom - Cabinetry',
  'Accessibility - ADA Modifications',
  'Accessibility - Aging-in-Place Upgrades',
  'Laundry Room - Build-Out',
  'Mudroom - Construction',
  
  // Garages & Accessory Structures
  'Garage - Construction',
  'Garage - Remodel',
  'Garage - Conversion',
  'Accessory - Storage Sheds',
  'Accessory - Workshops',
  'Accessory - Detached Structures',
  
  // Energy & Smart Home
  'Energy - Solar Panel Prep',
  'Energy - Battery Storage Systems',
  'Smart Home - Lighting Systems',
  'Smart Home - Thermostats',
  'Smart Home - Automation Wiring',
  'Energy - Audits',
  
  // Repairs & Maintenance
  'Repair - Rot Repair',
  'Repair - Water Damage',
  'Repair - Fire Damage',
  'Repair - Structural Reinforcement',
  'Repair - Seismic Retrofitting',
  'Repair - Termite Damage',
  'Repair - Mold Remediation',
  
  // Permits & Inspections
  'Permits - Acquisition',
  'Compliance - Code Upgrades',
  'Inspection - Coordination',
  'Documentation - As-Built',
  'Project - Closeout Services'
];

function ProposalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [customerZip, setCustomerZip] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [proposalDate, setProposalDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerSignature, setCustomerSignature] = useState('');
  const [contractorSignature, setContractorSignature] = useState('');
  const [proposalNotes, setProposalNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', scope: '', description: '', cost: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Pre-fill form from URL parameters (coming from job preview)
  useEffect(() => {
    const fromJobId = searchParams.get('jobId');
    const nameParam = searchParams.get('customerName');
    const emailParam = searchParams.get('email');
    const phoneParam = searchParams.get('phone');
    const addressParam = searchParams.get('address');
    const cityParam = searchParams.get('city');
    const stateParam = searchParams.get('state');
    const zipParam = searchParams.get('zip');
    const descriptionParam = searchParams.get('description');
    const existingProposalParam = searchParams.get('existingProposal');

    if (fromJobId) {
      setJobId(fromJobId);
    }

    if (nameParam) {
      setCustomerName(nameParam);
    }

    if (emailParam) {
      setCustomerEmail(emailParam);
    }

    if (phoneParam) {
      setCustomerPhone(phoneParam);
    }

    if (addressParam) {
      setCustomerAddress(addressParam);
    }

    if (cityParam) {
      setCustomerCity(cityParam);
    }

    if (stateParam) {
      setCustomerState(stateParam);
    }

    if (zipParam) {
      setCustomerZip(zipParam);
    }

    // Load existing proposal data if editing
    if (existingProposalParam) {
      try {
        const proposalData = JSON.parse(existingProposalParam);
        if (proposalData.lineItems && Array.isArray(proposalData.lineItems)) {
          // Convert existing line items to the expected format
          const loadedItems = proposalData.lineItems.map((item: any, index: number) => ({
            id: String(index + 1),
            scope: item.scope || '',
            description: item.description || '',
            cost: item.cost || 0
          }));
          setLineItems(loadedItems);
        }
      } catch (error) {
        console.error('Failed to parse existing proposal data:', error);
      }
    } else if (descriptionParam && descriptionParam.trim()) {
      // Pre-fill first line item with project description if available (only if not editing)
      setLineItems([
        { id: '1', scope: '', description: descriptionParam, cost: 0 }
      ]);
    }
  }, [searchParams]);

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

    // Validate jobId is present
    if (!jobId) {
      alert('Error: Job ID is missing. Please try again from the job preview page.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      
      // Build full address for submission
      const fullAddress = `${customerAddress}, ${customerCity}, ${customerState} ${customerZip}`;
      
      const res = await fetch(`/api/admin/jobs/${jobId}/proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          customerAddress: fullAddress,
          customerPhone,
          customerEmail,
          lineItems: lineItems.filter(item => item.scope && item.cost > 0),
          totalCost,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to access code generation page
        if (jobId) {
          router.push(`/admin/jobs/${jobId}/access-code`);
        } else {
          alert('Proposal created successfully!');
          router.push('/admin/dashboard');
        }
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
        <div>
          <h1>Create New Proposal</h1>
          {jobId && (
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#567A8D', fontWeight: 600 }}>
              📋 Pre-filled from Job Intake
            </p>
          )}
        </div>
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
                <label>Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-field full-width">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required
                  placeholder="123 Main Street"
                />
              </div>
              <div className="form-field">
                <label>City *</label>
                <input
                  type="text"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  required
                  placeholder="Salem"
                />
              </div>
              <div className="form-field">
                <label>State *</label>
                <input
                  type="text"
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value)}
                  required
                  placeholder="OR"
                  maxLength={2}
                />
              </div>
              <div className="form-field">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  value={customerZip}
                  onChange={(e) => setCustomerZip(e.target.value)}
                  required
                  placeholder="97301"
                  maxLength={10}
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
                <p>Email: projects@canyonconstructioninc.com</p>
                <p>Phone: (971) 340-0802</p>
                <p>Contact: Spencer Stanley</p>
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
          </section>          {/* Additional Notes */}
          <section className="proposal-section notes-section">
            <h4>Additional Notes</h4>
            <textarea
              value={proposalNotes}
              onChange={(e) => setProposalNotes(e.target.value)}
              placeholder="Add any additional notes, terms, or conditions for this proposal..."
              rows={6}
              className="notes-textarea"
            />
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

export default function NewProposal() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>}>
      <ProposalForm />
    </Suspense>
  );
}