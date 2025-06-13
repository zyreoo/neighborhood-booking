'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { bookingModel } from '@/lib/firestore/bookingModel';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const userBookings = await bookingModel.getUserBookings(user.uid);
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-icon">
          {user.email ? user.email[0].toUpperCase() : '?'}
        </div>
        <div className="profile-info">
          <h1>Profile</h1>
          <p className="email">{user.email}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="bookings-section">
          <h2>Your Bookings</h2>
          {error ? (
            <div className="error-message">
              {error}
              <button onClick={() => window.location.reload()} className="retry-button">
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <p>You don't have any bookings yet.</p>
              <button onClick={() => router.push('/')} className="browse-button">
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <h3>{booking.propertyName}</h3>
                  <div className="booking-dates">
                    <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div className="booking-status">
                    Status: <span className={`status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 80px auto 0;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .profile-icon {
          width: 80px;
          height: 80px;
          background-color: #4299e1;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
        }

        .profile-info h1 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }

        .email {
          color: #4a5568;
          margin: 0;
        }

        .profile-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .bookings-section h2 {
          margin: 0 0 2rem 0;
          color: #2d3748;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .booking-card {
          background: #f7fafc;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .booking-card h3 {
          margin: 0 0 1rem 0;
          color: #2d3748;
        }

        .booking-dates p {
          margin: 0.5rem 0;
          color: #4a5568;
        }

        .booking-status {
          margin-top: 1rem;
          font-weight: 500;
        }

        .status-confirmed {
          color: #48bb78;
        }

        .status-cancelled {
          color: #e53e3e;
        }

        .status-completed {
          color: #4299e1;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          margin-top: 80px;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3182ce;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          text-align: center;
          padding: 2rem;
          background: #fff5f5;
          border-radius: 8px;
          color: #e53e3e;
        }

        .retry-button {
          display: block;
          margin: 1rem auto 0;
          padding: 0.5rem 1rem;
          background-color: #3182ce;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .no-bookings {
          text-align: center;
          padding: 3rem;
          background: #f7fafc;
          border-radius: 8px;
        }

        .browse-button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .browse-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </div>
  );
} 