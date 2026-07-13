
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI not found in environment variables.');
    throw new Error('MONGO_URI is missing');
  }

  if (mongoose.connection.readyState) {
    console.log('✅ MongoDB is already connected.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    throw err;
  }
}
export async function disconnectDB() {
  if (mongoose.connection.readyState) {
    try {
      await mongoose.disconnect();
      console.log('✅ MongoDB Disconnected...');
    } catch (err) {
      console.error('❌ Error disconnecting from MongoDB:', err);
    }
  } else {
    console.log('✅ MongoDB was not connected.');
  }
}

export async function clearDB() {
  if (mongoose.connection.readyState) {
    try {
      await mongoose.connection.dropDatabase();
      console.log('✅ MongoDB Database Cleared...');
    } catch (err) {
      console.error('❌ Error clearing MongoDB database:', err);
    }
  } else {
    console.log('✅ MongoDB was not connected, nothing to clear.');
  }
}

export async function getDB() {
  if (mongoose.connection.readyState) {
    return mongoose.connection.db;
  } else {
    console.error('❌ MongoDB is not connected.');
    throw new Error('MongoDB is not connected');
  }
}