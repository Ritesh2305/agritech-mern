import mongoose, { Document, Schema } from 'mongoose';

export interface ICrop extends Document {
  farm: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  variety: string;
  sowingDate: Date;
  expectedHarvest: Date;
  stage: 'Sowing' | 'Germination' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvested';
  status: 'Healthy' | 'Needs Attention' | 'Pest Detected' | 'Drought Stress';
  plantedArea: number; // in acres
  expectedYield: number; // in quintals/tonnes
  actualYield?: number;
  notes?: string;
  healthScore: number; // 0-100
  createdAt: Date;
}

const CropSchema = new Schema<ICrop>(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    variety: { type: String, default: 'Standard Hybrid' },
    sowingDate: { type: Date, required: true },
    expectedHarvest: { type: Date, required: true },
    stage: {
      type: String,
      enum: ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Maturity', 'Harvested'],
      default: 'Vegetative',
    },
    status: {
      type: String,
      enum: ['Healthy', 'Needs Attention', 'Pest Detected', 'Drought Stress'],
      default: 'Healthy',
    },
    plantedArea: { type: Number, default: 2.5 },
    expectedYield: { type: Number, default: 45 },
    actualYield: { type: Number },
    notes: { type: String, default: '' },
    healthScore: { type: Number, min: 0, max: 100, default: 85 },
  },
  { timestamps: true }
);

export const Crop = mongoose.models.Crop || mongoose.model<ICrop>('Crop', CropSchema);
