'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminShops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchShops = async () => {
      const { data, error } = await supabase.from('shops').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setShops(data);
      }
      setLoading(false);
    };
    fetchShops();
  }, [supabase]);

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(search.toLowerCase()) || 
    shop.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>All Shops</h1>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}></i>
            <input 
              type="text" 
              placeholder="Search by name or shop ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Shop ID</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Owner</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Created Date</th>
                <th style={{ padding: '12px 20px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading shops...</td></tr>
              ) : filteredShops.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No shops found</td></tr>
              ) : (
                filteredShops.map((shop) => (
                  <tr key={shop.id} style={{ borderTop: '1px solid #e5e7eb', fontSize: '14px' }}>
                    <td style={{ padding: '12px 20px', color: '#6b7280', fontFamily: 'monospace', fontSize: '13px' }}>{shop.id}</td>
                    <td style={{ padding: '12px 20px', color: '#111827', fontWeight: 500 }}>{shop.name}</td>
                    <td style={{ padding: '12px 20px', color: '#4b5563' }}>{shop.owner_name}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 500 }}>Active</span>
                    </td>
                    <td style={{ padding: '12px 20px', color: '#6b7280' }}>{new Date(shop.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      <a href={`/${shop.id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '6px 12px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                        View Print Page
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
