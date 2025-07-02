import { type SettingOption } from '../components/profile/types'

export const ACCOUNT_SETTINGS: Omit<SettingOption, 'onPress'>[] = [
  {
    id: 'edit-profile',
    icon: '👤',
    title: 'Edit Profile',
    subtitle: 'Update your personal information',
  },
  {
    id: 'privacy-settings',
    icon: '🔒',
    title: 'Privacy Settings',
    subtitle: 'Manage your privacy preferences',
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'Notifications',
    subtitle: 'Configure notification preferences',
  },
  {
    id: 'dark-mode',
    icon: '🌙',
    title: 'Dark Mode',
    subtitle: 'Switch between light and dark themes',
  },
  {
    id: 'help-support',
    icon: '❓',
    title: 'Help & Support',
    subtitle: 'Get help and contact support',
  },
]

export const APP_SETTINGS: Omit<SettingOption, 'onPress'>[] = [
  {
    id: 'data-storage',
    icon: '💾',
    title: 'Data & Storage',
    subtitle: 'Manage app data and storage',
  },
  {
    id: 'sync-settings',
    icon: '🔄',
    title: 'Sync Settings',
    subtitle: 'Configure data synchronization',
  },
  {
    id: 'export-data',
    icon: '📊',
    title: 'Export Data',
    subtitle: 'Download your financial data',
  },
]

export const PROFILE_COLORS = {
  gradientColors: ['#2563eb', '#7c3aed', '#9333ea'],
  background: '#f9fafb',
  cardBackground: '#ffffff',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  danger: '#ef4444',
} as const 