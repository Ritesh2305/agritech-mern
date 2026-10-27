import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userRole: { type: String, default: 'farmer' },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '127.0.0.1' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
