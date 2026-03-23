import { Link } from 'react-router-dom';
import { MessageCircle, Share, BarChart2 } from 'lucide-react';
import { extractTextContent, formatShortDate } from '../utils/forumUi';

const PostCard = ({ post }) => {
  const preview = extractTextContent(post.content);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posts/${post.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: preview.slice(0, 120),
          url: shareUrl,
        });
        return;
      } catch {
        // Fall back to clipboard when share is unavailable or dismissed.
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        // Ignore clipboard failures. The link still remains accessible in the UI.
      }
    }
  };

  return (
    <article className="feed-post">
      <div className="feed-post-meta">
        <span className="feed-author truncate">{post.username}</span>
        <span className="feed-separator">·</span>
        <span>{formatShortDate(post.createdAt)}</span>
        <span className="feed-separator">·</span>
        <span className="feed-category truncate">
          {post.categoryName || 'General'}
        </span>
      </div>

      <Link to={`/posts/${post.id}`} className="feed-post-link">
        <h2 className="feed-title">{post.title}</h2>
        <p className="feed-excerpt serif-text">
          {preview || 'Open the thread to read the full post.'}
        </p>
      </Link>

      <div className="feed-actions">
        <Link to={`/posts/${post.id}`} className="feed-action">
          <MessageCircle size={18} strokeWidth={1.5} />
          <span>{post.comments?.length ? `${post.comments.length} replies` : 'Discuss'}</span>
        </Link>
        <div className="feed-action" aria-label="View count">
          <BarChart2 size={18} strokeWidth={1.5} />
          <span>{post.viewCount ?? 0} views</span>
        </div>
        <button className="feed-action feed-action--end" onClick={handleShare} type="button">
          <Share size={18} strokeWidth={1.5} />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;
