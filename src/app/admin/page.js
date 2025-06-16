'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import '../../styles/admin.css';
import '../../styles/current-occupants.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentOccupants, setCurrentOccupants] = useState({});

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (!isAdmin()) {
      router.push('/');
      return;
    }

    const fetchUserDetails = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          return userDoc.data();
        }
        return null;
      } catch (err) {
        console.error('Error fetching user details:', err);
        return null;
      }
    };

    const fetchAllBookings = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const bookingsData = [];
        const occupantsByProperty = {};

        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const userDetails = await fetchUserDetails(data.userId);
          
          const bookingData = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
            checkIn: new Date(data.checkIn + 'T00:00:00Z'),
            checkOut: new Date(data.checkOut + 'T00:00:00Z'),
            userEmail: userDetails?.email || 'Unknown',
            userName: userDetails?.name || 'Unknown'
          };

          bookingsData.push(bookingData);

          // Group occupants by property
          if (!occupantsByProperty[data.propertyId]) {
            occupantsByProperty[data.propertyId] = [];
          }
          occupantsByProperty[data.propertyId].push(bookingData);
        }

        setBookings(bookingsData);
        setCurrentOccupants(occupantsByProperty);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings data');
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [user, isAdmin, router]);

  const filteredBookings = bookings.filter(booking => {
    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    const filterStart = new Date(startDate + 'T00:00:00Z');
    const filterEnd = new Date(endDate + 'T00:00:00Z');
    return bookingStart <= filterEnd && bookingEnd >= filterStart;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
            <p className="ml-3 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="admin-card">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
              <p className="text-gray-600">You do not have permission to view this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">
            Manage all bookings and reservations
          </p>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="admin-card mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Date Range Filter</h2>
            <div className="date-filter">
              <div className="date-filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card mb-6">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-100 text-gray-800">Current Occupants</h2>
          <div className="current-occupants-container">
            {[
              { id: 'sunset-beach-house', name: 'Sunset Beach House' },
              { id: 'mission-house', name: 'Mission House' },
              { id: 'lower-haight-house', name: 'Lower Haight House' }
            ].map((house) => {
              const houseOccupants = Object.entries(currentOccupants)
                .filter(([propertyId]) => propertyId === house.id)
                .flatMap(([_, occupants]) => 
                  occupants.filter(booking => {
                    const filterStart = new Date(startDate + 'T00:00:00Z');
                    const filterEnd = new Date(endDate + 'T00:00:00Z');
                    return new Date(booking.checkIn) <= filterEnd && new Date(booking.checkOut) >= filterStart;
                  })
                );

              return (
                <div key={house.id} className="current-occupant-card">
                  <h3>{house.name}</h3>
                  {houseOccupants.length > 0 ? (
                    <div className="occupants-list">
                      {houseOccupants.map(booking => (
                        <div key={booking.id} className="occupant-name">
                          {booking.userName}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-occupant">No current occupants</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="text-xl font-semibold p-6 border-b border-gray-100 text-gray-800">All Bookings</h2>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Email</th>
                  <th>Property</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.userName || 'N/A'}</td>
                    <td>{booking.userEmail || 'N/A'}</td>
                    <td>
                      {booking.propertyId === 'sunset-beach-house' ? 'Sunset Beach House' :
                       booking.propertyId === 'mission-house' ? 'Mission House' :
                       'Lower Haight House'}
                    </td>
                    <td>{booking.checkIn.toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                    <td>{booking.checkOut.toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                    <td>
                      <span className={`status-badge ${
                        booking.status === 'confirmed' ? 'status-confirmed' : 
                        booking.status === 'pending' ? 'status-pending' : 
                        'status-cancelled'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>{booking.createdAt?.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 