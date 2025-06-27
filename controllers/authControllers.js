import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      isBusiness,
      companyName,
      address,
      city,
      state,
      pinCode,
      password,
      confirmPassword,
      BusinessType,
      agreeToTerms
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      isBusiness: isBusiness || false,
      companyName: isBusiness ? companyName : "",
      address,
      city,
      state,
      pinCode,
      password: hashedPassword,
      BusinessType: isBusiness ? BusinessType : "",
      agreeToTerms: agreeToTerms || false,
    });

    // Save user to database
    await user.save();

    // Return success response
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isBusiness: user.isBusiness
      }
    });
    console.log("User registered:", user.email);

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    token,
    user: { id: user._id, email: user.email, isBusiness: user.isBusiness, isAdmin: user.isAdmin ,firstName: user.firstName, lastName: user.lastName },
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ message: "Password reset link has been sent to your email" });
};
