import React from 'react'
import { TouchableOpacity, Text, Alert } from 'react-native'

interface LogoutButtonProps {
  onLogout: () => void
  testID?: string
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  testID,
}) => {
  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <TouchableOpacity
      onPress={handleLogout}
      className="bg-red-500 py-4 rounded-2xl items-center shadow-sm active:bg-red-600"
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Logout"
      accessibilityHint="Tap to logout from your account"
    >
      <Text className="text-white font-semibold text-lg">Logout</Text>
    </TouchableOpacity>
  )
}
