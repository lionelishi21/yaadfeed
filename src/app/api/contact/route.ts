import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Log the contact submission (and optionally forward via email service)
    console.log('[Contact Form]', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // If you have a SMTP/SendGrid/Resend key in env, you can wire it up here.
    // For now, we persist the submission to MongoDB so the editorial team can view it.
    try {
      const { clientPromise } = await import('@/lib/mongodb');
      const mongoClient = await clientPromise;
      const db = mongoClient.db();
      await db.collection('contact_submissions').insertOne({
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
        status: 'unread',
      });
    } catch (dbError) {
      // DB write failure shouldn't block the user success response — log and continue
      console.error('[Contact Form] Failed to persist submission:', dbError);
    }



    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
