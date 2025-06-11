import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Property from '@/models/Property';
import Amenity from '@/models/Amenity';

const amenities = [
  { name: 'WiFi', icon: 'wifi', category: 'basic', description: 'High-speed wireless internet' },
  { name: 'Pool', icon: 'pool', category: 'outdoor', description: 'Swimming pool' },
  { name: 'Kitchen', icon: 'kitchen', category: 'kitchen', description: 'Full kitchen' },
  { name: 'TV', icon: 'tv', category: 'entertainment', description: 'Smart TV' },
  { name: 'Parking', icon: 'parking', category: 'basic', description: 'Free parking' },
];

const properties = [
  {
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: 350,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    description: "Stunning villa with panoramic ocean views"
  },
  {
    title: "Modern Downtown Apartment",
    location: "New York City, NY",
    price: 200,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    description: "Contemporary apartment in the heart of NYC"
  },
  {
    title: "Cozy Mountain Cabin",
    location: "Aspen, Colorado",
    price: 275,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3",
    type: "Cabin",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    description: "Rustic cabin with mountain views"
  }
];

export async function GET() {
  try {
    await connectDB();

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com'
    });

    // Create amenities
    const createdAmenities = await Amenity.insertMany(amenities);

    // Create properties with amenities and owner
    const createdProperties = await Promise.all(
      properties.map(async (property) => {
        // Assign random amenities to each property
        const randomAmenities = createdAmenities
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        return Property.create({
          ...property,
          owner: admin._id,
          amenities: randomAmenities.map(amenity => amenity._id)
        });
      })
    );

    return NextResponse.json({
      message: 'Database seeded successfully',
      data: {
        amenitiesCount: createdAmenities.length,
        propertiesCount: createdProperties.length,
        adminUser: admin.email
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
} 