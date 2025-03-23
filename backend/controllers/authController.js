const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Fix typo: JWT_SECRET
    const userId = decoded.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's profile data, including resumeUrl and coverLetterUrl
    res.status(200).json({
      username: user.username,
      email: user.email,
      resumeUrl: user.resumeUrl, // Add resumeUrl
      coverLetterUrl: user.coverLetterUrl, // Add coverLetterUrl
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};