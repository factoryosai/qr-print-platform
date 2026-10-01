/* eslint-disable */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { shopId, customer, settings, file } = await req.json();
    const supabase = createAdminClient();

    // In a real app, calculate price here from pricing_rules
    const totalAmount = 10; // Placeholder

    // Generate a short order number
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const printJobId = crypto.randomUUID();

    // Expiry time (e.g. 24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        shop_id: shopId,
        customer_name: customer.name,
        mobile: customer.mobile,
        service_type: 'document',
        print_settings: settings,
        total_amount: totalAmount,
        print_job_id: printJobId,
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const { error: fileError } = await supabase
      .from('order_files')
      .insert({
        order_id: orderData.id,
        file_name: file.fileName,
        storage_path: file.path,
        kind: 'document',
      });

    if (fileError) throw fileError;

    return NextResponse.json({ orderId: orderData.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
