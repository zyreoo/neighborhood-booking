'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import WelcomeHeader from '@/components/WelcomeHeader';
import Image from 'next/image';

const neighborhoods = [
  {
    id: 'sunset',
    name: 'Sunset District',
    description: 'Ocean views & laid-back vibes 🌊',
    password: 'oceanview',
    image: '/neighborhoods/sunset.jpg'
  },
  {
    id: 'mission',
    name: 'Mission District',
    description: 'Food & culture paradise 🌮',
    password: 'foodscene',
    image: '/neighborhoods/mission.jpg'
  },
  {
    id: 'lower-haight',
    name: 'Lower Haight',
    description: 'Historic charm meets modern life 🎨',
    password: 'historic',
    image: '/neighborhoods/lower-haight.jpg' 
  }
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [passwords, setPasswords] = useState({});
  const [errors, setErrors] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const handlePasswordChange = (id, value) => {
    setPasswords(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleAccess = (neighborhood) => {
    const enteredPassword = passwords[neighborhood.id] || '';
    if (enteredPassword === neighborhood.password) {
      router.push(`/neighborhoods/${neighborhood.id}`);
    } else {
      setErrors(prev => ({
        ...prev,
        [neighborhood.id]: 'Oops! Wrong password 🤔'
      }));
    }
  };

  if (!user) {
    return (
      <div className="container">
        <main>
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Find Your
                <br />
                Happy Place
                <br />
                in SF! ✨
              </h1>
              <p className="hero-subtitle">
                Discover amazing neighborhoods and make yourself at home
              </p>
              <div className="hero-buttons">
                <Link href="/auth/signup" className="btn btn-primary">
                  Get Started
                </Link>
                <Link href="/about" className="btn btn-secondary">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </section>

          <section className="property-section">
            <div className="section-header">
              <h2 className="section-title">
                Awesome Neighborhoods
              </h2>
              <p className="section-subtitle">Each with its own special character!</p>
            </div>
            <div className="property-grid">
              {neighborhoods.map((hood) => (
                <div 
                  key={hood.id} 
                  className="property-card"
                  onMouseEnter={() => setHoveredCard(hood.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="property-image-container">
                    {hood.image ? (
                      <Image
                        src={hood.image}
                        alt={hood.name}
                        width={400}
                        height={300}
                        className="property-image"
                      />
                    ) : (
                      <div className="property-image-placeholder">
                        <span>🏘️</span>
                      </div>
                    )}
                  </div>
                  <div className="property-content">
                    <h3 className="property-title">{hood.name}</h3>
                    <p className="property-location">{hood.description}</p>
                    <Link href="/auth/signup" className="btn btn-primary">
                      Join Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <main>
        <WelcomeHeader />
        
        <section className="property-section">
          <div className="section-header">
            <h2 className="section-title">
              Ready to Explore? 🗺️
            </h2>
            <p className="section-subtitle">Enter the secret password for each neighborhood</p>
          </div>
          <div className="property-grid">
            {neighborhoods.map((hood) => (
              <div 
                key={hood.id} 
                className="property-card"
                onMouseEnter={() => setHoveredCard(hood.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="property-image-container">
                  {hood.image ? (
                    <Image
                      src={hood.image}
                      alt={hood.name}
                      width={400}
                      height={300}
                      className="property-image"
                    />
                  ) : (
                    <div className="property-image-placeholder">
                      <span>🏘️</span>
                    </div>
                  )}
                </div>
                <div className="property-content">
                  <h3 className="property-title">{hood.name}</h3>
                  <p className="property-location">{hood.description}</p>
                  <form 
                    className="access-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAccess(hood);
                    }}
                  >
                    <div className="input-group">
                      <span className="input-icon">🔑</span>
                      <input
                        type="password"
                        placeholder="Enter the secret password"
                        value={passwords[hood.id] || ''}
                        onChange={(e) => handlePasswordChange(hood.id, e.target.value)}
                        className="input"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="btn btn-primary"
                    >
                      Unlock Access
                    </button>
                    {errors[hood.id] && (
                      <p className="error-message">{errors[hood.id]}</p>
                    )}
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
