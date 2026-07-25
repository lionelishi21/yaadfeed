import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/lib/auth';
import { UserService } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;
    await UserService.markArticleAsRead(userId, articleId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in /api/user/read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized', readArticles: [] },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const readArticles = await UserService.getUserReadArticles(userId);

    return NextResponse.json({ readArticles });
  } catch (error) {
    console.error('Error fetching read articles:', error);
    return NextResponse.json(
      { error: 'Internal server error', readArticles: [] },
      { status: 500 }
    );
  }
}
