'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    notes: ''
  });
  const [officePhone, setOfficePhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [additionalPhones, setAdditionalPhones] = useState<Array<{ name: string; title: string; phone: string }>>([]);
  const [loading, setLoading] = useState(false);

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
          notes: formData.notes
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
                  id="officePhone" required
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
