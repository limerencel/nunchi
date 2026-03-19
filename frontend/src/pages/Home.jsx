import { useState, useEffect } from 'react';
import { postAPI, categoryAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, page]);

  const loadPosts = () => {
    const fetchPosts = selectedCategory
      ? postAPI.getByCategory(selectedCategory, page)
      : postAPI.getAll(page);
    
    fetchPosts.then((res) => {
      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  };

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
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      {/* Category Tabs */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        background: 'rgba(255,255,255,0.8)', // This needs to be themable, but for now we'll stick to a solid color or backdrop filter
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        borderBottom: '1px solid var(--divider)',
        padding: '0 1rem'
      }}
      className="tabs-container"
      >
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <button
            onClick={() => { setSelectedCategory(null); setPage(0); }}
            style={{ 
              padding: '1rem 0', 
              fontWeight: !selectedCategory ? 700 : 500,
              color: !selectedCategory ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: !selectedCategory ? '3px solid var(--accent)' : '3px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            For You
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(0); }}
              style={{ 
                padding: '1rem 0', 
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                color: selectedCategory === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: selectedCategory === cat.id ? '3px solid var(--accent)' : '3px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No posts found.
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={page >= totalPages - 1}
            style={{ color: 'var(--accent)' }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;