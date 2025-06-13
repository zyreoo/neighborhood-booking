'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

const properties = {
  'sunset': {
    id: 'sunset-beach-house',
    title: 'Sunset Beach House',
    description: 'Beautiful beachfront property with stunning ocean views',
    price: '350',
    amenities: ['Ocean View', 'Private Deck', '3 Bedrooms', '2 Bathrooms'],
    image: '/sunset-house.jpg'
  },
  'mission': {
    id: 'mission-modern-loft',
    title: 'Mission Modern Loft',
    description: 'Contemporary loft in the heart of the Mission district',
    price: '275',
    amenities: ['High Ceilings', 'Modern Kitchen', '2 Bedrooms', '2 Bathrooms'],
    image: '/mission-loft.jpg'
  },
  'lower-haight': {
    id: 'haight-victorian',
    title: 'Historic Victorian',
    description: 'Charming Victorian home with modern amenities',
    price: '325',
    amenities: ['Period Details', 'Modern Updates', '3 Bedrooms', '2 Bathrooms'],
    image: '/haight-victorian.jpg'
  }
};

export default function NeighborhoodPage({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const neighborhood = params.neighborhood;
  const property = properties[neighborhood];

  if (!property) {
    return <div>Property not found</div>;
  }

  const handleBookingClick = () => {
    if (!user) {
      // Store the current URL to redirect back after sign in
      sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
      router.push('/auth/signin');
      return;
    }
    
    router.push(`/properties/${property.id}`);
  };

  return (
    <div className="property-page">
      <div className="property-container">
        <div className="property-image-placeholder">
          <span className="placeholder-icon">🏠</span>
        </div>
        
        <div className="property-content">
          <h1 className="property-title">{property.title}</h1>
          <p className="property-description">{property.description}</p>
          
          <div className="property-details">
            <div className="price-section">
              <span className="price">${property.price}</span>
              <span className="price-period">per night</span>
            </div>
            
            <div className="amenities">
              {property.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>

          <button 
            onClick={handleBookingClick}
            className="booking-button"
          >
            {user ? 'Book Now' : 'Sign in to Book'}
          </button>
        </div>
      </div>
    </div>
  );
} 