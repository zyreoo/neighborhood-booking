'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatLocationUrl = (location) => {
    return location.toLowerCase().replace(/\s+/g, '-');
  };

  const groupedProperties = properties.reduce((acc, property) => {
    if (!acc[property.location]) {
      acc[property.location] = [];
    }
    acc[property.location].push(property);
    return acc;
  }, {});

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <Header />
      <main className={styles.main}>
        {Object.entries(groupedProperties).map(([location, locationProperties]) => (
          <section key={location} className={styles.locationSection}>
            <Link href={`/location/${formatLocationUrl(location)}`} className={styles.locationLink}>
              <h2 className={styles.locationTitle}>
                Stay in {location} <span className={styles.arrow}>›</span>
              </h2>
            </Link>
            <div className={styles.cardsContainer}>
              <div className={styles.cardsScroll}>
                {locationProperties.map((property) => (
                  <div key={property._id} className={styles.card}>
                    <div className={styles.imageContainer}>
                      <img 
                        src={property.imageUrl} 
                        alt={property.title}
                        className={styles.image}
                      />
                      <div className={styles.price}>${property.price}/night</div>
                    </div>
                    <div className={styles.content}>
                      <h3>{property.title}</h3>
                      <p className={styles.description}>{property.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
