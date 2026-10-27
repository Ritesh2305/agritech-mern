import mongoose, { Document, Schema } from 'mongoose';

export interface IFarm extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  location: string;
  area: number;
  areaUnit: 'acres' | 'hectares';
  soilType: 'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Loamy' | 'Sandy';
  irrigationType: 'Drip' | 'Sprinkler' | 'Canal' | 'Rainfed' | 'Borewell';
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

const FarmSchema = new Schema<IFarm>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    area: { type: Number, required: true },
    areaUnit: { type: String, enum: ['acres', 'hectares'], default: 'acres' },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Loamy', 'Sandy'],
      default: 'Loamy',
    },
    irrigationType: {
      type: String,
      enum: ['Drip', 'Sprinkler', 'Canal', 'Rainfed', 'Borewell'],
      default: 'Drip',
    },
    coordinates: {
      lat: { type: Number, default: 17.3850 },
      lng: { type: Number, default: 78.4867 },
    },
  },
  { timestamps: true }
);

export const Farm = mongoose.models.Farm || mongoose.model<IFarm>('Farm', FarmSchema);
