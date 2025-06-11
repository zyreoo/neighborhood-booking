'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function PropertyPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        const foundProperty = data.find(p => p._id === params.propertyId);
        
        if (!foundProperty) {
          throw new Error('Property not found');
        }
        
        setProperty(foundProperty);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.propertyId]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <div className={styles.titleSection}>
          <h1>{property.title}</h1>
          <p className={styles.location}>{property.location}</p>
        </div>
        
        <div className={styles.imageGallery}>
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className={styles.mainImage}
          />
        </div>
        
        <div className={styles.contentContainer}>
          <div className={styles.propertyInfo}>
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <span className={styles.detailIcon}>🛏️</span>
                <div>
                  <h3>{property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</h3>
                  <p>Perfect for your stay</p>
                </div>
              </div>

              <div className={styles.detailCard}>
                <span className={styles.detailIcon}>🚿</span>
                <div>
                  <h3>{property.bathrooms} Bathroom{property.bathrooms !== 1 ? 's' : ''}</h3>
                  <p>Fresh and clean</p>
                </div>
              </div>

              <div className={styles.detailCard}>
                <span className={styles.detailIcon}>👥</span>
                <div>
                  <h3>Up to {property.maxGuests} Guests</h3>
                  <p>Spacious accommodation</p>
                </div>
              </div>

              <div className={styles.detailCard}>
                <span className={styles.detailIcon}>🏠</span>
                <div>
                  <h3>{property.type || 'House'}</h3>
                  <p>Property type</p>
                </div>
              </div>
            </div>

            <div className={styles.description}>
              <h2>About this place</h2>
              <p>{property.description}</p>
            </div>
          </div>

          <div className={styles.bookingCard}>
            <div className={styles.priceContainer}>
              <span className={styles.price}>${property.price}</span>
              <span className={styles.perNight}>per night</span>
            </div>
            
            <button className={styles.bookButton}>
              Book Now
            </button>

            <div className={styles.bookingDetails}>
              <p>Free cancellation before check-in</p>
              <p>Self check-in with keypad</p>
              <p>Great location with high ratings</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 