'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { HomePageSkeleton } from '@/components/SkeletonLoader';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propertiesResponse, bookingsResponse] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/bookings')
      ]);

      if (!propertiesResponse.ok || !bookingsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const propertiesData = await propertiesResponse.json();
      const bookingsData = await bookingsResponse.json();

      setProperties(propertiesData);
      setTopLocations(bookingsData);
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

  if (loading) return (
    <div>
      <Header />
      <HomePageSkeleton />
      <Footer />
    </div>
  );
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.mainTitle}>Find Your Perfect Stay</h1>
        {topLocations.map((locationData) => {
          const locationProperties = groupedProperties[locationData.location] || [];
          return (
            <section key={locationData.location} className={styles.locationSection}>
              <Link href={`/${formatLocationUrl(locationData.location)}`} className={styles.locationLink}>
                <h2 className={styles.locationTitle}>
                  Stay in {locationData.location} 
                </h2>
              </Link>
              <div className={styles.cardsContainer}>
                <div className={styles.cardsScroll}>
                  {locationProperties.map((property) => (
                    <Link 
                      key={property._id} 
                      href={`/${formatLocationUrl(locationData.location)}/${property._id}`}
                      className={styles.card}
                    >
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
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
