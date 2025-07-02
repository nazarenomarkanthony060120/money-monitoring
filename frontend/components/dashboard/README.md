# Dashboard Components

This directory contains all the reusable components for the money monitoring app's dashboard screen.

## Architecture

The dashboard follows a modular component architecture with proper separation of concerns:

- **Components**: Reusable UI components
- **Hooks**: Custom hooks for data management and navigation
- **Types**: Centralized TypeScript interfaces

## Components

### Core Components

- **`DashboardHeader`**: Header with user greeting and logout button
- **`BalanceCard`**: Displays total balance with trend indicators
- **`StatsGrid`**: Grid layout for income/expense statistics
- **`QuickActionsSection`**: Collection of quick action buttons
- **`RecentTransactionsSection`**: List of recent transactions

### Individual Components

- **`StatCard`**: Individual statistic card with trend indicators
- **`QuickActionCard`**: Individual quick action button
- **`TransactionItem`**: Individual transaction list item

### State Components

- **`LoadingState`**: Loading indicator for async operations
- **`ErrorState`**: Error display with retry functionality

## Usage

```tsx
import {
  DashboardHeader,
  BalanceCard,
  StatsGrid,
  QuickActionsSection,
  RecentTransactionsSection,
} from '../../components/dashboard'

// Use with custom hooks
import { useDashboard, useDashboardNavigation } from '../../hooks/useDashboard'

function HomeScreen() {
  const { balance, stats, quickActions, recentTransactions } = useDashboard()
  const { handleViewAllTransactions, handleTransactionPress } =
    useDashboardNavigation()

  return (
    <SafeAreaView>
      <DashboardHeader user={user} onLogout={handleLogout} />
      <BalanceCard {...balance} />
      <ScrollView>
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
```

## Features

### TypeScript Support

- Full TypeScript coverage with proper interfaces
- Centralized type definitions in `types/dashboard.ts`
- Type-safe props and data structures

### Accessibility

- Proper accessibility labels and roles
- Screen reader support
- Keyboard navigation support

### Responsive Design

- Flexible layouts that adapt to different screen sizes
- Proper spacing and typography
- Touch-friendly interactive elements

### Performance

- Optimized with `useMemo` for expensive calculations
- Efficient re-rendering with proper key props
- Lazy loading support for large datasets

## Customization

### Styling

Components use Tailwind CSS classes for consistent styling. Colors and spacing can be customized through:

- Tailwind configuration
- Component-level style overrides
- Theme provider (if implemented)

### Data

Mock data is provided through the `useDashboard` hook. In production:

- Replace with API calls
- Add loading and error states
- Implement caching strategies

## Best Practices

1. **Single Responsibility**: Each component has a single, well-defined purpose
2. **Composition**: Components are composed together rather than tightly coupled
3. **Props Interface**: Clear, typed interfaces for all component props
4. **Error Boundaries**: Proper error handling and user feedback
5. **Performance**: Optimized for smooth user experience
6. **Accessibility**: Full accessibility support for all users
