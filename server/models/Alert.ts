import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  pestOrDisease: string;
  affectedCrops: string[];
  region: string;
  recommendedAction: string;
  organicRemedy: string;
  active: boolean;
  issuedAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    pestOrDisease: { type: String, required: true },
    affectedCrops: [{ type: String }],
    region: { type: String, default: 'All South-Central Regions' },
    recommendedAction: { type: String, required: true },
    organicRemedy: { type: String, default: 'Neem seed kernel extract (NSKE 5%) spray.' },
    active: { type: Boolean, default: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Alert = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
