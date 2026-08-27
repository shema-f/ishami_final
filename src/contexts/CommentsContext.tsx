import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  content: string;
  timestamp: number;
  likes: number;
  replies: Comment[];
  parentId?: string;
}

interface CommentsContextType {
  comments: Record<string, Comment[]>;
  addComment: (articleId: string, authorName: string, content: string, parentId?: string) => void;
  deleteComment: (articleId: string, commentId: string) => void;
  likeComment: (articleId: string, commentId: string) => void;
  getArticleComments: (articleId: string) => Comment[];
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    try {
      const saved = localStorage.getItem('article_comments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('article_comments', JSON.stringify(comments));
    } catch {
      // localStorage not available
    }
  }, [comments]);

  const addComment = useCallback((articleId: string, authorName: string, content: string, parentId?: string) => {
    setComments(prev => {
      const articleComments = prev[articleId] || [];
      
      const newComment: Comment = {
        id: generateId(),
        articleId,
        authorName: authorName.trim() || 'Anonymous',
        content: content.trim(),
        timestamp: Date.now(),
        likes: 0,
        replies: [],
      };

      let updatedComments: Comment[];

      if (parentId) {
        // Add as a reply
        updatedComments = addReplyToComment(articleComments, parentId, newComment);
      } else {
        // Add as a top-level comment
        updatedComments = [newComment, ...articleComments];
      }

      return {
        ...prev,
        [articleId]: updatedComments,
      };
    });
  }, []);

  const deleteComment = useCallback((articleId: string, commentId: string) => {
    setComments(prev => {
      const articleComments = prev[articleId] || [];
      const updatedComments = deleteCommentFromList(articleComments, commentId);
      return {
        ...prev,
        [articleId]: updatedComments,
      };
    });
  }, []);

  const likeComment = useCallback((articleId: string, commentId: string) => {
    setComments(prev => {
      const articleComments = prev[articleId] || [];
      const updatedComments = likeCommentInList(articleComments, commentId);
      return {
        ...prev,
        [articleId]: updatedComments,
      };
    });
  }, []);

  const getArticleComments = useCallback((articleId: string) => {
    return comments[articleId] || [];
  }, [comments]);

  return (
    <CommentsContext.Provider
      value={{
        comments,
        addComment,
        deleteComment,
        likeComment,
        getArticleComments,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

// Helper functions
function addReplyToComment(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, reply],
      };
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComment(comment.replies, parentId, reply),
      };
    }
    return comment;
  });
}

function deleteCommentFromList(comments: Comment[], commentId: string): Comment[] {
  return comments
    .filter(comment => comment.id !== commentId)
    .map(comment => ({
      ...comment,
      replies: deleteCommentFromList(comment.replies, commentId),
    }));
}

function likeCommentInList(comments: Comment[], commentId: string): Comment[] {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        likes: comment.likes + 1,
      };
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: likeCommentInList(comment.replies, commentId),
      };
    }
    return comment;
  });
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}
