'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '../components/Header';
import Footer from '@/components/Footer';
import MainContent from '@/components/MainContent';

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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Available Properties</h1>
        
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
                <h2>{property.title}</h2>
                <p className={styles.location}>{property.location}</p>
                <div className={styles.details}>
                  <span>{property.bedrooms || 1} beds</span>
                  <span>•</span>
                  <span>{property.bathrooms || 1} baths</span>
                  <span>•</span>
                  <span>Up to {property.maxGuests || 2} guests</span>
                </div>
                <p className={styles.description}>{property.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
