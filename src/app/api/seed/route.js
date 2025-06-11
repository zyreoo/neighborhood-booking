import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';

const sampleProperties = [
  // San Mateo Properties
  {
    title: "Modern Studio in Downtown",
    location: "San Mateo",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    description: "Bright and modern studio in the heart of downtown",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2
  },
  {
    title: "Cozy Garden Cottage",
    location: "San Mateo",
    price: 180,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    description: "Peaceful cottage with beautiful garden views",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2
  },
  {
    title: "Luxury Condo with Bay View",
    location: "San Mateo",
    price: 250,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    description: "High-end condo with stunning bay views",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4
  },

  // Sausalito Properties
  {
    title: "Waterfront Villa",
    location: "Sausalito",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    description: "Luxurious villa with direct water access",
    bedrooms: 3,
    bathrooms: 2.5,
    maxGuests: 6
  },
  {
    title: "Artist's Loft",
    location: "Sausalito",
    price: 200,
    imageUrl: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9",
    description: "Creative space in the artistic heart of Sausalito",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2
  },
  {
    title: "Harbor View House",
    location: "Sausalito",
    price: 350,
    imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    description: "Classic house overlooking the beautiful harbor",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4
  },

  // Mill Valley Properties
  {
    title: "Redwood Retreat",
    location: "Mill Valley",
    price: 280,
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
    description: "Serene home surrounded by redwood trees",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4
  },
  {
    title: "Mountain View Cabin",
    location: "Mill Valley",
    price: 220,
    imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8",
    description: "Cozy cabin with stunning Mt. Tam views",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3
  },

  // Tiburon Properties
  {
    title: "Bay Front Estate",
    location: "Tiburon",
    price: 550,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    description: "Elegant estate with panoramic bay views",
    bedrooms: 4,
    bathrooms: 3.5,
    maxGuests: 8
  },
  {
    title: "Downtown Penthouse",
    location: "Tiburon",
    price: 400,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    description: "Luxury penthouse in the heart of Tiburon",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6
  },

  // San Carlos Properties
  {
    title: "Charming Craftsman",
    location: "San Carlos",
    price: 275,
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
    description: "Beautiful craftsman home in quiet neighborhood",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 5
  },
  {
    title: "Modern Townhouse",
    location: "San Carlos",
    price: 225,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
    description: "Contemporary townhouse near downtown",
    bedrooms: 2,
    bathrooms: 2.5,
    maxGuests: 4
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing properties
    await Property.deleteMany({});
    
    // Insert new properties
    const properties = await Property.insertMany(sampleProperties);
    
    return NextResponse.json({ 
      message: 'Database seeded successfully',
      count: properties.length 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 