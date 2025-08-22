const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB connected to: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
