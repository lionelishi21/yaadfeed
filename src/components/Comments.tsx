'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Reply, Heart, Flag, MoreVertical, Send, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ButtonLoader } from '@/components/ui/Loading';
import { formatters } from '@/utils';
import toast from 'react-hot-toast';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image?: string;
    email: string;
  };
  articleId: string;
  parentId?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface CommentsProps {
  articleId: string;
}

const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const openAuthModal = () => {
    window.dispatchEvent(new CustomEvent('open-auth-modal'));
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      openAuthModal();
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          articleId,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData.comment, ...comments]);
        setNewComment('');
        toast.success('Comment posted successfully!');
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!session) {
      openAuthModal();
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          articleId,
          parentId,
        }),
      });

      if (response.ok) {
        const replyData = await response.json();
        // Update the comments state to include the new reply
        fetchComments(); // Refresh all comments for simplicity
        setReplyContent('');
        setReplyingTo(null);
        toast.success('Reply posted successfully!');
      } else {
        toast.error('Failed to post reply');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session) {
      openAuthModal();
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchComments(); // Refresh comments to show updated likes
      }
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const CommentComponent: React.FC<{ comment: Comment; isReply?: boolean }> = ({ 
    comment, 
    isReply = false 
  }) => {
    const isLiked = session && comment.likes.includes((session.user as any)?.id || '');
    
    return (
      <div className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {comment.author.image ? (
              <img
                src={comment.author.image}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-jamaica-green-500 to-jamaica-gold-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-sm font-semibold text-gray-900">
                {comment.author.name}
              </h4>
              <span className="text-xs text-gray-500">
                {formatters.relative(comment.createdAt)}
              </span>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {comment.content}
            </p>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  isLiked 
                    ? 'text-red-600 hover:text-red-700' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{comment.likes.length}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className="flex items-center space-x-1 text-xs text-gray-500 hover:text-jamaica-green-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}

              <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors">
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment._id && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment._id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentComponent key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-4">
        <MessageCircle className="w-5 h-5 text-jamaica-green-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="bg-gradient-to-br from-jamaica-green-50 to-jamaica-gold-50 rounded-lg p-6 border border-jamaica-green-200">
        {session ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-jamaica-green-500 to-jamaica-gold-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-jamaica-green-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Commenting as <span className="font-medium">{session.user?.name}</span>
              </p>
              <Button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="bg-gradient-to-r from-jamaica-green-600 to-jamaica-gold-500 hover:from-jamaica-green-700 hover:to-jamaica-gold-600"
              >
                {submitting ? (
                  <ButtonLoader size="sm" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Join the conversation
            </h4>
            <p className="text-gray-600 mb-4">
              Sign in to share your thoughts and connect with other readers.
            </p>
            <Button
              onClick={openAuthModal}
              className="bg-gradient-to-r from-jamaica-green-600 to-jamaica-gold-500 hover:from-jamaica-green-700 hover:to-jamaica-gold-600"
            >
              Sign In to Comment
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentComponent key={comment._id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-500">
              Be the first to share your thoughts on this article!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments; 