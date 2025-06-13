'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import BookingForm from '@/components/BookingForm';
import './page.css';

console.log('DEBUG: Property page module loaded');

const properties = {
  'sunset-beach-house': {
    title: 'Sunset Beach House',
    description: 'Beautiful beachfront property with stunning ocean views',
    price: '350',
    amenities: ['Ocean View', 'Private Deck', '3 Bedrooms', '2 Bathrooms'],
    image: '/sunset-house.jpg',
    details: [
      'Spacious living area with panoramic ocean views',
      'Fully equipped modern kitchen',
      'Master bedroom with en-suite bathroom',
      'Private beach access',
      'Outdoor shower',
      'Parking for 2 cars'
    ]
  },
  // ... other properties
};

export default function PropertyPage({ params }) {
  console.log('DEBUG: PropertyPage rendering with params:', params);
  
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const property = properties[params.id];

  console.log('DEBUG: Current auth state:', { user, loading });

  if (!user) {
    console.log('DEBUG: No user, showing auth required message');
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please sign in to view this property</p>
        <button 
          onClick={() => {
            sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
            router.push('/auth/signin');
          }}
          className="auth-button"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!property) {
    console.log('DEBUG: Property not found for ID:', params.id);
    return <div>Property not found</div>;
  }

  if (loading) {
    console.log('DEBUG: Showing loading state');
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  console.log('DEBUG: Rendering property details for:', property.title);
  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="property-header">
          <h1 className="property-title">{property.title}</h1>
          <p className="property-description">{property.description}</p>
        </div>

        <div className="property-image-placeholder">
          <span className="placeholder-icon">🏠</span>
        </div>

        <div className="property-details">
          <div className="amenities-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h2>Property Details</h2>
            <ul className="details-list">
              {property.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className="booking-section">
            <h2>Book Your Stay</h2>
            <BookingForm 
              propertyId={params.id}
              propertyName={property.title}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .auth-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </div>
  );
} 