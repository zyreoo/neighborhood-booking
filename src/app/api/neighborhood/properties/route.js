import { NextResponse } from 'next/server';
import connectNeighborhoodDB from '@/lib/mongodb-neighborhood';
import Property from '@/models/neighborhood/Property';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const guests = searchParams.get('guests');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    await connectNeighborhoodDB();
    
    let query = {};
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    const skip = (page - 1) * limit;
    
    const [properties, total] = await Promise.all([
      Property.find(query)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 }),
      Property.countDocuments(query)
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectNeighborhoodDB();
    const data = await request.json();
    
    const property = await Property.create(data);
    
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 