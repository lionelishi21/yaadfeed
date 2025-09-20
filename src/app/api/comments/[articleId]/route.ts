import { NextRequest, NextResponse } from 'next/server';

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { articleId: '1' },
    { articleId: '2' },
    { articleId: '3' }
  ];
}
import { connectToDatabase } from '@/lib/mongodb';

interface CommentWithReplies {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  articleId: string;
  parentId?: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
  replies: CommentWithReplies[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;

    const { db } = await connectToDatabase();
    const commentsCollection = db.collection('comments');

    // First get all comments for this article
    const allComments = await commentsCollection
      .find({ articleId })
      .sort({ createdAt: -1 })
      .toArray();

    // Organize comments with their replies
    const commentMap = new Map<string, CommentWithReplies>();
    const topLevelComments: CommentWithReplies[] = [];

    // First pass: create map of all comments
    allComments.forEach(comment => {
      commentMap.set(comment._id.toString(), {
        _id: comment._id.toString(),
        content: comment.content,
        author: comment.author,
        articleId: comment.articleId,
        parentId: comment.parentId,
        likes: comment.likes || [],
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        replies: []
      });
    });

    // Second pass: organize into hierarchy
    allComments.forEach(comment => {
      const commentObj = commentMap.get(comment._id.toString());
      
      if (comment.parentId && commentObj) {
        // This is a reply
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentObj);
        }
      } else if (commentObj) {
        // This is a top-level comment
        topLevelComments.push(commentObj);
      }
    });

    return NextResponse.json({ 
      comments: topLevelComments,
      total: allComments.length 
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 