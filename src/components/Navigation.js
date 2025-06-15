'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import '@/styles/Navigation.css';

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
        <div className="nav-left"></div>
        
        <Link href="/" className="nav-logo">
          <Image
            src="/neighborhoodLogo.png"
            alt="Neighborhood Logo"
            width={180}
            height={50}
            className="logo-image"
            priority
          />
        </Link>

        <div className="nav-links">
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
                    {user.email}
                  </div>
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
            <Link href="/auth/signin" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 