import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("Deepusharma07", 10);

  const admin = new User({
    name: "Deeptanshu Admin",
    email: "deepusteam1011@gmail.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });

  await admin.save();
  console.log("✅ Admin created:", admin.email);
  mongoose.disconnect();
};

createAdmin();
