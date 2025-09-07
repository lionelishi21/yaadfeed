import { NextRequest, NextResponse } from 'next/server';
// heavy imports moved to inside handler

export async function POST(request: NextRequest) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions as any);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, articleId, parentId } = await request.json();

    if (!content || !articleId) {
      return NextResponse.json({ error: 'Content and articleId are required' }, { status: 400 });
    }

    const { connectToDatabase } = await import('@/lib/mongodb');
    const { db } = await connectToDatabase();
    const commentsCollection = db.collection('comments');

    const comment = {
      content: content.trim(),
      articleId,
      parentId: parentId || null,
      author: {
        _id: (session.user as any).id,
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || null,
      },
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await commentsCollection.insertOne(comment);
    const newComment = await commentsCollection.findOne({ _id: result.insertedId });

    return NextResponse.json({ 
      comment: newComment,
      message: 'Comment created successfully' 
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ 
      error: 'Failed to create comment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 