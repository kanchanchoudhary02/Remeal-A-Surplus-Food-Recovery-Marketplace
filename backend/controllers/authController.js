// controllers/authController.js

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, providerType, address } = req.body;

    // 1. Check karo user pehle se exist to nahi karta
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    // 2. Password ko hash karo (10 = "salt rounds" — jitna zyada, utna secure but slow)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. User ko database me banao
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      providerType,
      address,
    });

    // 4. Turant login jaisa experience dene ke liye token bhi bhej do
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Email se user dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 2. Diya gaya password aur stored hash compare karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // 3. Match ho gaya — token banao aur bhejo
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser };