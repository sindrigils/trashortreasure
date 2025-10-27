import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const ingestSecret = request.headers.get('x-ingest-secret');
    if (!ingestSecret || ingestSecret !== process.env.INGEST_SHARED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const { name, brought_candy, hate_vote, love_vote } = body;

    if (!name || !brought_candy || !hate_vote || !love_vote) {
      return NextResponse.json(
        { error: 'Missing required fields: name, brought_candy, hate_vote, love_vote' },
        { status: 400 }
      );
    }

    // Trim whitespace
    const voterName = name.trim();
    const broughtCandy = brought_candy.trim();
    const hateVote = hate_vote.trim();
    const loveVote = love_vote.trim();

    // Validate: hate_vote cannot equal brought_candy
    if (hateVote.toLowerCase() === broughtCandy.toLowerCase()) {
      return NextResponse.json(
        { error: 'Hate vote cannot be your own candy' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase
      .from('votes')
      .insert({
        voter_name: voterName,
        brought_candy: broughtCandy,
        hate_vote: hateVote,
        love_vote: loveVote,
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save vote' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
