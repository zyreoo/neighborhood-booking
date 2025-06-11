"use client";
import React, { useState, useEffect } from 'react';
import './MainContent.css';

const MainContent = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties?page=${page}&limit=6`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch properties');
      
      setProperties(data.properties);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading properties...</div>;
  if (error) return <div className="error">{error}</div>;

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
          <div key={property._id} className="property-card">
            <div className="property-image">
              <img src={property.imageUrl} alt={property.title} />
              <button className="favorite-button">♡</button>
            </div>
            <div className="property-info">
              <div className="property-header">
                <h3>{property.title}</h3>
              </div>
              <p className="location">{property.location}</p>
              <p className="property-details">
                {property.bedrooms} beds • {property.bathrooms} baths • Max {property.maxGuests} guests
              </p>
              <div className="amenities-preview">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <span key={amenity._id} className="amenity-tag">
                    {amenity.name}
                  </span>
                ))}
              </div>
              <p className="price">
                <span>${property.price}</span> night
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent; 