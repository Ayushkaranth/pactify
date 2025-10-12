import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  pactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pact', required: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);