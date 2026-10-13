import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fontSize: {
    type: String,
    enum: ['normal', 'large', 'xlarge'],
    default: 'normal',
  },
  highContrast: {
    type: Boolean,
    default: false,
  },
  reducedMotion: {
    type: Boolean,
    default: false,
  },
  speechPitch: {
    type: Number,
    default: 1.0,
  },
  speechRate: {
    type: Number,
    default: 1.0,
  },
  preferredVoiceName: {
    type: String,
    default: '',
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'te'],
    default: 'en',
  },
}, {
  timestamps: true,
});

const Preference = mongoose.models.Preference || mongoose.model('Preference', preferenceSchema);

export default Preference;
