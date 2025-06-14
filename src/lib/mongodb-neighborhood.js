import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI_NEIGHBORHOOD || 'mongodb+srv://user1:qwerty12345@cluster0.dvrmlra.mongodb.net/neighborhood?retryWrites=true&w=majority&appName=Cluster0';

let cached = global.mongooseNeighborhood;

if (!cached) {
  cached = global.mongooseNeighborhood = { conn: null, promise: null };
}

async function connectNeighborhoodDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).catch((err) => {
      console.error('MongoDB Neighborhood connection error:', err);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB Neighborhood connected successfully');
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Neighborhood connection failed:', e);
    throw e;
  }

  return cached.conn;
}

export default connectNeighborhoodDB; 