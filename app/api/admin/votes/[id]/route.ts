import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

// PUT /api/admin/votes/[id] - Update a single vote
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vote ID' },
        { status: 400 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const { voter_name, brought_candy, hate_vote, love_vote } = body;

    if (!voter_name || !brought_candy || !hate_vote || !love_vote) {
      return NextResponse.json(
        { error: 'Missing required fields: voter_name, brought_candy, hate_vote, love_vote' },
        { status: 400 }
      );
    }

    // Trim whitespace
    const voterName = voter_name.trim();
    const broughtCandy = brought_candy.trim();
    const hateVote = hate_vote.trim();
    const loveVote = love_vote.trim();

    // Validate: hate_vote cannot equal brought_candy (case-insensitive)
    if (hateVote.toLowerCase() === broughtCandy.toLowerCase()) {
      return NextResponse.json(
        { error: 'Hate vote cannot be the same as brought candy' },
        { status: 400 }
      );
    }

    // Update in Supabase
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('votes')
      .update({
        voter_name: voterName,
        brought_candy: broughtCandy,
        hate_vote: hateVote,
        love_vote: loveVote,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'Failed to update vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, vote: data });
  } catch (error) {
    console.error('Admin PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/votes/[id] - Delete a single vote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vote ID' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
