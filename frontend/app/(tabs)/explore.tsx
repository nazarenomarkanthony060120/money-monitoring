import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChartCard = ({ title, value, change, icon, color }: any) => (
  <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <View className="flex-row items-center justify-between mb-4">
      <View
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View
        className={`px-3 py-1 rounded-full ${change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
      >
        <Text
          className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {change >= 0 ? '+' : ''}
          {change}%
        </Text>
      </View>
    </View>
    <Text className="text-gray-600 text-sm font-medium mb-1">{title}</Text>
    <Text className="text-2xl font-bold text-gray-900">{value}</Text>
  </View>
)

const InsightCard = ({ title, description, icon, type }: any) => (
  <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <View className="flex-row items-start">
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${
          type === 'positive'
            ? 'bg-green-100'
            : type === 'warning'
              ? 'bg-yellow-100'
              : 'bg-blue-100'
        }`}
      >
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base mb-1">
          {title}
        </Text>
        <Text className="text-gray-600 text-sm leading-5">{description}</Text>
      </View>
    </View>
  </View>
)

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
          <Text className="text-white text-3xl font-bold mb-2">Analytics</Text>
          <Text className="text-white/80 text-lg">
            Track your financial insights
          </Text>
        </View>

        <View className="px-6 -mt-6">
          {/* Overview Cards */}
          <View className="mb-8">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              This Month
            </Text>
            <View className="space-y-4">
              <ChartCard
                title="Total Spending"
                value="$2,450"
                change={-8.5}
                icon="📉"
                color="#ef4444"
              />
              <ChartCard
                title="Total Income"
                value="$4,200"
                change={12.3}
                icon="📈"
                color="#10b981"
              />
              <ChartCard
                title="Savings Rate"
                value="41.7%"
                change={5.2}
                icon="💰"
                color="#3b82f6"
              />
            </View>
          </View>

          {/* Spending Categories */}
          <View className="mb-8">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Top Categories
            </Text>
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {[
                {
                  category: 'Food & Dining',
                  amount: '$450',
                  percentage: 18.4,
                  color: '#ef4444',
                },
                {
                  category: 'Transportation',
                  amount: '$320',
                  percentage: 13.1,
                  color: '#f59e0b',
                },
                {
                  category: 'Shopping',
                  amount: '$280',
                  percentage: 11.4,
                  color: '#8b5cf6',
                },
                {
                  category: 'Entertainment',
                  amount: '$180',
                  percentage: 7.3,
                  color: '#06b6d4',
                },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <Text className="text-gray-900 font-medium">
                      {item.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-900 font-semibold mr-3">
                      {item.amount}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {item.percentage}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Insights */}
          <View className="mb-8">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Smart Insights
            </Text>
            <View className="space-y-3">
              <InsightCard
                title="Great job on savings!"
                description="You've saved 41.7% of your income this month, which is above the recommended 20%."
                icon="🎉"
                type="positive"
              />
              <InsightCard
                title="Food spending increased"
                description="Your food expenses are 15% higher than last month. Consider meal planning to reduce costs."
                icon="⚠️"
                type="warning"
              />
              <InsightCard
                title="Transportation optimization"
                description="You could save $50/month by using public transport 2 more days per week."
                icon="💡"
                type="info"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-gray-900 text-xl font-bold mb-4">
              Quick Actions
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity className="flex-1 bg-blue-600 py-4 rounded-xl items-center">
                <Text className="text-white font-semibold">Export Report</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-gray-200 py-4 rounded-xl items-center">
                <Text className="text-gray-700 font-semibold">Set Budget</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="h-32" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
