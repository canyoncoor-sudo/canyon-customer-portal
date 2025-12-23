'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleBusinessSearch from '@/components/GoogleBusinessSearch';
import './new-professional.css';

interface AdditionalContact {
  name: string;
  title: string;
  phone: string;
}

export default function NewProfessional() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: '',
    trade: '',
    ccb_number: '',
    contact_name: '',
    phone: '',
    email: '',
    street_address: '',
    city: '',
    state: 'OR',
    zip_code: '',
    notes: '',
    // Google fields
    google_place_id: '',
    google_business_name: '',
    google_rating: null as number | null,
    google_total_reviews: null as number | null,
    google_maps_url: '',
    google_profile_photo_url: '',
    google_last_synced: '',
    is_google_verified: false,
  });
  
  const [additionalContacts, setAdditionalContacts] = useState<AdditionalContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);

  const oregonCities = [
    'Albany', 'Ashland', 'Astoria', 'Baker City', 'Bandon', 'Beaverton', 'Bend',
    'Brookings', 'Canby', 'Central Point', 'Clatskanie', 'Columbia City', 'Coos Bay',
    'Coquille', 'Corvallis', 'Cottage Grove', 'Dallas', 'Estacada', 'Eugene',
    'Florence', 'Forest Grove', 'Gladstone', 'Grants Pass', 'Gresham', 'Happy Valley',
    'Hermiston', 'Hillsboro', 'Hood River', 'Independence', 'Junction City', 'Keizer',
    'Klamath Falls', 'La Grande', 'Lake Oswego', 'Lebanon', 'Lincoln City',
    'Madras', 'McMinnville', 'Medford', 'Milwaukie', 'Molalla', 'Monmouth',
    'Newberg', 'Newport', 'Ontario', 'Oregon City', 'Pendleton', 'Portland',
    'Prineville', 'Redmond', 'Roseburg', 'Salem', 'Sandy', 'Seaside',
    'Sherwood', 'Silverton', 'Springfield', 'St. Helens', 'Stayton', 'Sutherlin',
    'Sweet Home', 'The Dalles', 'Tigard', 'Tillamook', 'Troutdale', 'Tualatin',
    'West Linn', 'Wilsonville', 'Woodburn'
  ];

  const handleGoogleBusinessSelect = (businessData: any) => {
    setFormData(prev => ({
      ...prev,
      company_name: businessData.company_name || prev.company_name,
      street_address: businessData.address || prev.street_address,
      phone: businessData.phone || prev.phone,
      trade: businessData.trade || prev.trade,
      google_place_id: businessData.google_place_id || '',
      google_business_name: businessData.google_business_name || '',
      google_rating: businessData.google_rating || null,
      google_total_reviews: businessData.google_total_reviews || null,
      google_maps_url: businessData.google_maps_url || '',
      google_profile_photo_url: businessData.google_profile_photo_url || '',
      google_last_synced: businessData.google_last_synced || '',
      is_google_verified: businessData.is_google_verified || false,
    }));

    alert('✅ Business information loaded from Google! You can edit any fields before saving.');
  };

  const addContact = () => {
    setAdditionalContacts([...additionalContacts, { name: '', title: '', phone: '' }]);
  };

  const updateContact = (index: number, field: keyof AdditionalContact, value: string) => {
    const newContacts = [...additionalContacts];
    newContacts[index][field] = value;
    setAdditionalContacts(newContacts);
  };

  const removeContact = (index: number) => {
    setAdditionalContacts(additionalContacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.contact_name || !formData.phone) {
      alert('Please fill in Company Name, Primary Contact Name, and Phone Number');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      // Format additional contacts for notes field
      const contactsText = additionalContacts
        .filter(c => c.name && c.phone)
        .map(c => `${c.name} (${c.title || 'Contact'}) - ${c.phone}`)
        .join('\n');
      
      const fullNotes = contactsText 
        ? `Additional Contacts:\n${contactsText}${formData.notes ? '\n\n' + formData.notes : ''}`
        : formData.notes;

      const res = await fetch('/api/admin/professionals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          address: `${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}`.trim(),
          notes: fullNotes,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin');
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create professional');
      }

      const data = await res.json();
      router.push(`/admin/professionals/agreement?id=${data.professional.id}`);
    } catch (error) {
      console.error('Error creating professional:', error);
      alert('Failed to create professional. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="new-professional">
      <header className="professional-header">
        <div className="header-content">
          <button onClick={() => router.back()} className="back-btn">
            ← Back
          </button>
          <h1>Add Licensed Professional</h1>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="professional-form">
        {/* Google Business Search */}
        {!useManualEntry && (
          <div className="form-section">
            <div className="google-search-header">
              <h2>Search Google Business</h2>
              <button
                type="button"
                onClick={() => setUseManualEntry(true)}
                className="manual-entry-btn"
              >
                Enter Manually
              </button>
            </div>
            <GoogleBusinessSearch onBusinessSelect={handleGoogleBusinessSelect} />
            <p className="helper-text">
              Search for a business to auto-fill company information from Google
            </p>
          </div>
        )}

        {useManualEntry && (
          <div className="form-section">
            <button
              type="button"
              onClick={() => setUseManualEntry(false)}
              className="google-search-btn"
            >
              ← Back to Google Search
            </button>
          </div>
        )}

        {/* Company Information */}
        <div className="form-section">
          <h2>Company Information</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="ABC Construction LLC"
                required
              />
            </div>

            <div className="form-field">
              <label>Trade *</label>
              <input
                type="text"
                name="trade"
                list="trade-options"
                value={formData.trade}
                onChange={handleChange}
                placeholder="Type or select a trade..."
                required
              />
              <datalist id="trade-options">
                <option value="Arborist" />
                <option value="Cabinets" />
                <option value="Carpentry" />
                <option value="Carpeting" />
                <option value="Concrete" />
                <option value="Demolition" />
                <option value="Drywall" />
                <option value="Electrical" />
                <option value="Excavation" />
                <option value="Finish Carpentry" />
                <option value="Flooring" />
                <option value="Framing" />
                <option value="General Contractor" />
                <option value="Hardwood Flooring" />
                <option value="House Cleaning" />
                <option value="HVAC" />
                <option value="Insulation" />
                <option value="Landscape Construction" />
                <option value="Landscape Maintenance" />
                <option value="Landscaping" />
                <option value="Masonry" />
                <option value="Painting" />
                <option value="Plumbing" />
                <option value="Pressure Washing" />
                <option value="Remodeling" />
                <option value="Roofing" />
                <option value="Sheet Rock" />
                <option value="Siding" />
                <option value="Tile" />
                <option value="Trim" />
                <option value="Windows & Doors" />
              </datalist>
              <p className="field-hint" style={{fontSize: '12px', color: '#454547', marginTop: '4px'}}>Start typing or select from the list. You can enter a custom trade if needed.</p>
            </div>

            <div className="form-field">
              <label>CCB License Number</label>
              <input
                type="text"
                name="ccb_number"
                value={formData.ccb_number}
                onChange={handleChange}
                placeholder="123456"
              />
            </div>
          </div>
        </div>

        {/* Primary Contact */}
        <div className="form-section">
          <h2>Primary Contact</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>Contact Name *</label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-field">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(503) 555-1234"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@company.com"
              />
            </div>
          </div>
        </div>

        {/* Additional Contacts */}
        <div className="form-section">
          <div className="section-header">
            <h2>Additional Contacts</h2>
            <button type="button" onClick={addContact} className="add-contact-btn">
              + Add Contact
            </button>
          </div>
          
          {additionalContacts.length === 0 && (
            <p className="helper-text">Add additional contacts for this company (optional)</p>
          )}

          {additionalContacts.map((contact, index) => (
            <div key={index} className="additional-contact-card">
              <div className="form-grid">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                    placeholder="Jane Smith"
                  />
                </div>

                <div className="form-field">
                  <label>Title/Role</label>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={(e) => updateContact(index, 'title', e.target.value)}
                    placeholder="Project Manager"
                  />
                </div>

                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                    placeholder="(503) 555-5678"
                  />
                </div>

                <div className="form-field remove-btn-field">
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="remove-contact-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business Address */}
        <div className="form-section">
          <h2>Business Address</h2>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Street Address</label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="123 Business Ave"
              />
            </div>

            <div className="form-field">
              <label>City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                {oregonCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>State</label>
              <input
                type="text"
                name="state"
                value="Oregon"
                disabled
                className="disabled-field"
              />
            </div>

            <div className="form-field">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="97201"
                maxLength={5}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <h2>Notes</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional information about this professional..."
            rows={4}
            className="full-width-textarea"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.back()}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Professional'}
          </button>
        </div>
      </form>
    </div>
  );
}
