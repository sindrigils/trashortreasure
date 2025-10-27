import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// GET /api/admin/votes - Fetch all votes
export async function GET() {
  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/votes?confirm=true - Delete ALL votes
export async function DELETE(request: NextRequest) {
  try {
    // Safety check: require confirm=true parameter
    const searchParams = request.nextUrl.searchParams;
    const confirm = searchParams.get('confirm');

    if (confirm !== 'true') {
      return NextResponse.json(
        { error: 'Must provide confirm=true parameter' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // First, count how many votes will be deleted
    const { count, error: countError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Supabase count error:', countError);
      return NextResponse.json(
        { error: 'Failed to count votes' },
        { status: 500 }
      );
    }

    // Delete all votes
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .neq('id', 0); // This will match all rows

    if (deleteError) {
      console.error('Supabase delete all error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete votes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      deleted_count: count || 0,
    });
  } catch (error) {
    console.error('Admin DELETE all error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
