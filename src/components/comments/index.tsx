// =============================================
// Comments Components - Form, Display, Replies
// =============================================

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Reply, 
  MoreHorizontal, 
  Flag, 
  ThumbsUp,
  Loader2,
  AlertCircle,
  User
} from 'lucide-react';

// Types
export interface CommentAuthor {
  id: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface CommentReply {
  id: string;
  content: string;
  author: CommentAuthor;
  created_at: string;
  likes: number;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  created_at: string;
  likes: number;
  is_liked?: boolean;
  replies?: CommentReply[];
}

export interface CommentFormData {
  content: string;
  parent_id?: string | null;
}

// Props interfaces
export interface CommentsSectionProps {
  comments: Comment[];
  totalCount: number;
  onAddComment: (data: CommentFormData) => Promise<void>;
  onReply?: (commentId: string, data: CommentFormData) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
  onLikeReply?: (replyId: string, commentId: string) => Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
  currentUser?: CommentAuthor | null;
  maxLength?: number;
}

export interface CommentFormProps {
  onSubmit: (data: CommentFormData) => Promise<void>;
  isSubmitting?: boolean;
  placeholder?: string;
  submitLabel?: string;
  maxLength?: number;
  autoFocus?: boolean;
  parentId?: string | null;
  onCancel?: () => void;
  compact?: boolean;
}

// ============================================================================
// Comment Form Component
// ============================================================================

export function CommentForm({
  onSubmit,
  isSubmitting = false,
  placeholder = 'اكتب تعليقك هنا...',
  submitLabel = 'إرسال',
  maxLength = 1000,
  autoFocus = false,
  parentId = null,
  onCancel,
  compact = false,
}: CommentFormProps) {
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('التعليق لا يمكن أن يكون فارغاً');
      return;
    }

    if (content.length > maxLength) {
      setError(`التعليق يجب أن يكون أقل من ${maxLength} حرف`);
      return;
    }

    try {
      await onSubmit({ content: content.trim(), parent_id: parentId });
      setContent('');
      if (!parentId) {
        textareaRef.current?.blur();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال التعليق');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-4'}>
      {parentId && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Reply className="w-4 h-4" />
          <span>رد على تعليق</span>
        </div>
      )}
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full resize-none rounded-lg border border-border bg-background 
            p-3 text-sm placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${compact ? 'min-h-20' : 'min-h-24'}
          `}
          disabled={isSubmitting}
        />
        
        {maxLength && (
          <span className={`
            absolute bottom-3 left-3 text-xs text-muted-foreground
            ${content.length > maxLength ? 'text-red-500' : ''}
          `}>
            {content.length}/{maxLength}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          اضغط Ctrl+Enter للإرسال
        </span>
        
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
          )}
          <Button 
            type="submit" 
            size="sm"
            disabled={isSubmitting || !content.trim() || content.length > maxLength}
            className="gap-1"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

// ============================================================================
// Single Comment Component
// ============================================================================

export interface SingleCommentProps {
  comment: Comment;
  onReply?: (data: CommentFormData) => Promise<void>;
  onLike?: () => Promise<void>;
  onReplyLike?: (replyId: string) => Promise<void>;
  isReplying?: boolean;
  isSubmittingReply?: boolean;
  currentUser?: CommentAuthor | null;
  maxLength?: number;
}

export function SingleComment({
  comment,
  onReply,
  onLike,
  onReplyLike,
  isReplying = false,
  isSubmittingReply = false,
  currentUser,
  maxLength = 500,
}: SingleCommentProps) {
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(true);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="group">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="w-10 h-10 shrink-0">
          {comment.author.avatar_url ? (
            <AvatarImage src={comment.author.avatar_url} alt={comment.author.display_name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
              {getInitials(comment.author.display_name)}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.author.display_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onLike}
              className={`
                flex items-center gap-1.5 text-xs transition-colors
                ${comment.is_liked 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <ThumbsUp className={`w-4 h-4 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes || 0}</span>
            </button>

            {currentUser && onReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>رد</span>
              </button>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {showReplies 
                    ? `إخفاء ${comment.replies.length} رد` 
                    : `عرض ${comment.replies.length} رد`}
                </span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && onReply && (
            <div className="mt-4">
              <CommentForm
                onSubmit={onReply}
                isSubmitting={isSubmittingReply}
                placeholder={`رد على ${comment.author.display_name}...`}
                submitLabel="إرسال الرد"
                maxLength={maxLength}
                compact
                parentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                autoFocus
              />
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 ms-6 border-s-2 border-border ps-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    {reply.author.avatar_url ? (
                      <AvatarImage src={reply.author.avatar_url} alt={reply.author.display_name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white text-xs">
                        {getInitials(reply.author.display_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{reply.author.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {reply.content}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => onReplyLike?.(reply.id)}
                        className={`
                          flex items-center gap-1.5 text-xs transition-colors
                          ${reply.is_liked 
                            ? 'text-primary' 
                            : 'text-muted-foreground hover:text-foreground'}
                        `}
                      >
                        <ThumbsUp className={`w-3 h-3 ${reply.is_liked ? 'fill-current' : ''}`} />
                        <span>{reply.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Comments Section Component
// ============================================================================

export function CommentsSection({
  comments,
  totalCount,
  onAddComment,
  onReply,
  onLikeComment,
  onLikeReply,
  isLoading = false,
  isSubmitting = false,
  currentUser,
  maxLength = 1000,
}: CommentsSectionProps) {
  const [showForm, setShowForm] = React.useState(true);

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">التعليقات</h2>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">
            التعليقات ({totalCount})
          </h2>
        </div>
        
        {totalCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {comments.length} من {totalCount}
          </span>
        )}
      </div>

      {/* Comment Form */}
      {currentUser ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 shrink-0">
                {currentUser.avatar_url ? (
                  <AvatarImage src={currentUser.avatar_url} alt={currentUser.display_name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {currentUser.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <CommentForm
                  onSubmit={onAddComment}
                  isSubmitting={isSubmitting}
                  maxLength={maxLength}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-3">
              سجّل الدخول لإضافة تعليق
            </p>
            <Button variant="outline" size="sm">
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <SingleComment
                  comment={comment}
                  onReply={onReply ? (data) => onReply(comment.id, data) : undefined}
                  onLike={onLikeComment ? () => onLikeComment(comment.id) : undefined}
                  onReplyLike={onLikeReply ? (replyId) => onLikeReply(replyId, comment.id) : undefined}
                  currentUser={currentUser}
                  maxLength={500}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">لا توجد تعليقات بعد</h3>
            <p className="text-muted-foreground">
              كن أول من يضيف تعليقاً على هذا المقال
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

// ============================================================================
// Tool Reviews Component (Specialized for Tools)
// ============================================================================

export interface ToolReview {
  id: string;
  content: string;
  rating: number;
  author: CommentAuthor;
  created_at: string;
  helpful_count: number;
  is_helpful?: boolean;
}

export interface ToolReviewsProps {
  reviews: ToolReview[];
  averageRating: number;
  totalReviews: number;
  onAddReview: (data: { content: string; rating: number }) => Promise<void>;
  onMarkHelpful?: (reviewId: string) => Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
  currentUser?: CommentAuthor | null;
}

export function ToolReviews({
  reviews,
  averageRating,
  totalReviews,
  onAddReview,
  onMarkHelpful,
  isLoading = false,
  isSubmitting = false,
  currentUser,
}: ToolReviewsProps) {
  const [rating, setRating] = React.useState(5);

  return (
    <section className="space-y-6">
      {/* Header with Rating Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">المراجعات ({totalReviews})</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`
                  w-6 h-6 transition-colors
                  ${star <= rating 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-muted-foreground'}
                `}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({averageRating.toFixed(1)})
          </span>
        </div>
      </div>

      {/* Write Review */}
      {currentUser && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 shrink-0">
                {currentUser.avatar_url ? (
                  <AvatarImage src={currentUser.avatar_url} alt={currentUser.display_name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                    {currentUser.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-3">
                <CommentForm
                  onSubmit={(data) => onAddReview({ ...data, rating })}
                  isSubmitting={isSubmitting}
                  placeholder="اكتب مراجعتك عن هذه الأداة..."
                  submitLabel="إرسال المراجعة"
                  maxLength={500}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-2/3 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    {review.author.avatar_url ? (
                      <AvatarImage src={review.author.avatar_url} alt={review.author.display_name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {review.author.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.author.display_name}</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {review.content}
                    </p>
                    
                    <button
                      onClick={() => onMarkHelpful?.(review.id)}
                      className={`
                        flex items-center gap-1.5 text-xs transition-colors
                        ${review.is_helpful 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-foreground'}
                      `}
                    >
                      <ThumbsUp className={`w-4 h-4 ${review.is_helpful ? 'fill-current' : ''}`} />
                      <span>مفيد ({review.helpful_count || 0})</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              لا توجد مراجعات بعد. كن أول من يراجع هذه الأداة!
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
