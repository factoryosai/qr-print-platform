import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { shopId, fileName } = await req.json();
    if (!shopId || !fileName) {
      return NextResponse.json({ error: 'Missing shopId or fileName' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // Generate a secure random path
    const orderTempId = crypto.randomUUID();
    const safeName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${shopId}/${orderTempId}/${safeName}`;

    // Create a signed upload URL valid for 10 minutes
    const { data, error } = await supabase
      .storage
      .from('print-files')
      .createSignedUploadUrl(path);

    if (error) throw error;

    return NextResponse.json({ signedUrl: data.signedUrl, path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
