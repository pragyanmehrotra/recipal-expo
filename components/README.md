# ReciPal Component Library

A collection of reusable, modular UI components for the ReciPal app. All components are designed to be consistent, accessible, and easily customizable.

## Components

### Button

A flexible button component with multiple variants and sizes.

```jsx
import { Button } from '../components';

// Basic usage
<Button title="Click me" onPress={handlePress} />

// With variants
<Button
  title="Primary Button"
  variant="primary"
  size="large"
  onPress={handlePress}
/>

// Disabled state
<Button
  title="Disabled Button"
  disabled={true}
  onPress={handlePress}
/>
```

**Props:**

- `title` (string): Button text
- `onPress` (function): Press handler
- `variant` (string): "primary" | "secondary" | "accent" | "outline" | "ghost"
- `size` (string): "small" | "medium" | "large"
- `disabled` (boolean): Disabled state
- `style` (object): Additional styles
- `textStyle` (object): Text-specific styles

### Input

A styled text input component with consistent theming.

```jsx
import { Input } from "../components";

<Input
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>;
```

**Props:**

- `placeholder` (string): Placeholder text
- `value` (string): Input value
- `onChangeText` (function): Change handler
- `secureTextEntry` (boolean): Password input
- `keyboardType` (string): Keyboard type
- `autoCapitalize` (string): Auto-capitalization
- `style` (object): Additional styles

### Text

A flexible text component with typography variants.

```jsx
import { Text } from "../components";

<Text variant="title" size="large" color="primary">
  Hello World
</Text>;
```

**Props:**

- `children` (node): Text content
- `variant` (string): "title" | "subtitle" | "body" | "caption"
- `size` (string): "small" | "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge"
- `color` (string): "primary" | "secondary" | "muted" | "accent" | "success" | "warning"
- `style` (object): Additional styles

### Container

A layout container with consistent padding and background.

```jsx
import { Container } from "../components";

<Container padding="large" backgroundColor="primary">
  <Text>Content here</Text>
</Container>;
```

**Props:**

- `children` (node): Container content
- `padding` (string): "none" | "small" | "medium" | "large"
- `backgroundColor` (string): "primary" | "secondary" | "transparent"
- `style` (object): Additional styles

### Header

A screen header component with title and subtitle.

```jsx
import { Header } from "../components";

<Header
  title="Welcome Back"
  subtitle="Sign in to your account"
  titleSize="xxlarge"
  subtitleSize="medium"
  textAlign="center"
/>;
```

**Props:**

- `title` (string): Header title
- `subtitle` (string): Header subtitle (optional)
- `titleSize` (string): Title font size
- `subtitleSize` (string): Subtitle font size
- `titleColor` (string): Title color
- `subtitleColor` (string): Subtitle color
- `textAlign` (string): Text alignment
- `marginTop` (number): Top margin
- `marginBottom` (number): Bottom margin
- `style` (object): Additional styles

### Divider

A visual divider component.

```jsx
import { Divider } from "../components";

<Divider orientation="horizontal" color="border" margin="medium" />;
```

**Props:**

- `orientation` (string): "horizontal" | "vertical"
- `color` (string): "border" | "muted" | "accent"
- `thickness` (number): Divider thickness (1, 2, 3)
- `margin` (string): "none" | "small" | "medium" | "large"
- `style` (object): Additional styles

### Card

A container component with background and border.

```jsx
import { Card } from "../components";

<Card padding="medium" backgroundColor="secondary" borderRadius="medium">
  <Text>Card content</Text>
</Card>;
```

**Props:**

- `children` (node): Card content
- `padding` (string): "none" | "small" | "medium" | "large"
- `backgroundColor` (string): "primary" | "secondary" | "transparent"
- `borderRadius` (string): "small" | "medium" | "large"
- `style` (object): Additional styles

### Placeholder

A placeholder component for empty states.

```jsx
import { Placeholder } from "../components";

<Placeholder message="No items found" size="large" color="muted" />;
```

**Props:**

- `message` (string): Placeholder message
- `size` (string): Text size
- `color` (string): Text color
- `style` (object): Additional styles

### LoadingSpinner

A loading indicator component.

```jsx
import { LoadingSpinner } from "../components";

<LoadingSpinner message="Loading..." />;
```

**Props:**

- `message` (string): Loading message

## Theme System

All components use a centralized theme system defined in `../constants/theme.js`. The theme includes:

- **Colors**: Primary, secondary, accent, and semantic colors
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Standard border radius values
- **Shadows**: Elevation and shadow styles

## Usage Guidelines

1. **Import from index**: Always import components from the index file:

   ```jsx
   import { Button, Text, Container } from "../components";
   ```

2. **Use semantic variants**: Choose variants that match the component's purpose:

   - `primary` for main actions
   - `secondary` for secondary actions
   - `accent` for highlights
   - `outline` for subtle actions
   - `ghost` for minimal styling

3. **Consistent sizing**: Use the predefined size variants:

   - `small` for compact UI
   - `medium` for standard UI
   - `large` for prominent UI

4. **Accessibility**: All components include proper accessibility props and semantic markup.

5. **Customization**: Use the `style` prop for component-specific customizations while maintaining the design system.

## Best Practices

- Use the theme constants for colors and spacing
- Maintain consistent component usage across screens
- Test components with different content lengths
- Ensure proper contrast ratios for accessibility
- Use semantic color variants (success, warning, error) appropriately
