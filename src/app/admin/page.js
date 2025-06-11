'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    imageUrl: '',
    type: 'Villa',
    bedrooms: '',
    bathrooms: '',
    maxGuests: '',
    description: '',
    amenities: []
  });

  useEffect(() => {
    fetchProperties();
    fetchAmenities();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchAmenities = async () => {
    try {
      const response = await fetch('/api/amenities');
      const data = await response.json();
      setAmenities(data.amenities);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      // Reset form and refresh properties
      setFormData({
        title: '',
        location: '',
        price: '',
        imageUrl: '',
        type: 'Villa',
        bedrooms: '',
        bathrooms: '',
        maxGuests: '',
        description: '',
        amenities: []
      });
      fetchProperties();
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenitiesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      amenities: selectedOptions
    }));
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Property Management</h1>
      
      <div className={styles.formSection}>
        <h2>Add New Property</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price per Night</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Cabin">Cabin</option>
              <option value="House">House</option>
              <option value="Loft">Loft</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amenities">Amenities</label>
            <select
              id="amenities"
              name="amenities"
              multiple
              value={formData.amenities}
              onChange={handleAmenitiesChange}
              className={styles.multiSelect}
            >
              {amenities.map(amenity => (
                <option key={amenity._id} value={amenity._id}>
                  {amenity.name} - {amenity.category}
                </option>
              ))}
            </select>
            <small>Hold Ctrl (Windows) or Cmd (Mac) to select multiple amenities</small>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxGuests">Max Guests</label>
              <input
                type="number"
                id="maxGuests"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Property
          </button>
        </form>
      </div>

      <div className={styles.propertiesList}>
        <h2>Existing Properties</h2>
        <div className={styles.propertyGrid}>
          {properties.map((property) => (
            <div key={property._id} className={styles.propertyCard}>
              <img src={property.imageUrl} alt={property.title} />
              <div className={styles.propertyInfo}>
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <p>${property.price} per night</p>
                <p>{property.bedrooms} beds • {property.bathrooms} baths</p>
                <div className={styles.amenitiesList}>
                  {property.amenities.map(amenity => (
                    <span key={amenity._id} className={styles.amenityTag}>
                      {amenity.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 