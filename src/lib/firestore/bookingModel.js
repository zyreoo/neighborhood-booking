import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'bookings';

export const bookingModel = {
  // Create a new booking
  createBooking: async (data) => {
    try {
      const bookingData = {
        ...data,
        status: 'confirmed',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        extensionRequests: []
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), bookingData);
      return { id: docRef.id, ...bookingData };
    } catch (error) {
      throw error;
    }
  },

  // Request a booking extension
  requestExtension: async (bookingId, userId, additionalDays) => {
    try {
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }

      const bookingData = bookingDoc.data();
      const extensionRequest = {
        requestId: Date.now().toString(),
        userId,
        additionalDays,
        status: 'pending',
        requestedAt: Timestamp.now()
      };

      await updateDoc(bookingRef, {
        extensionRequests: [...bookingData.extensionRequests, extensionRequest],
        updatedAt: Timestamp.now()
      });

      return extensionRequest;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Approve or reject extension request
  handleExtensionRequest: async (bookingId, requestId, approved) => {
    try {
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (!bookingDoc.exists()) {
        throw new Error('Booking not found');
      }

      const bookingData = bookingDoc.data();
      const updatedExtensionRequests = bookingData.extensionRequests.map(request => {
        if (request.requestId === requestId) {
          return {
            ...request,
            status: approved ? 'approved' : 'rejected',
            handledAt: Timestamp.now()
          };
        }
        return request;
      });

      // If approved, update the booking end date
      let updates = {
        extensionRequests: updatedExtensionRequests,
        updatedAt: Timestamp.now()
      };

      if (approved) {
        const request = bookingData.extensionRequests.find(r => r.requestId === requestId);
        if (request) {
          const currentEndDate = new Date(bookingData.checkOut);
          currentEndDate.setDate(currentEndDate.getDate() + request.additionalDays);
          updates.checkOut = currentEndDate.toISOString();
        }
      }

      await updateDoc(bookingRef, updates);
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  // Get all pending extension requests (for admin)
  getPendingExtensionRequests: async () => {
    try {
      const bookingsRef = collection(db, COLLECTION_NAME);
      const q = query(
        bookingsRef,
        where('extensionRequests', 'array-contains', { status: 'pending' }),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const requests = [];

      querySnapshot.forEach((doc) => {
        const booking = { id: doc.id, ...doc.data() };
        const pendingRequests = booking.extensionRequests.filter(r => r.status === 'pending');
        requests.push(...pendingRequests.map(r => ({ ...r, booking })));
      });

      return requests;
    } catch (error) {
      throw error;
    }
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      const bookingsRef = collection(db, COLLECTION_NAME);
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      return bookings;
    } catch (error) {
      throw error;
    }
  },

  // Get bookings for a property
  async getPropertyBookings(propertyId) {
    const bookingsRef = collection(db, COLLECTION_NAME);
    const q = query(bookingsRef, where('property', '==', propertyId));
    const snapshot = await getDocs(q);
    
    const bookings = [];
    snapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings;
  },

  // Update a booking
  async update(bookingId, updateData) {
    const bookingRef = doc(db, COLLECTION_NAME, bookingId);
    await updateDoc(bookingRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return { id: bookingId, ...updateData };
  },

  // Delete a booking
  async delete(bookingId) {
    const bookingRef = doc(db, COLLECTION_NAME, bookingId);
    await deleteDoc(bookingRef);
    return true;
  }
}; 