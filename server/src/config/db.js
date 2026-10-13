import mongoose from 'mongoose';

let isConnected = false;
let connectionError = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('ℹ️ No MONGODB_URI provided in environment. Initializing local in-memory store adapter.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    connectionError = null;
    console.log(`✅ MongoDB Connected to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.warn(`⚠️ MongoDB connection failed (${error.message}). Falling back to local in-memory store.`);
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  error: connectionError,
  mode: isConnected ? 'MongoDB Atlas (Persistent)' : 'Development In-Memory Store (Resilient Fallback)'
});
