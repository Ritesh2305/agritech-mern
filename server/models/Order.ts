import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  resource: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'rejected';
  shippingAddress: {
    fullName: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'Cash on Delivery' | 'Kisan Credit Card' | 'UPI / NetBanking';
  timeline: {
    status: string;
    timestamp: Date;
    note: string;
  }[];
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, default: 'kg' },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'shipped', 'delivered', 'rejected'],
      default: 'pending',
      index: true,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      village: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, default: 'Telangana' },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Kisan Credit Card', 'UPI / NetBanking'],
      default: 'Cash on Delivery',
    },
    timeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
