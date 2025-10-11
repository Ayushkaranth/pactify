// models/Pact.ts
import mongoose from 'mongoose';

const PactSchema = new mongoose.Schema({
  // The user who created and proposed the pact
  creatorId: { type: String, required: true },
  
  // The user who is invited to join the pact
  partnerId: { type: String, required: true },

  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  
  // Pacts can be for tasks or for tracking money (IOUs)
  type: { type: String, required: true, enum: ['task', 'financial'], default: 'task' },

  // The lifecycle of the pact
  status: { type: String, required: true, enum: ['pending', 'active', 'completed', 'failed', 'rejected'], default: 'pending' },
  
  // The on-chain proof that the pact was accepted
  acceptanceTxHash: { type: String },

  // For financial pacts
  amount: { type: Number },
  currency: { type: String },

}, { timestamps: true });

export default mongoose.models.Pact || mongoose.model('Pact', PactSchema);