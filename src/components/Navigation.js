'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import '../styles/navigation.css';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/" className="logo-link">
            <Image 
              src="/logo.svg" 
              alt="Neighborhood" 
              width={40} 
              height={40} 
              className="logo-image"
            />
            <span className="logo-text">Neighborhood</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="nav-links">
            <Link href="/houses" className="nav-link">
              Find Houses
            </Link>
            <Link href="/about" className="nav-link">
              About Us
            </Link>
            <Link href="/contact" className="nav-link">
              Contact
            </Link>
          </div>

          <div className="nav-auth">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="user-name">{user.email}</span>
                </div>
                <button onClick={signOut} className="btn btn-secondary">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/auth/signin" className="btn btn-text">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn btn-primary">
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 