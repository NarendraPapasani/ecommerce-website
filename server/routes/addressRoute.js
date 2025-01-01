const express = require("express");

const router = express.Router();

const addressController = require("../controllers/addressController");

router.post("/add", addressController.addAddress);

router.get("/all", addressController.getAllAddress);

router.put("/update/:addressId", addressController.updateAddress);

router.delete("/delete/:addressId", addressController.deleteAddress);

module.exports = router;
