import express from 'express';

import jwt from 'jsonwebtoken';

import User from '../models/User.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

// GENERATE JWT TOKEN
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 * @access  Public
 */
router.post(
  '/register',
  async (req, res) => {
    try {
      const {
        username,
        email,
        password,
      } = req.body;

      // VALIDATION
      if (
        !username ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            'Please enter all fields',
        });
      }

      // CHECK USER
      const userExists =
        await User.findOne({
          email,
        });

      if (userExists) {
        return res.status(400).json({
          message:
            'User already exists with this email',
        });
      }

      // CREATE USER
      const user =
        await User.create({
          username,
          email,
          password,
        });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(
          user._id
        ),
      });
    } catch (error) {
      console.error(
        'Register Error:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Server error during registration',
      });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  async (req, res) => {
    try {
      const { email, password } =
        req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            'Please enter all fields',
        });
      }

      // FIND USER
      const user =
        await User.findOne({
          email,
        }).select('+password');

      // CHECK PASSWORD
      if (
        user &&
        (await user.matchPassword(
          password
        ))
      ) {
        res.json({
          _id: user._id,
          username:
            user.username,
          email: user.email,
          token: generateToken(
            user._id
          ),
        });
      } else {
        res.status(401).json({
          message:
            'Invalid email or password',
        });
      }
    } catch (error) {
      console.error(
        'Login Error:',
        error
      );

      res.status(500).json({
        message:
          error.message ||
          'Server error during login',
      });
    }
  }
);

/**
 * @route   POST /api/auth/google-login
 * @desc    Google Login
 * @access  Public
 */
router.post(
  '/google-login',
  async (req, res) => {
    try {
      const {
        username,
        email,
      } = req.body;

      if (!email) {
        return res.status(400).json({
          message:
            'Google email missing',
        });
      }

      // CHECK USER
      let user =
        await User.findOne({
          email,
        });

      // CREATE USER IF NOT EXISTS
      if (!user) {
        user =
          await User.create({
            username,
            email,
            googleAuth: true,
          });
      }

      // RETURN TOKEN
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(
          user._id
        ),
      });
    } catch (error) {
      console.error(
        'Google Login Error:',
        error
      );

      res.status(500).json({
        message:
          'Google login failed',
      });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get(
  '/me',
  protect,
  async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error(
        'Profile Error:',
        error
      );

      res.status(500).json({
        message:
          'Server error retrieving profile',
      });
    }
  }
);

export default router;