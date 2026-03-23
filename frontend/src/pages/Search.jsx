import { useDeferredValue, useEffect, useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import { categoryAPI, postAPI } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim());
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const queryLength = query.trim().length;
  const hasQuery = queryLength > 0;
  const isShortQuery = hasQuery && queryLength < 2;

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (deferredQuery.length < 2) {
      return;
    }

    let cancelled = false;

    postAPI
      .search(deferredQuery, 0, 20)
      .then((response) => {
        if (cancelled) {
          return;
        }

        setResults(response.data.content);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Search is unavailable right now.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  return (
    <section className="page-shell">
      <header className="feed-header">
        <p className="eyebrow">Explore</p>
        <h1 className="feed-heading">Find the thread, not the noise.</h1>
        <p className="feed-subtitle">
          Search by idea, category, or title. Results update once your query becomes specific enough to matter.
        </p>
      </header>

      <div className="search-form">
        <label className="search-field" htmlFor="search-threads">
          <SearchIcon size={18} strokeWidth={1.7} />
          <input
            id="search-threads"
            className="search-input"
            type="search"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              const nextLength = nextQuery.trim().length;

              setQuery(nextQuery);

              if (nextLength < 2) {
                setLoading(false);
                setResults([]);
                setError('');
                return;
              }

              setLoading(true);
              setError('');
            }}
            placeholder="Search posts, ideas, and categories"
          />
        </label>
        <p className="search-hint">Try precise words like “minimalism”, “React”, or a category name.</p>
      </div>

      <div className="search-grid">
        <div className="sidebar-panel">
          <p className="eyebrow">Start here</p>
          <h2 className="sidebar-section-title">Suggested lanes</h2>
          <div className="sidebar-stack">
            {categories.slice(0, 5).map((category) => (
              <button
                key={category.id}
                className="sidebar-topic sidebar-topic-button"
                onClick={() => setQuery(category.name)}
                type="button"
              >
                <span className="sidebar-topic-name">{category.name}</span>
                <span className="sidebar-topic-description">
                  {category.description || 'Search this category directly.'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-panel">
          <p className="eyebrow">Method</p>
          <h2 className="sidebar-section-title">Search reads best when you narrow it.</h2>
          <p className="sidebar-note">
            Two or three precise words outperform broad prompts. Start with a topic, then scan the category and timestamp before opening the post.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Searching</h2>
          <p className="empty-state-body">Looking through the archive for matching threads.</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Search unavailable</h2>
          <p className="empty-state-body">{error}</p>
        </div>
      ) : !hasQuery ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Search the archive</h2>
          <p className="empty-state-body">Enter a phrase to surface matching conversations.</p>
        </div>
      ) : isShortQuery ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Add one more character</h2>
          <p className="empty-state-body">The search endpoint works better when the query is at least two characters long.</p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-title">No direct matches</h2>
          <p className="empty-state-body">Try a broader keyword or jump in through one of the categories above.</p>
        </div>
      ) : (
        <Motion.div
          className="feed-stack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        >
          {results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Motion.div>
      )}
    </section>
  );
};

export default Search;
