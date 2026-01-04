import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../types';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Verify JWT token
export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key') as JwtPayload;
    
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid token or user not found.' });
      return;
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if ((error as Error).name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token.' });
      return;
    }
    if ((error as Error).name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired. Please login again.' });
      return;
    }
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

// Optional auth - allows both authenticated and guest access
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key') as JwtPayload;
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

// Admin only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

// Admin or technician middleware
export const staffOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && ['admin', 'technician'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Staff privileges required.' });
  }
};
