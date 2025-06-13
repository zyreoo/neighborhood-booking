'use client';

import Link from 'next/link';
import { useAuth } from '../lib/auth';
import '../styles/navigation.css';

export default function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-logo-container">
            <Link href="/" className="nav-logo">
              Neighborhood
            </Link>
          </div>

          <div className="nav-items">
            {user ? (
              <>
                <span className="nav-welcome">Welcome, {user.email}</span>
                <button onClick={signOut} className="nav-button nav-button-secondary">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="nav-link">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="nav-button nav-button-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 