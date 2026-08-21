import { NextRequest, NextResponse } from 'next/server';
import { PushSubscriptionService } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const success = await PushSubscriptionService.addToken(token);

    if (success) {
      return NextResponse.json({ success: true, message: 'Subscription saved successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in push subscription route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
