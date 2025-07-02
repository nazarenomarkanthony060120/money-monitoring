import { useMemo } from 'react'
import {
  AnalyticsData,
  OverviewData,
  CategoryData,
  InsightData,
  QuickAction,
} from '../types/analytics'

export const useAnalytics = (): AnalyticsData => {
  const analyticsData = useMemo<AnalyticsData>(() => {
    const overview: OverviewData[] = [
      {
        title: 'Total Spending',
        value: '$2,450',
        change: -8.5,
        icon: '📉',
        color: '#ef4444',
      },
      {
        title: 'Total Income',
        value: '$4,200',
        change: 12.3,
        icon: '📈',
        color: '#10b981',
      },
      {
        title: 'Savings Rate',
        value: '41.7%',
        change: 5.2,
        icon: '💰',
        color: '#3b82f6',
      },
    ]

    const categories: CategoryData[] = [
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
    ]

    const insights: InsightData[] = [
      {
        title: 'Great job on savings!',
        description:
          "You've saved 41.7% of your income this month, which is above the recommended 20%.",
        icon: '🎉',
        type: 'positive',
      },
      {
        title: 'Food spending increased',
        description:
          'Your food expenses are 15% higher than last month. Consider meal planning to reduce costs.',
        icon: '⚠️',
        type: 'warning',
      },
      {
        title: 'Transportation optimization',
        description:
          'You could save $50/month by using public transport 2 more days per week.',
        icon: '💡',
        type: 'info',
      },
    ]

    const quickActions: QuickAction[] = [
      {
        title: 'Export Report',
        variant: 'primary',
        onPress: () => {
          // TODO: Handle export functionality
          console.log('Export report')
        },
      },
      {
        title: 'Set Budget',
        variant: 'secondary',
        onPress: () => {
          // TODO: Navigate to budget screen
          console.log('Navigate to budget')
        },
      },
    ]

    return {
      overview,
      categories,
      insights,
      quickActions,
    }
  }, [])

  return analyticsData
}

export const useAnalyticsNavigation = () => {
  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log('Exporting analytics report...')
  }

  const handleSetBudget = () => {
    // TODO: Navigate to budget creation screen
    console.log('Navigating to budget screen...')
  }

  const handleCategoryPress = (category: string) => {
    // TODO: Navigate to category details screen
    console.log(`Viewing details for category: ${category}`)
  }

  return {
    handleExportReport,
    handleSetBudget,
    handleCategoryPress,
  }
} 