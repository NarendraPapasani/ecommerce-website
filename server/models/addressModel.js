const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  addresses: [
    {
      addressId: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: Number,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      building: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      LandMark: {
        type: String,
        required: true,
      },
      town: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      defaultAddress: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
