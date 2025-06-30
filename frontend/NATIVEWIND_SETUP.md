# NativeWind Setup Guide

This project uses NativeWind (Tailwind CSS for React Native) for styling instead of StyleSheet.

## What's Been Configured

### 1. **Dependencies**

- `nativewind@4.1.23` - The main NativeWind package
- `tailwindcss@3.4.17` - Tailwind CSS core
- `prettier-plugin-tailwindcss@0.5.14` - Prettier plugin for Tailwind

### 2. **Configuration Files**

- `tailwind.config.js` - Tailwind configuration with NativeWind preset
- `babel.config.js` - Babel configuration with NativeWind plugin
- `nativewind-env.d.ts` - TypeScript declarations for NativeWind
- `tsconfig.json` - Updated to include NativeWind types

### 3. **Expo Configuration**

- `app.json` - Added NativeWind plugin to Expo plugins array

## How to Use NativeWind

### Basic Usage

Instead of StyleSheet, use Tailwind classes with the `className` prop:

```tsx
// ❌ Old StyleSheet way
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

<View style={styles.container}>

// ✅ New NativeWind way
<View className="flex-1 p-4 bg-white">
```

### Common Patterns

#### Layout

```tsx
// Flexbox
<View className="flex-1">                    // flex: 1
<View className="flex-row">                  // flexDirection: 'row'
<View className="items-center">              // alignItems: 'center'
<View className="justify-center">            // justifyContent: 'center'

// Spacing
<View className="p-4">                       // padding: 16
<View className="px-4 py-2">                 // paddingHorizontal: 16, paddingVertical: 8
<View className="m-2">                       // margin: 8
<View className="mb-4">                      // marginBottom: 16
```

#### Typography

```tsx
<Text className="text-lg font-bold">         // fontSize: 18, fontWeight: 'bold'
<Text className="text-center text-gray-600"> // textAlign: 'center', color: '#4B5563'
<Text className="text-sm">                   // fontSize: 14
```

#### Colors

```tsx
// Background colors
<View className="bg-white">                  // backgroundColor: '#FFFFFF'
<View className="bg-blue-500">               // backgroundColor: '#3B82F6'
<View className="bg-gray-100">               // backgroundColor: '#F3F4F6'

// Text colors
<Text className="text-black">                // color: '#000000'
<Text className="text-red-500">              // color: '#EF4444'
<Text className="text-green-600">            // color: '#059669'
```

#### Borders

```tsx
<View className="border border-gray-300">    // borderWidth: 1, borderColor: '#D1D5DB'
<View className="rounded-lg">                // borderRadius: 8
<View className="rounded-full">              // borderRadius: 9999
```

### Dynamic Classes

You can use template literals for dynamic classes:

```tsx
const isActive = true;
const isDisabled = false;

<View className={`p-4 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}>
<Button className={`${isDisabled ? 'opacity-50' : ''}`}>
```

### Combining with Style Props

You can combine NativeWind classes with style props for dynamic values:

```tsx
<View
  className="flex-1 p-4 rounded-lg"
  style={{ backgroundColor: colors.background }}
>
```

## Examples from Our Login/Signup Pages

### Input Container

```tsx
<View className="flex-row items-center border rounded-xl px-4 py-4 mb-4">
  <Ionicons name="mail-outline" size={20} className="mr-3" />
  <TextInput className="flex-1 text-base" />
</View>
```

### Button

```tsx
<TouchableOpacity className="py-4 rounded-xl items-center mb-6">
  <Text className="text-white text-base font-semibold">Sign In</Text>
</TouchableOpacity>
```

### Conditional Styling

```tsx
<TouchableOpacity
  className={`py-4 rounded-xl items-center mb-6 ${isButtonDisabled ? 'opacity-60' : ''}`}
>
```

## Benefits of NativeWind

1. **Consistency** - Same design system across web and mobile
2. **Productivity** - Faster styling with utility classes
3. **Maintainability** - No need to manage StyleSheet objects
4. **Responsive** - Built-in responsive design utilities
5. **Dark Mode** - Easy dark mode implementation
6. **Performance** - Optimized for React Native

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors about `className` not existing:

1. Make sure `nativewind-env.d.ts` is included in `tsconfig.json`
2. Restart your TypeScript server in your editor
3. Clear Metro cache: `npx expo start --clear`

### Styles Not Applying

1. Check that NativeWind plugin is in `babel.config.js`
2. Verify `tailwind.config.js` content paths include your files
3. Restart the development server

### Performance Issues

1. Use `className` instead of `style` for static styles
2. Avoid complex dynamic class generation
3. Use `useMemo` for expensive class calculations

## Migration from StyleSheet

To migrate existing StyleSheet components:

1. Replace `StyleSheet.create()` with `className` props
2. Convert style properties to Tailwind classes
3. Use `style` prop only for dynamic values
4. Remove StyleSheet imports

Example migration:

```tsx
// Before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

// After
<View className="flex-1 p-4 bg-white">
  <Text className="text-2xl font-bold mb-4">Title</Text>
</View>
```

## Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Native Styling Guide](https://reactnative.dev/docs/style)
