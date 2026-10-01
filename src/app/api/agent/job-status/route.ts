/* eslint-disable */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const shopId = req.headers.get('x-shop-id');
    const agentSecret = req.headers.get('x-agent-secret');
    const { print_job_id, status, failure_reason } = await req.json();

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

    // Update job status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        print_status: status, 
        failure_reason: failure_reason || null 
      })
      .eq('print_job_id', print_job_id)
      .eq('shop_id', shopId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
