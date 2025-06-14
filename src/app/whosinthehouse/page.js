'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { houses } from '@/lib/houseData';
import styles from './page.module.css';

export default function WhosInTheHousePage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [occupancyData, setOccupancyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOccupancyData = async () => {
    if (!startDate || !endDate) return;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('checkOut', '>=', startDate),
        where('checkIn', '<=', endDate),
        where('status', '==', 'confirmed')
      );

      const querySnapshot = await getDocs(q);
      const occupancy = {};

      // Initialize occupancy data for all houses
      houses.forEach(house => {
        occupancy[house.id] = {
          houseName: house.name,
          bookings: []
        };
      });

      // Populate occupancy data from bookings
      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        const propertyId = booking.propertyId;
        
        // Find the matching house
        const house = houses.find(h => h.id === propertyId);
        if (house) {
          occupancy[house.id].bookings.push({
            id: doc.id,
            userEmail: booking.userEmail,
            checkIn: new Date(booking.checkIn).toLocaleDateString(),
            checkOut: new Date(booking.checkOut).toLocaleDateString()
          });
        }
      });

      setOccupancyData(occupancy);
    } catch (err) {
      console.error('Error fetching occupancy data:', err);
      setError('Failed to load occupancy data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchOccupancyData();
    }
  }, [startDate, endDate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Who's in the House?</h1>
      
      <div className={styles.datePickerContainer}>
        <div className={styles.datePickerGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setError('');
              }}
              className={styles.input}
              max={endDate || undefined}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setError('');
              }}
              className={styles.input}
              min={startDate || undefined}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading occupancy data...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {!loading && !error && startDate && endDate && (
        <div className={styles.housesGrid}>
          {Object.entries(occupancyData).map(([houseId, data]) => (
            <div key={houseId} className={styles.houseCard}>
              <div className={styles.houseHeader}>
                <h3 className={styles.houseName}>{data.houseName}</h3>
                <span className={styles.bookingCount}>
                  {data.bookings.length} {data.bookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              </div>
              <div className={styles.houseContent}>
                {data.bookings.length === 0 ? (
                  <p className={styles.noOccupants}>No occupants during this period</p>
                ) : (
                  <div className={styles.bookingList}>
                    {data.bookings.map((booking) => (
                      <div key={booking.id} className={styles.bookingItem}>
                        <p className={styles.bookingDetail}>
                          <span className={styles.bookingLabel}>Guest:</span> {booking.userEmail}
                        </p>
                        <p className={styles.bookingDetail}>
                          <span className={styles.bookingLabel}>Check-in:</span> {booking.checkIn}
                        </p>
                        <p className={styles.bookingDetail}>
                          <span className={styles.bookingLabel}>Check-out:</span> {booking.checkOut}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 