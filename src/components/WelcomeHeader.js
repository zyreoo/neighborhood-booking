'use client';

import { useAuth } from '@/lib/auth';
import styles from './WelcomeHeader.module.css';

export default function WelcomeHeader() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.welcomeSection}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.welcomeSection}>
      <h1 className={styles.welcomeTitle}>
        Welcome to Neighborhood, {user.displayName || 'Guest'}! 👋
      </h1>
      <p className={styles.welcomeSubtitle}>
        Find your perfect home in our carefully curated neighborhoods
      </p>
    </div>
  );
} 