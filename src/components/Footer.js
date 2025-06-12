"use client";
import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [activeSection, setActiveSection] = useState('popular');

  const destinations = {
    popular: {
      title: "Popular",
      locations: [
        { name: "Cleveland", type: "Condo rentals" },
        { name: "Philadelphia", type: "Monthly Rentals" },
        { name: "Minneapolis", type: "Vacation rentals" },
        { name: "Galveston", type: "Condo rentals" },
        { name: "Tokyo", type: "Condo rentals" },
        { name: "London", type: "Apartment rentals" }
      ]
    },
    beach: {
      title: "Beach",
      locations: [
        { name: "North Myrtle Beach", type: "Monthly Rentals" },
        { name: "West Palm Beach", type: "Vacation rentals" },
        { name: "Orange Beach", type: "House rentals" },
        { name: "Gulf Shores", type: "Villa rentals" }
      ]
    },
    mountains: {
      title: "Mountains",
      locations: [
        { name: "Pocono Mountains", type: "Cottage rentals" },
        { name: "Portland", type: "House rentals" },
        { name: "Nice", type: "Villa rentals" },
        { name: "Barcelona", type: "Apartment rentals" }
      ]
    }
  };

  return (
    <footer className="footer">
      <div className="destinations-wrapper">
        <h2 className="destinations-header">Inspiration for future getaways</h2>
        <div className="categories-nav">
          {Object.entries(destinations).map(([key, { title }]) => (
            <button
              key={key}
              className={`category-button ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              {title}
            </button>
          ))}
        </div>
        <div className="destinations-grid">
          {destinations[activeSection].locations.map((location, index) => (
            <div key={index} className="destination-card">
              <h3>{location.name}</h3>
              <p>{location.type}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact</h3>
          <p>
            Get in touch with us to plan your perfect trip to these amazing destinations.
            Our travel experts are here to help you create unforgettable memories.
          </p>
        </div>
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            We specialize in showcasing the best destinations across Romania,
            from the healing salt mines of Praid to the vibrant streets of Bucuresti.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p>
            Discover more about our services, travel guides, and special offers
            to make your Romanian adventure unforgettable.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Simone Marton. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;