import mongoose, { Document, Schema } from 'mongoose';

export interface IUserMode extends Document {
  userId: string;
  overallMood: string;
  journalEntry: string;
  feelings: string[];
  sleepHours: string;
  date: Date;
}

const userModeSchema = new Schema<IUserMode>({
  userId: { type: String, required: true },
  overallMood: { type: String, required: true },
  journalEntry: { type: String, required: true },
  feelings: { type: [String], required: true },
  sleepHours: { type: String, required: true },
  date: { type: Date, required: true },
});

const UserMode = mongoose.model<IUserMode>('UserMode', userModeSchema);
export default UserMode;