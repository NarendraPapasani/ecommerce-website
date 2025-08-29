const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    favoriteCategory: {
      type: String,
      enum: [
        "electronics",
        "clothing",
        "clothes", // Alternative for clothing
        "home",
        "furniture", // Alternative for home/furniture
        "beauty",
        "sports",
        "books",
        "toys",
        "shoes", // Shoes & Footwear
        "miscellaneous", // Miscellaneous items
      ],
    },
    password: {
      type: String,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    agreeMarketing: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    isTemporary: {
      type: Boolean,
      default: false,
    },
    // Enhanced profile fields
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProviders: [
      {
        type: String,
        enum: ["email", "google"],
      },
    ],
    socialLinks: {
      twitter: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      linkedin: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      language: {
        type: String,
        default: "en",
      },
      currency: {
        type: String,
        default: "INR",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: false,
        },
        push: {
          type: Boolean,
          default: true,
        },
        marketing: {
          type: Boolean,
          default: false,
        },
      },
    },
    shippingPreferences: {
      preferredDeliveryTime: {
        type: String,
        enum: ["morning", "afternoon", "evening", "no-preference"],
        default: "no-preference",
      },
      specialInstructions: {
        type: String,
        maxlength: 200,
        trim: true,
      },
    },
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastLoginAt: {
      type: Date,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    // Privacy settings
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
    },
    // Email change fields
    emailChangeCode: {
      type: String,
    },
    emailChangeExpires: {
      type: Date,
    },
    newEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
