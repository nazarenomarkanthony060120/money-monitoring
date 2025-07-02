import { useMemo, useCallback } from 'react'
import { type SettingOption } from '../components/profile/types'
import { ACCOUNT_SETTINGS, APP_SETTINGS } from '../constants/profileSettings'

export const useProfile = () => {
  // Handle setting option press
  const handleSettingPress = useCallback((settingId: string) => {
    switch (settingId) {
      case 'edit-profile':
        // TODO: Navigate to edit profile screen
        console.log('Edit Profile pressed')
        break
      case 'privacy-settings':
        // TODO: Navigate to privacy settings screen
        console.log('Privacy Settings pressed')
        break
      case 'notifications':
        // TODO: Navigate to notifications screen
        console.log('Notifications pressed')
        break
      case 'dark-mode':
        // TODO: Toggle dark mode
        console.log('Dark Mode pressed')
        break
      case 'help-support':
        // TODO: Navigate to help screen
        console.log('Help & Support pressed')
        break
      case 'data-storage':
        // TODO: Navigate to data storage screen
        console.log('Data & Storage pressed')
        break
      case 'sync-settings':
        // TODO: Navigate to sync settings screen
        console.log('Sync Settings pressed')
        break
      case 'export-data':
        // TODO: Handle data export
        console.log('Export Data pressed')
        break
      default:
        console.log(`Unknown setting: ${settingId}`)
    }
  }, [])

  // Account settings options
  const accountOptions: SettingOption[] = useMemo(
    () =>
      ACCOUNT_SETTINGS.map(setting => ({
        ...setting,
        onPress: () => handleSettingPress(setting.id),
      })),
    [handleSettingPress]
  )

  // App settings options
  const appOptions: SettingOption[] = useMemo(
    () =>
      APP_SETTINGS.map(setting => ({
        ...setting,
        onPress: () => handleSettingPress(setting.id),
      })),
    [handleSettingPress]
  )

  return {
    accountOptions,
    appOptions,
  }
} 