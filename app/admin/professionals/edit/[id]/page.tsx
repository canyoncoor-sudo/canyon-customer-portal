'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import '../../new/new-professional.css';

export default function EditProfessional() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfessional();
  }, [id]);

  const fetchProfessional = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch(`/api/admin/professionals/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        router.push('/admin');
        return;
      }

      if (!res.ok) {
        alert('Professional not found');
        router.push('/admin/professionals');
        return;
      }

      const data = await res.json();
      const pro = data.professional;
      
        setFormData({
          company_name: pro.company_name || '',
          trade: pro.trade || '',
          ccb_number: pro.ccb_number || '',
          contact_name: pro.contact_name || '',
          phone: pro.phone || '',
          email: pro.email || '',
          address: pro.address || '',
          notes: pro.notes || ''
        });      setOfficePhone(pro.phone || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch professional:', error);
      alert('Failed to load professional data');
      router.push('/admin/professionals');
    }
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
    setSubmitting(true);

    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin');
        return;
      }

      const res = await fetch(`/api/admin/professionals/${id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update professional');
      }

      alert('Professional updated successfully!');
      router.push('/admin/professionals');
    } catch (error) {
      console.error('Error updating professional:', error);
      alert('Failed to update professional. Please try again.');
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="new-professional">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading professional data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="new-professional">
      <header className="professional-header">
        <div className="header-content">
          <button onClick={() => router.push('/admin/professionals')} className="back-btn">
            ← Back
          </button>
          <h1>Edit Licensed Professional</h1>
          <div style={{ width: '80px' }}></div>
        </div>
      </header>

      <div className="professional-content">
        <form onSubmit={handleSubmit} className="professional-form">
          <div className="form-section">
            <h2>Company Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="company_name">Company Name </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="trade">Trade </label>
                <input
                  type="text"
                  id="trade"
                  name="trade"
                  list="trade-options"
                  value={formData.trade}
                  onChange={handleChange}
                  placeholder="Type or select a trade..."
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
              </div>

              <div className="form-field">
                <label htmlFor="ccb_number">License Number (CCB/LCB) </label>
                <input
                  type="text"
                  id="ccb_number"
                  name="ccb_number"
                  value={formData.ccb_number}
                  onChange={handleChange}
                  placeholder="e.g., CCB 123456 or LCB 789"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="contact_name">Contact Name </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="officePhone">Office Phone </label>
                <input
                  type="tel"
                  id="officePhone"
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
                <label htmlFor="email">Email </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
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

              <div className="form-field full-width">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, Portland, OR 97201"
                />
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
                placeholder="Any additional notes about this professional..."
                rows={4}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => router.push('/admin/professionals')} 
              className="btn-cancel"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Professional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
