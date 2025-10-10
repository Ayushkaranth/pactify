// models/Goal.ts
import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required.'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for your goal.'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  deadline: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'failed'],
    default: 'active',
  },
  stakeAmount: {
    type: Number,
  },
  stakeCurrency: {
    type: String,
  },
  stakeTxHash: {
    type: String,
  },
}, { timestamps: true }); // timestamps will add createdAt and updatedAt fields automatically

// This prevents Mongoose from redefining the model every time the file is reloaded in development
export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema);