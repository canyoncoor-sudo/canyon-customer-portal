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

    // Validate required fields (ccb_number is optional)
    console.log('Received data:', { company_name, trade, ccb_number, contact_name, phone, email });
    if (!company_name || !trade || !contact_name || !phone) {
      console.log('Missing required fields:', { 
        company_name: !company_name, 
        trade: !trade, 
        contact_name: !contact_name, 
        phone: !phone
      });
      return NextResponse.json({ error: 'Missing required fields: Company Name, Trade, Contact Name, and Phone are required' }, { status: 400 });
    }

    // Prepare insert data
    const insertData: any = {
      job_id: null, // Master list professionals don't have a job_id
      company_name,
      trade,
      ccb_number,
      contact_name,
      phone,
      email,
      address,
      notes,
      status: 'Active'
    };

    // Add Google fields if provided
    if (google_place_id) insertData.google_place_id = google_place_id;
    if (google_business_name) insertData.google_business_name = google_business_name;
    if (google_rating !== null && google_rating !== undefined) insertData.google_rating = google_rating;
    if (google_total_reviews !== null && google_total_reviews !== undefined) insertData.google_total_reviews = google_total_reviews;
    if (google_maps_url) insertData.google_maps_url = google_maps_url;
    if (google_profile_photo_url) insertData.google_profile_photo_url = google_profile_photo_url;
    if (google_last_synced) insertData.google_last_synced = google_last_synced;
    if (is_google_verified !== undefined) insertData.is_google_verified = is_google_verified;

    // Insert professional into subcontractors table
    const { data: professional, error } = await supabaseAdmin
      .from('subcontractors')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating professional:', error);
      return NextResponse.json({ error: 'Failed to create professional' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      professional 
    });
  } catch (error) {
    console.error('Error in /api/admin/professionals/create:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
