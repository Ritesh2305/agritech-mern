import React, { useState, useEffect } from 'react';
import { Shield, Users, ShoppingBag, DollarSign, Activity, CheckCircle, Truck, PackageCheck, XCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

interface AdminDashboardPageProps {
  onRefresh: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onRefresh }) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');

  const loadAdminData = async () => {
    setIsLoading(true);
    const [statsData, ordersData, usersData] = await Promise.all([
      api.getAdminStats(),
      api.getAllOrders(),
      api.getAdminUsers(),
    ]);
    setStats(statsData);
    setOrders(ordersData);
    setUsers(usersData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    await api.updateOrderStatus(orderId, newStatus);
    await loadAdminData();
    onRefresh();
  };

  if (!isAdmin) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
        <Shield className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
          Administrator Access Required
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
          This management console is restricted to certified agricultural officers and depot administrators.
        </p>
        <span className="text-xs text-emerald-700 font-semibold">
          Tip: Click the User badge in the top navigation and select "Admin Dr. Rao" to access.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
          <span>Enterprise Administration</span>
          <span aria-hidden="true">·</span>
          <span>Role-Based Access Control</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {t.admin.title}
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          {t.admin.subtitle}
        </p>
      </div>

      {/* KPI Stats Strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Registered Users</span>
            <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {stats.totalUsers}
            </div>
            <span className="text-[11px] text-stone-500">{stats.farmersCount} Farmers Enrolled</span>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Total Revenue</span>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              ₹{stats.totalRevenue?.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-stone-500">Inputs & Machinery</span>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Order Fulfillment</span>
            <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {stats.pendingOrders} Pending
            </div>
            <span className="text-[11px] text-stone-500">{stats.totalOrders} Total Orders</span>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs text-stone-500 block mb-1">Active Pest Alerts</span>
            <div className="text-2xl font-bold font-mono tabular-nums text-rose-600">
              {stats.activeAlerts}
            </div>
            <span className="text-[11px] text-stone-500">Live Surveillance</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {t.admin.manageOrders} ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {t.admin.userRegistry} ({users.length})
        </button>
      </div>

      {activeTab === 'orders' ? (
        /* Order Fulfillment Queue */
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Farmer / Destination</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {orders.map(o => (
                  <tr key={o.id || o._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                        {o.shippingAddress?.fullName || 'Farmer'}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {o.shippingAddress?.village}, {o.shippingAddress?.district}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400 max-w-xs truncate">
                      {o.items?.map((it: any) => `${it.name} (×${it.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                      ₹{o.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          o.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : o.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : o.status === 'approved'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                            : o.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id || o._id, 'approved')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px]"
                          >
                            {t.admin.approve}
                          </button>
                        )}
                        {o.status === 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id || o._id, 'shipped')}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px]"
                          >
                            {t.admin.ship}
                          </button>
                        )}
                        {o.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id || o._id, 'delivered')}
                            className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[11px]"
                          >
                            {t.admin.deliver}
                          </button>
                        )}
                        {o.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id || o._id, 'rejected')}
                            className="px-2 py-1 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px]"
                          >
                            {t.admin.reject}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* User Registry */
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {users.map(u => (
                  <tr key={u.id || u._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-stone-100">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-stone-600 dark:text-stone-400">
                      {u.phone}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {u.region || 'India'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
