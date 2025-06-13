import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/main.css';

const PropertyCard = ({ property }) => (
  <Link href={`/houses/${property.id}`} className="property-card">
    <div className="property-image-container">
      <Image 
        src={property.image || '/placeholder-house.jpg'} 
        alt={property.name}
        fill
        className="property-image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="property-badge">${property.price}/month</div>
    </div>
    <div className="property-content">
      <h3 className="property-title">{property.name}</h3>
      <p className="property-location">
        <span className="location-icon">📍</span>
        {property.location}
      </p>
      <p className="property-description">{property.description}</p>
      <div className="property-features">
        {property.features?.slice(0, 3).map((feature, index) => (
          <span key={index} className="feature-tag">{feature}</span>
        ))}
      </div>
    </div>
  </Link>
);

const PropertyGrid = ({ properties = [] }) => {
  if (properties.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏠</div>
        <h3>No Properties Available</h3>
        <p>Check back soon for new listings in our neighborhood!</p>
      </div>
    );
  }

  return (
    <div className="properties-grid">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid; 