import { NextResponse } from 'next/server';
import { propertyModel } from '@/lib/firestore/propertyModel';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const guests = searchParams.get('guests');
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('limit')) || 10;

    const properties = await propertyModel.getProperties({
      city,
      minPrice,
      maxPrice,
      guests,
      page,
      pageSize
    });

    return NextResponse.json({
      properties,
      pagination: {
        current: page,
        pageSize
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
    const data = await request.json();
    const property = await propertyModel.create(data);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 