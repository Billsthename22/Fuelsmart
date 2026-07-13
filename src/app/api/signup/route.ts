
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/api/lib/mongodb';
import User from '../model/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { fullName, email, address, password } = await request.json();

    // validate
    if (!fullName || !email || !address || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // prevent duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // hash & save
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      fullName,
      email,
      address,
      password: hashedPassword,
    });
    await user.save();

    // issue token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // strip password from response
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: userObj,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}