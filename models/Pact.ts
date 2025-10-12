// models/Pact.ts
import mongoose from 'mongoose';

const PactSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  partnerId: { type: String, required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'active', 'pending_confirmation', 'completed', 'failed', 'rejected'], 
    default: 'pending' 
  },
  
  acceptanceTxHash: { type: String },
  stakeAmount: { type: Number },
  rejectionCount: { type: Number, default: 0 },
  
  submission: {
    filePath: { type: String },
    fileName: { type: String },
    submittedAt: { type: Date },
    viewedBy: { type: String }, 
  },
}, { timestamps: true });

export default mongoose.models.Pact || mongoose.model('Pact', PactSchema);