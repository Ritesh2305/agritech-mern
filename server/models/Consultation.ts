import mongoose, { Document, Schema } from 'mongoose';

export interface IConsultation extends Document {
  farmer: mongoose.Types.ObjectId;
  farmerName: string;
  expertName: string;
  expertRole: string;
  date: string;
  timeSlot: string;
  cropAffected: string;
  topic: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  expertPrescription?: string;
  urgency: 'Routine' | 'High' | 'Emergency';
  createdAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    expertName: { type: String, required: true },
    expertRole: { type: String, default: 'Chief Agronomist & Soil Specialist' },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    cropAffected: { type: String, required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    expertPrescription: { type: String, default: '' },
    urgency: {
      type: String,
      enum: ['Routine', 'High', 'Emergency'],
      default: 'Routine',
    },
  },
  { timestamps: true }
);

export const Consultation = mongoose.models.Consultation || mongoose.model<IConsultation>('Consultation', ConsultationSchema);
