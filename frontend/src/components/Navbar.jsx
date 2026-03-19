import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, PenSquare, User as UserIcon, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className="nav-item"
        style={{ fontWeight: isActive ? '700' : '500' }}
      >
        <Icon strokeWidth={isActive ? 2.5 : 1.5} size={28} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="nav-sidebar">
      <div>
        <Link to="/" className="nav-logo">
          nunchi
        </Link>
        <div className="nav-links">
          <NavLink to="/" icon={Home} label="Home" />
          <NavLink to="/search" icon={Search} label="Explore" />
          
          {!user && (
            <>
              <NavLink to="/login" icon={LogIn} label="Log In" />
              <NavLink to="/register" icon={UserPlus} label="Sign Up" />
            </>
          )}
        </div>
        
        {user && (
          <button className="btn-primary" onClick={() => navigate('/create-post')}>
            Post
          </button>
        )}
      </div>

      {user && (
        <div className="nav-user">
          <div className="nav-item" style={{ cursor: 'default' }}>
            <UserIcon strokeWidth={1.5} size={28} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>{user.username}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@user</span>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="nav-item"
            style={{ marginTop: '0.5rem', width: '100%', color: 'var(--text-secondary)' }}
          >
            <LogOut strokeWidth={1.5} size={20} />
            <span style={{ fontSize: '0.9rem' }}>Log out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;