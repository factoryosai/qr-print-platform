'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        setShop(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    const { error } = await supabase
      .from('shops')
      .update({
        name: shop.name,
        owner_name: shop.owner_name,
        mobile: shop.mobile,
        email: shop.email,
        address: shop.address
      })
      .eq('id', shop.id);
      
    setSaving(false);
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const copyToClipboard = () => {
    if (shop?.id) {
      navigator.clipboard.writeText(shop.id);
      alert('Shop ID copied to clipboard');
    }
  };

  if (loading) {
    return <div style={{ padding: '32px' }}>Loading profile...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sp-topbar" style={{ padding: '24px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sp-topbar-left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Shop Profile</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Manage your shop details and contact information</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-sp-primary" 
          style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
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
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>General Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>Shop Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={shop?.name || ''} 
                  onChange={handleChange}
                  className="form-control-sp" 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>Owner Name</label>
                <input 
                  type="text" 
                  name="owner_name"
                  value={shop?.owner_name || ''} 
                  onChange={handleChange}
                  className="form-control-sp" 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile"
                  value={shop?.mobile || ''} 
                  onChange={handleChange}
                  className="form-control-sp" 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                />
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={shop?.email || ''} 
                  onChange={handleChange}
                  className="form-control-sp" 
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="form-label" style={{ fontWeight: '500', color: '#334155', fontSize: '14px' }}>Shop Address</label>
              <textarea 
                name="address"
                value={shop?.address || ''} 
                onChange={handleChange}
                rows={3}
                className="form-control-sp" 
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }} 
              ></textarea>
            </div>
          </div>

          <div className="shop-id-box" style={{ background: '#f1f5f9', borderRadius: '12px', border: '1px dashed #cbd5e1', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="shop-id-label" style={{ fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Shop ID</div>
              <div className="shop-id-sub" style={{ color: '#64748b', fontSize: '13px' }}>Used to connect your Desktop Agent</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <code className="shop-id-value" style={{ background: '#e2e8f0', padding: '8px 16px', borderRadius: '6px', color: '#0f172a', fontWeight: '500', letterSpacing: '0.5px' }}>
                {shop?.id}
              </code>
              <button 
                onClick={copyToClipboard}
                className="btn-copy"
                style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                title="Copy to clipboard"
              >
                <i className="bi bi-copy"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
