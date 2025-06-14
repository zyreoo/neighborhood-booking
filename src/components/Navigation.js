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
    <nav className="navigation">
      <div className="nav-content">
        <Link href="/" className="nav-logo">
          Neighborhood Booking
        </Link>

        <div className="nav-links">
          {user ? (
            <div className="profile-section">
              <button 
                className="profile-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="profile-icon">
                  {user.email ? user.email[0].toUpperCase() : '?'}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-email">{user.email}</div>
                  {isAdmin() && (
                    <Link href="/admin" className="dropdown-item">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link href="/bookings" className="dropdown-item">
                    My Bookings
                  </Link>
                  <button onClick={handleSignOut} className="dropdown-item sign-out">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/signin" className="sign-in-button">
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .navigation {
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1rem;
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
          width: 40px;
          height: 40px;
          background-color: #4299e1;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          padding: 0.5rem 0;
        }

        .user-email {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #edf2f7;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: #2d3748;
          text-decoration: none;
          font-size: 0.875rem;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f7fafc;
        }

        .sign-out {
          color: #e53e3e;
          border-top: 1px solid #edf2f7;
        }

        .sign-in-button {
          padding: 0.5rem 1rem;
          background-color: #4299e1;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .sign-in-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </nav>
  );
} 