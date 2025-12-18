'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoogleBusinessSearch from '@/components/GoogleBusinessSearch';
import './new-professional.css';

export default function NewProfessional() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company_name: '',
    trade: '',
    ccb_number: '',
    contact_name: '',
    phone: '',
    email: '',
    address: '',
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
  const [officePhone, setOfficePhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [additionalPhones, setAdditionalPhones] = useState<Array<{ name: string; title: string; phone: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);

  const handleGoogleBusinessSelect = (businessData: any) => {
    // Auto-populate form with Google data
    setFormData(prev => ({
      ...prev,
      company_name: businessData.company_name || prev.company_name,
      address: businessData.address || prev.address,
      email: prev.email, // Keep existing since Google doesn't provide
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

    // Set phone if provided
    if (businessData.phone) {
      setOfficePhone(businessData.phone);
    }

    // Show success message
    alert('✅ Business information loaded from Google! You can edit any fields before saving.');
  };

  const addPhoneNumber = () => {
    setAdditionalPhones([...additionalPhones, { name: '', title: '', phone: '' }]);
  };

  const updateAdditionalPhone = (index: number, field: 'name' | 'title' | 'phone', value: string) => {
    const newPhones = [...additionalPhones];
    newPhones[index][field] = value;
    setAdditionalPhones(newPhones);
  };

  const removeAdditionalPhone = (index: number) => {
    setAdditionalPhones(additionalPhones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch('/api/admin/professionals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: formData.company_name,
          trade: formData.trade,
          ccb_number: formData.ccb_number,
          contact_name: formData.contact_name,
          phone: officePhone || mobilePhone || formData.phone,
          email: formData.email,
          address: formData.address,
          notes: formData.notes,
          // Include Google fields
          google_place_id: formData.google_place_id || null,
          google_business_name: formData.google_business_name || null,
          google_rating: formData.google_rating,
          google_total_reviews: formData.google_total_reviews,
          google_maps_url: formData.google_maps_url || null,
          google_profile_photo_url: formData.google_profile_photo_url || null,
          google_last_synced: formData.google_last_synced || null,
          is_google_verified: formData.is_google_verified,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to create professional');
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

      <div className="professional-content">
        <form onSubmit={handleSubmit} className="professional-form">
          
          {/* Google Business Search Section */}
          {!useManualEntry && (
            <GoogleBusinessSearch 
              onBusinessSelect={handleGoogleBusinessSelect}
              disabled={loading}
            />
          )}

          {/* Toggle for manual entry */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setUseManualEntry(!useManualEntry)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#567A8D',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px',
              }}
            >
              {useManualEntry ? '🔍 Search Google Business Instead' : '✏️ Enter Information Manually'}
            </button>
          </div>

          {/* Show Google verification badge if linked */}
          {formData.is_google_verified && (
            <div style={{
              background: '#D4EDDA',
              border: '1px solid #28A745',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <div>
                <div style={{ fontWeight: 700, color: '#155724' }}>Linked to Google Business</div>
                <div style={{ fontSize: '13px', color: '#155724' }}>
                  {formData.google_business_name} • Rating: {formData.google_rating?.toFixed(1)} ⭐ ({formData.google_total_reviews} reviews)
                </div>
                {formData.google_maps_url && (
                  <a 
                    href={formData.google_maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: '#155724', textDecoration: 'underline' }}
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="form-section">
            <h2>Company Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="company_name">Company Name *</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="trade">Trade *</label>
                <input
                  type="text"
                  id="trade"
                  name="trade"
                  list="trade-options"
                  value={formData.trade}
                  onChange={handleChange}
                  placeholder="Type or select a trade..."
                  required
                />
                <datalist id="trade-options">
                  <option value="Cabinets" />
                  <option value="Concrete" />
                  <option value="Demolition" />
                  <option value="Drywall" />
                  <option value="Electrical" />
                  <option value="Excavation" />
                  <option value="Flooring" />
                  <option value="Framing" />
                  <option value="Hardwood Flooring" />
                  <option value="HVAC" />
                  <option value="Insulation" />
                  <option value="Landscaping" />
                  <option value="Masonry" />
                  <option value="Painting" />
                  <option value="Plumbing" />
                  <option value="Roofing" />
                  <option value="Siding" />
                  <option value="Tile" />
                  <option value="Windows & Doors" />
                </datalist>
              </div>

              <div className="form-field">
                <label htmlFor="ccb_number">License Number (CCB/LCB) *</label>
                <input
                  type="text"
                  id="ccb_number"
                  name="ccb_number"
                  value={formData.ccb_number}
                  onChange={handleChange}
                  placeholder="e.g., CCB 123456 or LCB 789"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="contact_name">Contact Name *</label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="officePhone">Office Phone *</label>
                <input
                  type="tel"
                  id="officePhone"
                  required
                  value={officePhone}
                  onChange={(e) => setOfficePhone(e.target.value)}
                  placeholder="(503) 555-0100"
                />
              </div>

              <div className="form-field">
                <label htmlFor="mobilePhone">Mobile Phone</label>
                <input
                  type="tel"
                  id="mobilePhone"
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  placeholder="(503) 555-0200"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, City, State ZIP"
                />
              </div>

              {additionalPhones.map((phoneEntry, index) => (
                <div key={index} className="additional-phone-section">
                  <div className="additional-phone-header">
                    <label>Additional Contact {index + 1}</label>
                    <button
                      type="button"
                      onClick={() => removeAdditionalPhone(index)}
                      className="remove-phone-btn"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className="additional-phone-fields">
                    <div className="form-field">
                      <label>Name</label>
                      <input
                        type="text"
                        value={phoneEntry.name}
                        onChange={(e) => updateAdditionalPhone(index, 'name', e.target.value)}
                        placeholder="Contact name"
                      />
                    </div>
                    <div className="form-field">
                      <label>Title</label>
                      <input
                        type="text"
                        value={phoneEntry.title}
                        onChange={(e) => updateAdditionalPhone(index, 'title', e.target.value)}
                        placeholder="e.g., Project Manager"
                      />
                    </div>
                    <div className="form-field">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={phoneEntry.phone}
                        onChange={(e) => updateAdditionalPhone(index, 'phone', e.target.value)}
                        placeholder="(503) 555-0300"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="form-field full-width">
                <button
                  type="button"
                  onClick={addPhoneNumber}
                  className="add-phone-btn"
                >
                  + Add Another Phone Number
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            <div className="form-field">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional notes about this professional..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Professional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
