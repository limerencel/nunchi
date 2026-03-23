import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await postAPI.create({
        title,
        content,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="page-shell page-shell--wide auth-shell">
        <div className="auth-panel auth-panel-single">
          <div className="auth-copy">
            <p className="eyebrow">Compose</p>
            <h1 className="feed-heading">You need an account to publish.</h1>
            <p className="feed-subtitle">
              Sign in first, then come back here to start a thread.
            </p>
          </div>
          <div className="submit-row submit-row-start">
            <Link className="btn-primary" to="/login">Log in</Link>
            <Link className="text-button" to="/register">Create account</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell page-shell--wide compose-shell">
      <div className="compose-layout">
        <div className="compose-intro">
          <p className="eyebrow">Compose</p>
          <h1 className="feed-heading">Start a quieter thread.</h1>
          <p className="feed-subtitle">
            Titles should be specific. The body can be plain text or pasted HTML if you are bringing in a longer draft.
          </p>
          <div className="sidebar-panel">
            <h2 className="sidebar-section-title">Posting notes</h2>
            <p className="sidebar-note">Lead with the idea, not the preamble.</p>
            <p className="sidebar-note">Topics are optional. Leave it blank if the post stands on its own.</p>
            <p className="sidebar-note">Paragraph breaks matter more than volume.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="compose-form">
          {error && <p className="error-message" role="alert">{error}</p>}

          <div className="field-group">
            <label className="field-label" htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={180}
              className="field-control"
              placeholder="State the thread in one strong line"
            />
            <div className="helper-row">
              <span>{title.length}/180</span>
              <span>Shorter titles scan better in the feed.</span>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="post-category">Category</label>
            <select
              id="post-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="field-control"
              disabled={loadingCategories}
            >
              <option value="">No topic</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="helper-row">
              <span>
                {loadingCategories
                  ? 'Loading topics…'
                  : categoryId
                    ? 'This post will be grouped under the selected topic.'
                    : 'Optional. If you skip it, the post is published without forcing a topic choice.'}
              </span>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="post-content">Content</label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="field-control field-textarea field-textarea-large serif-text"
              placeholder="Write the post here. Plain text is fine."
            />
            <div className="helper-row">
              <span>{content.trim().length} characters</span>
              <span>Line breaks are preserved in the reader view.</span>
            </div>
          </div>

          <div className="submit-row submit-row-start">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish thread'}
            </button>
            <button type="button" className="text-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
