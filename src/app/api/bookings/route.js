import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

// Define the Booking Schema
const bookingSchema = new mongoose.Schema({
  location: { type: String, required: true },
  bookingCount: { type: Number, default: 0 },
  propertyBookings: [{ type: String }]
});

// Get the model (or create if it doesn't exist)
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export async function POST(request) {
  try {
    await connectDB();
    const { propertyId, location } = await request.json();
    
    console.log('📍 Received booking request:', { propertyId, location });
    
    // Update or create booking count for the location
    const booking = await Booking.findOneAndUpdate(
      { location },
      { 
        $inc: { bookingCount: 1 },
        $push: { propertyBookings: propertyId }
      },
      { upsert: true, new: true }
    );

    console.log('📈 Updated booking stats:', {
      location,
      totalBookings: booking.bookingCount,
      totalPropertiesBooked: booking.propertyBookings.length
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('❌ Booking POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    console.log('🔍 Fetching top locations...');
    
    // First, get all locations from properties to ensure we have all locations
    const allLocations = await mongoose.connection.db.collection('properties').distinct('location');
    console.log('📊 Found total locations:', allLocations.length);
    
    // Get existing booking counts
    const existingBookings = await Booking.find().lean();
    console.log('📊 Locations with bookings:', existingBookings.length);
    
    // Create a map of locations to their booking counts
    const bookingMap = new Map(existingBookings.map(b => [b.location, b]));
    
    // Create entries for locations that don't have any bookings yet
    const allLocationBookings = allLocations.map(location => ({
      location,
      bookingCount: (bookingMap.get(location)?.bookingCount || 0),
      propertyBookings: (bookingMap.get(location)?.propertyBookings || [])
    }));
    
    // Sort by booking count (descending) and then alphabetically by location
    const sortedLocations = allLocationBookings.sort((a, b) => {
      if (b.bookingCount !== a.bookingCount) {
        return b.bookingCount - a.bookingCount;
      }
      return a.location.localeCompare(b.location);
    });
    
    // Get top 4 locations
    const topLocations = sortedLocations.slice(0, 4);
    
    console.log('🏆 Top locations:', topLocations.map(loc => ({
      location: loc.location,
      bookings: loc.bookingCount
    })));

    return NextResponse.json(topLocations);
  } catch (error) {
    console.error('❌ Booking GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 