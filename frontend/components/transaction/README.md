# Transaction Components

A collection of modern, reusable form components designed for the Add Transaction screen. These components follow the app's design system and provide consistent user experience across the money monitoring app.

## Components

### AmountInput

A specialized input field for entering transaction amounts with automatic formatting and validation.

**Features:**

- Currency symbol display
- Automatic decimal formatting
- Input validation for numbers only
- Clear button for quick reset
- Error state handling
- Focus/blur state indicators

**Usage:**

```tsx
<AmountInput
  value={amount}
  onValueChange={setAmount}
  error={errors.amount}
  currency="$"
/>
```

### TypeSelector

A toggle component for selecting between income and expense transaction types.

**Features:**

- Visual toggle between income/expense
- Emoji icons for quick recognition
- Active state styling
- Accessibility support

**Usage:**

```tsx
<TypeSelector value={type} onValueChange={setType} error={errors.type} />
```

### CategorySelector

A modal-based category selection component with icons and colors.

**Features:**

- Modal overlay with category grid
- Category icons and color coding
- Filter by transaction type (income/expense)
- Visual selection indicators
- Responsive grid layout

**Usage:**

```tsx
<CategorySelector
  value={categoryId}
  type={transactionType}
  onValueChange={setCategoryId}
  error={errors.category}
/>
```

### DatePickerInput

A date selection component with quick date options.

**Features:**

- Smart date display (Today, Yesterday, etc.)
- Modal with predefined date options
- Visual date representation
- Formatted date strings
- Error state handling

**Usage:**

```tsx
<DatePickerInput value={date} onValueChange={setDate} error={errors.date} />
```

### PaymentMethodSelector

A modal-based payment method selection component.

**Features:**

- Modal with payment method list
- Payment method icons and colors
- Visual selection indicators
- Support for multiple payment types

**Usage:**

```tsx
<PaymentMethodSelector
  value={paymentMethod}
  onValueChange={setPaymentMethod}
  error={errors.paymentMethod}
/>
```

### NotesInput

A flexible text input component for descriptions and notes.

**Features:**

- Single-line and multi-line support
- Character counter
- Clear button
- Auto-resize for multi-line
- Error state handling
- Focus/blur state indicators

**Usage:**

```tsx
<NotesInput
  label="Description"
  value={description}
  onValueChange={setDescription}
  placeholder="Enter description..."
  error={errors.description}
  maxLength={200}
/>

<NotesInput
  label="Notes (Optional)"
  value={notes}
  onValueChange={setNotes}
  placeholder="Add notes..."
  maxLength={500}
  multiline
/>
```

### FormButton

A styled button component with loading states and gradient styling.

**Features:**

- Primary and secondary variants
- Loading state with spinner
- Gradient background
- Disabled state handling
- Accessibility support

**Usage:**

```tsx
<FormButton
  title="Add Transaction"
  onPress={handleSubmit}
  isLoading={isLoading}
  disabled={!isValid}
/>

<FormButton
  title="Cancel"
  onPress={handleCancel}
  variant="secondary"
/>
```

## Design System

All components follow the app's design system with:

- Consistent border radius (rounded-2xl)
- Proper spacing and padding
- Color scheme with blue accents
- Shadow effects for depth
- Accessibility labels and roles
- Error state styling with red accents
- Focus states with blue borders

## Form Validation

Components support error state display with:

- Red border styling when error is present
- Error message display with icon
- Proper error clearing when value changes
- Consistent error message formatting

## Accessibility

All components include:

- Proper accessibility labels
- Screen reader support
- Keyboard navigation
- High contrast error states
- Descriptive button labels
- Form field associations

## Usage Example

```tsx
import {
  AmountInput,
  TypeSelector,
  CategorySelector,
  DatePickerInput,
  PaymentMethodSelector,
  NotesInput,
  FormButton,
} from '../components/transaction'

function AddTransactionForm() {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date(),
    description: '',
    notes: '',
    paymentMethod: 'other',
  })

  return (
    <ScrollView>
      <TypeSelector
        value={formData.type}
        onValueChange={(value) => updateFormData('type', value)}
      />

      <AmountInput
        value={formData.amount}
        onValueChange={(value) => updateFormData('amount', value)}
      />

      <CategorySelector
        value={formData.category}
        type={formData.type}
        onValueChange={(value) => updateFormData('category', value)}
      />

      <DatePickerInput
        value={formData.date}
        onValueChange={(value) => updateFormData('date', value)}
      />

      <PaymentMethodSelector
        value={formData.paymentMethod}
        onValueChange={(value) => updateFormData('paymentMethod', value)}
      />

      <NotesInput
        label="Description"
        value={formData.description}
        onValueChange={(value) => updateFormData('description', value)}
        maxLength={200}
      />

      <NotesInput
        label="Notes (Optional)"
        value={formData.notes}
        onValueChange={(value) => updateFormData('notes', value)}
        maxLength={500}
        multiline
      />

      <FormButton
        title="Add Transaction"
        onPress={handleSubmit}
        isLoading={isLoading}
      />
    </ScrollView>
  )
}
```
