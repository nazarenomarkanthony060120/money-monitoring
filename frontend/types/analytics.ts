export type InsightType = 'positive' | 'warning' | 'info'

export interface OverviewData {
  title: string
  value: string
  change: number
  icon: string
  color: string
}

export interface CategoryData {
  category: string
  amount: string
  percentage: number
  color: string
}

export interface InsightData {
  title: string
  description: string
  icon: string
  type: InsightType
}

export interface QuickAction {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
}

export interface AnalyticsData {
  overview: OverviewData[]
  categories: CategoryData[]
  insights: InsightData[]
  quickActions: QuickAction[]
} 