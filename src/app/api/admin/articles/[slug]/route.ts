import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NewsService } from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    let article = await NewsService.getNewsBySlug(slug);
    
    if (!article) {
      article = await NewsService.getNewsById(slug);
    }

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error: any) {
    console.error('Error fetching admin article:', error);
    return NextResponse.json({ error: 'Failed to fetch article', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const data = await request.json();
    
    const updated = await NewsService.updateNews(slug, data);
    
    if (!updated) {
      return NextResponse.json({ error: 'Article not found or failed to update' }, { status: 404 });
    }
    
    return NextResponse.json({ article: updated });
  } catch (error: any) {
    console.error('Error updating admin article:', error);
    return NextResponse.json({ error: 'Failed to update article', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const deleted = await NewsService.deleteNews(slug);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Article not found or failed to delete' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting admin article:', error);
    return NextResponse.json({ error: 'Failed to delete article', details: error.message }, { status: 500 });
  }
}
