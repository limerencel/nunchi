import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const loadPost = () => {
    postAPI.getById(id).then((res) => setPost(res.data)).catch(console.error);
  };

  const loadComments = () => {
    commentAPI.getByPostId(id).then((res) => setComments(res.data)).catch(console.error);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await commentAPI.create(id, { content: newComment });
      setNewComment('');
      loadComments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      await postAPI.delete(id);
      navigate('/');
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        By {post.username} | {post.categoryName} | {post.viewCount} views | {new Date(post.createdAt).toLocaleString()}
      </div>
      
      {user && (user.username === post.username || user.role === 'ADMIN') && (
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleDelete} style={{ background: '#dc3545', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>Delete Post</button>
        </div>
      )}

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '2rem', minHeight: '100px' }}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <h3>Comments ({comments.length})</h3>
      
      {user && (
        <form onSubmit={handleComment} style={{ marginBottom: '1rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            style={{ width: '100%', padding: '0.5rem', minHeight: '100px' }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>Add Comment</button>
        </form>
      )}

      {comments.map((comment) => (
        <div key={comment.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            <strong>{comment.username}</strong> | {new Date(comment.createdAt).toLocaleString()}
          </div>
          <p style={{ margin: '0.5rem 0 0 0' }}>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostDetail;