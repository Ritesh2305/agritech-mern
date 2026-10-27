import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  author: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: Date;
}

export interface IForumPost extends Document {
  author: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  category: 'Crop Disease' | 'Organic Farming' | 'Irrigation Tech' | 'Market Prices' | 'Govt Schemes' | 'General';
  tags: string[];
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'farmer' },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Crop Disease', 'Organic Farming', 'Irrigation Tech', 'Market Prices', 'Govt Schemes', 'General'],
      default: 'General',
      index: true,
    },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        authorName: { type: String, required: true },
        authorRole: { type: String, default: 'farmer' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const ForumPost = mongoose.models.ForumPost || mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
