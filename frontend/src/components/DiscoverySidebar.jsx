import { useEffect, useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { categoryAPI } from '../services/api';

const DiscoverySidebar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((response) => setCategories(response.data))
      .catch(() => setCategories([]));
  }, []);

  const featuredCategories = categories.slice(0, 4);

  return (
    <aside className="discovery-sidebar right-sidebar">
      <div className="sidebar-panel sidebar-panel-featured">
        <div className="sidebar-icon-row">
          <Compass size={16} strokeWidth={1.7} />
          <span>Discovery</span>
        </div>
        <h2 className="sidebar-section-title">Quiet signals worth opening.</h2>
        <p className="sidebar-note">
          Read slowly, skim the metadata, then dive into the thread with the strongest point of view.
        </p>
      </div>

      <div className="sidebar-panel">
        <div className="sidebar-icon-row">
          <Sparkles size={16} strokeWidth={1.7} />
          <span>Categories</span>
        </div>
        <div className="sidebar-stack">
          {featuredCategories.length > 0 ? (
            featuredCategories.map((category) => (
              <div key={category.id} className="sidebar-topic">
                <p className="sidebar-topic-name">{category.name}</p>
                <p className="sidebar-topic-description">
                  {category.description || 'A thread category for closer observation.'}
                </p>
              </div>
            ))
          ) : (
            <p className="sidebar-note">Categories will appear here once the API responds.</p>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <span>Read the room.</span>
        <span>Write with intent.</span>
        <span>© 2026 nunchi</span>
      </div>
    </aside>
  );
};

export default DiscoverySidebar;
