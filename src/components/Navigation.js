'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../lib/auth';
import { useRouter } from 'next/navigation';
import './Navigation.css';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('1. Sign out button clicked');
      console.log('2. Current user:', user);
      await signOut();
      console.log('3. Sign out successful');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="nav-brand">
          <span className="nav-logo">🏠</span>
          <span className="nav-title">Neighborhood</span>
        </Link>

        {user && (
          <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
} 