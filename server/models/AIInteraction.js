import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const AISourceSchema = new Schema({
  type: { type: String },
  id: { type: String },
  confidence: { type: String, enum: ['high', 'medium', 'low'] }
}, { _id: false });

const StructuredResponseSchema = new Schema({
  language: { type: String, enum: ['en', 'rw', 'mixed'] },
  intent: { type: String },
  topic: { type: String },
  answer: { type: String },
  explanation: { type: String, default: null },
  example: { type: String, default: null },
  safety_note: { type: String, default: null },
  confidence: { type: String, enum: ['high', 'medium', 'low'] },
  sources: { type: [AISourceSchema], default: [] },
  warnings: { type: [String], default: [] },
  retrievedCount: { type: Number, default: 0 },
  topScore: { type: Number, default: 0 }
}, { _id: false });

const AIInteractionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  prompt: { type: String, required: true, index: true },
  promptRaw: { type: String },
  response: { type: String, required: true },
  structured: { type: StructuredResponseSchema, default: null },
  sentiment: { type: String },
  isPro: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

AIInteractionSchema.index({ userId: 1, createdAt: -1 });
AIInteractionSchema.index({ prompt: 1 });
AIInteractionSchema.index({ 'structured.intent': 1 });
AIInteractionSchema.index({ 'structured.topic': 1 });
AIInteractionSchema.index({ 'structured.language': 1 });

export const AIInteraction = model('AIInteraction', AIInteractionSchema);
