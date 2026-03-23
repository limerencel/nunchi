import { createElement } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, PenSquare, User as UserIcon, LogOut, LogIn, UserPlus } from 'lucide-react';

const SidebarNavItem = ({ to, icon, label, mobileOnly = false, pathname }) => {
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <Link
      to={to}
      className="nav-item"
      data-active={isActive ? 'true' : 'false'}
      data-mobile-only={mobileOnly ? 'true' : 'false'}
      aria-current={isActive ? 'page' : undefined}
    >
      {createElement(icon, { strokeWidth: isActive ? 2.2 : 1.6, size: 22 })}
      <span>{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-sidebar">
      <div className="nav-top">
        <Link to="/" className="nav-brand">
          <span className="nav-kicker">Forum for careful readers</span>
          <span className="nav-logo">nunchi</span>
          <span className="nav-subtitle">The art of observation, translated into threads.</span>
        </Link>
        <div className="nav-links" aria-label="Primary">
          <SidebarNavItem to="/" icon={Home} label="Home" pathname={location.pathname} />
          <SidebarNavItem to="/search" icon={Search} label="Explore" pathname={location.pathname} />
          {user && (
            <SidebarNavItem
              to="/create-post"
              icon={PenSquare}
              label="Compose"
              mobileOnly
              pathname={location.pathname}
            />
          )}


          {!user && (
            <>
              <SidebarNavItem to="/login" icon={LogIn} label="Log In" pathname={location.pathname} />
              <SidebarNavItem to="/register" icon={UserPlus} label="Sign Up" pathname={location.pathname} />
            </>
          )}
        </div>

        {user && (
          <button className="btn-primary nav-create" onClick={() => navigate('/create-post')}>
            <PenSquare size={18} strokeWidth={1.9} />
            <span>Compose</span>
          </button>
        )}
      </div>

      {user && (
        <div className="nav-user">
          <div className="nav-user-card">
            <span className="nav-avatar" aria-hidden="true">
              {user.username?.slice(0, 1).toUpperCase() || <UserIcon size={18} />}
            </span>
            <div className="nav-user-copy">
              <span className="nav-user-name">{user.username}</span>
              <span className="nav-user-handle">{user.email || 'Signed in'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-logout">
            <LogOut strokeWidth={1.6} size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
