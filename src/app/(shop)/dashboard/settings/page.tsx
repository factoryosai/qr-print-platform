'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const supabase = createClient();

  const servicesList = [
    { id: 'doc', label: 'Document Print' },
    { id: 'idcard', label: 'Aadhaar/ID Cards' },
    { id: 'pancard', label: 'PAN Card' },
    { id: 'passport', label: 'Passport Photos' },
    { id: 'resume', label: 'Resume Printing' },
    { id: 'xerox', label: 'Xerox/Photocopy' }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        // Parse services if stringified JSON, or fallback to default
        let parsedServices = [];
        try {
          parsedServices = typeof data.services_enabled === 'string' ? JSON.parse(data.services_enabled) : (data.services_enabled || ['doc', 'xerox']);
        } catch (e) {
          parsedServices = ['doc', 'xerox'];
        }
        setShop({ ...data, parsedServices });
      }
      setLoading(false);
    };
    fetchSettings();
  }, [supabase]);

  const handleServiceToggle = (serviceId: string) => {
    const current = [...(shop.parsedServices || [])];
    const index = current.indexOf(serviceId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(serviceId);
    }
    setShop({ ...shop, parsedServices: current });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setShop({ ...shop, [e.target.name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    const { error } = await supabase
      .from('shops')
      .update({
        is_active: shop.is_active,
        services_enabled: shop.parsedServices,
        retention_hours: parseInt(shop.retention_hours || '24'),
        file_size_limit_mb: parseInt(shop.file_size_limit_mb || '25'),
      })
      .eq('id', shop.id);
      
    setSaving(false);
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) return <div style={{ padding: '32px' }}>Loading settings...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Shop Settings</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Configure your shop rules and services</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-sp-primary" 
          style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
      
      <div className="sp-body" style={{ padding: '32px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {message.text && (
            <div style={{ padding: '16px', borderRadius: '8px', marginBottom: '24px', background: message.type === 'success' ? '#dcfce3' : '#fee2e2', color: message.type === 'success' ? '#16a34a' : '#dc2626', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
              {message.text}
            </div>
          )}

          <div className="info-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Store Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>Accepting Orders</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>Toggle off to temporarily stop receiving new print jobs</div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                <input 
                  type="checkbox" 
                  name="is_active"
                  checked={shop?.is_active || false}
                  onChange={handleChange}
                  style={{ opacity: 0, width: 0, height: 0 }} 
                />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: shop?.is_active ? '#22c55e' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: shop?.is_active ? '26px' : '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>
          </div>

          <div className="info-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>Services Enabled</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {servicesList.map(svc => (
                <label key={svc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: shop?.parsedServices?.includes(svc.id) ? '#fef2f2' : '#fff' }}>
                  <input 
                    type="checkbox" 
                    checked={shop?.parsedServices?.includes(svc.id) || false}
                    onChange={() => handleServiceToggle(svc.id)}
                    style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
                  />
                  <span style={{ fontWeight: '500', color: '#334155' }}>{svc.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="info-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '32px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>System Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>Max File Size (MB)</label>
                <input 
                  type="number" 
                  name="file_size_limit_mb"
                  value={shop?.file_size_limit_mb || ''} 
                  onChange={handleChange}
                  className="form-control-sp" 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                />
                <div style={{ fontSize: '12px', color: '#64748b' }}>Maximum size allowed per upload</div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>File Retention (Hours)</label>
                <input 
                  type="number" 
                  name="retention_hours"
                  value={shop?.retention_hours || ''} 
                  onChange={handleChange}
                  className="form-control-sp" 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                />
                <div style={{ fontSize: '12px', color: '#64748b' }}>Time before files are auto-deleted</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
