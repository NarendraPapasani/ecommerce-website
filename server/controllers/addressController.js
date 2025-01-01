const Address = require("../models/addressModel");

const addAddress = async (req, res) => {
  try {
    const { email } = req.user;
    const {
      country,
      fullName,
      mobileNumber,
      pincode,
      building,
      area,
      LandMark,
      town,
      state,
      defaultAddress,
    } = req.body;

    let address = await Address.findOne({ email });
    if (!address) {
      address = new Address({
        email,
        addresses: [],
      });
    }

    const newAddress = {
      addressId: Math.random().toString(36).substr(2, 7),
      country,
      fullName,
      mobileNumber,
      pincode,
      building,
      area,
      LandMark,
      town,
      state,
      defaultAddress,
    };

    address.addresses.push(newAddress);
    await address.save();

    res.json({
      status: "success",
      message: "Address added successfully",
      id: newAddress.addressId,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllAddress = async (req, res) => {
  try {
    const { email } = req.user;
    const address = await Address.findOne({ email });
    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }
    res.status(201).json({ status: "success", address });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { email } = req.user;
    const { addressId } = req.params;
    const {
      country,
      fullName,
      mobileNumber,
      pincode,
      building,
      area,
      LandMark,
      town,
      state,
      defaultAddress,
    } = req.body;
    const address = await Address.findOne({ email });
    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }
    const addressToUpdate = address.addresses.find(
      (address) => address.addressId === addressId
    );
    if (addressToUpdate) {
      addressToUpdate.country = country;
      addressToUpdate.fullName = fullName;
      addressToUpdate.mobileNumber = mobileNumber;
      addressToUpdate.pincode = pincode;
      addressToUpdate.building = building;
      addressToUpdate.area = area;
      addressToUpdate.LandMark = LandMark;
      addressToUpdate.town = town;
      addressToUpdate.state = state;
      addressToUpdate.defaultAddress = defaultAddress;
      await address.save();
      res.status(201).json({
        status: "success",
        message: "Address updated successfully",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { email } = req.user;
    const { addressId } = req.params;
    const address = await Address.findOne({ email });
    if (!address) {
      return res
        .status(404)
        .json({ status: "error", message: "Address not found" });
    }
    const addressToDelete = address.addresses.find(
      (address) => address.addressId === addressId
    );
    if (addressToDelete) {
      address.addresses = address.addresses.filter(
        (address) => address.addressId !== addressId
      );
      await address.save();
      res
        .status(201)
        .json({ status: "success", message: "Address deleted successfully" });
    } else {
      res.status(404).json({ status: "error", message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { addAddress, getAllAddress, updateAddress, deleteAddress };
