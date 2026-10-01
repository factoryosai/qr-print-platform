import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { userId, shopName, email } = await req.json();
    
    if (!userId || !shopName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const shopId = 'SHOP' + Math.floor(100 + Math.random() * 900);
    const agentSecret = crypto.randomUUID();

    const { error } = await supabase.from('shops').insert({
      id: shopId,
      owner_user_id: userId,
      name: shopName,
      agent_secret: agentSecret,
      email: email,
    });

    if (error) {
      console.error("Shop creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, shopId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
