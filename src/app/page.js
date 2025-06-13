'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const neighborhoods = [
  {
    name: 'Sunset',
    description: 'Peaceful residential area with ocean views',
    image: '/sunset.jpg',
    properties: 12
  },
  {
    name: 'Mission',
    description: 'Vibrant culture and amazing food scene',
    image: '/mission.jpg',
    properties: 15
  },
  {
    name: 'Lower Haight',
    description: 'Historic charm meets modern living',
    image: '/haight.jpg',
    properties: 8
  }
];

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="landing-page">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="nav-logo">🏠</span>
            <span className="nav-title">Neighborhood</span>
          </div>
          <div className="nav-links">
            <Link href="/about-us" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
            <Link href="/auth/signin" className="nav-link">Sign In</Link>
            <Link href="/auth/signup" className="nav-button">Join Us</Link>
          </div>
        </nav>

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
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">🏠</span>
          <span className="nav-title">Neighborhood</span>
        </div>
        <div className="nav-links">
          <Link href="/houses" className="nav-link">Find Houses</Link>
          <Link href="/favorites" className="nav-link">Favorites</Link>
          <button className="nav-link">Sign Out</button>
        </div>
      </nav>

      <main className="main-content">
        <section className="welcome-section">
          <h1 className="welcome-title">
            Welcome Back{session.user?.name ? `, ${session.user.name}` : ''}
          </h1>
          <p className="welcome-subtitle">
            Explore available properties in your favorite neighborhoods
          </p>
        </section>

        <section className="neighborhoods-section">
          <div className="section-header">
            <h2 className="section-title">Featured Neighborhoods</h2>
            <Link href="/neighborhoods" className="section-link">
              View All →
            </Link>
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
