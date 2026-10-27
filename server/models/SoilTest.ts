import mongoose, { Document, Schema } from 'mongoose';

export interface ISoilTest extends Document {
  farm: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  ph: number; // 0-14
  moisture: number; // percentage %
  organicCarbon: number; // percentage %
  recommendations: string[];
  status: 'Optimal' | 'Deficient' | 'Needs Balancing' | 'Critical';
  testedAt: Date;
  createdAt: Date;
}

const SoilTestSchema = new Schema<ISoilTest>(
  {
    farm: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    nitrogen: { type: Number, required: true }, // e.g. 240 kg/ha
    phosphorus: { type: Number, required: true }, // e.g. 35 kg/ha
    potassium: { type: Number, required: true }, // e.g. 180 kg/ha
    ph: { type: Number, required: true }, // e.g. 6.8
    moisture: { type: Number, required: true }, // e.g. 42%
    organicCarbon: { type: Number, default: 0.65 }, // %
    recommendations: [{ type: String }],
    status: {
      type: String,
      enum: ['Optimal', 'Deficient', 'Needs Balancing', 'Critical'],
      default: 'Optimal',
    },
    testedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SoilTest = mongoose.models.SoilTest || mongoose.model<ISoilTest>('SoilTest', SoilTestSchema);
