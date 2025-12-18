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
    const { 
      company_name, 
      trade, 
      ccb_number, 
      contact_name, 
      phone, 
      email, 
      address, 
      notes,
      // Google fields
      google_place_id,
      google_business_name,
      google_rating,
      google_total_reviews,
      google_maps_url,
      google_profile_photo_url,
      google_last_synced,
      is_google_verified
    } = body;

    // Validate required fields
    if (!company_name || !trade || !ccb_number || !contact_name || !phone || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      company_name,
      trade,
      ccb_number,
      contact_name,
      phone,
      email,
      address,
      notes
    };

    // Add Google fields if provided
    if (google_place_id !== undefined) updateData.google_place_id = google_place_id;
    if (google_business_name !== undefined) updateData.google_business_name = google_business_name;
    if (google_rating !== undefined) updateData.google_rating = google_rating;
    if (google_total_reviews !== undefined) updateData.google_total_reviews = google_total_reviews;
    if (google_maps_url !== undefined) updateData.google_maps_url = google_maps_url;
    if (google_profile_photo_url !== undefined) updateData.google_profile_photo_url = google_profile_photo_url;
    if (google_last_synced !== undefined) updateData.google_last_synced = google_last_synced;
    if (is_google_verified !== undefined) updateData.is_google_verified = is_google_verified;

    const { data: professional, error } = await supabaseAdmin
      .from('subcontractors')
      .update(updateData)
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
