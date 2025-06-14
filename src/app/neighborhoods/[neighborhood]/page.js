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
    id: 'mission',
    title: 'Mission Modern Loft',
    description: 'Contemporary loft in the heart of the Mission district',
    price: '275',
    amenities: ['High Ceilings', 'Modern Kitchen', '2 Bedrooms', '2 Bathrooms'],
    image: '/mission-loft.jpg'
  },
  'lower-haight': {
    id: 'lowerhaight',
    title: 'Lower Haight Victorian',
    description: 'Classic San Francisco Victorian in Lower Haight',
    price: '300',
    amenities: ['Period Details', 'Bay Windows', '3 Bedrooms', '1.5 Bathrooms'],
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

      <style jsx>{`
        .property-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .property-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .property-image-placeholder {
          background: #f0f0f0;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          font-size: 48px;
        }

        .property-content {
          padding: 2rem;
        }

        .property-title {
          font-size: 2rem;
          margin: 0 0 1rem;
          color: #2d3748;
        }

        .property-description {
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .property-details {
          margin-bottom: 2rem;
        }

        .price-section {
          margin-bottom: 1rem;
        }

        .price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
        }

        .price-period {
          color: #718096;
          margin-left: 0.5rem;
        }

        .amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .amenity-tag {
          background: #edf2f7;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .booking-button {
          width: 100%;
          padding: 1rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .booking-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </div>
  );
} 