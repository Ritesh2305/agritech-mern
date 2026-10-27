import { Request, Response, NextFunction } from 'express';
import {
  UserModel,
  FarmModel,
  CropModel,
  OrderModel,
  ResourceModel,
  SoilTestModel,
  ConsultationModel,
  ActivityLogModel,
  isMongoConnected,
} from '../models/index.ts';
import { fallbackStore } from '../state.ts';

// @desc    Get system-wide overview statistics
// @route   GET /api/v1/admin/stats
// @access  Private (Admin only)
export const getSystemStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (isMongoConnected()) {
      const [
        totalUsers,
        totalFarms,
        totalCrops,
        totalOrders,
        totalResources,
        totalSoilTests,
        totalConsultations,
      ] = await Promise.all([
        UserModel.countDocuments(),
        FarmModel.countDocuments(),
        CropModel.countDocuments(),
        OrderModel.countDocuments(),
        ResourceModel.countDocuments(),
        SoilTestModel.countDocuments(),
        ConsultationModel.countDocuments(),
      ]);

      const orders = await OrderModel.find();
      const revenue = orders.reduce((sum: number, ord: any) => sum + (ord.totalAmount || 0), 0);
      const pendingOrders = orders.filter((ord: any) => ord.status === 'pending').length;

      res.json({
        success: true,
        data: {
          totalUsers,
          totalFarms,
          totalCrops,
          totalOrders,
          totalRevenue: revenue,
          pendingOrders,
          totalResources,
          totalSoilTests,
          totalConsultations,
          systemStatus: 'Healthy',
          dbMode: 'MongoDB Atlas',
        },
      });
      return;
    }

    const totalRevenue = fallbackStore.orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = fallbackStore.orders.filter((o: any) => o.status === 'pending').length;

    res.json({
      success: true,
      data: {
        totalUsers: fallbackStore.users.length,
        totalFarms: fallbackStore.farms.length,
        totalCrops: fallbackStore.crops.length,
        totalOrders: fallbackStore.orders.length,
        totalRevenue,
        pendingOrders,
        totalResources: fallbackStore.resources.length,
        totalSoilTests: fallbackStore.soilTests.length,
        totalConsultations: fallbackStore.consultations.length,
        systemStatus: 'Healthy',
        dbMode: 'Local Fallback In-Memory',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users
// @route   GET /api/v1/admin/users
// @access  Private (Admin only)
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role, search } = req.query;

    if (isMongoConnected()) {
      const query: any = {};
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }
      const users = await UserModel.find(query).select('-password').sort({ createdAt: -1 });
      res.json({ success: true, count: users.length, data: users });
      return;
    }

    let users = fallbackStore.users.map((u: any) => {
      const { password, ...safeUser } = u as any;
      return safeUser;
    });

    if (role) {
      users = users.filter((u: any) => u.role === role);
    }
    if (search) {
      const s = String(search).toLowerCase();
      users = users.filter((u: any) =>
        u.name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        u.phone?.toLowerCase().includes(s)
      );
    }

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['farmer', 'admin', 'expert'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role specified' });
      return;
    }

    if (isMongoConnected()) {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      await ActivityLogModel.create({
        user: req.user?.id || req.user?._id,
        action: 'USER_ROLE_UPDATED',
        details: `Updated role of user ${user.name} (${user.email}) to ${role}`,
      });

      res.json({ success: true, data: user });
      return;
    }

    const user = fallbackStore.users.find((u: any) => u._id === id || u.id === id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.role = role;
    const { password, ...safeUser } = user as any;

    fallbackStore.activityLogs.unshift({
      _id: 'log-' + Date.now(),
      id: 'log-' + Date.now(),
      user: { _id: req.user?.id, name: req.user?.name || 'Admin', email: req.user?.email || '' },
      userName: req.user?.name || 'Admin',
      userRole: 'admin',
      action: 'USER_ROLE_UPDATED',
      details: `Updated role of user ${user.name} (${user.email}) to ${role}`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      await ActivityLogModel.create({
        user: req.user?.id || req.user?._id,
        action: 'USER_DELETED',
        details: `Deleted user ${user.name} (${user.email})`,
      });

      res.json({ success: true, message: 'User deleted successfully' });
      return;
    }

    const index = fallbackStore.users.findIndex((u: any) => u._id === id || u.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const deleted = fallbackStore.users.splice(index, 1)[0];
    fallbackStore.activityLogs.unshift({
      _id: 'log-' + Date.now(),
      id: 'log-' + Date.now(),
      user: { _id: req.user?.id, name: req.user?.name || 'Admin', email: req.user?.email || '' },
      userName: req.user?.name || 'Admin',
      userRole: 'admin',
      action: 'USER_DELETED',
      details: `Deleted user ${deleted.name} (${deleted.email})`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system activity audit logs
// @route   GET /api/v1/admin/logs
// @access  Private (Admin only)
export const getActivityLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = '50' } = req.query;
    const limitNum = parseInt(limit as string, 10) || 50;

    if (isMongoConnected()) {
      const logs = await ActivityLogModel.find()
        .populate('user', 'name email role')
        .sort({ timestamp: -1 })
        .limit(limitNum);

      res.json({ success: true, count: logs.length, data: logs });
      return;
    }

    const logs = fallbackStore.activityLogs.slice(0, limitNum);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
