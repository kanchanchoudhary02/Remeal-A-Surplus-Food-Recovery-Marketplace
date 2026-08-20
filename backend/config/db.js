// config/db.js
// Ye file sirf ek kaam karti hai: MongoDB Atlas se connection banana.
// Isko alag file me isliye rakha hai taaki server.js saaf-suthra rahe
// aur DB connection logic ek hi jagah manage ho.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // process.env.MONGO_URI .env file se aayega (secret hai, isliye hardcode nahi karte)
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Agar DB hi connect nahi hua, to server chalne ka koi fayda nahi — isliye process exit
    process.exit(1);
  }
};

export default connectDB;
