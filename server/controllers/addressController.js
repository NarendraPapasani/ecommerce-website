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

    // Validate required fields
    if (
      !fullName ||
      !mobileNumber ||
      !pincode ||
      !building ||
      !area ||
      !town ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        status: "error",
        message: "All required fields must be filled",
      });
    }

    let address = await Address.findOne({ email });
    if (!address) {
      address = new Address({
        email,
        addresses: [],
      });
    }

    // If this is set as default, make sure no other address is default
    if (defaultAddress) {
      address.addresses.forEach((addr) => {
        addr.defaultAddress = false;
      });
    }

    const newAddress = {
      addressId: Math.random().toString(36).substr(2, 9),
      country,
      fullName,
      mobileNumber,
      pincode,
      building,
      area,
      LandMark: LandMark || "",
      town,
      state,
      defaultAddress: defaultAddress || false,
    };

    address.addresses.push(newAddress);
    await address.save();

    res.status(200).json({
      status: "success",
      message: "Address added successfully",
      id: newAddress.addressId,
    });
  } catch (error) {
    console.error("Add address error:", error);
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
      return res.status(200).json({
        status: "success",
        address: { addresses: [] },
        message: "No addresses found",
      });
    }
    res.status(200).json({
      status: "success",
      address,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
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

    // Validate required fields
    if (
      !fullName ||
      !mobileNumber ||
      !pincode ||
      !building ||
      !area ||
      !town ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        status: "error",
        message: "All required fields must be filled",
      });
    }

    const address = await Address.findOne({ email });
    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }

    const addressToUpdate = address.addresses.find(
      (addr) => addr.addressId === addressId
    );

    if (!addressToUpdate) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }

    // If this is being set as default, make sure no other address is default
    if (defaultAddress) {
      address.addresses.forEach((addr) => {
        if (addr.addressId !== addressId) {
          addr.defaultAddress = false;
        }
      });
    }

    // Update the address
    addressToUpdate.country = country;
    addressToUpdate.fullName = fullName;
    addressToUpdate.mobileNumber = mobileNumber;
    addressToUpdate.pincode = pincode;
    addressToUpdate.building = building;
    addressToUpdate.area = area;
    addressToUpdate.LandMark = LandMark || "";
    addressToUpdate.town = town;
    addressToUpdate.state = state;
    addressToUpdate.defaultAddress = defaultAddress || false;

    await address.save();

    res.status(200).json({
      status: "success",
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Update address error:", error);
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
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }

    const addressToDelete = address.addresses.find(
      (addr) => addr.addressId === addressId
    );

    if (!addressToDelete) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }

    // Remove the address
    address.addresses = address.addresses.filter(
      (addr) => addr.addressId !== addressId
    );

    await address.save();

    res.status(200).json({
      status: "success",
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { email } = req.user;
    const address = await Address.findOne({ email });
    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }
    const addressToGet = address.addresses.filter(
      (address) => address._id.toString() === addressId
    );
    if (!addressToGet) {
      return res.status(404).json({
        status: "error",
        message: "Address not found",
      });
    }
    res.status(200).json({ status: "success", address: addressToGet });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  addAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
  getAddressById,
};
