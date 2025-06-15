import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { bookingModel } from '@/lib/firestore/bookingModel';
import { useRouter } from 'next/navigation';

export default function BookingForm({ propertyId, propertyName }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Get already booked dates for this property
    const fetchBookedDates = async () => {
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // Look ahead 3 months
        
        const dates = await bookingModel.getPropertyAvailableDates(
          propertyId,
          startDate.toISOString(),
          endDate.toISOString()
        );
        setBookedDates(dates);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDates();
  }, [propertyId]);

  // Calculate minimum and maximum dates for the summer season
  const calculateDateLimits = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Summer season: June 1st to August 31st
    const summerStart = new Date(currentYear, 5, 1); // June 1st
    const summerEnd = new Date(currentYear, 7, 31); // August 31st
    
    // If we're past this year's summer, show next year's dates
    if (now > summerEnd) {
      summerStart.setFullYear(currentYear + 1);
      summerEnd.setFullYear(currentYear + 1);
    }
    
    return {
      min: summerStart.toISOString().split('T')[0],
      max: summerEnd.toISOString().split('T')[0]
    };
  };

  const { min: minDate, max: maxDate } = calculateDateLimits();

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    setError('');
    
    if (checkOut) {
      validateDates(newCheckIn, checkOut);
    }
  };

  const handleCheckOutChange = (e) => {
    const newCheckOut = e.target.value;
    setError('');
    
    if (checkIn) {
      validateDates(checkIn, newCheckOut);
    }
  };

  const validateDates = (startDate, endDate) => {
    const checkInDate = new Date(startDate);
    const checkOutDate = new Date(endDate);
    
    // Calculate the difference in days
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Check if stay is at least 2 weeks
    if (diffDays < 14) {
      setError('Booking must be at least 2 weeks (14 days)');
      setCheckOut('');
      return false;
    }

    // If all validations pass
    setCheckOut(endDate);
    return true;
  };

  const isDateBooked = (date) => {
    return bookedDates.some(booking => {
      const bookingStart = new Date(booking.start);
      const bookingEnd = new Date(booking.end);
      const checkDate = new Date(date);
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      // Store the current URL to redirect back after login
      sessionStorage.setItem('redirectAfterAuth', window.location.pathname);
      router.push('/auth/signin');
      return;
    }

    try {
      await bookingModel.createBooking({
        propertyId,
        propertyName,
        userId: user.uid,
        userEmail: user.email,
        checkIn,
        checkOut,
        status: 'confirmed'
      });

      setBookingSuccess(true);
      // Wait a moment before redirecting to show success state
      setTimeout(() => {
        router.push('/bookings');
      }, 1500);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Calculate minimum check-out date (14 days from check-in)
  const getMinCheckOut = () => {
    if (!checkIn) return '';
    const minDate = new Date(checkIn);
    minDate.setDate(minDate.getDate() + 14);
    return minDate.toISOString().split('T')[0];
  };

  if (bookingSuccess) {
    return (
      <div className="booking-success">
        <div className="success-icon">✓</div>
        <h3>Booking Confirmed!</h3>
        <p>Redirecting to your bookings...</p>
        <style jsx>{`
          .booking-success {
            text-align: center;
            padding: 2rem;
            background: #f0fff4;
            border-radius: 8px;
            color: #2f855a;
          }
          .success-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          h3 {
            margin: 0 0 0.5rem 0;
          }
          p {
            margin: 0;
            color: #4a5568;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h3>Book Your Stay</h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="check-in">Check-in Date</label>
          <input
            type="date"
            id="check-in"
            value={checkIn}
            onChange={handleCheckInChange}
            min={minDate}
            max={maxDate}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="check-out">Check-out Date (Minimum 2 weeks stay)</label>
          <input
            type="date"
            id="check-out"
            value={checkOut}
            onChange={handleCheckOutChange}
            min={checkIn ? getMinCheckOut() : minDate}
            max={maxDate}
            required
            disabled={!checkIn || loading}
          />
          {checkIn && !checkOut && (
            <div className="suggestion">
              Minimum check-out: {new Date(getMinCheckOut()).toLocaleDateString()}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !checkIn || !checkOut || error}
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </form>

      <style jsx>{`
        .booking-form {
          background: #fff8f3;
          padding: 2rem;
          border-radius: 24px;
          box-shadow: 0 4px 24px rgba(139, 69, 19, 0.06);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        input[type="date"] {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 32px;
          background: #fff;
          font-size: 1.1rem;
          color: var(--text-color);
          box-shadow: 0 1px 4px rgba(139, 69, 19, 0.04);
          transition: box-shadow 0.2s;
        }

        input[type="date"]:focus {
          outline: none;
          box-shadow: 0 0 0 2px var(--house-orange);
        }

        input:disabled {
          background-color: #f7f7f7;
          cursor: not-allowed;
        }

        .error-message {
          color: #e53e3e;
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background-color: #fff5f5;
          border-radius: 12px;
          font-weight: 500;
        }

        .suggestion {
          margin-top: 0.5rem;
          font-size: 0.95rem;
          color: var(--primary-color);
          font-style: italic;
        }

        .submit-button {
          width: 100%;
          padding: 1.1rem;
          background-color: var(--house-orange);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(211, 84, 0, 0.06);
        }

        .submit-button:hover:not(:disabled) {
          background: #d35400;
          color: #fff;
          box-shadow: 0 4px 16px rgba(211, 84, 0, 0.12);
        }

        .submit-button:disabled {
          background-color: #f7cac0;
          color: #fff;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
} 