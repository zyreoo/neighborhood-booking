import styles from './SkeletonLoader.module.css';

export function PropertyCardSkeleton() {
  return (
    <div className={styles.propertyCard}>
      <div className={styles.imageContainer}>
        <div className={styles.image} />
      </div>
      <div className={styles.content}>
        <div className={styles.title} />
        <div className={styles.description} />
        <div className={styles.details} />
      </div>
    </div>
  );
}

export function LocationPageSkeleton() {
  return (
    <div>
      <div className={styles.locationHero} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className={styles.locationTitle} />
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {[...Array(6)].map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15rem 5rem 5rem 5rem' }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ marginBottom: '3rem' }}>
          <div className={styles.locationTitle} />
          <div style={{ 
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            padding: '0.5rem'
          }}>
            {[...Array(4)].map((_, j) => (
              <div key={j} style={{ flex: '0 0 300px' }}>
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 