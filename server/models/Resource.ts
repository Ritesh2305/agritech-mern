import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Organic Pesticides' | 'Tools & Machinery' | 'Irrigation Equipment';
  description: string;
  price: number; // in INR ₹
  unit: string; // 'kg', 'bag (50kg)', 'litre', 'piece'
  stock: number;
  rating: number;
  manufacturer: string;
  imageUrl?: string;
  subsidyEligible: boolean;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Seeds', 'Fertilizers', 'Organic Pesticides', 'Tools & Machinery', 'Irrigation Equipment'],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'kg' },
    stock: { type: Number, required: true, default: 100 },
    rating: { type: Number, default: 4.8 },
    manufacturer: { type: String, default: 'AgroTech Certified' },
    imageUrl: { type: String, default: '' },
    subsidyEligible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
