import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectNeighborhoodDB from '@/lib/mongodb-neighborhood';
import User from '@/models/neighborhood/User';

export async function GET() {
  try {
    await connectNeighborhoodDB();
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      return NextResponse.json({ message: 'Test user already exists', user: existingUser });
    }

    // Create a test user
    const hashedPassword = await bcrypt.hash('test123', 12);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      phoneNumber: '1234567890',
      role: 'user'
    });

    return NextResponse.json({ 
      message: 'Test user created successfully', 
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 