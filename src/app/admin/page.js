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
            checkIn: new Date(data.checkIn),
            checkOut: new Date(data.checkOut),
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
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);
    return bookingStart <= filterEnd && bookingEnd >= filterStart;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
            <p className="ml-3">Loading admin dashboard...</p>
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
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
              <p className="mt-2">You do not have permission to view this page.</p>
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
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Date Range Filter</h2>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card mb-6">
          <h2 className="text-xl font-semibold p-4 border-b">Current Occupants</h2>
          <div className="p-4">
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
                      const filterStart = new Date(startDate);
                      const filterEnd = new Date(endDate);
                      return new Date(booking.checkIn) <= filterEnd && new Date(booking.checkOut) >= filterStart;
                    })
                  );

                return (
                  <div key={house.id} className="current-occupant-card">
                    <h3>{house.name}</h3>
                    {houseOccupants.length > 0 ? (
                      houseOccupants.map(booking => (
                        <div key={booking.id} className="occupant-info">
                          <div className="name">{booking.userName}</div>
                          <div className="email">{booking.userEmail}</div>
                          <div className="dates">
                            {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-occupant">No current occupants</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="text-xl font-semibold p-4 border-b">All Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Guest</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Property</th>
                  <th className="px-4 py-2 text-left">Check In</th>
                  <th className="px-4 py-2 text-left">Check Out</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="px-4 py-2">{booking.userName || 'N/A'}</td>
                    <td className="px-4 py-2">{booking.userEmail || 'N/A'}</td>
                    <td className="px-4 py-2">
                      {booking.propertyId === 'sunset-beach-house' ? 'Sunset Beach House' :
                       booking.propertyId === 'mission-house' ? 'Mission House' :
                       'Lower Haight House'}
                    </td>
                    <td className="px-4 py-2">{booking.checkIn.toLocaleDateString()}</td>
                    <td className="px-4 py-2">{booking.checkOut.toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{booking.createdAt?.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No bookings found for the selected date range
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 