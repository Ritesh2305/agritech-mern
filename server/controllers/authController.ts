import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel, ActivityLogModel, isMongoConnected } from '../models/index.ts';
import { fallbackStore } from '../state.ts';

const generateToken = (id: string, role: string, email: string): string => {
  const secret = process.env.JWT_SECRET || 'agritech_jwt_secure_agricultural_secret_key_2026';
  return (jwt.sign as any)({ id, role, email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user (farmer/admin)
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phone, role = 'farmer', language = 'en', region } = req.body;

    if (isMongoConnected()) {
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        res.status(400).json({ success: false, message: 'User already exists with this email' });
        return;
      }

      const user = await UserModel.create({
        name,
        email,
        password,
        phone,
        role,
        language,
        region: region || 'Telangana, India',
      });

      const token = generateToken(user._id.toString(), user.role, user.email);

      await ActivityLogModel.create({
        user: user._id,
        action: 'USER_REGISTERED',
        details: `Farmer ${user.name} registered account with role: ${user.role}`,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          language: user.language,
          region: user.region,
        },
      });
      return;
    }

    // In-memory fallback
    const existing = fallbackStore.users.find(u => u.email === email);
    if (existing) {
      res.status(400).json({ success: false, message: 'User already exists with this email' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: 'usr_' + Date.now(),
      id: 'usr_' + Date.now(),
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      language,
      region: region || 'Telangana, India',
      createdAt: new Date().toISOString(),
    };

    fallbackStore.users.push(newUser);
    fallbackStore.activityLogs.unshift({
      _id: 'log-' + Date.now(),
      id: 'log-' + Date.now(),
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      userName: newUser.name,
      userRole: newUser.role,
      action: 'USER_REGISTERED',
      details: `Farmer ${newUser.name} registered account with role: ${newUser.role}`,
      timestamp: new Date().toISOString(),
    });

    const token = generateToken(newUser._id, newUser.role, newUser.email);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        language: newUser.language,
        region: newUser.region,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (isMongoConnected()) {
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(user._id.toString(), user.role, user.email);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          language: user.language,
          region: user.region,
        },
      });
      return;
    }

    // In-memory fallback
    const user = fallbackStore.users.find(u => u.email === email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // Support plain password or bcrypt
    const isMatch = password === user.password || (await bcrypt.compare(password, user.password).catch(() => false));
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id || user.id, user.role, user.email);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        language: user.language,
        region: user.region,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (isMongoConnected()) {
      const user = await UserModel.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, data: user });
      return;
    }

    const user = fallbackStore.users.find(u => u._id === userId || u.id === userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const { password, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear session
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Quick demo persona login
// @route   POST /api/v1/auth/demo
// @access  Public
export const demoLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role = 'farmer' } = req.body;
    let targetUser: any;

    if (isMongoConnected()) {
      targetUser = await UserModel.findOne({ role });
    }

    if (!targetUser) {
      targetUser = fallbackStore.users.find(u => u.role === role) || fallbackStore.users[0];
    }

    if (!targetUser) {
      res.status(404).json({ success: false, message: 'Demo persona not found' });
      return;
    }

    const token = generateToken(targetUser._id || targetUser.id, targetUser.role, targetUser.email);

    res.json({
      success: true,
      token,
      user: {
        id: targetUser._id || targetUser.id,
        _id: targetUser._id || targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
        language: targetUser.language,
        region: targetUser.region,
      },
    });
  } catch (error) {
    next(error);
  }
};
