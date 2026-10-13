import mongoose from 'mongoose';

const accessibilityPreferencesSchema = new mongoose.Schema({
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
  preferredVoice: {
    type: String,
    default: '',
  },
  speechRate: {
    type: Number,
    default: 1.0,
    min: 0.5,
    max: 2.0,
  },
  autoSpeak: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password in default queries
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'te'],
    default: 'en',
  },
  accessibilityPreferences: {
    type: accessibilityPreferencesSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
});

// unique: true on email already defines the index

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
