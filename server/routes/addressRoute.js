const express = require("express");

const router = express.Router();

const addressController = require("../controllers/addressController");
const {
  authenticateController,
} = require("../middleware/authenticateController");

router.post("/add", authenticateController, addressController.addAddress);

router.get("/all", authenticateController, addressController.getAllAddress);

router.get(
  "/:addressId",
  authenticateController,
  addressController.getAddressById
);

router.put(
  "/update/:addressId",
  authenticateController,
  addressController.updateAddress
);

router.delete(
  "/delete/:addressId",
  authenticateController,
  addressController.deleteAddress
);

module.exports = router;
