import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create & save the user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });

    // If user not found or password is incorrect, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token with the user ID as the payload
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
