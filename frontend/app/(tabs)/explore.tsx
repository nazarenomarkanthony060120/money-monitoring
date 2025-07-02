import React from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAnalytics, useAnalyticsNavigation } from '../../hooks/useAnalytics'
import {
  AnalyticsHeader,
  OverviewSection,
  CategoriesSection,
  InsightsSection,
  QuickActionsSection,
} from '../../components/analytics'

export default function ExploreScreen() {
  const { overview, categories, insights, quickActions } = useAnalytics()
  const { handleExportReport, handleSetBudget, handleCategoryPress } =
    useAnalyticsNavigation()

  // Update quick actions with proper handlers
  const updatedQuickActions = quickActions.map((action) => {
    if (action.title === 'Export Report') {
      return { ...action, onPress: handleExportReport }
    }
    if (action.title === 'Set Budget') {
      return { ...action, onPress: handleSetBudget }
    }
    return action
  })

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <AnalyticsHeader
          title="Analytics"
          subtitle="Track your financial insights"
        />

        <View className="px-6 -mt-6">
          <OverviewSection data={overview} />

          <CategoriesSection categories={categories} />

          <InsightsSection insights={insights} />

          <QuickActionsSection actions={updatedQuickActions} />

          <View className="h-32" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
