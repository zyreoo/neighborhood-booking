'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function HousesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // This would come from your database
  const houses = [
    {
      id: 1,
      name: "Cozy Victorian Home",
      location: "Hayes Valley, San Francisco",
      price: "4500",
      image: "/house1.jpg",
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: 2,
      name: "Modern Apartment",
      location: "Mission District, San Francisco",
      price: "3800",
      image: "/house2.jpg",
      bedrooms: 2,
      bathrooms: 1
    },
    {
      id: 3,
      name: "Luxury Condo",
      location: "Marina District, San Francisco",
      price: "5200",
      image: "/house3.jpg",
      bedrooms: 3,
      bathrooms: 2
    }
  ];

  if (status === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-icon">
            <div className="house-icon"></div>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signup');
    return null;
  }

  return (
    <div className="houses-page">
      <div className="houses-header">
        <h1>Available Houses</h1>
        <p>Find your perfect home in San Francisco</p>
      </div>

      <div className="houses-grid">
        {houses.map((house) => (
          <Link href={`/houses/${house.id}`} key={house.id} className="house-card">
            <div className="house-image">
              <Image
                src={house.image}
                alt={house.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="house-info">
              <h2>{house.name}</h2>
              <p className="location">{house.location}</p>
              <div className="house-details">
                <span>{house.bedrooms} beds</span>
                <span>•</span>
                <span>{house.bathrooms} baths</span>
              </div>
              <p className="price">${house.price}/month</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 