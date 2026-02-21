import { NextRequest, NextResponse } from 'next/server';
import { PollService } from '@/lib/mongodb';

// GET: Get active poll
export async function GET() {
  const poll = await PollService.getActivePoll();
  if (!poll) {
    return NextResponse.json({ success: false, error: 'No active poll' }, { status: 404 });
  }
  return NextResponse.json({ success: true, poll });
}

// POST: Create a new poll (deactivate others)
export async function POST(request: NextRequest) {
  const { question, options } = await request.json();
  if (!question || !options || !Array.isArray(options) || options.length < 2) {
    return NextResponse.json({ success: false, error: 'Invalid poll data' }, { status: 400 });
  }
  // Deactivate all other polls
  const { getPollsCollection } = await import('@/lib/mongodb');
  const collection = await getPollsCollection();
  await collection.updateMany({}, { $set: { active: false } });
  // Create new poll
  const poll = await PollService.createPoll({
    question,
    options: options.map((text: string) => ({ text, votes: 0 })),
    active: true,
  });
  return NextResponse.json({ success: true, poll });
}

// PUT: Vote on a poll option
export async function PUT(request: NextRequest) {
  const { pollId, optionIndex } = await request.json();
  if (!pollId || typeof optionIndex !== 'number') {
    return NextResponse.json({ success: false, error: 'Invalid vote data' }, { status: 400 });
  }
  const poll = await PollService.voteOnPoll(pollId, optionIndex);
  if (!poll) {
    return NextResponse.json({ success: false, error: 'Poll not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, poll });
} 