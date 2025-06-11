import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Property from '@/models/Property';

export async function GET(request) {
  try {
    await connectDB();
    const properties = await Property.find();
    return NextResponse.json(properties);
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
    await connectDB();
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