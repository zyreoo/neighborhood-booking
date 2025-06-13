'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function HousePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // This would come from your database
  const house = {
    id,
    name: "Cozy Victorian Home",
    location: "Hayes Valley, San Francisco",
    description: "A charming Victorian house in the heart of Hayes Valley. This historic home features original architectural details, modern amenities, and a beautiful garden.",
    price: "4500",
    images: [
      "/house1.jpg",
      "/house2.jpg",
      "/house3.jpg"
    ],
    features: [
      "3 Bedrooms",
      "2 Bathrooms",
      "Garden",
      "Original Victorian Details",
      "Modern Kitchen",
      "High Ceilings"
    ],
    amenities: [
      "Washer/Dryer",
      "Dishwasher",
      "Central Heating",
      "High-Speed Internet",
      "Security System"
    ]
  };

  return (
    <div className="house-page">
      <div className="house-hero">
        <div className="house-images">
          <div className="main-image">
            <Image
              src={house.images[0]}
              alt={house.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="image-grid">
            {house.images.slice(1).map((img, i) => (
              <div key={i} className="grid-image">
                <Image
                  src={img}
                  alt={`${house.name} ${i + 2}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="house-content">
        <div className="house-header">
          <h1>{house.name}</h1>
          <p className="location">{house.location}</p>
          <p className="price">${house.price}/month</p>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button 
            className={`tab ${activeTab === 'amenities' ? 'active' : ''}`}
            onClick={() => setActiveTab('amenities')}
          >
            Amenities
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <p>{house.description}</p>
            </div>
          )}
          
          {activeTab === 'features' && (
            <div className="features">
              {house.features.map((feature, i) => (
                <div key={i} className="feature-item">
                  {feature}
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'amenities' && (
            <div className="amenities">
              {house.amenities.map((amenity, i) => (
                <div key={i} className="amenity-item">
                  {amenity}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary">Schedule a Visit</button>
          <button className="btn btn-secondary">Contact Host</button>
        </div>
      </div>
    </div>
  );
} 