'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import '../../styles/admin.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          // Fetch user details for each booking
          const userDetails = await fetchUserDetails(data.userId);
          
          bookingsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.(),
            updatedAt: data.updatedAt?.toDate?.(),
            checkIn: new Date(data.checkIn),
            checkOut: new Date(data.checkOut),
            userEmail: userDetails?.email || 'Unknown',
            userName: userDetails?.name || 'Unknown'
          });
        }

        setBookings(bookingsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings data');
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [user, isAdmin, router]);

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

        <div className="admin-card">
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
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="font-medium">{booking.userName}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-600">{booking.userEmail}</div>
                  </td>
                  <td>{booking.propertyId}</td>
                  <td>{booking.checkIn.toLocaleDateString()}</td>
                  <td>{booking.checkOut.toLocaleDateString()}</td>
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

          {bookings.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 