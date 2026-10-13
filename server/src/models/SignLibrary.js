import mongoose from 'mongoose';

const signLibrarySchema = new mongoose.Schema({
  signId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  signName: {
    type: String,
    required: true,
    trim: true,
  },
  signNameTelugu: {
    type: String,
    default: '',
  },
  meaning: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['greetings', 'healthcare', 'emergency', 'education', 'daily', 'numbers'],
    required: true,
  },
  supportedLanguage: {
    type: String,
    default: 'Indian Sign Language (ISL) & ASL Core',
  },
  referenceMediaUrl: {
    type: String,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'community-reviewed', 'sample-demo'],
    default: 'verified',
  },
  regionalNotes: {
    type: String,
    default: 'Verified according to standard Indian Sign Language (ISL) dictionary guidelines and universal basic sign conventions.',
  },
  gesturesDescription: {
    type: String,
    required: true,
  },
  steps: [{
    type: String,
  }],
  landmarkHints: {
    type: String,
    default: 'Open palm or finger extension tracking',
  }
}, {
  timestamps: true,
});

signLibrarySchema.index({ category: 1 });
// unique: true on signId already defines the index

const SignLibrary = mongoose.models.SignLibrary || mongoose.model('SignLibrary', signLibrarySchema);

export default SignLibrary;
