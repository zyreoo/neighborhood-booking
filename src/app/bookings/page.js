'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { bookingModel } from '@/lib/firestore/bookingModel';
import { useRouter } from 'next/navigation';

export default function BookingsPage() {
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
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, router]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#48bb78'; // green
      case 'cancelled':
        return '#e53e3e'; // red
      case 'completed':
        return '#4299e1'; // blue
      default:
        return '#718096'; // gray
    }
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 300px;
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
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
        <style jsx>{`
          .error-container {
            text-align: center;
            padding: 2rem;
            margin: 2rem auto;
            max-width: 400px;
            background: #fff5f5;
            border-radius: 8px;
            color: #e53e3e;
          }
          .retry-button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #3182ce;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .retry-button:hover {
            background-color: #2c5282;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <h1>Your Bookings</h1>
      
      {bookings.length === 0 ? (
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
              <div className="booking-header">
                <h3>{booking.propertyName}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-dates">
                <div className="date-group">
                  <label>Check-in</label>
                  <p>{formatDate(booking.checkIn)}</p>
                </div>
                <div className="date-group">
                  <label>Check-out</label>
                  <p>{formatDate(booking.checkOut)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bookings-page {
          padding: calc(var(--spacing-unit) * 2);
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          margin-bottom: calc(var(--spacing-unit) * 2);
          color: var(--primary-color);
          font-size: 2rem;
          font-weight: 600;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: calc(var(--spacing-unit) * 2);
        }

        .booking-card {
          background: white;
          border-radius: var(--border-radius);
          padding: calc(var(--spacing-unit) * 1.5);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .booking-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-unit);
          padding-bottom: var(--spacing-unit);
          border-bottom: 1px solid var(--background-color);
        }

        .booking-header h3 {
          margin: 0;
          color: var(--primary-color);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .booking-dates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-unit);
        }

        .date-group label {
          display: block;
          color: var(--text-color);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }

        .date-group p {
          margin: 0;
          color: var(--text-color);
          font-weight: 500;
          font-size: 1rem;
        }

        .no-bookings {
          text-align: center;
          padding: calc(var(--spacing-unit) * 4);
          background: white;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .no-bookings p {
          color: var(--text-color);
          margin-bottom: var(--spacing-unit);
          font-size: 1.1rem;
        }

        .browse-button {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .browse-button:hover {
          background-color: #6B8B77;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          background: white;
          border-radius: var(--border-radius);
          padding: calc(var(--spacing-unit) * 2);
        }

        .loading-spinner {
          border: 4px solid var(--background-color);
          border-top: 4px solid var(--accent-color);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-unit);
        }

        .error-container {
          text-align: center;
          padding: calc(var(--spacing-unit) * 2);
          margin: calc(var(--spacing-unit) * 2) auto;
          max-width: 400px;
          background: white;
          border-radius: var(--border-radius);
          color: #e53e3e;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .retry-button {
          margin-top: var(--spacing-unit);
          padding: 12px 24px;
          background-color: var(--accent-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background-color: #6B8B77;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 