const CartItem = require("../models/CartItem");

// Get all cart items
exports.getCartItems = async (req, res) => {
    try {
      // Fetch all cart items from the database
      const cartItems = await CartItem.find();
  
      // Respond with the list of items
      res.status(200).json(cartItems);
    } catch (err) {
      // Handle errors
      res.status(500).json({ error: err.message });
    }
  };

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const { id, name, price } = req.body;
    let cartItem = await CartItem.findOne({ id });

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cartItem = new CartItem({ id, name, price });
    }

    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findOneAndDelete({ id });
    res.status(200).send(`Item with id ${id} removed`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Increase item quantity
exports.increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findOne({ id });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
      res.status(200).json(cartItem);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Decrease item quantity
exports.decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findOne({ id });

    if (cartItem) {
      cartItem.quantity -= 1;

      if (cartItem.quantity <= 0) {
        await CartItem.findOneAndDelete({ id });
        res.status(200).send(`Item with id ${id} removed`);
      } else {
        await cartItem.save();
        res.status(200).json(cartItem);
      }
    } else {
      res.status(404).send('Item not found');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
