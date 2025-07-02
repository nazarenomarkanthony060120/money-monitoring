import axios from 'axios';
import { env } from '../config/environment';

export interface DiscordErrorPayload {
  error: string;
  message: string;
  stack?: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  timestamp: string;
  environment: string;
  source: 'backend' | 'frontend';
  userAgent?: string;
  ip?: string;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields: DiscordEmbedField[];
  timestamp: string;
  footer?: {
    text: string;
  };
}

export interface DiscordWebhookPayload {
  content?: string;
  embeds: DiscordEmbed[];
}

class DiscordService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = env.DISCORD_WEB_HOOK_API;
  }

  /**
   * Send error message to Discord webhook
   */
  async sendErrorToDiscord(errorPayload: DiscordErrorPayload): Promise<void> {
    try {
      if (!this.webhookUrl) {
        console.warn('Discord webhook URL not configured');
        return;
      }

      const embed = this.createErrorEmbed(errorPayload);
      const payload: DiscordWebhookPayload = {
        content: `🚨 **${errorPayload.source.toUpperCase()} ERROR ALERT** 🚨`,
        embeds: [embed],
      };

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });

      console.log('Error successfully sent to Discord');
    } catch (error) {
      console.error('Failed to send error to Discord:', error);
      // Don't throw error to prevent infinite loop
    }
  }

  /**
   * Create Discord embed for error
   */
  private createErrorEmbed(errorPayload: DiscordErrorPayload): DiscordEmbed {
    const fields: DiscordEmbedField[] = [
      {
        name: '🔥 Error',
        value: `\`\`\`${errorPayload.error}\`\`\``,
        inline: false,
      },
      {
        name: '💬 Message',
        value: errorPayload.message || 'No message provided',
        inline: false,
      },
      {
        name: '🌍 Environment',
        value: errorPayload.environment,
        inline: true,
      },
      {
        name: '📍 Source',
        value: errorPayload.source,
        inline: true,
      },
    ];

    if (errorPayload.endpoint) {
      fields.push({
        name: '🔗 Endpoint',
        value: `${errorPayload.method} ${errorPayload.endpoint}`,
        inline: true,
      });
    }

    if (errorPayload.userId) {
      fields.push({
        name: '👤 User ID',
        value: errorPayload.userId,
        inline: true,
      });
    }

    if (errorPayload.ip) {
      fields.push({
        name: '🌐 IP Address',
        value: errorPayload.ip,
        inline: true,
      });
    }

    if (errorPayload.userAgent) {
      fields.push({
        name: '🖥️ User Agent',
        value: errorPayload.userAgent.substring(0, 100) + (errorPayload.userAgent.length > 100 ? '...' : ''),
        inline: false,
      });
    }

    if (errorPayload.stack) {
      fields.push({
        name: '📋 Stack Trace',
        value: `\`\`\`${errorPayload.stack.substring(0, 1000)}${errorPayload.stack.length > 1000 ? '\n... (truncated)' : ''}\`\`\``,
        inline: false,
      });
    }

    return {
      title: `${errorPayload.source === 'backend' ? '🔧' : '🖥️'} ${errorPayload.source.toUpperCase()} Error`,
      description: `An error occurred in the ${errorPayload.source}`,
      color: errorPayload.source === 'backend' ? 0xff0000 : 0xff6600, // Red for backend, Orange for frontend
      fields,
      timestamp: errorPayload.timestamp,
      footer: {
        text: 'Money Monitoring App Error System',
      },
    };
  }

  /**
   * Send custom message to Discord
   */
  async sendCustomMessage(title: string, message: string, color: number = 0x00ff00): Promise<void> {
    try {
      if (!this.webhookUrl) {
        console.warn('Discord webhook URL not configured');
        return;
      }

      const embed: DiscordEmbed = {
        title,
        description: message,
        color,
        fields: [],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Money Monitoring App',
        },
      };

      const payload: DiscordWebhookPayload = {
        embeds: [embed],
      };

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      console.log('Custom message successfully sent to Discord');
    } catch (error) {
      console.error('Failed to send custom message to Discord:', error);
    }
  }
}

export const discordService = new DiscordService(); 