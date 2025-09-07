import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = process.env.CRON_SCHEDULE || '0 */4 * * *';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const hasSecret = !!process.env.CRON_SECRET;

    return NextResponse.json({ schedule, siteUrl, hasSecret }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const session: any = await getServerSession(authOptions as any);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    // Persist desired schedule in DB; actual Vercel cron change still requires a deploy
    const { connectToDatabase } = await import('@/lib/mongodb');
    const { db } = await connectToDatabase();
    await db.collection('settings').updateOne(
      { key: 'cron' },
      { $set: { schedule: body.schedule, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ saved: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to save settings' }, { status: 500 });
  }
}


