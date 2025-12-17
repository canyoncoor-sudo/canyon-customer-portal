import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/verify-admin-token';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const { data: professional, error } = await supabaseAdmin
      .from('subcontractors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching professional:', error);
      return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
    }

    return NextResponse.json({ professional });
  } catch (error) {
    console.error('Error in GET /api/admin/professionals/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { company_name, trade, ccb_number, contact_name, phone, email, address, notes } = body;

    // Validate required fields
    if (!company_name || !trade || !ccb_number || !contact_name || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: professional, error } = await supabaseAdmin
      .from('subcontractors')
      .update({
        company_name,
        trade,
        ccb_number,
        contact_name,
        phone,
        email,
        address,
        notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating professional:', error);
      return NextResponse.json({ error: 'Failed to update professional' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      professional 
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/professionals/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('subcontractors')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting professional:', error);
      return NextResponse.json({ error: 'Failed to delete professional' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Professional deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/professionals/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
