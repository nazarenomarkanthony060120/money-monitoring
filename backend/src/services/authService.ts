import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { ApiError } from '../utils/errors';
import { env } from '../config/environment';
import { IUserDocument } from '../types';
import { Types } from 'mongoose';

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
    }).select('+password') as IUserDocument | null;

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
      userId: (user as any)._id.toString(),
      email: user.email,
      provider: user.provider
    });

    return {
      user: {
        id: (user as any)._id.toString(),
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
      userId: (user as any)._id.toString(),
      email: user.email,
      provider: user.provider
    });

    return {
      user: {
        id: (user as any)._id.toString(),
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
        userId: (user as any)._id.toString(),
        email: user.email,
        provider: user.provider
      });

      return {
        user: {
          id: (user as any)._id.toString(),
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
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: (user as any)._id.toString(),
        email: user.email,
        provider: user.provider
      });

      return {
        user: {
          id: (user as any)._id.toString(),
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

  // Discord OAuth2 Authentication
  async loginWithDiscord(code: string, redirectUri: string): Promise<AuthResponse> {
    try {
      // Step 1: Exchange authorization code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: env.DISCORD_CLIENT_ID,
          client_secret: env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Discord token exchange error:', errorData);
        throw new ApiError(401, 'Failed to exchange Discord authorization code');
      }

      const tokenData = await tokenResponse.json() as {
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
      };

      // Step 2: Use access token to get user information
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('Discord user info error:', errorData);
        throw new ApiError(401, 'Failed to fetch Discord user information');
      }

      const discordUser = await userResponse.json() as {
        id: string;
        username: string;
        discriminator: string;
        avatar?: string;
        email?: string;
        verified?: boolean;
        locale?: string;
        mfa_enabled?: boolean;
        premium_type?: number;
        public_flags?: number;
      };

      // Check if user has email (required for our app)
      if (!discordUser.email) {
        throw new ApiError(400, 'Discord account must have a verified email address');
      }

      // Generate avatar URL if avatar exists
      const avatarUrl = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator) % 5}.png`;

      // Find or create user
      const user = await User.findOrCreateOAuthUser({
        id: discordUser.id,
        email: discordUser.email,
        name: `${discordUser.username}#${discordUser.discriminator}`,
        picture: avatarUrl,
        provider: 'discord'
      });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: (user as any)._id.toString(),
        email: user.email,
        provider: user.provider
      });

      return {
        user: {
          id: (user as any)._id.toString(),
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

  // Generate Discord OAuth2 authorization URL
  generateDiscordAuthUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email',
    });

    if (state) {
      params.append('state', state);
    }

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
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
      id: (user._id as Types.ObjectId).toString(),
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
      id: (user._id as Types.ObjectId).toString(),
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