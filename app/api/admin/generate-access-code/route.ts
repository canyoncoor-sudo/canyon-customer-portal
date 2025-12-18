// Canyon Customer Portal API
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateAccessCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CANYON-${randomNum}`;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET || 'your-secret-key'
    );
    
    try {
      await jwtVerify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { customerId } = await request.json();
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Generate new access code
    const accessCode = generateAccessCode();
    const hashedCode = await bcrypt.hash(accessCode, 10);
    
    // Update customer with new access code
    const { error } = await supabase
      .from('portal_jobs')
      .update({ access_code_hash: hashedCode })
      .eq('id', customerId);
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to generate access code' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      accessCode: accessCode
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
