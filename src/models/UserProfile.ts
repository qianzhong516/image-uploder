import mongoose from 'mongoose';

export interface UserProfiles extends mongoose.Document {
  profileIcon: typeof mongoose.Schema.ObjectId; // [foreign key]: userid
}

const UserProfileSchema = new mongoose.Schema<UserProfiles>({
  profileIcon: {
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: 'ProfileIcon',
  },
});

export default mongoose.models.UserProfile ||
  mongoose.model<UserProfiles>('UserProfile', UserProfileSchema);
