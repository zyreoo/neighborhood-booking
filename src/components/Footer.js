"use client";
import React, { useState, useEffect } from 'react';
import './Footer.css';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const [activeSection, setActiveSection] = useState('popular');
  const [locations, setLocations] = useState({
    popular: { title: "Popular", locations: [] },
    beach: { title: "Beach", locations: [] },
    mountains: { title: "Mountains", locations: [] }
  });
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/properties');
        const properties = await response.json();
        
        // Group properties by location and get property types
        const locationMap = properties.reduce((acc, property) => {
          if (!acc[property.location]) {
            acc[property.location] = {
              name: property.location,
              types: new Set()
            };
          }
          acc[property.location].types.add(property.type || 'House');
          return acc;
        }, {});

        // Convert to array and sort by number of properties
        const sortedLocations = Object.values(locationMap)
          .map(loc => ({
            name: loc.name,
            type: Array.from(loc.types)[0] // Use the first property type
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Get top locations from bookings
        const bookingsResponse = await fetch('/api/bookings');
        const topBookedLocations = await bookingsResponse.json();
        
        // Create sections
        const popularLocations = topBookedLocations.map(booking => ({
          name: booking.location,
          type: locationMap[booking.location]?.types.values().next().value || 'Luxury Stay'
        }));

        // Split remaining locations between beach and mountain sections
        const remainingLocations = sortedLocations.filter(
          loc => !popularLocations.find(pop => pop.name === loc.name)
        );
        
        const midPoint = Math.ceil(remainingLocations.length / 2);
        
        setLocations({
          popular: {
            title: "Popular",
            locations: popularLocations
          },
          beach: {
            title: "Coastal Areas",
            locations: remainingLocations.slice(0, midPoint)
          },
          mountains: {
            title: "Bay Area",
            locations: remainingLocations.slice(midPoint)
          }
        });
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationClick = (locationName) => {
    const urlLocation = locationName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${urlLocation}`);
  };

  return (
    <footer className="footer">
      <div className="destinations-wrapper">
        <h2 className="destinations-header">Inspiration for future getaways</h2>
        <div className="categories-nav">
          {Object.entries(locations).map(([key, { title }]) => (
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
          {locations[activeSection].locations.map((location, index) => (
            <div 
              key={index} 
              className="destination-card"
              onClick={() => handleLocationClick(location.name)}
            >
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
            We specialize in showcasing the best destinations across the Bay Area,
            from the vibrant streets of San Francisco to the tech hub of Palo Alto.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p>
            Discover more about our services, travel guides, and special offers
            to make your Bay Area adventure unforgettable.
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