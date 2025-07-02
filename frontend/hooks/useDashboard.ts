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
        icon: '➕',
        iconBackgroundColor: '#dbeafe', // blue-50
        onPress: () => {
          // TODO: Navigate to add transaction screen
          console.log('Navigate to add transaction')
        },
      },
      {
        title: 'View Analytics',
        subtitle: 'See spending patterns',
        icon: '📊',
        iconBackgroundColor: '#dcfce7', // green-50
        onPress: () => {
          // TODO: Navigate to analytics screen
          console.log('Navigate to analytics')
        },
      },
      {
        title: 'Set Budget',
        subtitle: 'Create spending limits',
        icon: '🎯',
        iconBackgroundColor: '#fef3c7', // yellow-50
        onPress: () => {
          // TODO: Navigate to budget screen
          console.log('Navigate to budget')
        },
      },
      {
        title: 'Export Report',
        subtitle: 'Download financial data',
        icon: '📄',
        iconBackgroundColor: '#f3e8ff', // purple-50
        onPress: () => {
          // TODO: Handle export functionality
          console.log('Export report')
        },
      },
    ]

    const recentTransactions: Transaction[] = [
      {
        id: '1',
        title: 'Coffee Shop',
        amount: '-$4.50',
        time: '2 hours ago',
        icon: '☕',
        category: 'Food & Drink',
        type: 'expense',
      },
      {
        id: '2',
        title: 'Grocery Store',
        amount: '-$85.20',
        time: 'Yesterday',
        icon: '🛒',
        category: 'Groceries',
        type: 'expense',
      },
      {
        id: '3',
        title: 'Salary',
        amount: '+$3,200',
        time: '2 days ago',
        icon: '💰',
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
    // TODO: Navigate to transactions screen
    console.log('Navigate to all transactions')
  }

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: Navigate to transaction detail or edit screen
    console.log('Transaction pressed:', transaction)
  }

  return {
    handleViewAllTransactions,
    handleTransactionPress,
  }
} 