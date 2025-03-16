require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// User Schema & Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Code Schema & Model
const CodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  html: String,
  css: String,
  js: String,
  createdAt: { type: Date, default: Date.now },
});

const Code = mongoose.model("Code", CodeSchema);

// Middleware to Verify JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Fix token extraction

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Invalid Token:", error);
    res.status(400).json({ message: "Invalid Token" });
  }
};


// Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Save Code Route (Authenticated Users Only)
// Save Code Route (Authenticated Users Only)
app.post("/save-code", authenticate, async (req, res) => {
  try {
    const { html, css, js } = req.body;

    console.log("Received Code Data:", { html, css, js, userId: req.user.id });

    const newCode = new Code({
      userId: req.user.id, // Extracted from token in `authenticate` middleware
      html,
      css,
      js,
    });

    await newCode.save();
    res.status(201).json({ message: "Code saved successfully!" });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Get Saved Codes (Authenticated Users Only)
app.get("/get-codes", authenticate, async (req, res) => {
  try {
    const codes = await Code.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    console.log("Fetched Codes for user:", req.user.id, codes); // Debug log
    res.json(codes);
  } catch (error) {
    console.error("Error fetching codes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// Delete a saved code
app.delete("/delete-code/:id", authenticate, async (req, res) => {
  try {
    console.log("🗑️ Received delete request for ID:", req.params.id); // Debugging

    const deletedCode = await Code.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // Ensure user owns the code
    });

    if (!deletedCode) {
      console.log("❌ Code not found or unauthorized.");
      return res
        .status(404)
        .json({ message: "Code not found or unauthorized" });
    }

    console.log("✅ Code deleted successfully!");
    res.json({ message: "Code deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting code:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/user-profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
