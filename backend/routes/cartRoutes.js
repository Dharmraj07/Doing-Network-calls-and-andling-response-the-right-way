const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();
router.get("/", cartController.getCartItems);
router.post("/add", cartController.addItem);
router.delete("/remove/:id", cartController.removeItem);
router.patch("/increase/:id", cartController.increaseQuantity);
router.patch("/decrease/:id", cartController.decreaseQuantity);

module.exports = router;
