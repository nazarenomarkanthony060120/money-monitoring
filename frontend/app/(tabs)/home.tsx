import React from 'react'
import { ScrollView, StatusBar } from 'react-native'
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

  const handleLogout = () => {
    logout()
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <DashboardHeader user={user} onLogout={handleLogout} />

      <BalanceCard {...balance} />

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <StatsGrid stats={stats} />

        <QuickActionsSection actions={quickActions} />

        <RecentTransactionsSection
          transactions={recentTransactions}
          onViewAll={handleViewAllTransactions}
          onTransactionPress={handleTransactionPress}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
