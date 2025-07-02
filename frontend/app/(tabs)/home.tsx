import React from 'react'
import { ScrollView, StatusBar, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useDashboard, useDashboardNavigation } from '../../hooks/useDashboard'
import {
  DashboardHeader,
  BalanceCard,
  StatsGrid,
  QuickActionsSection,
  RecentTransactionsSection,
} from '../../components/dashboard'

export default function HomeScreen() {
  const { user, logout } = useAuth()
  const { balance, stats, quickActions, recentTransactions } = useDashboard()
  const { handleViewAllTransactions, handleTransactionPress } =
    useDashboardNavigation()

  const [refreshing, setRefreshing] = React.useState(false)

  const handleLogout = () => {
    logout()
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const handleBalancePress = () => {
    console.log('Balance card pressed - navigate to balance details')
  }

  const handleStatPress = (stat: any) => {
    console.log('Stat pressed:', stat.title)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <DashboardHeader user={user} onLogout={handleLogout} />

      <BalanceCard {...balance} onPress={handleBalancePress} />

      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        <StatsGrid stats={stats} onStatPress={handleStatPress} />

        <QuickActionsSection actions={quickActions} title="Quick Actions" />

        <RecentTransactionsSection
          transactions={recentTransactions}
          onViewAll={handleViewAllTransactions}
          onTransactionPress={handleTransactionPress}
          title="Recent Transactions"
          maxItems={4}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
