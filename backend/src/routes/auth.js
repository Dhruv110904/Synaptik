const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const EmailOTP = require("../models/EmailOTP");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();




router.post("/register/request-otp", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();


  await EmailOTP.deleteMany({ email });

  await EmailOTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });

  await sendEmail({
    to: email,
    subject: "Your Synaptik OTP",
    html: `
      <h2>Verify your email</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `,
  });

  res.json({ message: "OTP sent to email" });
});


router.post("/register/resend-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const record = await EmailOTP.findOne({ email });
  if (!record) {
    return res.status(400).json({ message: "OTP session not found. Register again." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  record.otp = otp;
  record.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await record.save();

  await sendEmail({
    to: email,
    subject: "Your new Synaptik OTP",
    html: `
      <h2>New OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `,
  });

  res.json({ message: "OTP resent successfully" });
});



router.post("/register/verify-otp", async (req, res) => {
  const { name, username, email, password, otp } = req.body;

  if (!name || !username || !email || !password || !otp) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const record = await EmailOTP.findOne({ email, otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    passwordHash,
  });

  await EmailOTP.deleteMany({ email });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
    },
  });
});



router.post("/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
    },
  });
});



router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
