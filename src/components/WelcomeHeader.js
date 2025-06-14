'use client';

import { useAuth } from '@/lib/auth';

export default function WelcomeHeader() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="welcome-section">
        <div className="loading-text">Loading...</div>
        <style jsx>{`
          .loading-text {
            font-size: 1.25rem;
            color: var(--neutral);
            text-align: center;
            padding: 2rem;
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <div className="welcome-icon">👋</div>
        <h1 className="welcome-title">
          Welcome back, {user.displayName || 'Guest'}!
        </h1>
        <p className="welcome-subtitle">
          Ready to explore more beautiful homes in San Francisco?
        </p>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-icon">🏠</span>
            <div className="stat-content">
              <div className="stat-value">150+</div>
              <div className="stat-label">Properties</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📍</span>
            <div className="stat-content">
              <div className="stat-value">3</div>
              <div className="stat-label">Neighborhoods</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <div className="stat-content">
              <div className="stat-value">4.8</div>
              <div className="stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .welcome-section {
          padding: 3rem 2rem;
          background: linear-gradient(135deg, var(--background), var(--neutral));
          border-radius: var(--border-radius);
          margin: 2rem auto;
          position: relative;
          overflow: hidden;
        }

        .welcome-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .welcome-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          animation: wave 2s infinite;
          display: inline-block;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }

        .welcome-title {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .welcome-subtitle {
          font-size: 1.25rem;
          color: var(--text-dark);
          margin-bottom: 2.5rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--background);
          border-radius: var(--border-radius);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: var(--transition);
        }

        .stat-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-content {
          text-align: left;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--neutral);
        }

        @media (max-width: 768px) {
          .welcome-section {
            padding: 2rem 1rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stat-item {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 