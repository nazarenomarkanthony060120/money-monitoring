export interface User {
  id?: string
  name?: string
  email?: string
  avatar?: string
  provider?: string
}

export interface SettingOption {
  id: string
  icon: string
  title: string
  subtitle?: string
  onPress: () => void
}

export interface ProfileOptionProps {
  icon: string
  title: string
  subtitle?: string
  onPress: () => void
  showBorder?: boolean
  testID?: string
}

export interface SettingsSectionProps {
  title: string
  options: SettingOption[]
  testID?: string
} 