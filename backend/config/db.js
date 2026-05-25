import mongoose from 'mongoose';

// Global flag to track connection state
global.dbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    global.dbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    global.dbConnected = false;
    console.error('==================================================');
    console.error('DATABASE WARNING: MongoDB connection failed!');
    console.error(`Error: ${error.message}`);
    console.error('Lumina AI will run in Mock database mode.');
    console.error('History logs and Auth will be restricted.');
    console.error('Please configure MONGO_URI inside backend/.env.');
    console.error('==================================================');
    // We do NOT call process.exit(1) so the backend server stays alive 
    // and returns structured health checks and AI generations.
  }
};

export default connectDB;
