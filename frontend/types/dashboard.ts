export interface User {
  id?: string
  name?: string
  email?: string
  avatar?: string
  provider?: string
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
  description?: string
  recurring?: boolean
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
  subtitle?: string
}

export interface QuickAction {
  title: string
  subtitle: string
  icon: string
  onPress: () => void
  iconBackgroundColor?: string
  badge?: string
  disabled?: boolean
}

export interface BalanceData {
  balance: string
  changePercentage: string
  changeDescription: string
  isPositiveChange?: boolean
  previousBalance?: string
  currency?: string
}

export interface DashboardData {
  balance: BalanceData
  stats: StatData[]
  quickActions: QuickAction[]
  recentTransactions: Transaction[]
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  budget?: number
  spent?: number
  type: 'income' | 'expense'
}

export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: 'weekly' | 'monthly' | 'yearly'
  category?: string
  startDate: Date
  endDate: Date
}

export interface NotificationSettings {
  budgetAlerts: boolean
  transactionReminders: boolean
  weeklyReports: boolean
  monthlyReports: boolean
  pushNotifications: boolean
}

export interface DashboardSettings {
  currency: string
  dateFormat: string
  theme: 'light' | 'dark' | 'auto'
  notifications: NotificationSettings
} 