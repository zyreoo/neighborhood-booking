'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { bookingModel } from '@/lib/firestore/bookingModel';

export default function ExtensionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, userData, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !userData) {
      router.push('/auth/signin');
      return;
    }

    if (!isAdmin()) {
      router.push('/');
      return;
    }

    loadRequests();
  }, [user, userData, router]);

  const loadRequests = async () => {
    try {
      const pendingRequests = await bookingModel.getPendingExtensionRequests();
      setRequests(pendingRequests);
    } catch (err) {
      setError('Failed to load extension requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (bookingId, requestId, approved) => {
    try {
      await bookingModel.handleExtensionRequest(bookingId, requestId, approved);
      await loadRequests(); // Reload the list
    } catch (err) {
      setError('Failed to process request');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!isAdmin()) {
    return <div className="container mx-auto p-4">Access denied</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Extension Requests</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <p>No pending extension requests</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.requestId}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    Booking #{request.booking.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    User: {request.userId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Additional Days: {request.additionalDays}
                  </p>
                  <p className="text-sm text-gray-600">
                    Requested: {request.requestedAt.toDate().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(request.booking.id, request.requestId, true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest(request.booking.id, request.requestId, false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 