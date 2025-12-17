import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const adminData = await verifyAdminToken(token);
    
    if (!adminData) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      professional_id,
      agreement_date,
      subcontractor_signature,
      subcontractor_signature_date,
      subcontractor_printed_name,
      canyon_signature,
      canyon_signature_date,
      canyon_printed_name
    } = body;

    // Validate required fields
    if (!professional_id || !agreement_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create agreement record (we'll need to create this table)
    const agreementData: any = {
      professional_id,
      agreement_date,
      status: 'draft',
      created_at: new Date().toISOString()
    };

    // Add signatures if provided
    if (subcontractor_signature) {
      agreementData.subcontractor_signature = subcontractor_signature;
      agreementData.subcontractor_signature_date = subcontractor_signature_date;
      agreementData.subcontractor_printed_name = subcontractor_printed_name;
    }

    if (canyon_signature) {
      agreementData.canyon_signature = canyon_signature;
      agreementData.canyon_signature_date = canyon_signature_date;
      agreementData.canyon_printed_name = canyon_printed_name;
    }

    // Check if both signatures are present
    if (subcontractor_signature && canyon_signature) {
      agreementData.status = 'signed';
      agreementData.signed_at = new Date().toISOString();
    }

    // We'll store this in the subcontractors table for now with additional fields
    // Later we can create a separate agreements table
    const { data: agreement, error } = await supabaseAdmin
      .from('subcontractors')
      .update({
        agreement_signed: !!subcontractor_signature,
        agreement_date: agreement_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', professional_id)
      .select()
      .single();

    if (error) {
      console.error('Error saving agreement:', error);
      return NextResponse.json({ error: 'Failed to save agreement' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      agreement: {
        ...agreement,
        ...agreementData
      }
    });
  } catch (error) {
    console.error('Error in /api/admin/agreements/create:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
