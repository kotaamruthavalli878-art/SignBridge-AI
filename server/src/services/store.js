import mongoose from 'mongoose';
import User from '../models/User.js';
import Preference from '../models/Preference.js';
import SignLibrary from '../models/SignLibrary.js';
import { seedSignsData } from '../data/seedSigns.js';

// In-Memory Fallback State (Ensures 100% functionality even before Atlas URI is provided)
const memoryStore = {
  users: new Map(),
  preferences: new Map(),
  signs: new Map(),
};

// Seed in-memory signs immediately
seedSignsData.forEach((s) => {
  memoryStore.signs.set(s.signId, { ...s, _id: s.signId });
});

export const store = {
  isMongooseActive() {
    return mongoose.connection.readyState === 1;
  },

  async seedSignsIfEmpty() {
    if (this.isMongooseActive()) {
      try {
        const count = await SignLibrary.countDocuments();
        if (count === 0) {
          console.log('🌱 Seeding SignLibrary in MongoDB Atlas...');
          await SignLibrary.insertMany(seedSignsData);
          console.log(`✅ Seeded ${seedSignsData.length} verified signs into MongoDB.`);
        }
      } catch (err) {
        console.warn('Could not auto-seed MongoDB collection:', err.message);
      }
    }
  },

  async findUserByEmail(email, includePassword = false) {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.isMongooseActive()) {
      const query = User.findOne({ email: normalizedEmail });
      if (includePassword) {
        query.select('+password');
      }
      return await query.exec();
    }

    // In-memory lookup
    for (const user of memoryStore.users.values()) {
      if (user.email.toLowerCase() === normalizedEmail) {
        if (!includePassword) {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
        return { ...user };
      }
    }
    return null;
  },

  async findUserById(id) {
    if (this.isMongooseActive()) {
      return await User.findById(id).select('-password').exec();
    }

    const user = memoryStore.users.get(String(id));
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async createUser(userData) {
    if (this.isMongooseActive()) {
      const user = new User(userData);
      await user.save();
      const obj = user.toObject();
      delete obj.password;
      return obj;
    }

    const id = 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const user = {
      _id: id,
      id: id,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      preferredLanguage: userData.preferredLanguage || 'en',
      accessibilityPreferences: userData.accessibilityPreferences || {
        fontSize: 'normal',
        highContrast: false,
        reducedMotion: false,
        preferredVoice: '',
        speechRate: 1.0,
        autoSpeak: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.users.set(id, user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async updateUserPreferences(userId, prefs) {
    if (this.isMongooseActive()) {
      const user = await User.findById(userId);
      if (!user) return null;

      user.accessibilityPreferences = {
        ...user.accessibilityPreferences?.toObject(),
        ...prefs,
      };
      if (prefs.preferredLanguage) {
        user.preferredLanguage = prefs.preferredLanguage;
      }
      await user.save();

      await Preference.findOneAndUpdate(
        { userId },
        { $set: { userId, ...prefs } },
        { upsert: true, new: true }
      );

      const obj = user.toObject();
      delete obj.password;
      return obj;
    }

    const user = memoryStore.users.get(String(userId));
    if (!user) return null;

    user.accessibilityPreferences = {
      ...(user.accessibilityPreferences || {}),
      ...prefs,
    };
    if (prefs.preferredLanguage) {
      user.preferredLanguage = prefs.preferredLanguage;
    }
    user.updatedAt = new Date().toISOString();
    memoryStore.users.set(String(userId), user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getSigns(category = null, search = null) {
    if (this.isMongooseActive()) {
      const query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { signName: regex },
          { signNameTelugu: regex },
          { meaning: regex },
          { gesturesDescription: regex },
        ];
      }
      return await SignLibrary.find(query).sort({ signName: 1 }).exec();
    }

    let list = Array.from(memoryStore.signs.values());
    if (category && category !== 'all') {
      list = list.filter((s) => s.category === category);
    }
    if (search && search.trim() !== '') {
      const sLower = search.toLowerCase().trim();
      list = list.filter((s) =>
        s.signName.toLowerCase().includes(sLower) ||
        (s.signNameTelugu && s.signNameTelugu.toLowerCase().includes(sLower)) ||
        s.meaning.toLowerCase().includes(sLower) ||
        s.gesturesDescription.toLowerCase().includes(sLower)
      );
    }
    return list;
  },

  async getSignById(idOrSignId) {
    if (this.isMongooseActive()) {
      let sign = await SignLibrary.findOne({ signId: idOrSignId }).exec();
      if (!sign && mongoose.isValidObjectId(idOrSignId)) {
        sign = await SignLibrary.findById(idOrSignId).exec();
      }
      return sign;
    }

    let sign = memoryStore.signs.get(idOrSignId);
    if (!sign) {
      for (const s of memoryStore.signs.values()) {
        if (s._id === idOrSignId || s.signId === idOrSignId) {
          return s;
        }
      }
    }
    return sign || null;
  }
};
