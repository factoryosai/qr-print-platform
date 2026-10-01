import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request, { params }: { params: { shopId: string } }) {
  const supabase = createAdminClient();
  const { data: shop, error } = await supabase.from('shops').select('id, name, address, is_active, services_enabled, file_size_limit_mb, accepted_file_types').eq('id', params.shopId).single();
  if (error || !shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  return NextResponse.json({ shop });
}
