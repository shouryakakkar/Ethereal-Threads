const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ... existing code ...

// Save shipping address
exports.saveShippingAddress = async (req, res) => {
  try {
    console.log('Received shipping address data:', req.body);
    const { street, city, state, postalCode, country, isDefault } = req.body;

    // Validate required fields
    if (!street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        details: {
          street: !street ? 'Street is required' : null,
          city: !city ? 'City is required' : null,
          state: !state ? 'State is required' : null,
          postalCode: !postalCode ? 'Postal code is required' : null
        }
      });
    }

    // If this is set as default, unset any existing default address
    if (isDefault) {
      console.log('Unsetting existing default address for user:', req.user._id);
      await User.updateMany(
        { _id: req.user._id, 'shippingAddresses.isDefault': true },
        { $set: { 'shippingAddresses.$.isDefault': false } }
      );
    }

    // Add new address
    console.log('Adding new shipping address for user:', req.user._id);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          shippingAddresses: {
            street,
            city,
            state,
            postalCode,
            country: country || 'India',
            isDefault: isDefault || false
          }
        }
      },
      { new: true }
    );

    if (!user) {
      console.error('User not found:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Successfully saved shipping address');
    res.json({
      success: true,
      message: 'Shipping address saved successfully',
      shippingAddresses: user.shippingAddresses
    });
  } catch (error) {
    console.error('Error saving shipping address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save shipping address',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get user's shipping addresses
exports.getShippingAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('shippingAddresses');
    
    res.json({
      success: true,
      shippingAddresses: user.shippingAddresses
    });
  } catch (error) {
    console.error('Error fetching shipping addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch shipping addresses',
      error: error.message
    });
  }
};

// Set default shipping address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // First, unset any existing default address
    await User.updateMany(
      { _id: req.user._id, 'shippingAddresses.isDefault': true },
      { $set: { 'shippingAddresses.$.isDefault': false } }
    );

    // Set the new default address
    const user = await User.findOneAndUpdate(
      { 
        _id: req.user._id,
        'shippingAddresses._id': addressId
      },
      { 
        $set: { 'shippingAddresses.$.isDefault': true }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Default address updated successfully',
      shippingAddresses: user.shippingAddresses
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message
    });
  }
}; 