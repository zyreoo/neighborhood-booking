import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'properties';

export const propertyModel = {
  // Create a new property
  async create(propertyData) {
    const propertiesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(propertiesRef, {
      ...propertyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...propertyData };
  },

  // Get properties with filters
  async getProperties({ city, minPrice, maxPrice, guests, page = 1, pageSize = 10 }) {
    const propertiesRef = collection(db, COLLECTION_NAME);
    let conditions = [];
    
    if (city) {
      conditions.push(where('address.city', '==', city));
    }
    if (minPrice) {
      conditions.push(where('price', '>=', Number(minPrice)));
    }
    if (maxPrice) {
      conditions.push(where('price', '<=', Number(maxPrice)));
    }
    if (guests) {
      conditions.push(where('maxGuests', '>=', Number(guests)));
    }

    const q = query(
      propertiesRef,
      ...conditions,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    const properties = [];
    snapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });

    return properties;
  },

  // Update a property
  async update(propertyId, updateData) {
    const propertyRef = doc(db, COLLECTION_NAME, propertyId);
    await updateDoc(propertyRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return { id: propertyId, ...updateData };
  },

  // Delete a property
  async delete(propertyId) {
    const propertyRef = doc(db, COLLECTION_NAME, propertyId);
    await deleteDoc(propertyRef);
    return true;
  }
}; 