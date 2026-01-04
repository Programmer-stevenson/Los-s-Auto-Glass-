import express, { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { auth } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validation';

const router = express.Router();

// Register
router.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ email, password, firstName, lastName, phone });
    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/me', auth, async (req: Request, res: Response) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    const updates: any = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', auth, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Add vehicle
router.post('/vehicles', auth, async (req: Request, res: Response) => {
  try {
    const { make, model, year, vin, licensePlate, color } = req.body;

    await User.findByIdAndUpdate(
      req.user!._id,
      { $push: { vehicles: { make, model, year, vin, licensePlate, color } } }
    );

    res.status(201).json({ message: 'Vehicle added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Delete vehicle
router.delete('/vehicles/:index', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= user.vehicles.length) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    user.vehicles.splice(index, 1);
    await user.save();

    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove vehicle' });
  }
});

export default router;
