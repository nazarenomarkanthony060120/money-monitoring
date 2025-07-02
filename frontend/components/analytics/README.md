# Analytics Components

This directory contains all the reusable components for the money monitoring app's analytics/explore screen.

## Architecture

The analytics screen follows a modular component architecture with proper separation of concerns:

- **Components**: Reusable UI components
- **Hooks**: Custom hooks for data management and navigation
- **Types**: Centralized TypeScript interfaces

## Components

### Core Components

- **`AnalyticsHeader`**: Header with gradient background and title/subtitle
- **`OverviewSection`**: Section containing overview chart cards
- **`CategoriesSection`**: Section displaying spending categories with percentages
- **`InsightsSection`**: Section showing smart financial insights
- **`QuickActionsSection`**: Collection of quick action buttons

### Individual Components

- **`ChartCard`**: Individual chart card with trend indicators
- **`CategoryItem`**: Individual category item with color indicator
- **`InsightCard`**: Individual insight card with icon and description

## Usage

```tsx
import {
  AnalyticsHeader,
  OverviewSection,
  CategoriesSection,
  InsightsSection,
  QuickActionsSection,
} from '../../components/analytics'

// Use with custom hooks
import { useAnalytics, useAnalyticsNavigation } from '../../hooks/useAnalytics'

function ExploreScreen() {
  const { overview, categories, insights, quickActions } = useAnalytics()
  const { handleExportReport, handleSetBudget, handleCategoryPress } =
    useAnalyticsNavigation()

  return (
    <SafeAreaView>
      <AnalyticsHeader
        title="Analytics"
        subtitle="Track your financial insights"
      />
      <ScrollView>
        <OverviewSection data={overview} />
        <CategoriesSection categories={categories} />
        <InsightsSection insights={insights} />
        <QuickActionsSection actions={quickActions} />
      </ScrollView>
    </SafeAreaView>
  )
}
```

## Features

### TypeScript Support

- Full TypeScript coverage with proper interfaces
- Centralized type definitions in `types/analytics.ts`
- Type-safe props and data structures

### Component Structure

- **Single Responsibility**: Each component has a single, well-defined purpose
- **Composition**: Components are composed together rather than tightly coupled
- **Props Interface**: Clear, typed interfaces for all component props

### Data Management

- Custom hook `useAnalytics` provides mock data structure
- Custom hook `useAnalyticsNavigation` handles navigation logic
- Easy to replace mock data with API calls

### Styling

- Consistent use of Tailwind CSS classes
- Proper color coding for different data types
- Responsive design with proper spacing

## Component Details

### AnalyticsHeader

- Gradient background (blue to purple)
- Configurable title and subtitle
- Uses LinearGradient from expo-linear-gradient

### ChartCard

- Displays financial metrics with trend indicators
- Color-coded icons and backgrounds
- Positive/negative change indicators

### CategoryItem

- Shows spending categories with color indicators
- Displays amount and percentage
- Proper typography hierarchy

### InsightCard

- Three insight types: positive, warning, info
- Color-coded backgrounds based on type
- Icon and descriptive text

### QuickActionsSection

- Flexible action buttons
- Primary/secondary button variants
- Touch feedback with activeOpacity

## Data Structure

```typescript
interface AnalyticsData {
  overview: OverviewData[] // Financial overview cards
  categories: CategoryData[] // Spending categories
  insights: InsightData[] // Smart insights
  quickActions: QuickAction[] // Action buttons
}
```

## Customization

### Adding New Insights

1. Add new insight data to `useAnalytics` hook
2. Ensure proper `InsightType` classification
3. Include appropriate icon and description

### Adding New Categories

1. Update categories array in `useAnalytics`
2. Include color coding for visual distinction
3. Ensure percentage calculations are accurate

### Custom Actions

1. Add new actions to `quickActions` array
2. Implement handlers in `useAnalyticsNavigation`
3. Configure button variants (primary/secondary)

## Best Practices

1. **Type Safety**: Always use proper TypeScript interfaces
2. **Component Composition**: Build complex UIs from simple components
3. **Separation of Concerns**: Keep data logic in hooks, UI logic in components
4. **Consistent Styling**: Use Tailwind classes for consistent design
5. **Accessibility**: Include proper accessibility labels and roles
6. **Performance**: Use proper keys for list items and optimize re-renders
