'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './location-properties.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LocationPageSkeleton } from '@/components/SkeletonLoader';

export default function LocationProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const locationSlug = params.slug;


  const formatSlugToLocation = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        
        const locationName = formatSlugToLocation(locationSlug);
        const filteredProperties = data.filter(
          property => property.location === locationName
        );
        
        if (filteredProperties.length === 0) {
          throw new Error(`No properties found in ${locationName}`);
        }
        
        setProperties(filteredProperties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [locationSlug]);

  if (loading) return (
    <div>
      <Header />
      <LocationPageSkeleton />
      <Footer />
    </div>
  );

  if (error) return (
    <div>
      <Header />
      <div className={styles.error}>{error}</div>
      <Footer />
    </div>
  );

  const locationName = formatSlugToLocation(locationSlug);

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}> Welcome to {locationName}</h1>
        <div className={styles.contentContainer}>
          <div className={styles.grid}>
            {properties.map((property) => (
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
      </main>
      <Footer />
    </div>
  );
} 