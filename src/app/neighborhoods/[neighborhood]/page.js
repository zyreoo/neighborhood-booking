'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';

const properties = {
  'sunset': {
    id: 'sunset-beach-house',
    title: 'Sunset Beach House',
    description: 'Experience the perfect blend of coastal living and urban convenience in this stunning beachfront property. With panoramic ocean views, modern amenities, and a prime location in the heart of the Sunset District, this home offers an unparalleled San Francisco lifestyle. Enjoy morning walks along the beach, breathtaking sunsets from your private deck, and easy access to local cafes and restaurants.',
    image: '/sunset-house.jpg'
  },
  'mission': {
    id: 'mission',
    title: 'Mission Modern Loft',
    description: 'Contemporary loft in the heart of the Mission district',
    image: '/mission-loft.jpg'
  },
  'lower-haight': {
    id: 'lowerhaight',
    title: 'Lower Haight Victorian',
    description: 'Classic San Francisco Victorian in Lower Haight',
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
      sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
      router.push('/auth/signin');
      return;
    }
    
    router.push(`/properties/${property.id}`);
  };

  return (
    <div className="neighborhood-page">
      <div className="neighborhood-container">
        <div className="neighborhood-image">
          <Image
            src={property.image}
            alt={property.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="image-overlay"></div>
        </div>
        
        <div className="neighborhood-content">
          <h1 className="neighborhood-title">{property.title}</h1>
          <p className="neighborhood-description">{property.description}</p>
          
          <button 
            onClick={handleBookingClick}
            className="booking-button"
          >
            {user ? 'Book Now' : 'Sign in to Book'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .neighborhood-page {
          min-height: 100vh;
          background: var(--background-color);
          padding: 2rem;
        }

        .neighborhood-container {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--house-orange);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(139, 69, 19, 0.05);
        }

        .neighborhood-image {
          position: relative;
          height: 400px;
          width: 100%;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(139, 69, 19, 0.1), rgba(139, 69, 19, 0.3));
        }

        .neighborhood-content {
          padding: 3rem;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          border-radius: 32px;
        }

        .neighborhood-title {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin: 0 0 1.5rem;
          font-weight: 600;
        }

        .neighborhood-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-color);
          margin-bottom: 2.5rem;
        }

        .booking-button {
          width: 100%;
          padding: 1.25rem;
          background: white;
          color: var(--house-orange);
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .booking-button:hover {
          background: var(--house-orange);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(211, 84, 0, 0.2);
        }

        .booking-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .neighborhood-page {
            padding: 1rem;
          }

          .neighborhood-content {
            padding: 2rem;
          }

          .neighborhood-title {
            font-size: 2rem;
          }

          .neighborhood-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 