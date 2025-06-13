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

              <div className="stay-duration">
                <p>14 nights</p>
              </div>

              {booking.status === 'confirmed' && (
                <button 
                  className="cancel-button"
                  onClick={async () => {
                    try {
                      await bookingModel.cancelBooking(booking.id);
                      // Refresh bookings
                      const updatedBookings = await bookingModel.getUserBookings(user.uid);
                      setBookings(updatedBookings);
                    } catch (error) {
                      setError('Failed to cancel booking. Please try again.');
                    }
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bookings-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          margin-bottom: 2rem;
          color: #2d3748;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .booking-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .booking-header h3 {
          margin: 0;
          color: #2d3748;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .booking-dates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .date-group label {
          display: block;
          color: #718096;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .date-group p {
          margin: 0;
          color: #2d3748;
          font-weight: 500;
        }

        .stay-duration {
          margin-bottom: 1rem;
          padding: 0.5rem;
          background-color: #f7fafc;
          border-radius: 4px;
          text-align: center;
        }

        .stay-duration p {
          margin: 0;
          color: #2d3748;
          font-weight: 500;
        }

        .cancel-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #e53e3e;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-button:hover {
          background-color: #c53030;
        }

        .no-bookings {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .browse-button {
          padding: 0.75rem 1.5rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 1rem;
        }

        .browse-button:hover {
          background-color: #3182ce;
        }
      `}</style>
    </div>
  );
} 