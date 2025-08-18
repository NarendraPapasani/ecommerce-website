const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateToken } = require("../lib/utils/generateToken.js");
const {
  generateVerificationCode,
  sendEmailVerification,
  sendPasswordResetEmail,
} = require("../lib/utils/emailService.js");

// Google OAuth login
const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, profilePicture } = req.body;

    if (!email || !name || !googleId) {
      return res
        .status(400)
        .json({ msg: "Required Google user information missing" });
    }

    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProviders = user.authProviders || [];
        if (!user.authProviders.includes("google")) {
          user.authProviders.push("google");
        }
        if (profilePicture && !user.profilePicture) {
          user.profilePicture = profilePicture;
        }
        await user.save();
      }

      // Update login statistics
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id, res);

      return res.status(200).json({
        msg: "Google login successful",
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          favoriteCategory: user.favoriteCategory,
          agreeMarketing: user.agreeMarketing,
          profilePicture: user.profilePicture,
          authProviders: user.authProviders,
        },
      });
    } else {
      // Create new user from Google data
      const [firstName, ...lastNameParts] = name.split(" ");
      const lastName = lastNameParts.join(" ") || "";

      const newUser = new User({
        firstName,
        lastName,
        email,
        googleId,
        profilePicture: profilePicture || "",
        emailVerified: true, // Google emails are pre-verified
        authProviders: ["google"],
        loginCount: 1,
        lastLoginAt: new Date(),
        isTemporary: false,
        // Set default values for required fields
        phone: "", // Will be updated in profile
        dateOfBirth: new Date(), // Will be updated in profile
        gender: "prefer-not-to-say",
        favoriteCategory: "electronics", // Default category
        agreeMarketing: false,
      });

      const savedUser = await newUser.save();

      // Generate JWT token
      const token = generateToken(savedUser._id, res);

      return res.status(201).json({
        msg: "Google account created and logged in successfully",
        success: true,
        token,
        isNewUser: true, // Flag to indicate profile completion needed
        user: {
          id: savedUser._id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          phone: savedUser.phone,
          favoriteCategory: savedUser.favoriteCategory,
          agreeMarketing: savedUser.agreeMarketing,
          profilePicture: savedUser.profilePicture,
          authProviders: savedUser.authProviders,
        },
      });
    }
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ msg: "Server error during Google authentication" });
  }
};

// Send email verification code
const sendEmailVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.emailVerified) {
      return res
        .status(400)
        .json({ msg: "Email already verified and registered" });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification code temporarily (you might want to use Redis for this in production)
    if (existingUser) {
      existingUser.emailVerificationCode = verificationCode;
      existingUser.emailVerificationExpires = expirationTime;
      await existingUser.save();
    } else {
      // Create temporary user record for verification (minimal data)
      await User.create({
        email,
        emailVerificationCode: verificationCode,
        emailVerificationExpires: expirationTime,
        emailVerified: false,
        isTemporary: true,
      });
    }

    // Send email using centralized email service
    const emailSent = await sendEmailVerification(email, verificationCode);

    if (emailSent) {
      res.status(200).json({
        msg: "Verification code sent to your email",
        success: true,
      });
    } else {
      res.status(500).json({ msg: "Failed to send verification email" });
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ msg: "Failed to send verification email" });
  }
};

// Verify email code
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(400)
      .json({ msg: "Email and verification code are required" });
  }

  try {
    const user = await User.findOne({
      email,
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired verification code" });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      msg: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ msg: "Server error during verification" });
  }
};

const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    address,
    city,
    country,
    favoriteCategory,
    password,
    agreeMarketing,
  } = req.body;

  // Validate required fields
  if (
    !firstName ||
    !lastName ||
    !phone ||
    !dateOfBirth ||
    !gender ||
    !favoriteCategory ||
    !password
  ) {
    return res.status(400).json({
      msg: "All required fields must be provided: firstName, lastName, phone, dateOfBirth, gender, favoriteCategory, password",
    });
  }

  try {
    // Check if user exists and email is verified
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "Please verify your email first" });
    }

    // Check if user exists with Google auth only
    if (
      existingUser.authProviders?.includes("google") &&
      !existingUser.password
    ) {
      // User exists with Google auth, now adding email/password
      if (!existingUser.emailVerified) {
        return res
          .status(400)
          .json({ msg: "Email not verified. Please verify your email first" });
      }

      // Hash password and update user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      existingUser.password = hashedPassword;
      existingUser.phone = phone;
      existingUser.dateOfBirth = new Date(dateOfBirth);
      existingUser.gender = gender;
      existingUser.address = address || "";
      existingUser.city = city || "";
      existingUser.country = country || "";
      existingUser.favoriteCategory = favoriteCategory;
      existingUser.agreeMarketing = agreeMarketing || false;

      // Add email to auth providers
      if (!existingUser.authProviders.includes("email")) {
        existingUser.authProviders.push("email");
      }

      const updatedUser = await existingUser.save();

      // Generate JWT token
      const token = generateToken(updatedUser._id, res);

      return res.status(200).json({
        msg: "Password added successfully to your Google account",
        success: true,
        token,
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          favoriteCategory: updatedUser.favoriteCategory,
          authProviders: updatedUser.authProviders,
        },
      });
    }

    if (!existingUser.emailVerified) {
      return res
        .status(400)
        .json({ msg: "Email not verified. Please verify your email first" });
    }

    // Check if this is a temporary user record (created during email verification)
    if (existingUser.isTemporary) {
      // Update the temporary record with actual user data
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.phone = phone;
      existingUser.dateOfBirth = new Date(dateOfBirth);
      existingUser.gender = gender;
      existingUser.address = address || "";
      existingUser.city = city || "";
      existingUser.country = country || "";
      existingUser.favoriteCategory = favoriteCategory;
      existingUser.password = hashedPassword;
      existingUser.agreeMarketing = agreeMarketing || false;
      existingUser.isTemporary = false;
      existingUser.authProviders = ["email"];

      const updatedUser = await existingUser.save();

      // Generate JWT token
      const token = generateToken(updatedUser._id, res);

      res.status(201).json({
        msg: "Account created successfully",
        success: true,
        token,
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          favoriteCategory: updatedUser.favoriteCategory,
        },
      });
    } else {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error during signup" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "No account found with this email address" });
    }

    // Check if user only has Google auth (no password set)
    if (
      user.authProviders &&
      user.authProviders.includes("google") &&
      !user.password
    ) {
      return res.status(400).json({
        msg: "This email is registered with Google. Please use Google Sign-In or set a password first.",
        requiresGoogleAuth: true,
      });
    }

    // Check if email is verified (for email/password users)
    if (!user.emailVerified && !user.authProviders?.includes("google")) {
      return res
        .status(400)
        .json({ msg: "Please verify your email before logging in" });
    }

    // Check if this is a temporary user record
    if (user.isTemporary) {
      return res
        .status(400)
        .json({ msg: "Please complete your registration first" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // Update login statistics
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;

    // Add email/password to auth providers if not already present
    if (!user.authProviders) {
      user.authProviders = ["email"];
    } else if (!user.authProviders.includes("email")) {
      user.authProviders.push("email");
    }

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, res);

    res.status(200).json({
      msg: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        favoriteCategory: user.favoriteCategory,
        agreeMarketing: user.agreeMarketing,
        profilePicture: user.profilePicture,
        authProviders: user.authProviders,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select(
      "-password -emailVerificationCode -emailVerificationExpires"
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    address,
    city,
    country,
    favoriteCategory,
    agreeMarketing,
    bio,
    website,
    occupation,
    company,
    socialLinks,
    preferences,
    shippingPreferences,
    privacy,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update basic fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (gender) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (country !== undefined) user.country = country;
    if (favoriteCategory) user.favoriteCategory = favoriteCategory;
    if (agreeMarketing !== undefined) user.agreeMarketing = agreeMarketing;

    // Update enhanced fields
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (occupation !== undefined) user.occupation = occupation;
    if (company !== undefined) user.company = company;

    // Update social links
    if (socialLinks) {
      user.socialLinks = { ...user.socialLinks, ...socialLinks };
    }

    // Update preferences
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    // Update shipping preferences
    if (shippingPreferences) {
      user.shippingPreferences = {
        ...user.shippingPreferences,
        ...shippingPreferences,
      };
    }

    // Update privacy settings
    if (privacy) {
      user.privacy = { ...user.privacy, ...privacy };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      msg: "Profile updated successfully",
      success: true,
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        address: updatedUser.address,
        city: updatedUser.city,
        country: updatedUser.country,
        favoriteCategory: updatedUser.favoriteCategory,
        agreeMarketing: updatedUser.agreeMarketing,
        bio: updatedUser.bio,
        website: updatedUser.website,
        occupation: updatedUser.occupation,
        company: updatedUser.company,
        socialLinks: updatedUser.socialLinks,
        preferences: updatedUser.preferences,
        shippingPreferences: updatedUser.shippingPreferences,
        privacy: updatedUser.privacy,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ msg: "Profile picture URL is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.profilePicture = profilePicture;
    await user.save();

    res.status(200).json({
      msg: "Profile picture updated successfully",
      success: true,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        msg: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        msg: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      msg: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user statistics
const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    // You can expand this to include order history, cart statistics, etc.
    const user = await User.findById(userId).select(
      "createdAt loginCount lastLoginAt"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const stats = {
      memberSince: user.createdAt,
      totalLogins: user.loginCount || 0,
      lastLogin: user.lastLoginAt,
      // Add more statistics as needed
    };

    res.status(200).json({
      success: true,
      statistics: stats,
    });
  } catch (error) {
    console.error("Get user statistics error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Send email change verification
const sendEmailChangeVerification = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const userId = req.user.id;

    if (!newEmail || !password) {
      return res
        .status(400)
        .json({ msg: "New email and password are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Check if new email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ msg: "Email is already in use" });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store verification code temporarily
    user.emailChangeCode = verificationCode;
    user.emailChangeExpires = expirationTime;
    user.newEmail = newEmail;
    await user.save();

    // Send email verification
    const emailSent = await sendEmailVerification(newEmail, verificationCode);

    if (emailSent) {
      res.status(200).json({
        msg: "Verification code sent to your new email",
        success: true,
      });
    } else {
      res.status(500).json({ msg: "Failed to send verification email" });
    }
  } catch (error) {
    console.error("Send email change verification error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Verify email change
const verifyEmailChange = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userId = req.user.id;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify OTP and check expiration
    if (
      user.emailChangeCode !== otp ||
      !user.emailChangeExpires ||
      user.emailChangeExpires < new Date() ||
      user.newEmail !== email
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid or expired verification code" });
    }

    // Update email
    user.email = user.newEmail;
    user.emailChangeCode = undefined;
    user.emailChangeExpires = undefined;
    user.newEmail = undefined;
    await user.save();

    res.status(200).json({
      msg: "Email changed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Verify email change error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      msg: "Account deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  googleAuth,
  sendEmailVerificationCode,
  verifyEmailCode,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  changePassword,
  getUserStatistics,
  sendEmailChangeVerification,
  verifyEmailChange,
  deleteAccount,
  logout,
};
