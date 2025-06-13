import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'bookings';

const validateBookingDates = (checkIn, checkOut) => {
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check if dates are in the future
  if (checkInDate < now) {
    throw new Error('Check-in date must be in the future');
  }

  // Check if check-out is after check-in
  if (checkOutDate <= checkInDate) {
    throw new Error('Check-out date must be after check-in date');
  }

  // Check if booking is within summer months (June to August)
  const month = checkInDate.getMonth();
  if (month < 5 || month > 7) { // 5 = June, 7 = August (0-based months)
    throw new Error('Bookings are only available during summer months (June to August)');
  }

  // Check if booking is at least 2 weeks
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 14) {
    throw new Error('Booking must be at least 2 weeks (14 days)');
  }
};

export const bookingModel = {
  // Create a new booking
  createBooking: async (data) => {
    try {
      // Validate dates
      validateBookingDates(data.checkIn, data.checkOut);

      // Check if user already has an active booking
      const existingBookings = await bookingModel.getUserActiveBookings(data.userId);
      if (existingBookings.length > 0) {
        throw new Error('You already have an active booking');
      }

      const bookingData = {
        ...data,
        status: 'confirmed',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), bookingData);
      return { id: docRef.id, ...bookingData };
    } catch (error) {
      throw error;
    }
  },

  // Get user's active bookings (current or future bookings)
  getUserActiveBookings: async (userId) => {
    try {
      const bookingsRef = collection(db, COLLECTION_NAME);
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        where('status', '==', 'confirmed')
      );

      const querySnapshot = await getDocs(q);
      const now = new Date();
      const bookings = [];

      querySnapshot.forEach((doc) => {
        const booking = { id: doc.id, ...doc.data() };
        // Filter out past bookings in JavaScript instead of using a compound query
        if (new Date(booking.checkOut) >= now) {
          bookings.push(booking);
        }
      });

      return bookings;
    } catch (error) {
      throw error;
    }
  },

  // Get all user's bookings (including past bookings)
  getUserBookings: async (userId) => {
    try {
      const bookingsRef = collection(db, COLLECTION_NAME);
      const q = query(
        bookingsRef,
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamps to regular dates
        const booking = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || null,
          updatedAt: data.updatedAt?.toDate?.() || null
        };
        bookings.push(booking);
      });

      // Sort by creation date in JavaScript
      return bookings.sort((a, b) => {
        const dateA = a.createdAt || new Date(0);
        const dateB = b.createdAt || new Date(0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error in getUserBookings:', error);
      throw new Error('Failed to fetch bookings. Please try again.');
    }
  },

  // Get property's available dates
  getPropertyAvailableDates: async (propertyId, startDate, endDate) => {
    try {
      const bookingsRef = collection(db, COLLECTION_NAME);
      const q = query(
        bookingsRef,
        where('propertyId', '==', propertyId),
        where('status', '==', 'confirmed')
      );

      const querySnapshot = await getDocs(q);
      const bookedDates = [];

      querySnapshot.forEach((doc) => {
        const booking = doc.data();
        // Filter dates in JavaScript instead of using a compound query
        if (new Date(booking.checkOut) >= new Date(startDate) && 
            new Date(booking.checkIn) <= new Date(endDate)) {
          bookedDates.push({
            start: booking.checkIn,
            end: booking.checkOut
          });
        }
      });

      return bookedDates;
    } catch (error) {
      throw error;
    }
  },

  // Get bookings for a property
  getPropertyBookings: async (propertyId) => {
    try {
      const bookingsRef = collection(db, COLLECTION_NAME);
      const q = query(
        bookingsRef,
        where('propertyId', '==', propertyId)
      );

      const querySnapshot = await getDocs(q);
      const bookings = [];

      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });

      // Sort bookings by check-in date in JavaScript instead of using orderBy
      return bookings.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    } catch (error) {
      throw error;
    }
  },

  // Update a booking
  update: async (bookingId, updateData) => {
    try {
      if (updateData.checkIn || updateData.checkOut) {
        validateBookingDates(
          updateData.checkIn || (await getDoc(doc(db, COLLECTION_NAME, bookingId))).data().checkIn,
          updateData.checkOut || (await getDoc(doc(db, COLLECTION_NAME, bookingId))).data().checkOut
        );
      }

      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      await updateDoc(bookingRef, {
        ...updateData,
        updatedAt: Timestamp.now()
      });
      return { id: bookingId, ...updateData };
    } catch (error) {
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    try {
      const bookingRef = doc(db, COLLECTION_NAME, bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: Timestamp.now()
      });
      return true;
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

  // Delete a booking
  async delete(bookingId) {
    const bookingRef = doc(db, COLLECTION_NAME, bookingId);
    await deleteDoc(bookingRef);
    return true;
  }
}; 