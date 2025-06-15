'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { bookingModel } from '@/lib/firestore/bookingModel';
import '../../styles/profile.css';

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
                  <div className="booking-card-header">
                    <div className="booking-card-icon">🏡</div>
                    <div className="booking-card-title">{booking.propertyName}</div>
                  </div>
                  <div className="booking-dates">
                    <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                    <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
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
    </div>
  );
} 