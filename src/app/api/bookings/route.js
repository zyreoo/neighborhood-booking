import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';


const bookingSchema = new mongoose.Schema({
  location: { type: String, required: true },
  bookingCount: { type: Number, default: 0 },
  propertyBookings: [{ type: String }]
});


const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export async function POST(request) {
  try {
    await connectDB();
    const { propertyId, location } = await request.json();
    

    const booking = await Booking.findOneAndUpdate(
      { location },
      { 
        $inc: { bookingCount: 1 },
        $push: { propertyBookings: propertyId }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('❌ Booking POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    
    const allLocations = await mongoose.connection.db.collection('properties').distinct('location');

    const existingBookings = await Booking.find().lean();
    

    const bookingMap = new Map(existingBookings.map(b => [b.location, b]));
    
    const allLocationBookings = allLocations.map(location => ({
      location,
      bookingCount: (bookingMap.get(location)?.bookingCount || 0),
      propertyBookings: (bookingMap.get(location)?.propertyBookings || [])
    }));
    

    const sortedLocations = allLocationBookings.sort((a, b) => {
      if (b.bookingCount !== a.bookingCount) {
        return b.bookingCount - a.bookingCount;
      }
      return a.location.localeCompare(b.location);
    });
    
    const topLocations = sortedLocations.slice(0, 4);

    return NextResponse.json(topLocations);
  } catch (error) {
    console.error('❌ Booking GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 