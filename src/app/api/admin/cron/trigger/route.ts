import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const session: any = await getServerSession(authOptions as any);

    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json().catch(() => ({ token: '' }));
    const cronSecret = process.env.CRON_SECRET || '';
    const provided = token || '';
    if (!cronSecret || provided !== cronSecret) {
      return NextResponse.json({ error: 'Invalid or missing token' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4000';
    const res = await fetch(`${siteUrl}/api/cron/scrape`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cronSecret}` },
      next: { revalidate: 0 },
    });
    const data = await res.json();

    // Persist a simple log entry
    try {
      const { connectToDatabase } = await import('@/lib/mongodb');
      const { db } = await connectToDatabase();
      await db.collection('cron_logs').insertOne({
        type: 'manual_trigger',
        by: session.user.email || 'admin',
        status: res.ok ? 'success' : 'error',
        response: data,
        createdAt: new Date(),
      });
    } catch {}

    return NextResponse.json({ ok: res.ok, data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to trigger' }, { status: 500 });
  }
}


