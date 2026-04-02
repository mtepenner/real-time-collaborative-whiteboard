import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Board' },
  boardId: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Optional: Store a JSON string of the canvas state for persistence
  lastSavedData: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Board', boardSchema);
