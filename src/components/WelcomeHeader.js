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
      <div className="welcome-video-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="welcome-video"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="welcome-overlay"></div>
      </div>
      <div className="welcome-content">
        <div className="welcome-icon">👋</div>
        <h1 className="welcome-title">
          Welcome back, {user.displayName || 'Guest'}!
        </h1>
        <p className="welcome-subtitle">
          Ready to choose your home in San Francisco?
        </p>
      </div>

      <style jsx>{`
        .welcome-section {
          position: relative;
          margin-bottom: 2rem;
          border-radius: 12px;
          overflow: hidden;
        }

        .welcome-video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .welcome-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .welcome-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
        }

        .welcome-content {
          position: relative;
          z-index: 1;
          padding: 3rem 2rem;
          text-align: center;
          color: white;
        }

        .welcome-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
} 