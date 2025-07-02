import React from 'react'
import { TouchableOpacity, Text, Alert } from 'react-native'
import { frontendDiscordService } from '../../services/discordService'

interface ErrorTestButtonProps {
  userId?: string
}

export const ErrorTestButton: React.FC<ErrorTestButtonProps> = ({ userId }) => {
  const testDiscordError = async () => {
    try {
      // Show confirmation dialog
      Alert.alert(
        'Test Discord Error Reporting',
        'This will send a test error to Discord. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Test Error',
            style: 'destructive',
            onPress: async () => {
              try {
                await frontendDiscordService.sendCustomError(
                  'Test Error',
                  'This is a test error sent from the Money Monitoring app to verify Discord webhook integration.',
                  {
                    userId,
                    page: 'Profile Screen',
                    severity: 'low',
                  },
                )

                Alert.alert(
                  'Success',
                  'Test error sent to Discord successfully!',
                )
              } catch (error) {
                Alert.alert('Error', 'Failed to send test error to Discord')
              }
            },
          },
        ],
      )
    } catch (error) {
      console.error('Error in test function:', error)
    }
  }

  const testCriticalError = async () => {
    Alert.alert(
      'Test Critical Error',
      'This will send a critical error to Discord. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Critical Error',
          style: 'destructive',
          onPress: async () => {
            try {
              await frontendDiscordService.sendCustomError(
                'Critical System Error',
                'Critical: This is a test critical error that should be sent to Discord immediately.',
                {
                  userId,
                  page: 'Profile Screen',
                  severity: 'critical',
                },
              )

              Alert.alert('Success', 'Critical test error sent to Discord!')
            } catch (error) {
              Alert.alert('Error', 'Failed to send critical error to Discord')
            }
          },
        },
      ],
    )
  }

  const testUncaughtError = () => {
    Alert.alert(
      'Test Uncaught Error',
      'This will throw an uncaught error to test global error handling. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Throw Error',
          style: 'destructive',
          onPress: () => {
            // This will trigger the global error handler
            setTimeout(() => {
              throw new Error('Test uncaught error for Discord webhook testing')
            }, 100)
          },
        },
      ],
    )
  }

  return (
    <>
      <TouchableOpacity
        onPress={testDiscordError}
        className="bg-blue-500 px-4 py-2 rounded-lg mb-2"
        testID="test-discord-error-button"
      >
        <Text className="text-white text-center font-medium">
          🧪 Test Discord Error
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testCriticalError}
        className="bg-red-500 px-4 py-2 rounded-lg mb-2"
        testID="test-critical-error-button"
      >
        <Text className="text-white text-center font-medium">
          🚨 Test Critical Error
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testUncaughtError}
        className="bg-orange-500 px-4 py-2 rounded-lg"
        testID="test-uncaught-error-button"
      >
        <Text className="text-white text-center font-medium">
          💥 Test Uncaught Error
        </Text>
      </TouchableOpacity>
    </>
  )
}
