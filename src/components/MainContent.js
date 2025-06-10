import React from 'react';
import './MainContent.css';

const MainContent = () => {
  const properties = [
    {
      id: 1,
      title: "Luxury Villa with Ocean View",
      location: "Malibu, California",
      price: 350,
      rating: 4.9,
      reviews: 128,
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3",
    },
    {
      id: 2,
      title: "Modern Downtown Apartment",
      location: "New York City, NY",
      price: 200,
      rating: 4.8,
      reviews: 96,
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      price: 275,
      rating: 4.95,
      reviews: 64,
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3",
    },
    {
      id: 4,
      title: "Beachfront Paradise",
      location: "Miami Beach, FL",
      price: 420,
      rating: 4.85,
      reviews: 156,
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3",
    },
    {
      id: 5,
      title: "Rustic Farmhouse",
      location: "Nashville, TN",
      price: 185,
      rating: 4.75,
      reviews: 82,
      imageUrl: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?ixlib=rb-4.0.3",
    },
    {
      id: 6,
      title: "Urban Loft Space",
      location: "Chicago, IL",
      price: 165,
      rating: 4.7,
      reviews: 73,
      imageUrl: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3",
    },
  ];

  return (
    <div className="main-content">
      <div className="filters">
        <button className="filter-button">Price</button>
        <button className="filter-button">Type of place</button>
        <button className="filter-button">Rooms and beds</button>
        <button className="filter-button">Amenities</button>
      </div>

      <div className="property-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              <img src={property.imageUrl} alt={property.title} />
              <button className="favorite-button">♡</button>
            </div>
            <div className="property-info">
              <div className="property-header">
                <h3>{property.title}</h3>
                <div className="rating">
                  ★ {property.rating} ({property.reviews})
                </div>
              </div>
              <p className="location">{property.location}</p>
              <p className="price">
                <span>${property.price}</span> night
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent; 