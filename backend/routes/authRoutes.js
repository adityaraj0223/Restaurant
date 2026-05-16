const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register or Update User Profile
router.post('/profile', async (req, res) => {
  try {
    const { email, phone, name, address, city, state, pincode, avatar } = req.body;
    
    // Find by email or phone
    let user;
    if (email) user = await User.findOne({ email });
    if (!user && phone) user = await User.findOne({ phone });

    if (user) {
      // Update existing
      user.name = name || user.name;
      user.address = address || user.address;
      user.city = city || user.city;
      user.state = state || user.state;
      user.pincode = pincode || user.pincode;
      if (avatar) user.avatar = avatar;
      await user.save();
      return res.status(200).json({ success: true, user });
    } else {
      // Create new
      user = new User({ name, email, phone, address, city, state, pincode, avatar });
      await user.save();
      return res.status(201).json({ success: true, user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get User Profile
router.get('/:identifier', async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.params.identifier }, { phone: req.params.identifier }]
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
