import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, Minus, Trash2, CheckCircle2, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { OrderTimeline } from '../components/OrderTimeline.tsx';
import { api } from '../services/api.ts';

interface MarketplacePageProps {
  resources: any[];
  orders: any[];
  onRefresh: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  resources,
  orders,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const { items, addItem, removeItem, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  // Checkout address state
  const [fullName, setFullName] = useState(user?.name || 'Ramesh Patel');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [village, setVillage] = useState('Wardhannapet');
  const [district, setDistrict] = useState('Warangal');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('506313');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Kisan Credit Card' | 'UPI / NetBanking'>('Cash on Delivery');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  const categories = [
    'All',
    'Seeds',
    'Fertilizers',
    'Organic Pesticides',
    'Tools & Machinery',
    'Irrigation Equipment',
  ];

  const filteredResources = resources.filter(res => {
    const matchesCat = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);

    const orderPayload = {
      items: items.map(i => ({
        resourceId: i.resourceId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
      })),
      shippingAddress: {
        fullName,
        phone,
        village,
        district,
        state,
        pincode,
      },
      paymentMethod,
    };

    const newOrder = await api.placeOrder(orderPayload);
    setIsOrdering(false);
    clearCart();
    setShowCheckoutModal(false);
    setOrderSuccessMsg(`Order #${newOrder.orderNumber || 'New'} placed successfully!`);
    setActiveTab('orders');
    onRefresh();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/organic_seeds_resources_1793110538678.jpg"
            alt="Agricultural inputs"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <span>Direct Agri-Depot</span>
            <span aria-hidden="true">·</span>
            <span>Government Subsidies Verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {t.market.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {t.market.subtitle}
          </p>
        </div>
      </div>

      {orderSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">{orderSuccessMsg}</span>
          </div>
          <button
            onClick={() => setOrderSuccessMsg('')}
            className="text-stone-500 hover:text-stone-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs: Catalog vs Order Tracking */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'catalog'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Product Catalog ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {t.market.orderHistory} ({orders.length})
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Catalog */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.common.search}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category Segmented Control */}
              <div className="flex overflow-x-auto gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                      activeCategory === cat
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(res => {
                const inCartItem = items.find(i => i.resourceId === res.id);
                return (
                  <div
                    key={res.id}
                    className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                        <span>{res.category}</span>
                        {res.subsidyEligible && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            Subsidy
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                        {res.name}
                      </h4>

                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                        {res.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-base font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                            ₹{res.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-stone-500"> / {res.unit}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 font-mono tabular-nums">
                          {res.stock} In Stock
                        </span>
                      </div>

                      {inCartItem ? (
                        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(res.id, -1)}
                            className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-200">
                            {inCartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(res.id, 1)}
                            className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            addItem({
                              resourceId: res.id,
                              name: res.name,
                              price: res.price,
                              unit: res.unit,
                              imageUrl: res.imageUrl,
                            })
                          }
                          className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.market.addToCart}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary Drawer */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm sticky top-20">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between mb-4">
                <span>{t.market.cart}</span>
                <span className="text-xs text-stone-500 font-normal">
                  {items.length} unique items
                </span>
              </h3>

              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-500">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <span>Your agricultural input cart is empty.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-64 overflow-y-auto pr-1">
                    {items.map(it => (
                      <div key={it.resourceId} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="pr-2">
                          <span className="font-semibold text-stone-900 dark:text-stone-100 block truncate max-w-[150px]">
                            {it.name}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            ₹{it.price} × {it.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => removeItem(it.resourceId)}
                            className="text-stone-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600 dark:text-stone-400">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Krishi Subsidy (Direct Benefit)</span>
                      <span>- ₹0</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100 pt-1 border-t border-stone-100 dark:border-stone-800">
                      <span>Total Payable</span>
                      <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    {t.market.checkout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Order Tracking History */
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
              No orders placed yet. Add items from the catalog.
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id || order._id}
                className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="text-xs text-stone-500">Order ID: </span>
                    <span className="font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-stone-400 ml-2">
                      ({new Date(order.createdAt).toLocaleDateString('en-IN')})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-500">Payment: {order.paymentMethod}</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400 text-base">
                      ₹{order.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Items:
                  </span>
                  {order.items?.map((it: any, i: number) => (
                    <div key={i} className="text-stone-600 dark:text-stone-400 flex justify-between max-w-md">
                      <span>• {it.name} (×{it.quantity})</span>
                      <span className="font-mono tabular-nums">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline Stepper */}
                <div className="pt-2">
                  <OrderTimeline currentStatus={order.status} timeline={order.timeline || []} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
              Confirm Agricultural Input Order
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Direct depot fulfillment with door-to-farm rural delivery.
            </p>

            <form onSubmit={handleCheckout} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Village / Mandal
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Cash on Delivery">Cash on Delivery (COD at Farm Gate)</option>
                  <option value="Kisan Credit Card">Kisan Credit Card (KCC Subsidized Credit)</option>
                  <option value="UPI / NetBanking">UPI / RuPay / NetBanking</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-xs flex justify-between font-bold">
                <span>Order Total:</span>
                <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isOrdering}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {isOrdering ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
