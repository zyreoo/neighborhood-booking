'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import BookingForm from '@/components/BookingForm';
import { bookingModel } from '@/lib/firestore/bookingModel';
import './page.css';

console.log('DEBUG: Property page module loaded');

const properties = {
  'sunset-beach-house': {
    title: 'Sunset Beach House',
    description: 'Beautiful beachfront property with stunning ocean views',
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
  'mission': {
    title: 'Mission Modern Loft',
    description: 'Contemporary loft in the heart of the Mission district',
    amenities: ['High Ceilings', 'Modern Kitchen', '2 Bedrooms', '2 Bathrooms'],
    image: '/mission-loft.jpg',
    details: [
      'Open concept living space',
      'Industrial-style design',
      'Gourmet kitchen with island',
      'Walk-in closets',
      'Smart home features',
      'Close to restaurants and bars'
    ]
  },
  'lowerhaight': {
    title: 'Lower Haight Victorian',
    description: 'Classic San Francisco Victorian in Lower Haight',
    amenities: ['Period Details', 'Bay Windows', '3 Bedrooms', '1.5 Bathrooms'],
    image: '/haight-victorian.jpg',
    details: [
      'Original hardwood floors',
      'Ornate Victorian details',
      'Updated kitchen',
      'Private garden',
      'High ceilings',
      'Close to public transit'
    ]
  }
};

export default function PropertyPage({ params }) {
  console.log('DEBUG: PropertyPage rendering with params:', params);
  
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const property = properties[params.id];

  useEffect(() => {
    const checkExistingBooking = async () => {
      if (user) {
        try {
          const bookings = await bookingModel.getUserActiveBookings(user.uid);
          setHasExistingBooking(bookings.length > 0);
        } catch (error) {
          console.error('Error checking bookings:', error);
        }
      }
      setLoading(false);
    };

    checkExistingBooking();
  }, [user]);

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
            {hasExistingBooking ? (
              <div className="contact-message">
                <div className="contact-icon">🔒</div>
                <h3 className="contact-title">You already have an active booking.</h3>
                <p className="contact-desc">Please contact Thomas to make any changes to your reservation:</p>
                <div className="contact-info">
                  <div className="contact-row"><span className="contact-label">📧 Email:</span> <a href="mailto:thomas@example.com" className="contact-link">thomas@example.com</a></div>
                  <div className="contact-row"><span className="contact-label">📞 Phone:</span> <a href="tel:5551234567" className="contact-link">(555) 123-4567</a></div>
                </div>
              </div>
            ) : (
              <BookingForm 
                propertyId={params.id}
                propertyName={property.title}
              />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-message {
          background-color: #fff3f3;
          border: 1px solid #ff5a5f;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1rem;
          text-align: center;
        }

        .contact-message p {
          margin: 0.5rem 0;
          color: #484848;
        }

        .contact-info {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #ffcdd2;
        }

        .contact-info p {
          margin: 0.5rem 0;
          color: #484848;
          font-weight: 500;
        }

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