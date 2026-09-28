import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const shopId = req.headers.get('x-shop-id');
    const agentSecret = req.headers.get('x-agent-secret');

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

    // Find next queued job
    const { data: nextJob, error: jobError } = await supabase
      .from('orders')
      .select('*, order_files(*)')
      .eq('shop_id', shopId)
      .eq('print_status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (jobError || !nextJob) {
      return NextResponse.json({ job: null });
    }

    // Mark as sending_to_printer
    await supabase
      .from('orders')
      .update({ print_status: 'sending_to_printer' })
      .eq('id', nextJob.id);

    const file = nextJob.order_files[0];

    // Generate signed download URL
    const { data: signedUrlData, error: signError } = await supabase
      .storage
      .from('print-files')
      .createSignedUrl(file.storage_path, 60 * 10); // 10 mins

    if (signError) throw signError;

    return NextResponse.json({
      job: {
        print_job_id: nextJob.print_job_id,
        download_url: signedUrlData.signedUrl,
        printer_name: "Default Windows Printer", // In real app, derive from printer_id and printer_routing
        settings: nextJob.print_settings,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
