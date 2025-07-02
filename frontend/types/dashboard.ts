export interface User {
  id?: string
  name?: string
  email?: string
  avatar?: string
}

export interface Transaction {
  id?: string
  title: string
  amount: string
  time: string
  icon: string
  category?: string
  type?: 'income' | 'expense'
  date?: Date
}

export interface StatData {
  title: string
  value: string
  icon: string
  color: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export interface QuickAction {
  title: string
  subtitle: string
  icon: string
  onPress: () => void
  iconBackgroundColor?: string
}

export interface BalanceData {
  balance: string
  changePercentage: string
  changeDescription: string
  isPositiveChange?: boolean
}

export interface DashboardData {
  balance: BalanceData
  stats: StatData[]
  quickActions: QuickAction[]
  recentTransactions: Transaction[]
} 