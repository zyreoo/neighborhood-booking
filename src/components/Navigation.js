'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Navigation() {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <div className="logo-icon">
            <span className="house">🏠</span>
            <span className="sparkle">✨</span>
          </div>
          <span className="logo-text">SF Homes</span>
        </Link>

        <div className="nav-links">
          <Link href="/about" className="nav-link">
            <span className="link-icon">ℹ️</span>
            <span className="link-text">About</span>
          </Link>
          <Link href="/neighborhoods" className="nav-link">
            <span className="link-icon">🗺️</span>
            <span className="link-text">Neighborhoods</span>
          </Link>
          {user ? (
            <div className="profile-section">
              <button 
                className="profile-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Open user menu"
              >
                <div className="profile-icon">
                  {user.email ? user.email[0].toUpperCase() : '?'}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-email">
                    <span className="email-icon">📧</span>
                    {user.email}
                  </div>
                  {isAdmin() && (
                    <Link href="/admin" className="dropdown-item">
                      <span className="item-icon">⚙️</span>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/profile" className="dropdown-item">
                    <span className="item-icon">👤</span>
                    Profile
                  </Link>
                  <Link href="/bookings" className="dropdown-item">
                    <span className="item-icon">📅</span>
                    My Bookings
                  </Link>
                  <button onClick={handleSignOut} className="dropdown-item sign-out">
                    <span className="item-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className="btn btn-primary">
              <span className="btn-icon">👋</span>
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: var(--background);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-weight: 700;
          color: var(--primary);
          transition: var(--transition);
        }

        .logo-icon {
          position: relative;
          font-size: 1.75rem;
        }

        .house {
          display: inline-block;
          animation: bounce 2s infinite;
        }

        .sparkle {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 1rem;
          animation: spin 3s linear infinite;
        }

        .logo-text {
          font-size: 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
        }

        .link-icon {
          font-size: 1.25rem;
          transition: var(--transition);
        }

        .nav-link:hover {
          background-color: var(--neutral);
          color: var(--text-light);
          transform: translateY(-2px);
        }

        .nav-link:hover .link-icon {
          transform: scale(1.2);
        }

        .profile-section {
          position: relative;
        }

        .profile-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .profile-icon {
          width: 45px;
          height: 45px;
          background-color: var(--primary);
          color: var(--text-light);
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.25rem;
          transition: var(--transition);
          transform: rotate(-5deg);
          box-shadow: 4px 4px 0 var(--secondary);
        }

        .profile-button:hover .profile-icon {
          transform: translateY(-2px) rotate(5deg);
          box-shadow: 6px 6px 0 var(--secondary);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 1rem;
          background: var(--background);
          border-radius: var(--border-radius);
          box-shadow: 8px 8px 0 var(--neutral);
          min-width: 260px;
          padding: 1rem;
          border: 3px solid var(--primary);
          animation: dropIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: top right;
        }

        @keyframes dropIn {
          from {
            opacity: 0;
            transform: scale(0.9) rotate(-3deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .user-email {
          padding: 1rem;
          border-radius: calc(var(--border-radius) - 4px);
          background-color: var(--neutral);
          color: var(--text-dark);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .email-icon,
        .item-icon {
          font-size: 1.25rem;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          color: var(--text-dark);
          text-decoration: none;
          font-size: 0.875rem;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: calc(var(--border-radius) - 4px);
          cursor: pointer;
          transition: var(--transition);
        }

        .dropdown-item:hover {
          background-color: var(--highlight);
          color: var(--text-light);
          transform: translateX(4px);
        }

        .sign-out {
          color: var(--primary);
          margin-top: 0.75rem;
          border-top: 2px dashed var(--neutral);
          padding-top: 1rem;
        }

        .sign-out:hover {
          background-color: var(--primary);
          color: var(--text-light);
        }

        .btn-icon {
          margin-right: 0.5rem;
          animation: wave 2s infinite;
          display: inline-block;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 1rem;
          }

          .link-text {
            display: none;
          }

          .nav-link {
            padding: 0.5rem;
          }

          .logo-text {
            display: none;
          }

          .dropdown-menu {
            min-width: 220px;
          }
        }
      `}</style>
    </nav>
  );
} 