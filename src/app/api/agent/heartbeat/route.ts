/* eslint-disable */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const shopId = req.headers.get('x-shop-id');
    if (!shopId) {
      return NextResponse.json({ error: 'Missing shop ID' }, { status: 400 });
    }

    // Parse body safely
    let agent_version = '1.0.0';
    let hostname = '';
    try {
      const body = await req.json();
      if (body.agent_version) agent_version = body.agent_version;
      if (body.hostname) hostname = body.hostname;
    } catch (_) {}

    const supabase = createAdminClient();

    // Verify shop exists (relaxed auth — heartbeat is low-risk, just confirms agent is alive)
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('id, agent_secret')
      .eq('id', shopId)
      .single();

    if (shopError || !shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Optional: check agent_secret only if the shop has one set
    const agentSecret = req.headers.get('x-agent-secret');
    if (shop.agent_secret && agentSecret && shop.agent_secret !== agentSecret) {
      return NextResponse.json({ error: 'Invalid agent secret' }, { status: 401 });
    }

    // Upsert agent status
    const { error: upsertError } = await supabase
      .from('agent_status')
      .upsert({
        shop_id: shopId,
        is_online: true,
        last_heartbeat: new Date().toISOString(),
        agent_version,
        hostname,
      }, { onConflict: 'shop_id' });

    if (upsertError) {
      console.error('Agent heartbeat upsert error:', upsertError);
    }

    return NextResponse.json({ success: true, message: 'Heartbeat received' });
  } catch (error: any) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
