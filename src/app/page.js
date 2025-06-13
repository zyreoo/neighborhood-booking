'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import WelcomeHeader from '@/components/WelcomeHeader';

const neighborhoods = [
  {
    name: 'Sunset',
    description: 'Peaceful residential area with ocean views',
    image: '/sunset.jpg',
  },
  {
    name: 'Mission',
    description: 'Vibrant culture and amazing food scene',
    image: '/mission.jpg',
  },
  {
    name: 'Lower Haight',
    description: 'Historic charm meets modern living',
    image: '/haight.jpg',
  }
];

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="landing-page">
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Find Your Perfect Home in San Francisco
              </h1>
              <p className="hero-subtitle">
                Discover beautiful properties in the city's most charming neighborhoods
              </p>
              <Link href="/auth/signup" className="cta-button">
                Get Started
              </Link>
            </div>
          </section>

          <section className="neighborhoods-section">
            <h2 className="section-title">Popular Neighborhoods</h2>
            <div className="neighborhood-grid">
              {neighborhoods.map((hood, i) => (
                <div key={i} className="neighborhood-card">
                  <div className="card-image-container">
                    <div className="card-image-placeholder">
                      <span className="placeholder-icon">🏘️</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{hood.name}</h3>
                    <p className="card-description">{hood.description}</p>
                    <div className="card-footer">
                      <span className="property-count">{hood.properties} Properties</span>
                      <Link href="/auth/signup" className="view-link">
                        View Properties →
                      </Link>
                    </div>
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
    <div className="dashboard-page">
      <main className="main-content">
        <WelcomeHeader />
        
        <section className="neighborhoods-section">
          <div className="section-header">
            <h2 className="section-title">Featured Neighborhoods</h2>
          </div>
          <div className="neighborhood-grid">
            {neighborhoods.map((hood, i) => (
              <Link 
                href={`/neighborhoods/${hood.name.toLowerCase().replace(' ', '-')}`} 
                key={i} 
                className="neighborhood-card"
              >
                <div className="card-image-container">
                  <div className="card-image-placeholder">
                    <span className="placeholder-icon">🏘️</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{hood.name}</h3>
                  <p className="card-description">{hood.description}</p>
                  <div className="card-footer">
                    <span className="property-count">{hood.properties} Properties</span>
                    <span className="view-link">Explore →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
