import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { ApiError } from '../utils/errors';
import { env } from '../config/environment';

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface GoogleAuthData {
  idToken: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    photo: string;
  };
}

interface OAuthUserData {
  id: string;
  email: string;
  name: string;
  photo?: string;
  provider: 'google' | 'facebook' | 'discord';
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
    provider: string;
    isEmailVerified: boolean;
  };
  token: string;
}

class AuthService {
  // Email/Password Authentication
  async loginWithEmail(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email and provider
    const user = await User.findOne({
      email: email.toLowerCase(),
      provider: 'email'
    }).select('+password') as any;

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      provider: user.provider
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    };
  }

  async registerUser(data: RegisterData): Promise<AuthResponse> {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      provider: 'email'
    });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    // Hash password
    const saltRounds = parseInt(env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      provider: 'email',
      isEmailVerified: false,
    }) as any;

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      provider: user.provider
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    };
  }

  // Google Authentication
  async loginWithGoogle(data: GoogleAuthData): Promise<AuthResponse> {
    const { idToken, user: googleUser } = data;

    try {
      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new ApiError(401, 'Invalid Google ID token');
      }

      // Verify that the token belongs to the expected user
      if (payload.email !== googleUser.email) {
        throw new ApiError(401, 'Email mismatch in Google token');
      }

      // Find or create user
      const user = await User.findOrCreateOAuthUser({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.photo,
        provider: 'google'
      }) as any;

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        provider: user.provider
      });

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          picture: user.picture,
          provider: user.provider,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      };
    } catch (error) {
      console.error('Google authentication error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Google authentication failed');
    }
  }

  // Facebook Authentication
  async loginWithFacebook(accessToken: string, userData: any): Promise<AuthResponse> {
    try {
      // Verify Facebook access token
      const facebookResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);

      if (!facebookResponse.ok) {
        throw new ApiError(401, 'Invalid Facebook access token');
      }

      const facebookProfile = await facebookResponse.json() as any;

      // Verify that the token belongs to the expected user
      if (facebookProfile.email !== userData.email) {
        throw new ApiError(401, 'Email mismatch in Facebook token');
      }

      // Find or create user
      const user = await User.findOrCreateOAuthUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.photo,
        provider: 'facebook'
      }) as any;

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        provider: user.provider
      });

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          picture: user.picture,
          provider: user.provider,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      };
    } catch (error) {
      console.error('Facebook authentication error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Facebook authentication failed');
    }
  }

  // Discord Authentication
  async loginWithDiscord(accessToken: string, userData: any): Promise<AuthResponse> {
    try {
      // Verify Discord access token
      const discordResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!discordResponse.ok) {
        throw new ApiError(401, 'Invalid Discord access token');
      }

      const discordProfile = await discordResponse.json() as any;

      // Verify that the token belongs to the expected user
      if (discordProfile.email !== userData.email) {
        throw new ApiError(401, 'Email mismatch in Discord token');
      }

      // Find or create user
      const user = await User.findOrCreateOAuthUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.photo,
        provider: 'discord'
      }) as any;

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        provider: user.provider
      });

      return {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          picture: user.picture,
          provider: user.provider,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      };
    } catch (error) {
      console.error('Discord authentication error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Discord authentication failed');
    }
  }

  // Password Reset
  async requestPasswordReset(email: string): Promise<void> {
    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      provider: 'email'
    }) as any;

    if (!user) {
      // For security, don't reveal if user exists
      return;
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // TODO: Send email with reset token
    console.log('Password reset token:', resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find user by reset token
    const user = await User.findByPasswordResetToken(token) as any;

    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = parseInt(env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.clearPasswordResetToken();
    await user.save();
  }

  // User Profile
  async getUserProfile(userId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
      createdAt: user.createdAt,
    };
  }

  async updateUserProfile(userId: string, updateData: any): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Update allowed fields
    if (updateData.name) user.name = updateData.name.trim();
    if (updateData.picture) user.picture = updateData.picture;
    if (updateData.preferences) {
      user.preferences = { ...user.preferences, ...updateData.preferences };
    }

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
    };
  }
}

export const authService = new AuthService(); 