import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { estimateReadingTime, formatLongDate, isHtmlContent } from '../utils/forumUi';

const CommentThread = ({ comments, currentUser, onDelete }) => (
  <div className="comment-thread">
    {comments.map((comment) => (
      <div key={comment.id} className={`comment-item${comment.parentId ? ' comment-item-reply' : ''}`}>
        <div className="comment-meta">
          <span className="feed-author truncate">{comment.username}</span>
          <span className="feed-separator">·</span>
          <span>{formatLongDate(comment.createdAt)}</span>
          {currentUser?.username === comment.username && (
            <button className="text-button comment-delete" onClick={() => onDelete(comment.id)} type="button">
              Delete
            </button>
          )}
        </div>
        <p className="comment-body serif-text">{comment.content}</p>
        {comment.replies?.length > 0 && (
          <CommentThread comments={comment.replies} currentUser={currentUser} onDelete={onDelete} />
        )}
      </div>
    ))}
  </div>
);

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadPost = useCallback(() => {
    setLoading(true);
    setPageError('');
    postAPI
      .getById(id)
      .then((res) => setPost(res.data))
      .catch(() => setPageError('This post could not be loaded.'))
      .finally(() => setLoading(false));
  }, [id]);

  const loadComments = useCallback(() => {
    commentAPI
      .getByPostId(id)
      .then((res) => setComments(res.data))
      .catch(() => setComments([]));
  }, [id]);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [loadComments, loadPost]);

  const handleComment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await commentAPI.create(id, { content: newComment });
      setNewComment('');
      loadComments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await postAPI.delete(id);
        navigate('/');
      } catch {
        setPageError('The post could not be deleted.');
      }
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await commentAPI.delete(commentId);
        loadComments();
      } catch {
        setPageError('The comment could not be deleted.');
      }
    }
  };

  if (loading) {
    return (
      <section className="page-shell page-shell--wide">
        <div className="empty-state">
          <h2 className="empty-state-title">Loading post</h2>
          <p className="empty-state-body">Pulling the thread into focus.</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page-shell page-shell--wide">
        <div className="empty-state">
          <h2 className="empty-state-title">Post unavailable</h2>
          <p className="empty-state-body">{pageError || 'This thread no longer exists.'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell page-shell--wide detail-shell">
      <Link to="/" className="detail-back">
        <ArrowLeft size={16} strokeWidth={1.8} />
        <span>Back to feed</span>
      </Link>

      <header className="detail-header">
        <div className="feed-post-meta">
          <span className="feed-author truncate">{post.username}</span>
          <span className="feed-separator">·</span>
          <span className="feed-category">{post.categoryName}</span>
          <span className="feed-separator">·</span>
          <span>{post.viewCount ?? 0} views</span>
          <span className="feed-separator">·</span>
          <span>{estimateReadingTime(post.content)} min read</span>
        </div>
        <h1 className="feed-heading detail-title">{post.title}</h1>
        <p className="feed-subtitle detail-subtitle">{formatLongDate(post.createdAt)}</p>
      </header>

      {user && (user.username === post.username || user.role === 'ADMIN') && (
        <div className="post-toolbar">
          <button onClick={handleDelete} className="danger-button" type="button">
            <Trash2 size={16} strokeWidth={1.8} />
            <span>Delete post</span>
          </button>
        </div>
      )}

      {pageError && (
        <p className="error-message" role="alert">
          {pageError}
        </p>
      )}

      <article className="detail-content">
        {isHtmlContent(post.content) ? (
          <div className="detail-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <div className="detail-prose detail-prose-plain serif-text">{post.content}</div>
        )}
      </article>

      <section className="comments-panel">
        <div className="comments-header">
          <div>
            <p className="eyebrow">Responses</p>
            <h2 className="sidebar-section-title">Comments ({comments.length})</h2>
          </div>
        </div>

        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <label className="field-label" htmlFor="comment-body">
              Add to the thread
            </label>
            <textarea
              id="comment-body"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a measured response..."
              required
              className="field-control field-textarea"
            />
            {error && <p className="error-message" role="alert">{error}</p>}
            <div className="submit-row">
              <span className="helper-copy">Thoughtful replies read better than quick ones.</span>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="empty-state empty-state-compact">
            <h2 className="empty-state-title">Join the conversation</h2>
            <p className="empty-state-body">Sign in to reply to this thread.</p>
          </div>
        )}

        {comments.length > 0 ? (
          <CommentThread comments={comments} currentUser={user} onDelete={handleCommentDelete} />
        ) : (
          <div className="empty-state empty-state-compact">
            <h2 className="empty-state-title">No comments yet</h2>
            <p className="empty-state-body">The first response sets the tone for the thread.</p>
          </div>
        )}
      </section>
    </section>
  );
};

export default PostDetail;
