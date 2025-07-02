# Profile Components

This directory contains reusable components for the profile screen, following React Native Expo coding standards.

## Components

### ProfileHeader

Displays user information including avatar, name, email, and provider badge with a gradient background.

**Props:**

- `user?: User` - User object containing profile information

### ProfileOption

Individual option item with icon, title, subtitle, and navigation arrow.

**Props:**

- `icon: string` - Emoji or icon to display
- `title: string` - Main option title
- `subtitle?: string` - Optional description text
- `onPress: () => void` - Callback function when pressed
- `showBorder?: boolean` - Whether to show bottom border (default: true)
- `testID?: string` - Test identifier for testing

### SettingsSection

Groups related profile options under a section header.

**Props:**

- `title: string` - Section header title
- `options: SettingOption[]` - Array of setting options
- `testID?: string` - Test identifier for testing

### LogoutButton

Standalone logout button with confirmation dialog.

**Props:**

- `onLogout: () => void` - Callback function when logout is confirmed
- `testID?: string` - Test identifier for testing

### AppVersion

Displays app version information using Expo Constants.

**Props:**

- `testID?: string` - Test identifier for testing

## Usage

```tsx
import {
  ProfileHeader,
  SettingsSection,
  LogoutButton,
  AppVersion,
} from '../../components/profile'

// Use in your profile screen
<ProfileHeader user={user} />
<SettingsSection title="Account Settings" options={accountOptions} />
<LogoutButton onLogout={handleLogout} />
<AppVersion />
```

## Features

- ✅ TypeScript support with proper interfaces
- ✅ Accessibility features (labels, hints, roles)
- ✅ Test identifiers for testing
- ✅ Responsive design with TailwindCSS
- ✅ Error handling and edge cases
- ✅ Expo Constants integration
- ✅ Clean component separation
- ✅ Consistent styling patterns
