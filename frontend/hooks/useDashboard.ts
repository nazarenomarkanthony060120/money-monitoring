import { useMemo } from 'react'
import {
  BalanceData,
  StatData,
  QuickAction,
  Transaction,
  DashboardData,
} from '../types/dashboard'

export const useDashboard = (): DashboardData => {
  // In a real app, this would fetch data from your API or state management
  const dashboardData = useMemo<DashboardData>(() => {
    const balance: BalanceData = {
      balance: '$2,450.00',
      changePercentage: '12.5%',
      changeDescription: 'from last month',
      isPositiveChange: true,
    }

    const stats: StatData[] = [
      {
        title: 'Income',
        value: '$3,200',
        icon: '📈',
        color: '#10b981',
        trend: {
          value: '8.2%',
          isPositive: true,
        },
      },
      {
        title: 'Expenses',
        value: '$750',
        icon: '📉',
        color: '#ef4444',
        trend: {
          value: '3.1%',
          isPositive: false,
        },
      },
    ]

    const quickActions: QuickAction[] = [
      {
        title: 'Add Transaction',
        subtitle: 'Record income or expense',
        icon: '💰',
        iconBackgroundColor: '#dbeafe', // blue-50
        onPress: () => {
          console.log('Navigate to add transaction')
        },
      },
      {
        title: 'View Analytics',
        subtitle: 'See spending patterns',
        icon: '📊',
        iconBackgroundColor: '#dcfce7', // green-50
        onPress: () => {
          console.log('Navigate to analytics')
        },
      },
      {
        title: 'Set Budget',
        subtitle: 'Create spending limits',
        icon: '🎯',
        iconBackgroundColor: '#fef3c7', // yellow-50
        onPress: () => {
          console.log('Navigate to budget')
        },
      },
      {
        title: 'Export Report',
        subtitle: 'Download financial data',
        icon: '📄',
        iconBackgroundColor: '#f3e8ff', // purple-50
        onPress: () => {
          console.log('Export report')
        },
      },
      {
        title: 'Categories',
        subtitle: 'Manage expense categories',
        icon: '🏷️',
        iconBackgroundColor: '#fef2f2', // red-50
        onPress: () => {
          console.log('Navigate to categories')
        },
      },
      {
        title: 'Recurring Payments',
        subtitle: 'Manage subscriptions',
        icon: '🔄',
        iconBackgroundColor: '#f0f9ff', // sky-50
        onPress: () => {
          console.log('Navigate to recurring payments')
        },
      },
    ]

    const recentTransactions: Transaction[] = [
      {
        id: '1',
        title: 'Starbucks Coffee',
        amount: '-$4.50',
        time: '2 hours ago',
        icon: '☕',
        category: 'Food & Drink',
        type: 'expense',
      },
      {
        id: '2',
        title: 'Whole Foods Market',
        amount: '-$85.20',
        time: 'yesterday',
        icon: '🛒',
        category: 'Groceries',
        type: 'expense',
      },
      {
        id: '3',
        title: 'Monthly Salary',
        amount: '+$3,200',
        time: '2 days ago',
        icon: '💰',
        category: 'Income',
        type: 'income',
      },
      {
        id: '4',
        title: 'Netflix Subscription',
        amount: '-$15.99',
        time: '3 days ago',
        icon: '📺',
        category: 'Entertainment',
        type: 'expense',
      },
      {
        id: '5',
        title: 'Uber Ride',
        amount: '-$12.30',
        time: '4 days ago',
        icon: '🚗',
        category: 'Transportation',
        type: 'expense',
      },
      {
        id: '6',
        title: 'Freelance Project',
        amount: '+$450.00',
        time: '5 days ago',
        icon: '💻',
        category: 'Income',
        type: 'income',
      },
    ]

    return {
      balance,
      stats,
      quickActions,
      recentTransactions,
    }
  }, [])

  return dashboardData
}

// Navigation handlers hook
export const useDashboardNavigation = () => {
  const handleViewAllTransactions = () => {
    console.log('Navigate to all transactions')
    // TODO: Navigate to transactions screen
  }

  const handleTransactionPress = (transaction: Transaction) => {
    console.log('Transaction pressed:', transaction.title)
    // TODO: Navigate to transaction detail or edit screen
  }

  const handleAddTransaction = () => {
    console.log('Navigate to add transaction')
    // TODO: Navigate to add transaction screen
  }

  const handleViewAnalytics = () => {
    console.log('Navigate to analytics')
    // TODO: Navigate to analytics screen
  }

  const handleSetBudget = () => {
    console.log('Navigate to budget setup')
    // TODO: Navigate to budget screen
  }

  const handleExportReport = () => {
    console.log('Export financial report')
    // TODO: Handle export functionality
  }

  return {
    handleViewAllTransactions,
    handleTransactionPress,
    handleAddTransaction,
    handleViewAnalytics,
    handleSetBudget,
    handleExportReport,
  }
} 