#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 ReciPal Environment Setup");
console.log("============================\n");

const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  console.log("✅ .env file already exists");
  console.log("📝 Current contents:");
  console.log(fs.readFileSync(envPath, "utf8"));
} else {
  console.log("📝 Creating .env file...");

  const envContent = `# Clerk Configuration
# Get your publishable key from https://clerk.com/dashboard
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:4000

# Note: For development, Clerk has limited email sending capabilities.
# In production, you'll need to configure email providers in your Clerk dashboard.
`;

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  console.log("\n📋 Next steps:");
  console.log("1. Go to https://clerk.com/dashboard");
  console.log("2. Create a new application or select existing one");
  console.log("3. Copy your publishable key");
  console.log(
    '4. Replace "pk_test_your_clerk_publishable_key_here" in .env with your actual key'
  );
  console.log("5. Restart your development server");
}

console.log("\n📚 For more help, see the README.md file");
