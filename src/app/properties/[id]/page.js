'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
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
  const { user, loading } = useAuth();
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' });
  const [isLoading, setIsLoading] = useState(true);
  const property = properties[params.id];

  console.log('DEBUG: Current auth state:', { user, loading, isLoading });

  useEffect(() => {
    console.log('DEBUG: PropertyPage useEffect running');
    console.log('DEBUG: Auth state in effect:', { user, loading });

    const checkAuthAndRedirect = async () => {
      console.log('DEBUG: Checking auth state');
      
      if (loading) {
        console.log('DEBUG: Auth is still loading...');
        return;
      }

      if (!user) {
        console.log('DEBUG: No user found, preparing redirect');
        const currentPath = window.location.pathname;
        console.log('DEBUG: Current path:', currentPath);
        
        const existingRedirect = sessionStorage.getItem('redirectAfterAuth');
        console.log('DEBUG: Existing redirect:', existingRedirect);
        
        if (!existingRedirect) {
          console.log('DEBUG: Setting redirect path:', currentPath);
          sessionStorage.setItem('redirectAfterAuth', currentPath);
          console.log('DEBUG: Redirecting to signin');
          router.push('/auth/signin');
        } else {
          console.log('DEBUG: Redirect already set to:', existingRedirect);
        }
      } else {
        console.log('DEBUG: User is authenticated:', user.email);
      }
      
      setIsLoading(false);
      console.log('DEBUG: Loading state set to false');
    };

    checkAuthAndRedirect();
  }, [user, loading, router, params.id]);

  if (!property) {
    console.log('DEBUG: Property not found for ID:', params.id);
    return <div>Property not found</div>;
  }

  if (loading || isLoading) {
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

  if (!user) {
    console.log('DEBUG: No user, showing auth required message');
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please sign in to view this property</p>
      </div>
    );
  }

  const handleBooking = async () => {
    console.log('[PropertyPage] Handling booking request:', {
      propertyId: params.id,
      userId: user?.uid,
      dates: selectedDates
    });
    
    // Here you would implement the actual booking logic
    alert('Booking functionality coming soon!');
  };

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
            <div className="date-picker">
              <div className="date-input">
                <label>Check-in</label>
                <input
                  type="date"
                  value={selectedDates.start}
                  onChange={(e) => setSelectedDates(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="date-input">
                <label>Check-out</label>
                <input
                  type="date"
                  value={selectedDates.end}
                  onChange={(e) => setSelectedDates(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>

            <div className="price-summary">
              <span className="price">${property.price}</span>
              <span className="per-night">per night</span>
            </div>

            <button 
              onClick={handleBooking}
              className="booking-button"
              disabled={!selectedDates.start || !selectedDates.end}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 