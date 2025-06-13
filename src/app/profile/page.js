import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarPlaceholder}>
              {session.user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <h1 className={styles.title}>Welcome, {session.user.name}!</h1>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{session.user.email}</span>
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Bookings</span>
                <span className={styles.statValue}>0</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Reviews</span>
                <span className={styles.statValue}>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 