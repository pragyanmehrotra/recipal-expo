# ReciPal Frontend

A React Native Expo app for meal planning with Clerk authentication and Tamagui UI components.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Clerk:**

   - Get your Clerk publishable key from [clerk.com](https://clerk.com)
   - Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   EXPO_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
recipal/
├── screens/
│   ├── auth/
│   │   ├── SignInScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── VerifyEmailScreen.js
│   │   └── AuthWrapper.js
│   └── main/
│       └── HomeScreen.js
├── components/
│   └── LoadingSpinner.js
├── api/
│   └── index.js
├── auth/
│   └── clerk.js
├── constants/
│   └── index.js
├── hooks/
│   └── index.js
├── navigation/
│   └── index.js
├── tamagui.config.js
└── App.js
```

## 🎨 UI & Theming

The app uses **Tamagui** for UI components with a beautiful dark theme by default:

### Design System

- **Dark Theme**: Modern dark interface with carefully chosen colors
- **Tamagui Components**: Consistent, accessible UI primitives
- **Custom Colors**: Primary (#FF6B6B), Secondary (#4ECDC4), Accent (#FFA726)
- **Typography**: Inter font family for clean, readable text

### Theme Features

- Automatic dark mode styling
- Consistent spacing and sizing tokens
- Responsive design with media queries
- Smooth animations and transitions
- Accessible color contrasts

## 🔐 Authentication Flow

The app uses Clerk for authentication with the following flow:

1. **Sign In Screen** - Users can sign in with email/password or social providers
2. **Sign Up Screen** - New users can create accounts
3. **Email Verification** - Users verify their email address
4. **Home Screen** - Main app interface for authenticated users

### Authentication States

- `isLoaded: false` → Shows loading spinner
- `isSignedIn: false, isSignedUp: false` → Shows sign-in screen
- `isSignedUp: true, isSignedIn: false` → Shows email verification
- `isSignedIn: true, isSignedUp: true` → Shows main app

## 🛠 API Integration

The app includes pre-configured API hooks for:

- **Recipe API** - Search, create, update, delete recipes
- **Meal Plan API** - Manage meal plans
- **Grocery List API** - Manage grocery lists

All API requests automatically include authentication tokens from Clerk.

## 🎨 Styling & Components

### Tamagui Components Used

- `YStack` - Vertical stack layout
- `XStack` - Horizontal stack layout
- `Text` - Typography component
- `Button` - Interactive buttons
- `Card` - Container with elevation
- `H1`, `H2` - Heading components
- `Separator` - Visual dividers

### Color Scheme

- **Primary**: `#FF6B6B` (Coral Red)
- **Secondary**: `#4ECDC4` (Turquoise)
- **Accent**: `#FFA726` (Orange)
- **Background**: `#1a1a1a` (Dark Gray)
- **Text**: `#ffffff` (White)
- **Borders**: `#404040` (Medium Gray)

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_API_URL=http://localhost:4000
```

### Clerk Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure authentication methods (email, social providers)
4. Copy your publishable key to the `.env` file
5. Configure redirect URLs in your Clerk dashboard

### Tamagui Configuration

The app includes a custom Tamagui configuration (`tamagui.config.js`) with:

- Dark theme by default
- Custom color tokens
- Inter font family
- Responsive media queries
- Custom spacing and sizing scales

## 📱 Features

- ✅ User authentication (sign up, sign in, email verification)
- ✅ Secure token storage with expo-secure-store
- ✅ API integration with automatic authentication
- ✅ Loading states and error handling
- ✅ Beautiful dark theme UI with Tamagui
- ✅ Modern, accessible components
- ✅ Responsive design
- ✅ Modular component structure

## 🚧 Next Steps

- [ ] Add React Navigation for screen transitions
- [ ] Implement recipe search functionality
- [ ] Add meal planning features
- [ ] Create grocery list management
- [ ] Add push notifications
- [ ] Implement offline support
- [ ] Add light theme toggle
- [ ] Implement advanced animations

## 🐛 Troubleshooting

### Common Issues

1. **Clerk not loading:**

   - Check your publishable key in `.env`
   - Ensure the key is prefixed with `EXPO_PUBLIC_`

2. **API requests failing:**

   - Verify your backend is running on the correct port
   - Check the `EXPO_PUBLIC_API_URL` in your `.env`

3. **Authentication not working:**

   - Ensure Clerk is properly configured
   - Check redirect URLs in Clerk dashboard

4. **Tamagui components not rendering:**
   - Ensure Tamagui is properly installed
   - Check the configuration in `tamagui.config.js`
   - Verify the provider is wrapping your app

### Email Verification Issues

**Problem**: Not receiving verification codes during development

**Cause**: Clerk development instances have very limited email sending capabilities (only 2 emails per hour)

**Solutions**:

1. **For Development Testing**:

   - Use the OTP verification screen in the app
   - Enter the 6-digit code sent to your email
   - Click "Resend Code" if needed
   - Check spam/junk folders
   - Wait up to 1 hour between code attempts

2. **For Production**:

   - Upgrade to a paid Clerk plan
   - Configure email providers (SendGrid, Mailgun, etc.) in Clerk dashboard
   - Set up proper email templates

3. **Alternative Testing**:

   - Use Clerk's test email feature in the dashboard
   - Create test accounts with real email addresses
   - Use the Clerk dashboard to manually verify emails

4. **Bypass Verification (Development Only)**:

   - In Clerk dashboard, go to Users → [User] → Actions → Verify Email
   - This manually verifies the email without sending an email

5. **OTP Verification (Recommended)**:
   - The app now uses OTP codes instead of email links
   - Codes are typically 6 digits and easier to enter
   - More reliable than email links in development

## 📄 License

This project is part of the ReciPal meal planning application.
