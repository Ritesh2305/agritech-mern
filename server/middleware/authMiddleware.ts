import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.ts';

export interface AuthRequest extends Request {
  user?: any;
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'agritech_jwt_secure_agricultural_secret_key_2026';
    const decoded: any = jwt.verify(token, secret);

    // In MongoDB mode: check user existence in DB if connected
    if (User.db?.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Resilient fallback / mock mode: populate decoded token payload
    req.user = {
      _id: decoded.id,
      id: decoded.id,
      role: decoded.role || 'farmer',
      name: decoded.name || 'AgriTech User',
      email: decoded.email || 'user@agritech.org',
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token validation failed or expired',
    });
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user?.role || 'guest'}' does not have permission for this resource`,
      });
    }
    next();
  };
}
