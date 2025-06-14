'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import WelcomeHeader from '@/components/WelcomeHeader';

const neighborhoods = [
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Peaceful residential area with ocean views',
    password: 'oceanview',
  },
  {
    id: 'mission',
    name: 'Mission',
    description: 'Vibrant culture and amazing food scene',
    password: 'foodscene',
  },
  {
    id: 'lower-haight',
    name: 'Lower Haight',
    description: 'Historic charm meets modern living',
    password: 'historic',
  }
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [passwords, setPasswords] = useState({});
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (id, value) => {
    setPasswords(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when typing
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
        [neighborhood.id]: 'Incorrect password'
      }));
    }
  };

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
              {neighborhoods.map((hood) => (
                <div key={hood.id} className="neighborhood-card">
                  <div className="card-image-container">
                    <div className="card-image-placeholder">
                      <span className="placeholder-icon">🏘️</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{hood.name}</h3>
                    <p className="card-description">{hood.description}</p>
                    <div className="card-footer">
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
          <h2 className="section-title">Featured Neighborhoods</h2>
          <div className="neighborhood-grid">
            {neighborhoods.map((hood) => (
              <div key={hood.id} className="neighborhood-card">
                <div className="card-image-container">
                  <div className="card-image-placeholder">
                    <span className="placeholder-icon">🏘️</span>
                  </div>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{hood.name}</h3>
                  <p className="card-description">{hood.description}</p>
                  <div className="password-section">
                    <div className="password-input-container">
                      <span className="lock-icon">🔒</span>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        value={passwords[hood.id] || ''}
                        onChange={(e) => handlePasswordChange(hood.id, e.target.value)}
                        className="password-input"
                      />
                    </div>
                    <button 
                      onClick={() => handleAccess(hood)}
                      className="access-button"
                    >
                      Access →
                    </button>
                  </div>
                  {errors[hood.id] && (
                    <p className="error-message">{errors[hood.id]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .password-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        .password-input-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }
        .lock-icon {
          font-size: 1.2rem;
        }
        .password-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .access-button {
          background: none;
          border: none;
          color: #FF5A5F;
          cursor: pointer;
          font-weight: 500;
        }
        .error-message {
          color: #FF5A5F;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
