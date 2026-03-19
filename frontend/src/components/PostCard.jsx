import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Share, BarChart2 } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <article style={{ 
      padding: '1.5rem 1rem', 
      borderBottom: '1px solid var(--divider)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'background-color 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface)'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
        <span style={{ fontWeight: 600 }}>{post.username}</span>
        <span style={{ color: 'var(--text-secondary)' }}>·</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>·</span>
        <span style={{ 
          fontSize: '0.8rem', 
          background: 'var(--surface)', 
          padding: '0.1rem 0.5rem', 
          borderRadius: '9999px',
          color: 'var(--text-secondary)'
        }}>
          {post.categoryName}
        </span>
      </div>

      {/* Content */}
      <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.25rem', 
          fontWeight: 700,
          lineHeight: 1.3
        }}>
          {post.title}
        </h2>
        <p className="serif-text" style={{ 
          margin: 0, 
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {post.content}
        </p>
      </Link>

      {/* Action Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        marginTop: '0.5rem', 
        color: 'var(--text-secondary)' 
      }}>
        <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
          <MessageCircle size={18} strokeWidth={1.5} />
          <span style={{ fontSize: '0.85rem' }}>Reply</span>
        </button>
        <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
          <Heart size={18} strokeWidth={1.5} />
        </button>
        <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
          <BarChart2 size={18} strokeWidth={1.5} />
          <span style={{ fontSize: '0.85rem' }}>{post.viewCount}</span>
        </button>
        <button className="action-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', marginLeft: 'auto' }}>
          <Share size={18} strokeWidth={1.5} />
        </button>
      </div>
    </article>
  );
};

export default PostCard;