import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    setMenuOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const notifications = [
    {
      icon: <CheckCircle2 size={20} />,
      title: 'Account active',
      text: 'Your Smart Banking account is running securely.',
      color: '#16a34a',
    },
    {
      icon: <CreditCard size={20} />,
      title: 'Transaction system ready',
      text: 'Deposit, withdraw and transfer features are active.',
      color: '#2563eb',
    },
    {
      icon: <ShieldAlert size={20} />,
      title: 'Security enabled',
      text: 'JWT protected login and secure APIs are enabled.',
      color: '#ea580c',
    },
  ];

  return (
    <nav
      style={{
        background: darkMode
          ? 'rgba(2,6,23,0.96)'
          : 'linear-gradient(135deg,#0f4c81,#1d4ed8)',
        color: 'white',
        padding: '0.85rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        boxShadow: '0 10px 30px rgba(15,23,42,.18)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '.7rem',
            fontWeight: 900,
            fontSize: '1.25rem',
          }}
        >
          <Landmark size={28} />
          Smart Banking
        </Link>

        {isAuthenticated ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={mobileButton}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

            <ul
              style={{
                ...navLinks,
                ...(menuOpen ? mobileOpen : {}),
              }}
            >
              <NavItem to="/dashboard" active={isActive('/dashboard')}>
                Dashboard
              </NavItem>

              <NavItem to="/accounts" active={isActive('/accounts')}>
                Accounts
              </NavItem>

              <NavItem to="/transfer" active={isActive('/transfer')}>
                Transfer
              </NavItem>

              <NavItem to="/transactions" active={isActive('/transactions')}>
                Transactions
              </NavItem>

              <NavItem to="/profile" active={isActive('/profile')}>
                Profile
              </NavItem>

              <li style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setProfileOpen(false);
                  }}
                  style={iconButton}
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 9,
                      height: 9,
                      background: '#ef4444',
                      borderRadius: '50%',
                      border: '2px solid white',
                    }}
                  />
                </button>

                {notificationOpen && (
                  <div style={dropdownBox}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                      }}
                    >
                      <b>Notifications</b>
                      <X
                        size={18}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setNotificationOpen(false)}
                      />
                    </div>

                    {notifications.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          gap: '.8rem',
                          padding: '.85rem',
                          background: '#f8fafc',
                          borderRadius: '14px',
                          marginBottom: '.7rem',
                        }}
                      >
                        <div style={{ color: item.color }}>{item.icon}</div>
                        <div>
                          <b style={{ fontSize: '.92rem' }}>{item.title}</b>
                          <p
                            style={{
                              margin: 0,
                              color: '#64748b',
                              fontSize: '.82rem',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>

              <li>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  style={iconButton}
                  title="Theme"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </li>

              <li style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationOpen(false);
                  }}
                  style={{
                    ...iconButton,
                    width: 'auto',
                    padding: '.55rem .8rem',
                    gap: '.45rem',
                  }}
                >
                  <User size={18} />
                  Hi, {user?.full_name?.split(' ')[0] || 'User'}
                </button>

                {profileOpen && (
                  <div style={profileBox}>
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#1d4ed8,#2563eb)',
                        color: 'white',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        marginBottom: '.8rem',
                      }}
                    >
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <b>{user?.full_name || 'User'}</b>
                    <p
                      style={{
                        margin: '.2rem 0 1rem',
                        color: '#64748b',
                        fontSize: '.85rem',
                      }}
                    >
                      {user?.email || 'Smart Banking Customer'}
                    </p>

                    <Link
                      to="/profile"
                      style={{
                        display: 'block',
                        padding: '.7rem',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        color: '#0f172a',
                        textDecoration: 'none',
                        marginBottom: '.7rem',
                        fontWeight: 700,
                      }}
                    >
                      View Profile
                    </Link>

                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        border: 0,
                        borderRadius: '12px',
                        background: '#ef4444',
                        color: 'white',
                        padding: '.7rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '.5rem',
                      }}
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </>
        ) : (
          <ul style={navLinks}>
            <NavItem to="/login" active={isActive('/login')}>
              Login
            </NavItem>
            <NavItem to="/register" active={isActive('/register')}>
              Register
            </NavItem>
          </ul>
        )}
      </div>

      <style>{`
        .dark-mode {
          background: #020617 !important;
          color: #f8fafc !important;
        }

        .dark-mode .page {
          background: #020617 !important;
        }

        .dark-mode .card,
        .dark-mode input,
        .dark-mode select,
        .dark-mode textarea {
          background: #0f172a !important;
          color: #f8fafc !important;
          border-color: #1e293b !important;
        }

        .dark-mode p,
        .dark-mode label,
        .dark-mode h1,
        .dark-mode h2,
        .dark-mode h3,
        .dark-mode h4 {
          color: inherit;
        }

        @media (max-width: 900px) {
          .smart-nav-links {
            display: none !important;
          }

          .smart-mobile-button {
            display: inline-flex !important;
          }

          .smart-nav-mobile-open {
            display: flex !important;
            position: absolute !important;
            left: 1rem !important;
            right: 1rem !important;
            top: 76px !important;
            flex-direction: column !important;
            background: rgba(15,76,129,.98) !important;
            padding: 1rem !important;
            border-radius: 18px !important;
            box-shadow: 0 20px 50px rgba(15,23,42,.25) !important;
          }
        }
      `}</style>
    </nav>
  );
}

function NavItem({ to, active, children }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          color: 'white',
          textDecoration: 'none',
          padding: '.55rem .75rem',
          borderRadius: '12px',
          background: active ? 'rgba(255,255,255,.18)' : 'transparent',
          fontWeight: 800,
          display: 'inline-block',
        }}
      >
        {children}
      </Link>
    </li>
  );
}

const navLinks = {
  display: 'flex',
  alignItems: 'center',
  gap: '.75rem',
  listStyle: 'none',
};

const mobileOpen = {
  display: 'flex',
};

const mobileButton = {
  display: 'none',
  background: 'rgba(255,255,255,.15)',
  color: 'white',
  border: 0,
  width: 42,
  height: 42,
  borderRadius: '12px',
  placeItems: 'center',
  cursor: 'pointer',
};

mobileButton.className = 'smart-mobile-button';

const iconButton = {
  position: 'relative',
  background: 'rgba(255,255,255,.15)',
  color: 'white',
  border: '1px solid rgba(255,255,255,.25)',
  width: 42,
  height: 42,
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dropdownBox = {
  position: 'absolute',
  right: 0,
  top: 52,
  width: 330,
  background: 'white',
  color: '#0f172a',
  borderRadius: '20px',
  boxShadow: '0 20px 50px rgba(15,23,42,.25)',
  padding: '1rem',
  zIndex: 2000,
};

const profileBox = {
  position: 'absolute',
  right: 0,
  top: 52,
  width: 260,
  background: 'white',
  color: '#0f172a',
  borderRadius: '20px',
  boxShadow: '0 20px 50px rgba(15,23,42,.25)',
  padding: '1rem',
  zIndex: 2000,
  textAlign: 'center',
};