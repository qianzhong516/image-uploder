import mongoose from 'mongoose';

export interface ProfileIcons extends mongoose.Document {
  _id: string;
  title: string;
  totalSizeInBytes: number;
  path: string;
  uploadedBy: typeof mongoose.Schema.ObjectId; // [foreign key]: userid
}

const ProfileIconSchema = new mongoose.Schema<ProfileIcons>({
  title: {
    type: String,
    required: [true, 'Image title is required.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  totalSizeInBytes: {
    type: Number,
  },
  path: {
    type: String,
    required: [true, 'Image saved path is required.'],
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'UserProfile',
  },
});

export default mongoose.models.ProfileIcon ||
  mongoose.model<ProfileIcons>('ProfileIcon', ProfileIconSchema);
