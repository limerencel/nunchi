import { useEffect, useMemo, useState } from 'react';
import { postAPI, categoryAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { motion as Motion } from 'framer-motion';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const request = selectedCategory
      ? postAPI.getByCategory(selectedCategory, page)
      : postAPI.getAll(page);

    request
      .then((res) => {
        if (cancelled) {
          return;
        }

        setPosts((currentPosts) =>
          page === 0 ? res.data.content : [...currentPosts, ...res.data.content.filter((item) => !currentPosts.some((post) => post.id === item.id))],
        );
        setTotalPages(res.data.totalPages);
      })
      .catch(() => {
        if (!cancelled) {
          setError('The feed could not be loaded right now.');
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
  }, [selectedCategory, page, refreshKey]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategory),
    [categories, selectedCategory],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <section className="page-shell">
      <header className="feed-header">
        <p className="eyebrow">The art of observation</p>
        <h1 className="feed-heading">{activeCategory?.name || 'For you'}</h1>
        <p className="feed-subtitle">
          {activeCategory?.description || 'A clean feed of conversations that reward a second look.'}
        </p>
      </header>

      <div className="tabs-shell">
        <div className="category-tabs">
          <button
            onClick={() => {
              setLoading(true);
              setError('');
              setSelectedCategory(null);
              setPage(0);
            }}
            className="category-tab"
            data-active={!selectedCategory}
          >
            For You
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setLoading(true);
                setError('');
                setSelectedCategory(cat.id);
                setPage(0);
              }}
              className="category-tab"
              data-active={selectedCategory === cat.id}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Feed unavailable</h2>
          <p className="empty-state-body">{error}</p>
          <button
            className="text-button"
            onClick={() => {
              setLoading(true);
              setError('');
              setRefreshKey((value) => value + 1);
            }}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : loading && posts.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Loading threads</h2>
          <p className="empty-state-body">Pulling the latest posts into the reading column.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-title">Nothing here yet</h2>
          <p className="empty-state-body">Switch categories or be the first person to start the thread.</p>
        </div>
      ) : (
        <Motion.div
          className="feed-stack"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {posts.map((post) => (
            <Motion.div key={post.id} variants={itemVariants}>
              <PostCard post={post} />
            </Motion.div>
          ))}
        </Motion.div>
      )}

      {totalPages > 1 && (
        <div className="paging-row">
          <button
            className="text-button"
            onClick={() => {
              setLoading(true);
              setError('');
              setPage((p) => p + 1);
            }}
            disabled={page >= totalPages - 1 || loading}
            type="button"
          >
            {page >= totalPages - 1 ? 'No more posts' : loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Home;
