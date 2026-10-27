import mongoose from 'mongoose';

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.includes('<username>')) {
    console.log('[Database] No live MONGO_URI provided in .env. Running in resilient mock & fallback mode.');
    return false;
  }
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Resilient fallback mode enabled.`);
    return false;
  }
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
