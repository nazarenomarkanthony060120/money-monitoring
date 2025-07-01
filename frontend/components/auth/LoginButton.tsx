import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { ProviderIcon } from './ProviderIcons'

interface LoginButtonProps {
  provider: {
    id: 'google' | 'facebook' | 'discord'
    name: string
    icon: string
    color: string
  }
  onPress: () => void
  isLoading: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  provider,
  onPress,
  isLoading,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={isLoading}
    className={`flex-row items-center justify-center px-6 py-4 rounded-2xl mb-4 border-2 ${
      isLoading ? 'opacity-50' : 'opacity-100'
    } active:scale-95`}
    style={{
      backgroundColor: provider.color,
      borderColor: provider.color,
      shadowColor: provider.color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    }}
  >
    {isLoading ? (
      <ActivityIndicator color="white" size="small" />
    ) : (
      <>
        <ProviderIcon provider={provider.id} size={24} />
        <Text className="text-white font-bold text-lg ml-3">
          Continue with {provider.name}
        </Text>
      </>
    )}
  </TouchableOpacity>
)
