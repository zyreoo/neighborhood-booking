'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const propertiesRef = collection(db, 'properties');
        const q = query(propertiesRef, limit(3));
        const querySnapshot = await getDocs(q);
        
        const fetchedProperties = [];
        querySnapshot.forEach((doc) => {
          fetchedProperties.push({ id: doc.id, ...doc.data() });
        });
        
        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Neighborhood Booking</h1>
        
        {session ? (
          <p className="mb-4">Welcome back, {session.user.name || session.user.email}!</p>
        ) : (
          <p className="mb-4">Please sign in to book properties</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="border rounded-lg overflow-hidden shadow-lg">
              {property.images && property.images[0] && (
                <div className="relative h-48">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-2">{property.address?.city}</p>
                <p className="text-gray-800 mb-4">{property.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${property.price}/night</span>
                  <button 
                    className={`px-4 py-2 rounded ${
                      session 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={() => {/* Add booking logic */}}
                    disabled={!session}
                  >
                    {session ? 'Book Now' : 'Sign in to Book'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
