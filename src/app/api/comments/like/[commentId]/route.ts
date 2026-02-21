import { NextRequest, NextResponse } from 'next/server';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { commentId: '1' },
    { commentId: '2' },
    { commentId: '3' }
  ];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const { connectToDatabase } = await import('@/lib/mongodb');
    const { ObjectId } = await import('mongodb');

    const session = (await getServerSession(authOptions as any)) as any;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = await params;
    const userId = (session.user as any).id;

    const { db } = await connectToDatabase();
    const commentsCollection = db.collection('comments');

    // Check if comment exists
    const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });
    
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const likes = comment.likes || [];
    const hasLiked = likes.includes(userId);

    let updateOperation;
    let message;

    if (hasLiked) {
      // Unlike the comment
      updateOperation = { $pull: { likes: userId } };
      message = 'Comment unliked';
    } else {
      // Like the comment
      updateOperation = { $addToSet: { likes: userId } };
      message = 'Comment liked';
    }

    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      {
        ...updateOperation,
        $set: { updatedAt: new Date() }
      }
    );

    // Get updated comment for response
    const updatedComment = await commentsCollection.findOne({ _id: new ObjectId(commentId) });

    return NextResponse.json({ 
      comment: updatedComment,
      message,
      liked: !hasLiked
    });

  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ 
      error: 'Failed to toggle like',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 