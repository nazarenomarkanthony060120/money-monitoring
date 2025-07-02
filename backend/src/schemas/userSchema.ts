import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// User Schema Definition
export const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function (this: any) {
      return this.provider === 'email';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  picture: {
    type: String,
    trim: true
  },
  provider: {
    type: String,
    enum: ['email', 'google', 'facebook', 'discord'],
    default: 'email'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1, provider: 1 }, { unique: true });
// userSchema.index({ email: 1 }); // Removed to avoid duplicate index warning
userSchema.index({ provider: 1 });

// Virtual for user profile
userSchema.virtual('profile').get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    picture: this.picture,
    provider: this.provider,
    isEmailVerified: this.isEmailVerified
  };
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.provider !== 'email') {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};

// Instance method to verify email verification token
userSchema.methods.verifyEmailToken = function (token: string): boolean {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.emailVerificationToken === hashedToken &&
    this.emailVerificationExpires > new Date();
};

// Instance method to verify password reset token
userSchema.methods.verifyPasswordResetToken = function (token: string): boolean {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.passwordResetToken === hashedToken &&
    this.passwordResetExpires > new Date();
};

// Instance method to clear password reset token
userSchema.methods.clearPasswordResetToken = function () {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

// Instance method to clear email verification token
userSchema.methods.clearEmailVerificationToken = function () {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
};

// Static method to find user by email and provider
userSchema.statics.findByEmailAndProvider = function (email: string, provider: string) {
  return this.findOne({ email: email.toLowerCase(), provider });
};

// Static method to find user by email verification token
userSchema.statics.findByEmailVerificationToken = function (token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() }
  });
};

// Static method to find user by password reset token
userSchema.statics.findByPasswordResetToken = function (token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  }).select('+password');
};

// Static method to find or create user by OAuth
userSchema.statics.findOrCreateOAuthUser = async function (profile: {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'facebook' | 'discord';
}) {
  let user = await this.findOne({
    email: profile.email,
    provider: profile.provider
  });

  if (!user) {
    user = await this.create({
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      provider: profile.provider,
      isEmailVerified: true
    });
  }

  return user;
}; 