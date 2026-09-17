import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    if (logout) logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#8B9A6E',
        color: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        fontFamily: 'sans-serif',
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: '#FFFFFF',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          ClothStore
        </Link>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            fontSize: 22,
            cursor: 'pointer',
            padding: 4,
          }}
          className="mobile-toggle-btn"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Search Bar */}
        <form
          onSubmit={submitSearch}
          style={{
            flex: '1 1 220px',
            maxWidth: 360,
            display: 'flex',
          }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: '100%',
                padding: '8px 16px 8px 36px',
                borderRadius: 20,
                border: searchFocused ? '1.5px solid #FFFFFF' : '1.5px solid transparent',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 14,
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
          </div>
        </form>

        {/* Navigation Links & Actions */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <NavLink to="/">{t('home')}</NavLink>
          <NavLink to="/contact">{t('contactUs')}</NavLink>
          <NavLink to="/about">{t('aboutUs')}</NavLink>

          {/* Language Switcher Badge */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* User Auth Section / Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  padding: '4px 12px 4px 6px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    color: '#8B9A6E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span>{user?.name?.split(' ')?.[0] || 'Account'}</span>
                <span style={{ fontSize: 10, marginLeft: 2 }}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    backgroundColor: '#FFFFFF',
                    color: '#2D2D2D',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #EAE2D6',
                    minWidth: 160,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1100,
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      padding: '10px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#2D2D2D',
                      textDecoration: 'none',
                      borderBottom: '1px solid #F7F2EB',
                    }}
                  >
                    {t('profile')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '10px 16px',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#D9534F',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <NavLink to="/login">{t('login')}</NavLink>
              <Link
                to="/register"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#8B9A6E',
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({ to, children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        opacity: hovered ? 1 : 0.9,
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s ease',
      }}
    >
      {children}
    </Link>
  );
}