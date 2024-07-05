import mongoose from 'mongoose';

export interface UserProfiles extends mongoose.Document {
  profileIcon: string; // file path string
}

const UserProfileSchema = new mongoose.Schema<UserProfiles>({
  profileIcon: {
    type: String,
  },
});

export default mongoose.models.UserProfile ||
  mongoose.model<UserProfiles>('UserProfile', UserProfileSchema);
