'use client';

import { useState, useEffect } from 'react';
import styles from './location-properties.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LocationProperties({ params }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Convert URL slug back to location name for display
  const locationName = decodeURIComponent(params.slug)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    fetchLocationProperties();
  }, [params.slug]);

  const fetchLocationProperties = async () => {
    try {
      const response = await fetch(`/api/properties?location=${encodeURIComponent(locationName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No properties found in this location');
      }
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <div className={styles.locationHero}>
          <div className={styles.heroBackground} />
          <h1 className={styles.welcomeText}>Welcome to {locationName}</h1>
        </div>
        
        <div className={styles.propertiesGrid}>
          {properties.map((property) => (
            <div key={property._id} className={styles.propertyCard}>
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
                <div className={styles.details}>
                  <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>Up to {property.maxGuests} guests</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
} 