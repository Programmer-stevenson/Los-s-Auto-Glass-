import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: (err as any).path,
        message: err.msg
      }))
    });
    return;
  }
  next();
};

// User registration validation
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  handleValidationErrors
];

// Login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Booking validation
export const bookingValidation = [
  body('serviceId')
    .notEmpty()
    .withMessage('Service selection is required'),
  body('vehicle.make')
    .trim()
    .notEmpty()
    .withMessage('Vehicle make is required'),
  body('vehicle.model')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required'),
  body('vehicle.year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid vehicle year'),
  body('appointmentDate')
    .isISO8601()
    .withMessage('Please provide a valid appointment date'),
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required'),
  handleValidationErrors
];

// Contact form validation
export const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('service')
    .notEmpty()
    .withMessage('Please select a service'),
  body('message')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Message cannot exceed 2000 characters'),
  handleValidationErrors
];
