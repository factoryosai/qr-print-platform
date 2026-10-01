/* eslint-disable */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const shopId = req.headers.get('x-shop-id');
    const agentSecret = req.headers.get('x-agent-secret');
    const { printers, agent_version } = await req.json();

    if (!shopId || !agentSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Verify agent
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('agent_secret')
      .eq('id', shopId)
      .single();

    if (shopError || shop.agent_secret !== agentSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Upsert agent status
    await supabase
      .from('agent_status')
      .upsert({ 
        shop_id: shopId, 
        is_online: true, 
        last_heartbeat: new Date().toISOString(),
        agent_version
      }, { onConflict: 'shop_id' });

    // In a full implementation, you would also sync the `printers` array 
    // into the `printers` table here (mark them as is_auto_detected = true).

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
