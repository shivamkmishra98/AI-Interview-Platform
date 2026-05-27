const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../services/mailService');

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    
    // Normalize email
    if (email) email = email.toLowerCase().trim();

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Normalize email
    if (email) email = email.toLowerCase().trim();

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (email) email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5174'}/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    // Development Helper: Log the URL so the developer can click it without setting up SMTP
    console.log(`\n\n--------------------------------------------`);
    console.log(`PASSWORD RESET URL:`);
    console.log(`${resetUrl}`);
    console.log(`--------------------------------------------\n\n`);

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
        resetUrl
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log('Email provider not configured. Falling back to dev mode console link.');
      
      // In a real production app, we would throw a 500 error here.
      // But for development/portfolio purposes, we return 200 so the frontend can proceed,
      // and the user can just click the link in the terminal!
      res.status(200).json({ success: true, data: 'Email simulated (check terminal for link)' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid token or token expired' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
